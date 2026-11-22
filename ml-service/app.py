```python
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import tensorflow as tf
from PIL import Image
import io
import numpy as np
import logging
import os
from pathlib import Path
import base64

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="TomatoLeaf ML Service", version="1.0.0")

# Global model variable
model = None

# Disease class mapping
DISEASE_CLASSES = {
    0: "Tomato___Bacterial_spot",
    1: "Tomato___Early_blight",
    2: "Tomato___Late_blight",
    3: "Tomato___Leaf_Mold",
    4: "Tomato___Septoria_leaf_spot",
    5: "Tomato___Spider_mites",
    6: "Tomato___Target_Spot",
    7: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    8: "Tomato___Tomato_mosaic_virus",
    9: "Tomato___healthy"
}

# Friendly names
DISEASE_DISPLAY_NAMES = {
    "Tomato___Bacterial_spot": "Bacterial Spot",
    "Tomato___Early_blight": "Early Blight",
    "Tomato___Late_blight": "Late Blight",
    "Tomato___Leaf_Mold": "Leaf Mold",
    "Tomato___Septoria_leaf_spot": "Septoria Leaf Spot",
    "Tomato___Spider_mites": "Spider Mites",
    "Tomato___Target_Spot": "Target Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Yellow Leaf Curl Virus",
    "Tomato___Tomato_mosaic_virus": "Mosaic Virus",
    "Tomato___healthy": "Healthy"
}


class PredictionRequest(BaseModel):
    imageData: str


class PredictionResponse(BaseModel):
    diseaseName: str
    displayName: str
    confidence: float
    result: str


def load_model():
    """Load ML model safely"""
    global model

    if model is not None:
        return model

    try:
        model_path = Path(__file__).parent / "best_mobilenetv3_finetuned.h5"

        if not model_path.exists():
            raise FileNotFoundError(f"Model not found at {model_path}")

        logger.info(f"Loading model from {model_path}...")

        # ✅ FIX: compile=False avoids Keras 3 compatibility issues
        model = tf.keras.models.load_model(str(model_path), compile=False)

        logger.info("Model loaded successfully!")
        return model

    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise


@app.on_event("startup")
async def startup_event():
    """Try loading model at startup (optional)"""
    try:
        load_model()
    except Exception:
        logger.warning("Model will be loaded on first request")


def preprocess_image(image_data: bytes, target_size=(224, 224)):
    try:
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        image = image.resize(target_size, Image.Resampling.LANCZOS)

        image_array = np.array(image, dtype=np.float32) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        return image_array

    except Exception as e:
        raise ValueError(f"Invalid image: {e}")


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):

    try:
        # Ensure model is loaded
        loaded_model = load_model()

        # Decode base64
        image_data_str = request.imageData
        if "," in image_data_str:
            image_data_str = image_data_str.split(",")[1]

        image_bytes = base64.b64decode(image_data_str)

        # Preprocess
        processed = preprocess_image(image_bytes)

        # Predict
        predictions = loaded_model.predict(processed, verbose=0)
        idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][idx])

        disease_name = DISEASE_CLASSES.get(idx, "Unknown")
        display_name = DISEASE_DISPLAY_NAMES.get(disease_name, disease_name)
        result = "Healthy" if disease_name == "Tomato___healthy" else "Diseased"

        return PredictionResponse(
            diseaseName=disease_name,
            displayName=display_name,
            confidence=confidence,
            result=result
        )

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")


@app.get("/")
async def root():
    return {
        "service": "TomatoLeaf ML Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "docs": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```
