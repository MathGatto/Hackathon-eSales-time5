import os
import pandas as pd
import numpy as np
import pickle
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Model

# Caminhos
CSV_PATH = os.path.join("data", "produtos.csv")
IMG_DIR = os.path.join("data", "Images")
OUTPUT_PATH = os.path.join("data", "features.pkl")

# Carrega o CSV
print("Lendo CSV...")
df = pd.read_csv(CSV_PATH, sep=';', encoding='utf-8')

# Carrega MobileNetV2 sem a camada de classificação final
print("Carregando modelo MobileNetV2...")
base_model = MobileNetV2(weights='imagenet', include_top=False, pooling='avg')
model = Model(inputs=base_model.input, outputs=base_model.output)

features_list = []

for idx, row in df.iterrows():
    sku = row.get("SKU")
    img_name = row.get("Imagem")
    if pd.isna(img_name):
        continue
    img_path = os.path.join(IMG_DIR, img_name)
    if not os.path.isfile(img_path):
        print(f"Imagem não encontrada: {img_path}")
        continue
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        feat = model.predict(x, verbose=0)[0]
        features_list.append({
            "sku": sku,
            "img_name": img_name,
            "feature": feat.astype(np.float32)
        })
        print(f"Processado: {img_name}")
    except Exception as e:
        print(f"Erro ao processar {img_name}: {e}")

# Salva os features em um arquivo pickle
with open(OUTPUT_PATH, "wb") as f:
    pickle.dump(features_list, f)
print(f"Features salvos em {OUTPUT_PATH}")
