from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL de ton frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Définir le chemin vers le fichier de données
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "data_clean.csv")

# Charger les données une fois au démarrage
df = pd.read_csv(DATA_PATH)

@app.get("/")
def get_data():
    # Exemple simple pour tester l’API
    return df.head(10).to_dict(orient="records")

@app.get("/api/non_adoption_factors")
def non_adoption_factors():
    filtered = df[df["AdoptionSpeed"] == 4]

    features = {
        "Âge (mois)": round(filtered["Age"].mean(), 2),
        "Taille à maturité": round(filtered["MaturitySize"].mean(), 2),
        "Longueur du pelage": round(filtered["FurLength"].mean(), 2),
        "État de santé": round(filtered["Health"].mean(), 2),
        "Nombre de photos": round(filtered["PhotoAmt"].mean(), 2),
        "Frais d’adoption": round(filtered["Fee"].mean(), 2)
    }

    return features

