import os
import io
import torch
import torch.nn as nn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from torchvision import models, transforms
from PIL import Image

app = FastAPI(title="Brain Tumor Classification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Define our 4 labels. Ensure they are in the exact order they were trained with!
# In the training notebook, label_map was: {'notumor': 0, 'glioma': 1, 'meningioma': 2, 'pituitary': 3}
CLASSES = ["notumor", "glioma", "meningioma", "pituitary"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best_model.pth")

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_ft = None

def load_model():
    global model_ft
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    
    # Model definition matching training setup
    # Make sure we use weights=None since the deprecated pretrained=False argument is being removed
    model_ft = models.resnet18(weights=None)
    num_ftrs = model_ft.fc.in_features
    
    # Important: The state_dict from the error message indicates the exact structure:
    # fc.0: Linear(in_features=512, out_features=512)
    # fc.3: Linear(in_features=512, out_features=4)
    model_ft.fc = nn.Sequential(
        nn.Linear(num_ftrs, 512),
        nn.ReLU(),
        nn.Dropout(0.5),
        nn.Linear(512, len(CLASSES))
    )
    
    # Load the weights
    model_ft.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model_ft = model_ft.to(device)
    model_ft.eval()

# Image preprocessing matching standard ResNet models training
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
def read_root():
    return {
        "message": "Brain Tumor Classification API is up and running.",
        "usage": "Send a POST request to /predict with a form-data field named 'file' containing the image."
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        return JSONResponse(status_code=400, content={"error": "File provided is not an image."})
    
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Preprocess the image
        input_tensor = transform(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            outputs = model_ft(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
            _, preds = torch.max(outputs, 1)
            
        predicted_class_idx = preds.item()
        predicted_class = CLASSES[predicted_class_idx]
        
        # Calculate percentage confidences for all classes
        confidences = {CLASSES[i]: round(probabilities[i].item() * 100, 2) for i in range(len(CLASSES))}
        
        return {
            "prediction": predicted_class,
            "class_idx": predicted_class_idx,
            "confidences": confidences,
            "success": True
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
