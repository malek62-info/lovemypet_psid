from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "data_clean.csv")

@app.get("/stacked-bar/{animal_type}")
def get_stacked_bar_data(animal_type: int):
    """
    Retourne les données agrégées pour toutes les variables dans un diagramme en barres empilées.
    Exclut 'Pas sûr' (3) pour Vaccinated, Dewormed, Sterilized, 'Grave' (3) pour Health, et 'Très grand' (4) pour MaturitySize.
    """
    if not os.path.exists(DATA_PATH):
        logger.error(f"Fichier introuvable : {DATA_PATH}")
        return {"error": "Fichier de données introuvable"}

    df = pd.read_csv(DATA_PATH)

    if "Type" not in df.columns:
        return {"error": "Colonne 'Type' manquante dans le fichier"}

    df = df[df["Type"] == animal_type]

    if df.empty:
        return {"error": "Aucune donnée trouvée pour ce type d'animal"}

    # Liste des variables à analyser
    variables = ["FurLength", "Vaccinated", "Dewormed", "Sterilized", "Health", "Gender", "MaturitySize"]

    # Filtrer les catégories non désirées
    df = df[
        ~((df["Vaccinated"] == 3) | 
          (df["Dewormed"] == 3) | 
          (df["Sterilized"] == 3) | 
          (df["Health"] == 3) | 
          (df["MaturitySize"] == 4))
    ]

    # Dictionnaire pour stocker les données agrégées
    stacked_data = []

    for variable in variables:
        if variable not in df.columns:
            logger.warning(f"Colonne {variable} manquante")
            continue

        # Grouper les données par variable et AdoptionSpeed
        grouped = df.groupby([variable, "AdoptionSpeed"]).size().unstack(fill_value=0)

        # Ajouter chaque catégorie comme une entrée dans stacked_data
        for category in grouped.index:
            total = grouped.loc[category].sum()  # Total des animaux dans cette catégorie
            if total == 0:
                continue  # Éviter division par zéro
            entry = {
                "category": f"{variable}_{category}",  # Ex. : "FurLength_1"
            }
            for speed in range(5):  # AdoptionSpeed va de 0 à 4
                count = int(grouped.loc[category, speed]) if speed in grouped.columns else 0
                entry[f"speed_{speed}"] = count
                entry[f"percent_{speed}"] = round((count / total) * 100, 1) if total > 0 else 0  # Pourcentage (optionnel)
            stacked_data.append(entry)

    return {"stacked_data": stacked_data}