from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import logging

# Configuration du logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "data_clean.csv")

# Fonction pour charger les données
def load_data(animal_type: int):
    logger.info(f"Chargement des données pour animal_type={animal_type} depuis {DATA_PATH}")
    
    # Vérifie si le fichier existe
    if not os.path.exists(DATA_PATH):
        logger.error(f"Fichier introuvable : {DATA_PATH}")
        return {}

    df = pd.read_csv(DATA_PATH)

    # Vérifie si la colonne "Type" existe
    if "Type" not in df.columns:
        logger.error("La colonne 'Type' est absente du fichier CSV.")
        return {}

    df = df[df["Type"] == animal_type]  # Filtrer par type (1 = Chien, 2 = Chat)

    if df.empty:
        logger.warning(f"Aucune donnée trouvée pour animal_type={animal_type}")
        return {}

    # Sélectionner les colonnes d'intérêt
    columns = ["Age", "MaturitySize", "FurLength", "Vaccinated", "Dewormed", "Sterilized", "Health", "AdoptionSpeed"]
    
    # Vérifie que toutes les colonnes existent
    missing_cols = [col for col in columns if col not in df.columns]
    if missing_cols:
        logger.error(f"Colonnes manquantes dans le fichier CSV : {missing_cols}")
        return {}

    df = df[columns]

    # Calcul de la matrice de corrélation
    correlation_matrix = df.corr()

    # Extraire la corrélation avec la Vitesse d'adoption
    correlation_with_adoption_speed = correlation_matrix['AdoptionSpeed']

    logger.info(f"Corrélation avec la Vitesse d'adoption : {correlation_with_adoption_speed}")
    
    # Formater les résultats pour correspondre à la structure attendue par le front-end
    formatted_data = [{"attribute": key, "value": value} for key, value in correlation_with_adoption_speed.items() if key != 'AdoptionSpeed']
    
    return formatted_data

# Endpoint pour récupérer les données
@app.get("/data/{animal_type}")
def get_data(animal_type: int):
    correlation_with_adoption_speed = load_data(animal_type)
    
    # Retourner les données formatées
    return {
        "data": correlation_with_adoption_speed
    }

