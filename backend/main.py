from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import pandas as pd

app = FastAPI()

# Carrega o CSV de SKUs ao iniciar
def load_skus():
    csv_path = os.path.join("data", "produtos.csv")
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path, sep=';', encoding='utf-8')
        return df.to_dict(orient='records')
    return []

skus_db = load_skus()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import random
import pickle
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Model

# Carrega features das imagens de referência
FEATURES_PATH = os.path.join("data", "features.pkl")
if os.path.exists(FEATURES_PATH):
    with open(FEATURES_PATH, "rb") as f:
        reference_features = pickle.load(f)
else:
    reference_features = []

# Carrega MobileNetV2 para extração de features
mobilenet_model = None
if reference_features:
    base_model = MobileNetV2(weights='imagenet', include_top=False, pooling='avg')
    mobilenet_model = Model(inputs=base_model.input, outputs=base_model.output)

@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    # Salva a imagem recebida
    upload_folder = "static/uploads"
    os.makedirs(upload_folder, exist_ok=True)
    file_location = os.path.join(upload_folder, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Busca por similaridade usando features
    if mobilenet_model and reference_features:
        try:
            img = image.load_img(file_location, target_size=(224, 224))
            x = image.img_to_array(img)
            x = np.expand_dims(x, axis=0)
            x = preprocess_input(x)
            feat = mobilenet_model.predict(x, verbose=0)[0]
            # Calcula distância euclidiana para cada vetor de referência
            dists = [np.linalg.norm(feat - ref["feature"]) for ref in reference_features]
            min_idx = int(np.argmin(dists))
            best_match = reference_features[min_idx]
            resposta = {
                "sku": best_match["sku"],
                "img_name": best_match["img_name"],
                "distancia": float(dists[min_idx]),
                "filename": file.filename
            }
        except Exception as e:
            resposta = {"erro": f"Erro ao processar imagem: {str(e)}", "filename": file.filename}
    else:
        resposta = {"erro": "Features de referência não carregadas.", "filename": file.filename}
    return JSONResponse(content=resposta)

@app.get("/skus/")
def get_skus():
    # Retorna os primeiros 20 SKUs para teste
    return {"skus": skus_db[:20]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
