import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import numpy as np  # Ajout de l'importation de numpy
import logging
from fastapi.responses import JSONResponse
from pydantic import BaseModel

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
    Retourne le pourcentage d'animaux stérilisés par tranches d'âge en mois
    Format compatible avec le front-end existant
    """
    df = load_data()

    # Validation des données
    required_columns = ["Type", "Age", "Gender", "Sterilized"]
    for col in required_columns:
        if col not in df.columns:
            return {"error": f"Colonne '{col}' manquante dans le fichier"}

    df = df[df["Type"] == animal_type]

    if df.empty:
        return {"error": "Aucune donnée trouvée pour ce type d'animal"}

    # Filtrage des données
    df = df[
        (df["Sterilized"].isin([1, 2])) &  # 1: Oui, 2: Non
        (df["Gender"].isin([1, 2]))        # 1: Mâle, 2: Femelle
    ].copy()

    # Conversion de l'âge en mois si nécessaire (supposons que l'âge est déjà en mois)
    df["AgeMonths"] = df["Age"]  # Si l'âge est déjà en mois
    # Si l'âge est en années: df["AgeMonths"] = df["Age"] * 12

    # Création de tranches d'âge de 10 mois
    def create_age_groups(age_months):
        lower = (age_months // 10) * 10
        upper = lower + 9
        return f"{lower}-{upper}"

    df["AgeGroup"] = df["AgeMonths"].apply(create_age_groups)

    # Calcul des pourcentages
    result = (
        df.groupby(["AgeGroup", "Gender", "Sterilized"])
        .size()
        .unstack(fill_value=0)
        .rename(columns={1: "Sterilized_Yes", 2: "Sterilized_No"})
        .assign(Total=lambda x: x["Sterilized_Yes"] + x["Sterilized_No"])
        .assign(Sterilized_Percent=lambda x: (x["Sterilized_Yes"] / x["Total"] * 100).round(1))
        .reset_index()
    )

    # Préparation des données au format attendu par le front
    output_data = []
    
    # On s'assure que toutes les tranches d'âge sont présentes même sans données
    all_age_groups = sorted(df["AgeGroup"].unique(), key=lambda x: int(x.split('-')[0]))
    
    for age_group in all_age_groups:
        group_data = result[result["AgeGroup"] == age_group]
        
        # Données pour les mâles
        male_data = group_data[group_data["Gender"] == 1]
        male_percent = float(male_data["Sterilized_Percent"].iloc[0]) if not male_data.empty else 0.0
        
        # Données pour les femelles
        female_data = group_data[group_data["Gender"] == 2]
        female_percent = float(female_data["Sterilized_Percent"].iloc[0]) if not female_data.empty else 0.0
        
        output_data.append({
            "Age": f"{age_group} mois",  # Format "X-X mois"
            "Male_Sterilization_Percent": male_percent,
            "Female_Sterilization_Percent": female_percent
        })

    return {"data": output_data}


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
    import os

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    df = pd.read_csv(os.path.join(BASE_DIR, "data", "data_clean.csv"))
    breeds = pd.read_csv(os.path.join(BASE_DIR, "data", "breed_labels.csv"))

    # Ajouter info de race pure
    df["IsPureBreed"] = df["Breed2"] == 0

    # Fusionner noms de races
    breeds = breeds.rename(columns={"BreedID": "Breed1", "BreedName": "BreedName"})
    df = df.merge(breeds[["Breed1", "BreedName"]], on="Breed1", how="left")
    df = df[df["BreedName"].notna()]

    # Adoption rapide
    df["AdoptedFast"] = df["AdoptionSpeed"].isin([0, 1])

    # Garder uniquement stérilisés / non-stérilisés
    df = df[df["Sterilized"].isin([1, 2])]

    # Regrouper par type, race, stérilisation et pureté
    grouped = df.groupby(["Type", "Breed1", "BreedName", "Sterilized", "IsPureBreed"]).agg(
        total=("AdoptedFast", "count"),
        adopted_fast=("AdoptedFast", "sum")
    ).reset_index()

    # Pourcentage
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



# @app.get("/age-vaccination-data")
# async def get_age_vaccination_data():
#     # Charger les données
#     df = load_data()
    
#     # Nettoyage des données
#     df = df.dropna(subset=['Age', 'Vaccinated'])
#     df = df[df['Vaccinated'] == 2]  # Garder uniquement les non-vaccinés (2)
#     df['Age'] = df['Age'].astype(int)  # S'assurer que l'âge est un entier

#     # Définir des intervalles d'âge (par exemple, de 0 à 250, avec des intervalles de 10 ans)
#     bins = list(range(0, 260, 10))  # Intervalles de 10 ans (0-10, 10-20, ..., 240-250)
#     labels = [f'{i}-{i+9}' for i in range(0, 250, 10)]  # Modifié pour correspondre aux bins
    
#     # Ajouter une colonne 'AgeGroup' pour l'intervalle d'âge
#     df['AgeGroup'] = pd.cut(df['Age'], bins=bins, labels=labels, right=False)

#     # Compter les non-vaccinés par groupe d'âge
#     result = (
#         df.groupby('AgeGroup')['Vaccinated']
#         .value_counts()
#         .unstack(fill_value=0)
#         .rename(columns={2: 'NoNumberVaccinated'})  # Se concentrer sur les non-vaccinés
#         .reset_index()
#     )
    
#     # Ajouter les groupes d'âge manquants avec des counts à 0
#     all_age_groups = set(labels)
#     current_age_groups = set(result['AgeGroup'])
#     missing_age_groups = all_age_groups - current_age_groups
    
#     for age_group in missing_age_groups:
#         result = result.append({
#             'AgeGroup': age_group,
#             'NoNumberVaccinated': 0
#         }, ignore_index=True)
    
#     # Trier par groupe d'âge
#     result = result.sort_values(by='AgeGroup').reset_index(drop=True)
    
#     # Convertir en format demandé
#     output = result.to_dict(orient='records')
    
#     return JSONResponse(content=output)


@app.get("/age-vaccination-data")
async def get_age_vaccination_data():
    # Charger les données
    df = load_data()

    # Nettoyage des données
    df = df.dropna(subset=['Age', 'Vaccinated'])
    df = df[df['Vaccinated'] == 2]  # Garder uniquement les non-vaccinés
    df['Age'] = df['Age'].astype(int)

    # Définir les intervalles d'âge
    bins = [0, 11, 21, 31, 41, float('inf')]
    labels = ['0-10', '11-20', '21-30', '31-40', '41+']

    # Créer la colonne de groupe d'âge
    df['AgeGroup'] = pd.cut(df['Age'], bins=bins, labels=labels, right=False)

    # Compter les non-vaccinés par groupe d'âge
    result = (
        df.groupby('AgeGroup')['Vaccinated']
        .value_counts()
        .unstack(fill_value=0)
        .rename(columns={2: 'NoNumberVaccinated'})  # Se concentrer sur les non-vaccinés
        .reset_index()
    )

    # Ajouter les groupes d'âge manquants
    for label in labels:
        if label not in result['AgeGroup'].values:
            result = result.append({
                'AgeGroup': label,
                'NoNumberVaccinated': 0
            }, ignore_index=True)

    # Trier par groupe d'âge
    result['AgeGroup'] = pd.Categorical(result['AgeGroup'], categories=labels, ordered=True)
    result = result.sort_values(by='AgeGroup').reset_index(drop=True)

    # Convertir en format JSON
    output = result.to_dict(orient='records')

    return JSONResponse(content=output)


@app.get("/furlength-early-adoption")
def get_furlength_early_adoption(gender: int = None):
    """
    Calcule et retourne les adoptions rapides par longueur de fourrure.
    Paramètre 'gender' permet de filtrer les données par sexe (1 = mâle, 2 = femelle).
    """
    df = load_data()
    
    # Vérifier que les colonnes existent
    if "FurLength" not in df.columns or "AdoptionSpeed" not in df.columns or "Gender" not in df.columns:
        return {"error": "Colonnes manquantes dans le fichier"}
    
    # Filtrer pour ne garder que les adoptions rapides (0 et 1)
    df = df[df["AdoptionSpeed"].isin([0, 1])]
    
    # Filtrer par sexe si le paramètre 'gender' est fourni
    if gender is not None:
        df = df[df["Gender"] == gender]
    
    # Compter le nombre d'adoptions par longueur de fourrure
    adoption_counts = df["FurLength"].value_counts().sort_index()
    
    # Préparer les libellés
    fur_length_labels = {
        0: "Non spécifié",
        1: "Court",
        2: "Moyen",
        3: "Long"
    }
    
    # Préparer les données pour le frontend
    data = {
        "fur_length": [],
        "count": [],
        "percentage": []
    }
    
    total_adoptions = len(df)
    
    for fur_length, count in adoption_counts.items():
        data["fur_length"].append(fur_length_labels.get(fur_length, str(fur_length)))
        data["count"].append(int(count))
        data["percentage"].append(round((count / total_adoptions) * 100, 2))
    
    return data




@app.get("/furlength-dewormed")
def get_furlength_dewormed():
    df = load_data()

    # Vérifier si les colonnes nécessaires existent
    if "FurLength" not in df.columns or "Dewormed" not in df.columns:
        return {"error": "Colonnes manquantes dans le fichier"}

    # Ne garder que les lignes avec des valeurs valides pour FurLength (1, 2, 3)
    df = df[df["FurLength"].isin([1, 2, 3])]

    # Séparer les groupes vermifugés et non vermifugés
    df_dewormed = df[df["Dewormed"] == 1]
    df_non_dewormed = df[df["Dewormed"] == 2]

    # Compter les occurrences par type de fourrure
    fur_length_counts_dewormed = df_dewormed["FurLength"].value_counts()
    fur_length_counts_non_dewormed = df_non_dewormed["FurLength"].value_counts()

    fur_length_labels = {
        1: "Court",
        2: "Moyen",
        3: "Long"
    }

    data = {
        "fur_length": [],
        "dewormed_count": [],
        "non_dewormed_count": []
    }

    for length in [1, 2, 3]:
        data["fur_length"].append(fur_length_labels[length])
        data["dewormed_count"].append(int(fur_length_counts_dewormed.get(length, 0)))
        data["non_dewormed_count"].append(int(fur_length_counts_non_dewormed.get(length, 0)))

    return data


#IA
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os

# Configuration du logging
logging.basicConfig(level=logging.DEBUG)  # Définit le niveau de log sur DEBUG pour avoir plus de détails
logger = logging.getLogger(__name__)

# Charger le modèle et le scaler
MODEL_PATH = os.path.join("data", "model_v.pkl")
SCALER_PATH = os.path.join("data", "scaler_v.pkl")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Modèle de données en entrée
class PetFeatures(BaseModel):
    Type: int
    Age: int
    Breed1: int
    Breed2: int
    Color1: int
    Color2: int
    MaturitySize: int
    FurLength: int
    Vaccinated: int
    Dewormed: int
    Sterilized: int
    PhotoAmt: int
    Fee: int
    PureBreed: int
    Health: int
    VideoAmt : int

@app.post("/predict")
def predict_pet_adoption(pet: PetFeatures):
    try:
        # Préparer les features
        input_data = pd.DataFrame([{
            'Type': pet.Type,
            'Age': pet.Age,
            'breed1_chat': pet.Breed1 if pet.Type == 2 else -1000,
            'breed1_chien': pet.Breed1 if pet.Type == 1 else -1000,
            'breed2_chat': pet.Breed2 if pet.Type == 2 else -1000,
            'breed2_chien': pet.Breed2 if pet.Type == 1 else -1000,
            'Color1': pet.Color1,
            'Color2': pet.Color2,
            'MaturitySize': pet.MaturitySize,
            'FurLength': pet.FurLength,
            'Vaccinated': pet.Vaccinated,
            'Dewormed': pet.Dewormed,
            'Sterilized': pet.Sterilized,
            'PhotoAmt': pet.PhotoAmt,
            'Fee': pet.Fee,
            'PureBreed': pet.PureBreed,
            'Health': pet.Health,
            'VideoAmt': pet.VideoAmt
        }])
        
        # Réorganiser les colonnes selon l'ordre utilisé pour l'entraînement
        input_data = input_data[['Type', 'Age', 'breed1_chat', 'breed1_chien', 'breed2_chat', 'breed2_chien',
                                'Color1', 'Color2', 'MaturitySize', 'FurLength', 'Vaccinated', 'Dewormed',
                                'Sterilized', 'PhotoAmt', 'Fee', 'PureBreed', 'VideoAmt', 'Health']]


        # Appliquer le scaler
        input_scaled = scaler.transform(input_data)
        


        # Prédiction
        prediction = model.predict(input_scaled)[0]
        probas = model.predict_proba(input_scaled)[0]

        return {
            "prediction": int(prediction),
            "proba_rapide_adoption": round(probas[0], 3),
            "proba_lente_adoption": round(probas[1], 3),
        }

    except Exception as e:
        logger.error(f"Erreur lors de la prédiction: {str(e)}")  # Log l'erreur
        raise HTTPException(status_code=500, detail="Une erreur est survenue lors de la prédiction.")
