import os
import io
import torch
import torch.nn as nn
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from torchvision import models, transforms
from PIL import Image

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define labels
CLASSES = ["notumor", "glioma", "meningioma", "pituitary"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best_model.pth")

# Global model variable
model_ft = None

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def load_model():
    """Loads the fine-tuned ResNet18 model."""
    if not os.path.exists(MODEL_PATH):
        logger.error(f"Model file not found at {MODEL_PATH}")
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    
    logger.info(f"Loading model from {MODEL_PATH} on {device}...")
    
    # Model definition matching training setup
    model = models.efficientnet_v2_s(weights=None)
    num_ftrs = model.classifier[1].in_features
    
    # Custom FC layer
    model.classifier = nn.Sequential(
        nn.Linear(num_ftrs, 512),
        nn.ReLU(),
        nn.Dropout(0.5),
        nn.Linear(512, len(CLASSES))
    )
    
    # Load weights
    try:
        checkpoint = torch.load(MODEL_PATH, map_location=device, weights_only=False)
        if isinstance(checkpoint, dict) and "state_dict" in checkpoint:
            model.load_state_dict(checkpoint["state_dict"])
        else:
            model.load_state_dict(checkpoint)
        model = model.to(device)
        model.eval()
        logger.info("Model loaded successfully.")
        return model
    except Exception as e:
        logger.error(f"Error loading model weights: {e}")
        raise

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for FastAPI."""
    global model_ft
    try:
        model_ft = load_model()
    except Exception as e:
        logger.critical(f"Failed to initialize model during startup: {e}")
    
    yield
    
    # Shutdown logic
    logger.info("Shutting down... clearing model resources.")
    model_ft = None

app = FastAPI(title="Brain Tumor Classification API", lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/")
def read_root():
    return {
        "message": "Brain Tumor Classification API is up and running.",
        "usage": "Send a POST request to /api/predict with a form-data field named 'file' containing the image.",
        "status": "Online",
        "device": str(device)
    }

@app.post("/predict")
@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint to predict brain tumor class from an uploaded MRI scan.
    """
    # 1. Validate Model Initialization
    if model_ft is None:
        logger.error("Inference requested but model is not initialized.")
        return JSONResponse(status_code=503, content={"error": "Model initialization failed. Please try again later."})
    
    # 2. Validate File Content Type
    if not file.content_type.startswith("image/"):
        logger.warning(f"Invalid file type uploaded: {file.content_type}")
        return JSONResponse(status_code=400, content={"error": "Invalid file type. Please upload a valid image file (JPEG, PNG)."})
    
    try:
        # 3. Read File Contents
        contents = await file.read()
        if not contents:
            logger.warning("Empty file uploaded.")
            return JSONResponse(status_code=400, content={"error": "The uploaded file is empty."})
            
        # 4. Open and Convert Image
        try:
            image = Image.open(io.BytesIO(contents)).convert("RGB")
        except Exception as img_eval_err:
            logger.error(f"Failed to open image file: {img_eval_err}")
            return JSONResponse(status_code=400, content={"error": "The uploaded file is corrupted or not a valid image format."})
        
        # 5. Preprocess Image
        try:
            input_tensor = transform(image).unsqueeze(0).to(device)
        except Exception as transform_err:
            logger.error(f"Error during image tensor transformation: {transform_err}")
            return JSONResponse(status_code=500, content={"error": "Failed to process image features. Please try a different image."})
        
        # 6. Model Inference
        with torch.no_grad():
            outputs = model_ft(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
            _, preds = torch.max(outputs, 1)
            
        predicted_class_idx = preds.item()
        
        # 7. Validate Output Index
        if predicted_class_idx < 0 or predicted_class_idx >= len(CLASSES):
            logger.critical(f"Model predicted out-of-bounds index: {predicted_class_idx}")
            return JSONResponse(status_code=500, content={"error": "Internal inference calculation error."})
            
        predicted_class = CLASSES[predicted_class_idx]
        
        # 8. Calculate Confidences
        confidences = {CLASSES[i]: round(probabilities[i].item() * 100, 2) for i in range(len(CLASSES))}
        
        logger.info(f"Inference successful: {predicted_class} ({confidences[predicted_class]}%)")
        
        return {
            "prediction": predicted_class,
            "class_idx": predicted_class_idx,
            "confidences": confidences,
            "success": True
        }
        
    except Exception as e:
        logger.exception(f"Unexpected inference error: {e}")
        return JSONResponse(status_code=500, content={"error": "An unexpected error occurred during analysis. Please contact support."})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
