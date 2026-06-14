import os
from dotenv import load_dotenv
load_dotenv()
import json
import numpy as np
from io import BytesIO
from PIL import Image
import google.generativeai as genai

# Configure Gemini
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from datetime import datetime
from api import auth, community
from api.auth import get_optional_user, get_current_user
from api.database import scans_collection

app = FastAPI(title="Bioscan AI Backend")

# Setup CORS to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Mount avatars directory
os.makedirs("avatars", exist_ok=True)
app.mount("/avatars", StaticFiles(directory="avatars"), name="avatars")

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(community.router, prefix="/api/community", tags=["community"])

# --- Pathogen Database ---
PATHOGENS = [
    {
        "id": 1,
        "name": "Black Spot",
        "scientificName": "Diplocarpon rosae",
        "description": "Circular black spots with fringed edges on yellowing surface, primarily affecting foliage and leading to severe defoliation.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAh9oSjjXVbkF7LOTd0RpuIi1OunWZnH-s8NPsK5GEHTfRD2oiDW5AW2oLN7_NhcDRlG2DzFAfLss5BBk__6Vilra5fFRxMLOr9HZEDM8bCB5XpyxBpdpYyOY9oaF-m-1s6ox_SCedL6z0Eh8QzGZ1otjfH-OSV-rODbypCCQvTNAAfNDASiR6JO5HxPj8YQt5NpBruASwdJJFVyCBXqAtQFEEzEfYR8PFYFHGC0EnNNlX4sutGVjmlY7ZoLU_LCzNhv7A9jurkIkk",
    },
    {
        "id": 2,
        "name": "Powdery Mildew",
        "scientificName": "Erysiphales spp.",
        "description": "White dusty fungal growth appearing on the green plant surface, impeding photosynthesis and stunting overall growth.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAQc6Q31ae4fganjThwdXNQNzH3gmR-DtOEWYFtoHcGyVf8Jk0BoQHoj1T9i-JmqVh6m9R1NWHFydXYVq1XG4D0CIiIYFv1JECg4_PWW3NapjSZOq4YnA-cyTwCszYCqBLXmVPkI4ZNyc_7bhTauvec0wE-ATJ-57h9WYXRiic0_MF-anplqeT0Kg7jWY_Aojf_oH_WhJK669s9bdn3MGQsCcuFh7uZfBnFaPnKySOOeLOmPugDko4Af3YI1pgEkcQaYY_3T-7Rg1w",
    },
    {
        "id": 3,
        "name": "Leaf Rust",
        "scientificName": "Puccinia triticina",
        "description": "Characterized by small, orange-brown pustules erupting through the leaf epidermis, draining critical plant nutrients.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAi6KSU5y2oFGRw4oDa0-cPyo7De_jBG93V5UmslTmUnmJ1TZHtUg1oEFNjNbMEMjs0xt2xfMzEFSKW8uwOFJy270t7oozylAKwpW2mgTInBSQZwHlmdHUzZxILKoo9ZjtP46qbAsFeZ69UlcassBJ0XBuc3kQLH5A_Ts2i3hi3x16UKVWTo9H4KkuC7lhYNvVZ_f7xf5zgkByitoGEOxxwxubJCQJOVNUar0zgr2tC6EoFSYrtJ-tCnoHF0shfYjkDi8F3BtQn4BI",
    },
    {
        "id": 4,
        "name": "Late Blight",
        "scientificName": "Phytophthora infestans",
        "description": "Presents as dark, water-soaked spots often accompanied by white mold on edges. Highly aggressive and destructive pathogen.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuC1o0mVGw6Y3dpWdea4DQx06erM0OpKD36WxJFkUUDXtidzemmupWaeTc7kd5pwyJNp3ZwJwIamT57umExZ3KCKb0ASJyU66aeHpB7sJycUEqTuEtt9vE7ZALzd12G5XEvf5ZE0y-p-V7YE9iqZXXa7fBSphaX7PPvbLP4xmYhYr6_p4CORqx8lnSc22yyo8LseQeTjP-N9nDh1bFjujtPvp6PkiP92NR74F6FyNUuy6w6vvUtFTog0Gj76gP_LQ6KFrwCqJCx0T5E",
    },
    {
        "id": 5,
        "name": "Grey Leaf Spot",
        "scientificName": "Cercospora zeae-maydis",
        "description": "Rectangular gray lesions parallel to veins, commonly affecting corn.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAD6wIcMa7sRz6pFbtD2Euad0RpKtyBBuuTSkAxc_Up53ajmAbbQgxxjcoK13AqFRKPmF67O9bhcP8EWJWbevD5CghSJN593PFL3xDazNmzNMIHSNloaLU_xKtcLaMcgAUtDtXkTA2ri05A1skgKCe-ZoaZz0aswwE34AVzkEshyxBdRvjrOQXPL0OpluOrvjCPd-DKZdwsWrnaafd27V8kh7ZR8Y6NFfdg35hZRBP05z2cj26nlIsz3rxJG_aCtO-hCMMWObxTlhg",
    },
    {
        "id": 6,
        "name": "Downy Mildew",
        "scientificName": "Peronosporaceae",
        "description": "Yellow patches on the upper leaf surface with gray fuzzy growth underneath.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuA0GmpjSGRL0BtUu2C0EnWwRtIAQRCHNfo3j_n6LCV49cgMs61CBkZiCrcSJxPj-tQ6YKrww3EQ5FJx2HAHpxN8v0eF3Lq-MpXldQzyXmA48LdV7NKE1v_rb6So82XHPqIP7u_toc2sDgDxYT3vVeVZ2zKVXyYaTLwsEXSDB_jGcKokg8YmdshQaKJMVkusk377LvIm49oC-QTOjkMNhKK353dCvT7784ocoXU-g1KEd5EsP_svOrUdxmTJBKxH5mRp3I2_8IhcIYE",
    },
    {
        "id": 7,
        "name": "Apple Scab",
        "scientificName": "Venturia inaequalis",
        "description": "Olive-green to brown velvety spots that eventually become corky.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuD-98fn3yta9JlnzcxEBnVVPCedu6zmpQfOUUtGl4UBvuyUwMS2dp00crUyKUIJ8Dzv_bWMsEgl2E_dKJMS0mcAjpWTK2BRN0OiRsuIlf5DLT8k2lD6lLrj-3c96IsiAD-Kmezq-zp-cgeZbRqUEP_qMVagipP2LpvrgbOT1a3-Vw2nO3x_7CbmBxeK9CBKeuGl0BpxWN1fX7nHsw6eY5x_9L2dMXWDNX0Tuqq5Gz_uYXARNMow1tOB75nG8wNEla96DajbOXrDiZM",
    },
    {
        "id": 8,
        "name": "Citrus Canker",
        "scientificName": "Xanthomonas axonopodis",
        "description": "Raised brown lesions with oily yellow halos, primarily affecting citrus crops.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBXaDrEn5VLMVCMB8FsYRWTfWnraql3eNz7m4TO-YE3R_xpC9YF_7UdOPvSwh5x-umIl0KJMN2jv2tP-iXh5JGKc1otcAMkmIsPy2CPgDAgtxJT7uUHR7V4yKuvrD92FlWwJ_Ket-EvZcuGP9g-GmB3uIFBaQJT4YFvnZPqd79VqWk7I5sGlY9TdRfgBKj84cd6xLNk0WuM88xTg_VbT9s__ZTKRBbyzp2hiqHEbiGKpr2134zWBl4wnQypHON5D3ECgSZ12OoYZxs",
    },
    {
        "id": 9,
        "name": "Sooty Mold",
        "scientificName": "Capnodium spp.",
        "description": "A black charcoal-like fungal coating that blocks photosynthesis.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCNlxpRYdJvSB245QS9RZ0deIa3k8hoQYdlQ5Onh9SC7ZTTFmc-mwawLHxfQi7KfLNLQCbhE7mRasKo59oHaDyrZhgNEcf8h_9rQVkGcdHKDmSv6-Zw6Q2QbQ3h-RZFf7j2j1Hvng0AxM2s-iLpzC1CX-3QfiLsdd48X6X8xq1_KwW73TonvuKwVsDQo0TOU7Aq9uhPcAH_JV5cIKx0PTWRBtPzCjx5Ql7GwEQWhGRpP1RsyChmw8XsYbSLNR_7v7babkFXALXgoX4",
    },
    {
        "id": 10,
        "name": "Bacterial Wilt",
        "scientificName": "Ralstonia solanacearum",
        "description": "Drooping green leaves with water-soaked streaks, leading to rapid collapse.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDSq0OcciJTb-knQ7oADhas1e5r0Un6cYhfFw6XnD38ztaECo6o2eHCYN6HHFkbnUVV5_1WnzSd9bOSh3MX0N6ZWiYTf5oA6FqMULjn364Z3ZMO3htTEPwS7Sg4M8Y4htdLUhD7emLU3WKWnOmGI4h8ditnjdsIgrRKYnPMu750pZDtzjkNp3nztvtvSC_Bs6mUjY5J7zGzM9ipQmfX_eylBUciMr8bp-qtJblsGWz6YNBuGdKK-sKBKqvytru1r6SwSxAaGKdYurE",
    },
    {
        "id": 11,
        "name": "Anthracnose",
        "scientificName": "Colletotrichum spp.",
        "description": "Dark sunken lesions with concentric rings, often seen on fruit and foliage.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBxOXBKtd65mv8vKYp6Uy226bMbj_90HXrN8M7coORVlqEbjozwV85crvO_3_fZjn4RmfN_Xih5LXIdcXR5HIgeefUz_GATaKgR_Y-jmH3gNz6MihaAWNzIQX3WhkT6e89qT5JWtiadmLmRD3bpP-qK1l-xEPDks5gUsl361dKc8ZLfMLxfWKcEOrHeake7y-Sd9y8cDeHe-sPrwoH2gXWv9kfErc9zVCtfskr_a2hdheYzQaYLJ5gWuIqRR-LaXAvgCkfsd-m14f4",
    },
    {
        "id": 12,
        "name": "Peach Leaf Curl",
        "scientificName": "Taphrina deformans",
        "description": "Thickened red and yellow puckered areas causing distorted leaf shape.",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCjv8YQGNXf0tXJ9ddvQs8y9ezWp_3Z3kWbj0KZ0RVTSbFuzH10zv8r8sNRRrajNZbkGnMLVpCF-mQeg11ZYasMMJoH0Nt1Wp_TVq0c_FA_0mc6e_r-DjLomMxFmr8tMUB0nuiGWLF7TKIJEcPw8ryFDcXF-KxO6Ka4Zww6bMU1532CV6jzn2UaIhCXb_CNHu6jELHaRqEB0zMsF_2MLeBvRAtwGuA5fUK8nojmyQM-ebBEnHmOqGz6dNHUADr8WocLGmeR7nGASWc",
    },
]

# --- Model Loading ---
MODEL_PATH = "api/plant_disease_model.h5"
CLASSES_PATH = "api/class_indices.json"
model = None
class_names = None

try:
    import tensorflow as tf
    if os.path.exists(MODEL_PATH) and os.path.exists(CLASSES_PATH):
        print("Loading trained model...")
        model = tf.keras.models.load_model(MODEL_PATH)
        with open(CLASSES_PATH, 'r') as f:
            class_indices = json.load(f)
            class_names = {v: k for k, v in class_indices.items()}
        print(f"Model loaded successfully. Found {len(class_names)} classes.")
    else:
        print(f"WARNING: '{MODEL_PATH}' or '{CLASSES_PATH}' not found.")
        print("The API will run in MOCK mode until you train the model using ml/train_model.py")
except Exception as e:
    print(f"WARNING: Failed to load TensorFlow or Model: {e}")
    print("The API will run in MOCK mode.")


# --- API Endpoints ---

@app.get("/api/health")
async def health_check():
    """Returns the health status of the API and model."""
    return {
        "status": "online",
        "model_loaded": model is not None,
        "mode": "real" if model is not None else "mock",
        "classes": len(class_names) if class_names else 0,
    }


@app.get("/api/pathogens")
async def get_pathogens():
    """Returns the full list of pathogens in the database."""
    return {"pathogens": PATHOGENS}

@app.get("/api/scans/history")
async def get_scan_history(current_user: dict = Depends(get_current_user)):
    """Returns the scan history of the authenticated user."""
    if scans_collection is None:
        return {"scans": []}
    
    scans = list(scans_collection.find(
        {"user_email": current_user["email"]},
        {"_id": 0}
    ).sort("created_at", -1))
    
    return {"scans": scans}

@app.get("/api/dataset-info")
async def get_dataset_info():
    """Returns metadata about the training dataset and model."""
    return {
        "dataset": {
            "name": "New Plant Diseases Dataset (Augmented)",
            "source": "kaggle.com/vipoooool/new-plant-diseases-dataset",
            "total_images": "87,000+",
            "classes": 38,
            "crop_species": 14,
            "image_resolution": "224x224",
        },
        "model": {
            "architecture": "MobileNetV2",
            "pretrained_on": "ImageNet",
            "dense_layer": "512 units (ReLU)",
            "dropout": 0.5,
            "output": "38 classes (Softmax)",
            "optimizer": "Adam (lr=0.001)",
            "loss": "categorical_crossentropy",
            "batch_size": 32,
            "epochs": 20,
            "framework": "TensorFlow 2.14",
        },
        "model_loaded": model is not None,
    }


@app.post("/api/scan")
async def scan_plant(file: UploadFile = File(...), user: dict = Depends(get_optional_user)):
    """Accepts an uploaded plant image and returns disease detection results."""
    try:
        if model is None or class_names is None:
            # --- MOCK MODE ---
            import time
            import random
            time.sleep(1.5)

            mock_diseases = [
                ("Apple - Apple Scab", 92.4),
                ("Tomato - Late Blight", 88.1),
                ("Potato - Early Blight", 95.2),
                ("Grape - Black Rot", 89.9),
                ("Corn - Common Rust", 94.7),
                ("Tomato - Healthy", 98.6),
                ("Cherry - Powdery Mildew", 91.3),
                ("Pepper - Bacterial Spot", 87.5),
            ]
            disease, confidence = random.choice(mock_diseases)

            name_parts = disease.split(" - ")
            crop = name_parts[0]
            condition = name_parts[1] if len(name_parts) > 1 else "Healthy"

            result_data = {
                "success": True,
                "result": {
                    "pathogen": {"name": condition, "scientificName": crop},
                    "confidence": confidence,
                    "confidenceLevel": "High" if confidence > 90 else "Medium",
                },
                "mode": "mock",
            }
            
            if user and scans_collection is not None:
                scans_collection.insert_one({
                    "user_email": user["email"],
                    "disease_name": condition,
                    "crop_name": crop,
                    "confidence": round(confidence, 2),
                    "confidenceLevel": "High" if confidence > 90 else "Medium",
                    "mode": "mock",
                    "created_at": datetime.utcnow()
                })
                
            return result_data

        else:
            # --- REAL INFERENCE MODE ---
            contents = await file.read()
            image = Image.open(BytesIO(contents))

            image = image.resize((224, 224))
            image_array = np.array(image)

            if image_array.shape[-1] != 3:
                image = image.convert("RGB")
                image_array = np.array(image)

            # Note: We no longer divide by 255.0 here because tf.keras.layers.Rescaling
            # is now built directly into the .keras model architecture.
            image_array = np.expand_dims(image_array, axis=0)

            predictions = model.predict(image_array)[0]

            predicted_index = int(np.argmax(predictions))
            confidence = float(predictions[predicted_index]) * 100
            predicted_class_name = class_names[predicted_index]

            parts = predicted_class_name.split("___")
            crop = parts[0].replace("_", " ") if len(parts) > 0 else "Unknown"
            condition = parts[1].replace("_", " ") if len(parts) > 1 else "Healthy"

            result_data = {
                "success": True,
                "result": {
                    "pathogen": {"name": condition, "scientificName": crop},
                    "confidence": round(confidence, 2),
                    "confidenceLevel": "High" if confidence > 90 else "Medium",
                },
                "mode": "real",
            }
            
            if user and scans_collection is not None:
                scans_collection.insert_one({
                    "user_email": user["email"],
                    "disease_name": condition,
                    "crop_name": crop,
                    "confidence": round(confidence, 2),
                    "confidenceLevel": "High" if confidence > 90 else "Medium",
                    "mode": "real",
                    "created_at": datetime.utcnow()
                })
                
            return result_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/gemini-diagnosis")
async def gemini_diagnosis(file: UploadFile = File(...), user: dict = Depends(get_optional_user)):
    """Accepts an uploaded plant image and returns a detailed diagnosis from Gemini 1.5 Flash."""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured on the server.")

    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents))
        
        # Convert to RGB if necessary for safety
        if image.mode != "RGB":
            image = image.convert("RGB")

        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = (
            "You are an expert plant pathologist. Analyze this image of a plant leaf and provide a diagnosis. "
            "Respond ONLY with a valid JSON object matching this exact schema:\n"
            "{\n"
            '  "disease_name": "Name of the disease",\n'
            '  "crop_name": "Name of the crop/plant",\n'
            '  "confidence_score": 95,\n'
            '  "detailed_treatment_plan": "A detailed, multi-sentence plan for treating the disease including specific chemicals or organic methods if applicable."\n'
            "}\n"
            "If it is not a plant, or if you are completely unsure, return:\n"
            "{\n"
            '  "disease_name": "Unknown",\n'
            '  "crop_name": "Unknown",\n'
            '  "confidence_score": 0,\n'
            '  "detailed_treatment_plan": "Unable to identify the plant or disease from the image."\n'
            "}"
        )
        
        response = model.generate_content([prompt, image])
        
        # Extract the JSON from the response text
        # Gemini sometimes wraps JSON in markdown blocks like ```json ... ```
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        result_json = json.loads(response_text.strip())
        
        result_data = {
            "success": True,
            "result": {
                "pathogen": {
                    "name": result_json.get("disease_name", "Unknown"),
                    "scientificName": result_json.get("crop_name", "Unknown"),
                    "treatment": result_json.get("detailed_treatment_plan", "")
                },
                "confidence": result_json.get("confidence_score", 0),
                "confidenceLevel": "High" if result_json.get("confidence_score", 0) > 90 else "Medium",
            },
            "mode": "gemini"
        }
        
        if user and scans_collection is not None:
            scans_collection.insert_one({
                "user_email": user["email"],
                "disease_name": result_json.get("disease_name", "Unknown"),
                "crop_name": result_json.get("crop_name", "Unknown"),
                "confidence": result_json.get("confidence_score", 0),
                "confidenceLevel": "High" if result_json.get("confidence_score", 0) > 90 else "Medium",
                "mode": "gemini",
                "created_at": datetime.utcnow()
            })
            
        return result_data
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse Gemini response as JSON.")
    except Exception as e:
        print("Gemini Error:", e)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
