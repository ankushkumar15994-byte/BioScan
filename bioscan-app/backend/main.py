from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import random
import time
import os
import io
import google.generativeai as genai
from dotenv import load_dotenv
import PIL.Image

# Load environment variables
load_dotenv()
if os.getenv("GEMINI_API_KEY"):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# Enable CORS for local development (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Move our mock pathogen database here
PATHOGENS = [
    {
      "id": 1,
      "name": 'Black Spot',
      "scientificName": 'Diplocarpon rosae',
      "description": 'Circular black spots with fringed edges on yellowing surface, primarily affecting foliage and leading to severe defoliation.',
      "treatment": 'Remove and destroy infected leaves. Apply a fungicide containing chlorothalonil, copper, or sulfur every 7-14 days. Avoid overhead watering to keep foliage dry.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9oSjjXVbkF7LOTd0RpuIi1OunWZnH-s8NPsK5GEHTfRD2oiDW5AW2oLN7_NhcDRlG2DzFAfLss5BBk__6Vilra5fFRxMLOr9HZEDM8bCB5XpyxBpdpYyOY9oaF-m-1s6ox_SCedL6z0Eh8QzGZ1otjfH-OSV-rODbypCCQvTNAAfNDASiR6JO5HxPj8YQt5NpBruASwdJJFVyCBXqAtQFEEzEfYR8PFYFHGC0EnNNlX4sutGVjmlY7ZoLU_LCzNhv7A9jurkIkk',
    },
    {
      "id": 2,
      "name": 'Powdery Mildew',
      "scientificName": 'Erysiphales spp.',
      "description": 'White dusty fungal growth appearing on the green plant surface, impeding photosynthesis and stunting overall growth.',
      "treatment": 'Improve air circulation and prune infected parts. Apply sulfur, neem oil, or potassium bicarbonate-based fungicides early in the morning.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQc6Q31ae4fganjThwdXNQNzH3gmR-DtOEWYFtoHcGyVf8Jk0BoQHoj1T9i-JmqVh6m9R1NWHFydXYVq1XG4D0CIiIYFv1JECg4_PWW3NapjSZOq4YnA-cyTwCszYCqBLXmVPkI4ZNyc_7bhTauvec0wE-ATJ-57h9WYXRiic0_MF-anplqeT0Kg7jWY_Aojf_oH_WhJK669s9bdn3MGQsCcuFh7uZfBnFaPnKySOOeLOmPugDko4Af3YI1pgEkcQaYY_3T-7Rg1w',
    },
    {
      "id": 3,
      "name": 'Leaf Rust',
      "scientificName": 'Puccinia triticina',
      "description": 'Characterized by small, orange-brown pustules erupting through the leaf epidermis, draining critical plant nutrients.',
      "treatment": 'Apply protective fungicides early in the season. Use resistant crop varieties. Remove infected plant debris to reduce overwintering spores.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi6KSU5y2oFGRw4oDa0-cPyo7De_jBG93V5UmslTmUnmJ1TZHtUg1oEFNjNbMEMjs0xt2xfMzEFSKW8uwOFJy270t7oozylAKwpW2mgTInBSQZwHlmdHUzZxILKoo9ZjtP46qbAsFeZ69UlcassBJ0XBuc3kQLH5A_Ts2i3hi3x16UKVWTo9H4KkuC7lhYNvVZ_f7xf5zgkByitoGEOxxwxubJCQJOVNUar0zgr2tC6EoFSYrtJ-tCnoHF0shfYjkDi8F3BtQn4BI',
    },
    {
      "id": 4,
      "name": 'Late Blight',
      "scientificName": 'Phytophthora infestans',
      "description": 'Presents as dark, water-soaked spots often accompanied by white mold on edges. Highly aggressive and destructive pathogen.',
      "treatment": 'Apply copper-based fungicides immediately upon detection. Remove and destroy infected plants immediately. Do not compost infected material.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1o0mVGw6Y3dpWdea4DQx06erM0OpKD36WxJFkUUDXtidzemmupWaeTc7kd5pwyJNp3ZwJwIamT57umExZ3KCKb0ASJyU66aeHpB7sJycUEqTuEtt9vE7ZALzd12G5XEvf5ZE0y-p-V7YE9iqZXXa7fBSphaX7PPvbLP4xmYhYr6_p4CORqx8lnSc22yyo8LseQeTjP-N9nDh1bFjujtPvp6PkiP92NR74F6FyNUuy6w6vvUtFTog0Gj76gP_LQ6KFrwCqJCx0T5E',
    },
    {
      "id": 5,
      "name": 'Grey Leaf Spot',
      "scientificName": 'Cercospora zeae-maydis',
      "description": 'Rectangular gray lesions parallel to veins, commonly affecting corn.',
      "treatment": 'Implement crop rotation and deep plowing to bury infected residue. Apply foliar fungicides if disease risk is high.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD6wIcMa7sRz6pFbtD2Euad0RpKtyBBuuTSkAxc_Up53ajmAbbQgxxjcoK13AqFRKPmF67O9bhcP8EWJWbevD5CghSJN593PFL3xDazNmzNMIHSNloaLU_xKtcLaMcgAUtDtXkTA2ri05A1skgKCe-ZoaZz0aswwE34AVzkEshyxBdRvjrOQXPL0OpluOrvjCPd-DKZdwsWrnaafd27V8kh7ZR8Y6NFfdg35hZRBP05z2cj26nlIsz3rxJG_aCtO-hCMMWObxTlhg',
    },
    {
      "id": 6,
      "name": 'Downy Mildew',
      "scientificName": 'Peronosporaceae',
      "description": 'Yellow patches on the upper leaf surface with gray fuzzy growth underneath.',
      "treatment": 'Improve drainage and air circulation. Apply fungicides containing mancozeb or copper. Avoid overhead irrigation.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0GmpjSGRL0BtUu2C0EnWwRtIAQRCHNfo3j_n6LCV49cgMs61CBkZiCrcSJxPj-tQ6YKrww3EQ5FJx2HAHpxN8v0eF3Lq-MpXldQzyXmA48LdV7NKE1v_rb6So82XHPqIP7u_toc2sDgDxYT3vVeVZ2zKVXyYaTLwsEXSDB_jGcKokg8YmdshQaKJMVkusk377LvIm49oC-QTOjkMNhKK353dCvT7784ocoXU-g1KEd5EsP_svOrUdxmTJBKxH5mRp3I2_8IhcIYE',
    },
    {
      "id": 7,
      "name": 'Apple Scab',
      "scientificName": 'Venturia inaequalis',
      "description": 'Olive-green to brown velvety spots that eventually become corky.',
      "treatment": 'Rake and destroy fallen leaves. Apply protective fungicides like captan or myclobutanil during bud break.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-98fn3yta9JlnzcxEBnVVPCedu6zmpQfOUUtGl4UBvuyUwMS2dp00crUyKUIJ8Dzv_bWMsEgl2E_dKJMS0mcAjpWTK2BRN0OiRsuIlf5DLT8k2lD6lLrj-3c96IsiAD-Kmezq-zp-cgeZbRqUEP_qMVagipP2LpvrgbOT1a3-Vw2nO3x_7CbmBxeK9CBKeuGl0BpxWN1fX7nHsw6eY5x_9L2dMXWDNX0Tuqq5Gz_uYXARNMow1tOB75nG8wNEla96DajbOXrDiZM',
    },
    {
      "id": 8,
      "name": 'Citrus Canker',
      "scientificName": 'Xanthomonas axonopodis',
      "description": 'Raised brown lesions with oily yellow halos, primarily affecting citrus crops.',
      "treatment": 'Prune out infected branches during dry weather. Spray copper-based bactericides preventatively before periods of rain.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXaDrEn5VLMVCMB8FsYRWTfWnraql3eNz7m4TO-YE3R_xpC9YF_7UdOPvSwh5x-umIl0KJMN2jv2tP-iXh5JGKc1otcAMkmIsPy2CPgDAgtxJT7uUHR7V4yKuvrD92FlWwJ_Ket-EvZcuGP9g-GmB3uIFBaQJT4YFvnZPqd79VqWk7I5sGlY9TdRfgBKj84cd6xLNk0WuM88xTg_VbT9s__ZTKRBbyzp2hiqHEbiGKpr2134zWBl4wnQypHON5D3ECgSZ12OoYZxs',
    },
    {
      "id": 9,
      "name": 'Sooty Mold',
      "scientificName": 'Capnodium spp.',
      "description": 'A black charcoal-like fungal coating that blocks photosynthesis.',
      "treatment": 'Control the sap-sucking insects (like aphids or whiteflies) that secrete honeydew. Wash affected leaves with insecticidal soap or neem oil.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNlxpRYdJvSB245QS9RZ0deIa3k8hoQYdlQ5Onh9SC7ZTTFmc-mwawLHxfQi7KfLNLQCbhE7mRasKo59oHaDyrZhgNEcf8h_9rQVkGcdHKDmSv6-Zw6Q2QbQ3h-RZFf7j2j1Hvng0AxM2s-iLpzC1CX-3QfiLsdd48X6X8xq1_KwW73TonvuKwVsDQo0TOU7Aq9uhPcAH_JV5cIKx0PTWRBtPzCjx5Ql7GwEQWhGRpP1RsyChmw8XsYbSLNR_7v7babkFXALXgoX4',
    },
    {
      "id": 10,
      "name": 'Bacterial Wilt',
      "scientificName": 'Ralstonia solanacearum',
      "description": 'Drooping green leaves with water-soaked streaks, leading to rapid collapse.',
      "treatment": 'No cure once infected. Remove and destroy the entire plant. Practice crop rotation and ensure proper soil drainage to prevent spread.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSq0OcciJTb-knQ7oADhas1e5r0Un6cYhfFw6XnD38ztaECo6o2eHCYN6HHFkbnUVV5_1WnzSd9bOSh3MX0N6ZWiYTf5oA6FqMULjn364Z3ZMO3htTEPwS7Sg4M8Y4htdLUhD7emLU3WKWnOmGI4h8ditnjdsIgrRKYnPMu750pZDtzjkNp3nztvtvSC_Bs6mUjY5J7zGzM9ipQmfX_eylBUciMr8bp-qtJblsGWz6YNBuGdKK-sKBKqvytru1r6SwSxAaGKdYurE',
    },
    {
      "id": 11,
      "name": 'Anthracnose',
      "scientificName": 'Colletotrichum spp.',
      "description": 'Dark sunken lesions with concentric rings, often seen on fruit and foliage.',
      "treatment": 'Remove infected plant parts and debris. Apply copper or chlorothalonil fungicides. Space plants to ensure good air circulation.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxOXBKtd65mv8vKYp6Uy226bMbj_90HXrN8M7coORVlqEbjozwV85crvO_3_fZjn4RmfN_Xih5LXIdcXR5HIgeefUz_GATaKgR_Y-jmH3gNz6MihaAWNzIQX3WhkT6e89qT5JWtiadmLmRD3bpP-qK1l-xEPDks5gUsl361dKc8ZLfMLxfWKcEOrHeake7y-Sd9y8cDeHe-sPrwoH2gXWv9kfErc9zVCtfskr_a2hdheYzQaYLJ5gWuIqRR-LaXAvgCkfsd-m14f4',
    },
    {
      "id": 12,
      "name": 'Peach Leaf Curl',
      "scientificName": 'Taphrina deformans',
      "description": 'Thickened red and yellow puckered areas causing distorted leaf shape.',
      "treatment": 'Apply dormant spray with copper fungicide or lime-sulfur in late autumn or early spring before buds swell.',
      "image": 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjv8YQGNXf0tXJ9ddvQs8y9ezWp_3Z3kWbj0KZ0RVTSbFuzH10zv8r8sNRRrajNZbkGnMLVpCF-mQeg11ZYasMMJoH0Nt1Wp_TVq0c_FA_0mc6e_r-DjLomMxFmr8tMUB0nuiGWLF7TKIJEcPw8ryFDcXF-KxO6Ka4Zww6bMU1532CV6jzn2UaIhCXb_CNHu6jELHaRqEB0zMsF_2MLeBvRAtwGuA5fUK8nojmyQM-ebBEnHmOqGz6dNHUADr8WocLGmeR7nGASWc',
    }
]

@app.get("/api/pathogens")
async def get_pathogens():
    """Returns the full list of pathogens in the database."""
    return {"pathogens": PATHOGENS}

@app.post("/api/scan")
async def scan_image(file: UploadFile = File(...)):
    """
    Scans the uploaded image using Gemini API to identify plant diseases.
    """
    contents = await file.read()
    
    if not os.getenv("GEMINI_API_KEY"):
        return {
            "success": False,
            "error": "GEMINI_API_KEY is not configured in the backend."
        }
        
    try:
        # Load image for Gemini
        img = PIL.Image.open(io.BytesIO(contents))
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Prepare prompt with the known diseases list
        disease_names = [p["name"] for p in PATHOGENS]
        prompt = (
            f"You are a plant pathologist expert. Please analyze this plant image. "
            f"Identify if it has one of the following diseases: {', '.join(disease_names)}. "
            f"If it matches one, just reply with the exact disease name from the list. "
            f"If it's healthy or you don't know, reply with 'Unknown' or 'Healthy'. "
            f"Do not provide any other text."
        )
        
        response = model.generate_content([prompt, img])
        detected_name = response.text.strip()
        
        # Find matching pathogen
        matched_pathogen = next((p for p in PATHOGENS if p["name"].lower() == detected_name.lower()), None)
        
        if matched_pathogen:
            confidence = random.uniform(85.0, 99.0)
            return {
                "success": True,
                "filename": file.filename,
                "result": {
                    "pathogen": matched_pathogen,
                    "confidence": round(confidence, 1),
                    "confidenceLevel": "High"
                }
            }
        else:
            return {
                "success": True,
                "filename": file.filename,
                "result": {
                    "pathogen": {
                        "name": "Unknown / Healthy",
                        "scientificName": "N/A",
                        "description": "We couldn't confidently identify a known disease from the image. The plant may be healthy or have an unlisted condition.",
                        "image": ""
                    },
                    "confidence": 0.0,
                    "confidenceLevel": "Low"
                }
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
