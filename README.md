[![Code Quality](https://img.shields.io/badge/Code%20Quality-A-brightgreen)](https://app.codacy.com/gh/malek62-info/lovemypet_psid/dashboard) [![Dernière Release](https://img.shields.io/github/v/release/malek62-info/LoveMyPet?style=flat-square)](https://github.com/malek62-info/lovemypet_psid/releases) [![GitHub commits](https://img.shields.io/github/last-commit/malek62-info/lovemypet_psid/main)](https://github.com/malek62-info/lovemypet_psid/commits/main) [![Python CI with pip](https://github.com/malek62-info/lovemypet_psid/actions/workflows/python.yml/badge.svg)](https://github.com/malek62-info/lovemypet_psid/actions/workflows/python.yml)


# Instructions pour démarrer le projet

## Ce projet contient :
1. **Frontend (Next.js)**
2. **Backend (FastAPI)**

### Prérequis
- **Node.js et npm** doivent être installés pour le frontend.
- **Python 3.7+** doit être installé pour le backend.
- **Pip** doit être installé pour le backend (qui gère les dépendances Python).

---

## 1. Frontend (Next.js)

### Étapes pour démarrer le frontend :

1. Clonez le dépôt et allez dans le dossier `frontend` :
    ```bash
    git clone https://github.com/malek62-info/lovemypet_psid.git
    cd lovemypet_psid/frontend
    ```

2. Installez les dépendances :
    ```bash
    npm install
    ```

3. Lancez l'application :
    ```bash
    npm run dev
    ```

   L'application sera accessible à l'adresse suivante : `http://localhost:3000`.

---

## 2. Backend (FastAPI)

### Étapes pour démarrer le backend :

1. Clonez le dépôt et allez dans le dossier `backend` :
    ```bash
    git clone https://github.com/malek62-info/lovemypet_psid.git
    cd lovemypet_psid/backend
    ```

2. Créez un environnement virtuel :
    ```bash
    python -m venv venv
    ```

3. Activez l'environnement virtuel :
    - **Sous Windows** :
      ```bash
      venv\\Scripts\\activate
      ```
    - **Sous macOS/Linux** :
      ```bash
      source venv/bin/activate
      ```

4. Installez les dépendances :
    ```bash
    pip install -r .github\\workflows\\requirements.txt
    ```

5. Lancez l'application backend avec Uvicorn :
    ```bash
    uvicorn main:app --reload
    ```

   Le backend sera accessible à l'adresse suivante : `http://localhost:8000`.

---


6. Génération du fichier `requirements.txt`

Exécutez la commande suivante pour générer le fichier `requirements.txt` dans le dossier `.github/workflows/` :

```bash
pip freeze > .github/workflows/requirements.txt
