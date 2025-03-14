from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import pandas as pd
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
    print(df.head())  # Affiche le head dans la console
    
    return df.head(10).to_dict(orient="records") 

@app.get("/")  
def get_data():
    return load_data()

