import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Charger les données
file_path = r"C:\Users\Faiz ADENLE\Desktop\lovemypet_psid\backend\data\data_clean.csv"
df = pd.read_csv(file_path)

# Convertir les valeurs numériques en labels pour la lisibilité
mapping = {1: "Yes", 2: "No", 3: "Not Sure"}
df["Vaccinated"] = df["Vaccinated"].map(mapping)
df["Sterilized"] = df["Sterilized"].map(mapping)

# Filtrer les données en fonction de la variable "Fee" et uniquement les valeurs non nulles
df_filtered = df[df['Fee'] != 0]

# Créer le premier boxplot : Frais d'adoption en fonction de Vaccinated
plt.figure(figsize=(14, 6))

# Boxplot pour Vaccinated et Fee
plt.subplot(1, 2, 1)  # 1 ligne, 2 colonnes, premier subplot
sns.boxplot(x='Vaccinated', y='Fee', data=df_filtered, palette="coolwarm")
plt.title("Distribution des frais d'adoption (Fee) par Vaccination")
plt.xlabel("Vaccinated")
plt.ylabel("Frais d'adoption (€)")

# Créer le deuxième boxplot : Frais d'adoption en fonction de Sterilized
plt.subplot(1, 2, 2)  # 1 ligne, 2 colonnes, deuxième subplot
sns.boxplot(x='Sterilized', y='Fee', data=df_filtered, palette="coolwarm")
plt.title("Distribution des frais d'adoption (Fee) par Stérilisation")
plt.xlabel("Sterilized")
plt.ylabel("Frais d'adoption (€)")

# Ajuster l'affichage
plt.tight_layout()
plt.show()


