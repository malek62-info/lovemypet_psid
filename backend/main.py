from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scipy.stats import gaussian_kde  # Importation corrigée
import pandas as pd
import os
import numpy as np  # Ajout de l'importation de numpy
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
    
    if not os.path.exists(DATA_PATH):
        logger.error(f"Fichier introuvable : {DATA_PATH}")
        return {"error": "Fichier de données introuvable"}

    df = pd.read_csv(DATA_PATH)

    if "Type" not in df.columns:
        return {"error": "Colonne 'Type' manquante dans le fichier"}
    """
    ici on filtre les donnée on garde uniquement le type de l'nimale qui nou interesse 
    """

    df = df[df["Type"] == animal_type]

    if df.empty:
        return {"error": "Aucune donnée trouvée pour ce type d'animal"}

    variables = ["FurLength", "Vaccinated", "Dewormed", "Sterilized", "Health", "Gender", "MaturitySize"]

    df = df[
        ~((df["Vaccinated"] == 3) | 
          (df["Dewormed"] == 3) | 
          (df["Sterilized"] == 3) | 
          (df["Health"] == 3) | 
          (df["MaturitySize"] == 4))
    ]

    stacked_data = []

    """
    on compte les occurrences par vitesse d'adoption (AdoptionSpeed)
    """

    for variable in variables:
        if variable not in df.columns:
            logger.warning(f"Colonne {variable} manquante")
            continue

        grouped = df.groupby([variable, "AdoptionSpeed"]).size().unstack(fill_value=0)

        for category in grouped.index:
            total = grouped.loc[category].sum()
            if total == 0:
                continue
            entry = {
                "category": f"{variable}_{category}",
            }
            for speed in range(5):
                count = int(grouped.loc[category, speed]) if speed in grouped.columns else 0
                entry[f"speed_{speed}"] = count
                entry[f"percent_{speed}"] = round((count / total) * 100, 1) if total > 0 else 0
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

    df = df[df["Sterilized"] != 3]

    grouped = df.groupby(["Gender", "Sterilized"]).size().unstack(fill_value=0)

    grouped.columns = ["Sterilized_Yes" if col == 1 else "Sterilized_No" for col in grouped.columns]

    grouped = grouped.reset_index()

    sterilization_data = []
    for _, row in grouped.iterrows():
        entry = {
            "Gender": f"Gender_{int(row['Gender'])}",
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

    df = df[
        (df["Sterilized"] != 3) &
        (df["Gender"] != 3)
    ]

    def categorize_age(age):
        if age <= 2: return "Âge - Jeune"
        elif age <= 7: return "Âge - Adulte"
        else: return "Âge - Senior"

    df["AgeCategory"] = df["Age"].apply(categorize_age)

    grouped = df.groupby(["AgeCategory", "Gender", "Sterilized"]).size().unstack(fill_value=0)

    grouped.columns = ["Sterilized_No" if col == 2 else "Sterilized_Yes" for col in grouped.columns]

    grouped["Total"] = grouped["Sterilized_Yes"] + grouped["Sterilized_No"]

    grouped["Sterilized_Yes_Percent"] = (grouped["Sterilized_Yes"] / grouped["Total"] * 100).round(1)
    grouped = grouped.reset_index()

    age_categories = ["Âge - Jeune", "Âge - Adulte", "Âge - Senior"]
    sterilization_data = []

    for age in age_categories:
        entry = {"Age": age}
        age_data = grouped[grouped["AgeCategory"] == age]
        male_data = age_data[age_data["Gender"] == 1]
        entry["Male_Sterilization_Percent"] = float(male_data["Sterilized_Yes_Percent"].iloc[0]) if not male_data.empty else 0.0
        female_data = age_data[age_data["Gender"] == 2]
        entry["Female_Sterilization_Percent"] = float(female_data["Sterilized_Yes_Percent"].iloc[0]) if not female_data.empty else 0.0
        sterilization_data.append(entry)

    return {"data": sterilization_data}



@app.get("/adoption-speed-density/{animal_type}")
def get_adoption_speed_density(animal_type: int):
    if not os.path.exists(DATA_PATH):
        logger.error(f"Fichier introuvable : {DATA_PATH}")
        return {"error": "Fichier de données introuvable"}
    
    df = pd.read_csv(DATA_PATH)

    if "Type" not in df.columns:
        return {"error": "Colonne 'Type' manquante dans le fichier"}
    
    # Filtrer par type d'animal (1 pour chiens, 2 pour chats)
    df = df[df["Type"] == animal_type]
    # Exclure le genre mixte (3)
    df = df[df["Gender"] != 3]
    
    # Définir les intervalles d'âge (en mois)
    bins = [0, 6, 12, 24, 36, 60, 120, float('inf')]  # 0-6 mois, 6-12 mois, 1-2 ans, 2-3 ans, 3-5 ans, 5-10 ans, 10+ ans
    labels = ["0-6 mois", "6-12 mois", "1-2 ans", "2-3 ans", "3-5 ans", "5-10 ans", "10+ ans"]
    df["AgeCategory"] = pd.cut(df["Age"], bins=bins, labels=labels, right=False)
    
    # Grouper par catégorie d'âge, sexe et vitesse d'adoption
    grouped = df.groupby(["AgeCategory", "Gender", "AdoptionSpeed"]).size().unstack(fill_value=0).reset_index()
    
    # Structure des données pour le frontend
    line_data = {"male": {}, "female": {}}
    
    for gender, label in [(1, "male"), (2, "female")]:
        df_gender = grouped[grouped["Gender"] == gender]
        if not df_gender.empty:
            for speed in range(5):
                if speed in df_gender.columns:
                    line_data[label][str(speed)] = {
                        "x": df_gender["AgeCategory"].tolist(),
                        "y": df_gender[speed].tolist()
                    }
                else:
                    line_data[label][str(speed)] = {"x": [], "y": []}
    
    return {"line_data": line_data}