import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/stacked-bar/{animal_type}")
def get_stacked_bar_data(animal_type: int):
    
    df = load_data()

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
    df = load_data()

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
    df = load_data()

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
    
    df = load_data()

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

@app.get("/sterilization-topbreeds")
def sterilization_topbreeds():
    

    # Exclure races "Mixed Breed"
    MIXED_BREED_ID = 307
    df = df[(df["Breed1"] != MIXED_BREED_ID) & (df["Sterilized"] != 3)]

    df["SterilizedBool"] = df["Sterilized"] == 2
    df["AdoptedFast"] = df["AdoptionSpeed"] <= 1

    # Top 10 races les plus fréquentes par Type
    top_breeds = (
        df.groupby(["Type", "Breed1"])["PetID"]
        .count()
        .reset_index(name="count")
        .sort_values(["Type", "count"], ascending=[True, False])
        .groupby("Type")
        .head(10)
    )

    # Garder seulement ces races
    df = df.merge(top_breeds[["Type", "Breed1"]], on=["Type", "Breed1"])

    # Statistiques par race
    grouped = df.groupby(["Type", "Breed1"]).agg(
        total=("PetID", "count"),
        sterilized=("SterilizedBool", "mean"),
        adopted_fast=("AdoptedFast", "mean")
    ).reset_index()

    grouped["BreedName"] = grouped["Breed1"].apply(lambda x: f"Race {x}")
    grouped["AnimalType"] = grouped["Type"].map({1: "Chien", 2: "Chat"})

    return grouped.to_dict(orient="records")



@app.get("/api/sterilization_adoption_impact")
def sterilization_adoption_impact():
    import pandas as pd
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    df = pd.read_csv(os.path.join(BASE_DIR, "data", "data_clean.csv"))
    breeds = pd.read_csv(os.path.join(BASE_DIR, "data", "breed_labels.csv"))

    # Fusionner les noms de races
    breeds = breeds.rename(columns={"BreedID": "Breed1", "BreedName": "BreedName"})
    df = df.merge(breeds[["Breed1", "BreedName"]], on="Breed1", how="left")
    df = df[df["BreedName"].notna()]

    # Garde uniquement AdoptionSpeed 0 ou 1 (adoption rapide)
    df["AdoptedFast"] = df["AdoptionSpeed"].isin([0, 1])

    # Garde uniquement stérilisés / non-stérilisés (ignore inconnus)
    df = df[df["Sterilized"].isin([1, 2])]

    # Compter nombre total et nombre adoptés rapidement par race, type et statut de stérilisation
    grouped = df.groupby(["Type", "Breed1", "BreedName", "Sterilized"]).agg(
        total=("AdoptedFast", "count"),
        adopted_fast=("AdoptedFast", "sum")
    ).reset_index()

    # Calcul du pourcentage
    grouped["adoption_rate"] = (grouped["adopted_fast"] / grouped["total"] * 100).round(1)

    return grouped.to_dict(orient="records")



@app.get("/api/top_sterilized_breeds")
def get_top_sterilized_breeds():
    import pandas as pd
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    df = pd.read_csv(os.path.join(BASE_DIR, "data", "data_clean.csv"))
    breeds = pd.read_csv(os.path.join(BASE_DIR, "data", "breed_labels.csv"))

    # Filtrer les colonnes utiles
    df = df[["Type", "Breed1", "Sterilized"]].dropna()
    df = df[df["Sterilized"] == 2]  # uniquement stérilisés

    # Fusion avec les noms de races
    breeds = breeds.rename(columns={"BreedID": "Breed1", "BreedName": "BreedName"})
    df = pd.merge(df, breeds[["Breed1", "BreedName"]], on="Breed1", how="left")

    # Regrouper par Type, Breed1 et BreedName
    grouped = df.groupby(["Type", "Breed1", "BreedName"]).size().reset_index(name="Count")
    return grouped.to_dict(orient="records")

@app.get("/top-breeds-adoption/{animal_type}")
def get_top_breeds_adoption(animal_type: int):
    """
    Retourne les 10 races pures et mixtes les plus rapides à être adoptées pour un type d'animal.
    """
    if not os.path.exists(DATA_PATH):
        logger.error(f"Fichier introuvable : {DATA_PATH}")
        return {"error": "Fichier de données introuvable"}

    # Charger les données
    df = pd.read_csv(DATA_PATH)
    breed_labels = pd.read_csv(os.path.join(BASE_DIR, "data", "breed_labels.csv"))

    if "Type" not in df.columns:
        return {"error": "Colonne 'Type' manquante dans le fichier"}

    # Filtrer par type d'animal (1 = Chien, 2 = Chat)
    df = df[df["Type"] == animal_type]

    if df.empty:
        return {"error": "Aucune donnée trouvée pour ce type d'animal"}

    # Fusionner avec les noms des races
    df = df.merge(breed_labels, left_on="Breed1", right_on="BreedID", how="left")

    # Ajouter la colonne "Purity"
    df["Purity"] = df["Breed2"].apply(lambda x: "Pure" if x == 0 else "Mixte")

    # Calculer la vitesse moyenne par race et pureté
    speed_by_breed_purity = df.groupby(["BreedName", "Purity"])["AdoptionSpeed"].mean().reset_index()

    # Filtrer pour avoir au moins 5 observations par race pour fiabilité
    counts = df.groupby(["BreedName", "Purity"]).size()
    valid_breeds = counts[counts >= 5].index
    speed_by_breed_purity = speed_by_breed_purity[speed_by_breed_purity.set_index(["BreedName", "Purity"]).index.isin(valid_breeds)]

    # Top 10 races pures
    pure_breeds = speed_by_breed_purity[speed_by_breed_purity["Purity"] == "Pure"]
    top_10_pure = pure_breeds.sort_values("AdoptionSpeed").head(10)

    # Top 10 races mixtes
    mixte_breeds = speed_by_breed_purity[speed_by_breed_purity["Purity"] == "Mixte"]
    top_10_mixte = mixte_breeds.sort_values("AdoptionSpeed").head(10)

    # Combiner les deux tops
    top_10_combined = pd.concat([top_10_pure, top_10_mixte])

    # Préparer les données pour le frontend
    bar_data = top_10_combined.rename(columns={
        "BreedName": "breed",
        "Purity": "purity",
        "AdoptionSpeed": "speed"
    }).to_dict(orient="records")

    return {"bar_data": bar_data}