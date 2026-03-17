FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (required for OpenCV/Pillow if needed)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies (CPU version of PyTorch to save space)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code
COPY . .

# Expose the API port
EXPOSE 8000

# Start the FastAPI server using Uvicorn
CMD ["uvicorn", "index:app", "--host", "0.0.0.0", "--port", "8000"]