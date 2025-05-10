from fastapi import FastAPI, File, UploadFile, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from typing import List, Optional, Dict, Any
import uvicorn
import os
import pandas as pd
import logging
import time
from functools import lru_cache

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("sku-identifier")

app = FastAPI(
    title="SKU Identifier API",
    description="API para identificação de SKUs a partir de imagens",
    version="1.0.0"
)

# Carrega o CSV de SKUs ao iniciar com cache para melhorar performance
@lru_cache(maxsize=1)
def load_skus():
    start_time = time.time()
    csv_path = os.path.join("data", "produtos.csv")
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path, sep=';', encoding='utf-8')
            result = df.to_dict(orient='records')
            logger.info(f"CSV carregado em {time.time() - start_time:.2f} segundos. {len(result)} produtos encontrados.")
            return result
        except Exception as e:
            logger.error(f"Erro ao carregar CSV: {str(e)}")
            return []
    logger.warning(f"Arquivo CSV não encontrado em {csv_path}")
    return []

# Função para buscar um SKU específico pelo ID
def get_sku_by_id(sku_id: str):
    skus = load_skus()
    for sku in skus:
        if sku.get('SKU') == sku_id:
            return sku
    return None

# Inicializa o banco de dados de SKUs
skus_db = load_skus()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar diretórios estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Endpoint para servir imagens de referência
@app.get("/reference-image/{image_name}")
async def get_reference_image(image_name: str):
    image_path = os.path.join("data", "Images", "produtos", image_name)
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail=f"Imagem {image_name} não encontrada")
    return FileResponse(image_path)

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
    start_time = time.time()
    logger.info(f"Iniciando processamento de imagem: {file.filename}")
    
    # Salva a imagem recebida
    upload_folder = "static/uploads"
    os.makedirs(upload_folder, exist_ok=True)
    file_location = os.path.join(upload_folder, file.filename)
    
    try:
        with open(file_location, "wb") as f:
            content = await file.read()
            f.write(content)
        
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
                
                # Busca informações detalhadas do SKU
                sku_details = get_sku_by_id(best_match["sku"])
                
                resposta = {
                    "sku": best_match["sku"],
                    "img_name": best_match["img_name"],
                    "distancia": float(dists[min_idx]),
                    "filename": file.filename,
                    "produto": sku_details.get("Produto", "") if sku_details else "",
                    "descricao": sku_details.get("Descrição", "") if sku_details else "",
                    "processamento_ms": int((time.time() - start_time) * 1000)
                }
                
                # Encontra os 3 produtos mais similares para comparação
                top_indices = sorted(range(len(dists)), key=lambda i: dists[i])[:3]
                similar_products = []
                
                for idx in top_indices:
                    if idx != min_idx:  # Não incluir o melhor match novamente
                        similar_sku = reference_features[idx]["sku"]
                        similar_img_name = reference_features[idx]["img_name"]
                        similar_details = get_sku_by_id(similar_sku)
                        if similar_details:
                            similar_products.append({
                                "sku": similar_sku,
                                "produto": similar_details.get("Produto", ""),
                                "distancia": float(dists[idx]),
                                "img_name": similar_img_name
                            })
                
                if similar_products:
                    resposta["produtos_similares"] = similar_products
                
                logger.info(f"Imagem processada com sucesso em {time.time() - start_time:.2f} segundos. SKU encontrado: {best_match['sku']}")
            except Exception as e:
                logger.error(f"Erro ao processar imagem: {str(e)}")
                resposta = {"erro": f"Erro ao processar imagem: {str(e)}", "filename": file.filename}
        else:
            logger.error("Features de referência não carregadas.")
            resposta = {"erro": "Features de referência não carregadas.", "filename": file.filename}
    except Exception as e:
        logger.error(f"Erro ao salvar ou processar arquivo: {str(e)}")
        resposta = {"erro": f"Erro ao processar arquivo: {str(e)}", "filename": file.filename}
    
    return JSONResponse(content=resposta)

@app.get("/skus/")
def get_skus(
    skip: int = Query(0, description="Número de itens para pular (paginação)"),
    limit: int = Query(20, description="Número máximo de itens para retornar"),
    search: Optional[str] = Query(None, description="Termo de busca para filtrar SKUs")
):
    start_time = time.time()
    
    # Filtra os SKUs se houver um termo de busca
    if search:
        filtered_skus = []
        search_lower = search.lower()
        for sku in skus_db:
            # Busca em vários campos
            sku_id = str(sku.get('SKU', '')).lower()
            produto = str(sku.get('Produto', '')).lower()
            descricao = str(sku.get('Descrição', '')).lower()
            
            if (search_lower in sku_id or 
                search_lower in produto or 
                search_lower in descricao):
                filtered_skus.append(sku)
    else:
        filtered_skus = skus_db
    
    # Aplica paginação
    paginated_skus = filtered_skus[skip:skip + limit]
    
    logger.info(f"Busca de SKUs concluída em {time.time() - start_time:.2f} segundos. Encontrados {len(filtered_skus)} SKUs, retornando {len(paginated_skus)}.")
    
    return {
        "skus": paginated_skus,
        "total": len(filtered_skus),
        "skip": skip,
        "limit": limit
    }

@app.get("/skus/{sku_id}")
def get_sku_details(sku_id: str):
    sku = get_sku_by_id(sku_id)
    if not sku:
        raise HTTPException(status_code=404, detail=f"SKU {sku_id} não encontrado")
    return sku

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
