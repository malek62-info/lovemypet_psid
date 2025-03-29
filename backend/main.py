import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # CORS uniquement pour l'URL de ton frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Récupère le dossier contenant main.py
DATA_PATH = os.path.join(BASE_DIR, "data", "data_clean.csv")

def load_data():
    df = pd.read_csv(DATA_PATH)
    return df

@app.get("/photos")
async def get_photo_adoption_counts():
    df = load_data()

    # Création des intervalles pour PhotoAmt
    # Création des intervalles pour PhotoAmt
    bins = [0, 5, 10, 20, 30]  # Plages réduites à 4 intervalles
    labels = ['0-5', '6-10', '11-20', '21-30']  # 4 labels pour chaque intervalle


    df['PhotoAmt_interval'] = pd.cut(df['PhotoAmt'], bins=bins, labels=labels, right=False)

    # Compter le nombre d'animaux adoptés dans chaque intervalle de photos pour chaque AdoptionSpeed
    adoption_counts = df.groupby(['PhotoAmt_interval', 'AdoptionSpeed']).size().unstack(fill_value=0)
    
    print(f"Le nombre de photos le plus élevé est : {df['PhotoAmt'].max()}")

    # Convertir en dictionnaire pour renvoyer en JSON
    adoption_counts_dict = adoption_counts.to_dict(orient='index')

    return adoption_counts_dict



@app.get("/adoption-speed-gender")
async def get_adoption_speed_gender():
    df = load_data()

    # 🎯 Sélection des colonnes utiles
    columns = ["PetID", "Gender", "MaturitySize", "Fee", "AdoptionSpeed"]
    df = df[columns].dropna()  # Supprime les valeurs nulles

    # 🔄 Mapping des valeurs pour Gender
    gender_map = {1: "Mâle", 2: "Femelle"}
    df = df[df["Gender"].isin(gender_map.keys())]  # Supprime Mixed (3)
    df["Gender"] = df["Gender"].map(gender_map)

    # 🔄 Mapping des valeurs pour AdoptionSpeed
    adoption_speed_map = {
        0: "Le jour même",
        1: "1-7 jours",
        2: "8-30 jours",
        3: "31-90 jours",
        4: "Non adopté",
    }

    df["AdoptionSpeed"] = df["AdoptionSpeed"].map(adoption_speed_map)

    # 🚀 Conversion des types
    df["MaturitySize"] = df["MaturitySize"].astype(int)
    df["Fee"] = df["Fee"].astype(int)

    return df.to_dict(orient="records")