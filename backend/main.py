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

def load_data():
    return pd.read_csv(DATA_PATH)

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

