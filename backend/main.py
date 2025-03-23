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

@app.get("/sterilization-by-gender/{animal_type}")
def get_sterilization_by_gender(animal_type: int):
    """
    Retourne le nombre total d'animaux stérilisés et non stérilisés par sexe.
    Exclut 'Pas sûr' (3) pour Sterilized.
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

    # Filtrer les catégories non désirées (Sterilized == 3 pour "Pas sûr")
    df = df[df["Sterilized"] != 3]

    # Grouper les données par Gender et Sterilized
    grouped = df.groupby(["Gender", "Sterilized"]).size().unstack(fill_value=0)

    # Renommer les colonnes pour correspondre à Sterilized_Yes et Sterilized_No
    grouped.columns = ["Sterilized_Yes" if col == 1 else "Sterilized_No" for col in grouped.columns]

    # Réinitialiser l'index
    grouped = grouped.reset_index()

    # Transformer les données pour le frontend
    sterilization_data = []
    for _, row in grouped.iterrows():
        entry = {
            "Gender": f"Gender_{int(row['Gender'])}",  # Ex. : "Gender_1"
            "Sterilized_Yes": int(row["Sterilized_Yes"]),
            "Sterilized_No": int(row["Sterilized_No"]),
        }
        sterilization_data.append(entry)

    return {"data": sterilization_data}

@app.get("/sterilization-percent-by-age/{animal_type}")
def get_sterilization_percent_by_age(animal_type: int):
    """
    Retourne le pourcentage d'animaux stérilisés par âge et sexe.
    Exclut 'Pas sûr' (3) pour Sterilized et 'Mixte' (3) pour Gender.
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

    # Filtrer les catégories non désirées
    df = df[
        (df["Sterilized"] != 3) &  # Exclut "Pas sûr" pour Sterilized
        (df["Gender"] != 3)  # Exclut "Mixte" pour Gender
    ]

    # Catégoriser les âges
    def categorize_age(age):
        if age <= 2:  # 0-2 ans : Jeune
            return "Âge - Jeune"
        elif age <= 7:  # 3-7 ans : Adulte
            return "Âge - Adulte"
        else:  # 8+ ans : Senior
            return "Âge - Senior"

    df["AgeCategory"] = df["Age"].apply(categorize_age)

    # Grouper par âge et sexe, et calculer le pourcentage de stérilisation
    grouped = df.groupby(["AgeCategory", "Gender", "Sterilized"]).size().unstack(fill_value=0)

    # Renommer les colonnes pour Sterilized_Yes et Sterilized_No
    grouped.columns = ["Sterilized_No" if col == 2 else "Sterilized_Yes" for col in grouped.columns]

    # Calculer le total par groupe (AgeCategory, Gender)
    grouped["Total"] = grouped["Sterilized_Yes"] + grouped["Sterilized_No"]

    # Calculer les pourcentages
    grouped["Sterilized_Yes_Percent"] = (grouped["Sterilized_Yes"] / grouped["Total"] * 100).round(1)
    grouped = grouped.reset_index()

    # Transformer les données pour le frontend
    age_categories = ["Âge - Jeune", "Âge - Adulte", "Âge - Senior"]
    sterilization_data = []

    for age in age_categories:
        entry = {"Age": age}
        # Filtrer les données pour cet âge
        age_data = grouped[grouped["AgeCategory"] == age]
        # Pourcentage pour les mâles (Gender == 1)
        male_data = age_data[age_data["Gender"] == 1]
        entry["Male_Sterilization_Percent"] = float(male_data["Sterilized_Yes_Percent"].iloc[0]) if not male_data.empty else 0.0
        # Pourcentage pour les femelles (Gender == 2)
        female_data = age_data[age_data["Gender"] == 2]
        entry["Female_Sterilization_Percent"] = float(female_data["Sterilized_Yes_Percent"].iloc[0]) if not female_data.empty else 0.0
        sterilization_data.append(entry)

    return {"data": sterilization_data}