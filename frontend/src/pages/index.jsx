import AnimalTypeChart from "../AnimalTypeChart";
import AgeDistributionChart from "../AgeDistributionChart";
import Wrapper from "../components/Wrapper";

export default function Home() {
  return (
    <Wrapper>
      <div className="">

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Contexte</h2>
          <p className="mb-4">
            Chaque année, des millions d'animaux errants se retrouvent sans foyer et risquent l’euthanasie en raison du manque d’adoptions.
            Ce problème soulève une question cruciale en matière de bien-être animal : comment augmenter leurs chances d’être adoptés rapidement ?
          </p>
          <p>
            L'essor des technologies d’intelligence artificielle et d’analyse de données ouvre de nouvelles perspectives pour améliorer ce processus.
            En exploitant les informations disponibles sur les profils d’animaux – descriptions textuelles, caractéristiques tabulaires et images –
            il devient possible d’identifier les éléments qui influencent le temps d’adoption.
            Une meilleure compréhension de ces facteurs peut permettre d’optimiser la présentation des animaux et d’accélérer leur adoption.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Objectifs</h2>
          <p className="mb-4">
            Ce projet vise à appliquer des techniques d’analyse de données et de machine learning pour prédire la rapidité d’adoption
            des animaux en fonction des informations disponibles sur leurs profils.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Préparer et nettoyer les données pour garantir leur fiabilité et leur exploitabilité.</li>
            <li>Réaliser des visualisations claires pour comprendre les distributions et les corrélations.</li>
            <li>Développer des modèles prédictifs en fonction des données textuelles, tabulaires et visuelles.</li>
            <li>Fournir des recommandations pour optimiser la présentation des profils d’animaux.</li>
          </ul>
          <p>
            En combinant une approche data-driven et des modèles d’intelligence artificielle,
            cette étude ambitionne de contribuer à l’amélioration des taux d’adoption et de réduire le nombre d’animaux en attente d’un foyer.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Solution</h2>
          <p className="mb-4">Pour répondre aux problématiques soulevées et atteindre les objectifs fixés, l’approche adoptée repose sur plusieurs étapes clés :</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Exploration et préparation des données :</strong> Sélectionner, nettoyer et traiter les données pertinentes (textuelles, tabulaires et visuelles).</li>
            <li><strong>Analyse exploratoire :</strong> Visualiser la distribution des variables et identifier les facteurs influents.</li>
            <li><strong>Modélisation prédictive :</strong> Mettre en œuvre des algorithmes de machine learning pour anticiper le temps d’adoption.</li>
            <li><strong>Interprétation et recommandations :</strong> Traduire les résultats en recommandations concrètes pour optimiser les chances d’adoption rapide.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Présentation du Jeu de Données</h2>
          <p>
            L’étude repose sur un jeu de données recensant des animaux proposés à l’adoption en Malaisie.
            Ce jeu de données contient des informations variées sur les animaux, incluant des données tabulaires, textuelles et visuelles.
            L’objectif est de comprendre les facteurs influençant la rapidité d’adoption en analysant ces différentes sources d’information.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Description des données</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Caractéristiques générales :</strong> Type d’animal (chien ou chat), âge (en mois), race principale et secondaire, sexe, taille, longueur du pelage.</li>
            <li><strong>État de santé :</strong> Vaccination, vermifugation, stérilisation, état général.</li>
            <li><strong>Apparence :</strong> Couleurs principales du pelage.</li>
            <li><strong>Informations sur l’adoption :</strong> Nombre d’animaux représentés dans un profil, frais d’adoption (si applicable).</li>
            <li><strong>Données multimédias :</strong> Nombre de photos associées à chaque profil.</li>
          </ul>
          <p className="mt-4">
            L’objectif est de prédire la variable <strong>AdoptionSpeed</strong>, qui représente le délai d’adoption selon cinq catégories :
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>0 : Adoption le jour même</li>
            <li>1 : Moins d’une semaine</li>
            <li>2 : Entre 8 et 30 jours</li>
            <li>3 : Entre 31 et 90 jours</li>
            <li>4 : Pas adopté après 100 jours</li>
          </ul>



          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Prétraitement des données</h2>

            <p>
              La phase de prétraitement a débuté par une série de vérifications visant à garantir la qualité et la cohérence du jeu de données.
            </p>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Contrôle de qualité</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Détection des doublons</strong> : Aucun doublon n'a été détecté, ce qui élimine les risques de biais liés à des répétitions dans les données.</li>
                <li><strong>Gestion des valeurs manquantes</strong> : L'analyse a confirmé l'absence totale de valeurs nulles, rendant inutile toute imputation ou suppression d'observations.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Sélection et suppression des variables non pertinentes</h3>
              <p>Pour améliorer la pertinence du modèle, certaines variables ont été écartées après évaluation :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>VideoAmt</strong> (nombre de vidéos) : Cette variable était quasi constante et n'avait pas d'impact significatif sur l'adoption.</li>
                <li><strong>State</strong> (état de localisation en Malaisie) : Aucune corrélation claire avec la cible (AdoptionSpeed) n'a été identifiée.</li>
                <li><strong>Name</strong> (nom de l'animal) : Souvent manquante ou trop spécifique, cette variable n'apportait pas d'information prédictive utile.</li>
                <li><strong>Description</strong> (texte de présentation) : Exclue en raison de sa nature non structurée, nécessitant un traitement spécifique (NLP) non prévu dans cette analyse.</li>
                <li><strong>RescuerID</strong> (identifiant du sauveteur) : Variable catégorielle sans lien direct avec l'adoption.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Format des données</h3>
              <p>Les données étaient déjà numériques, avec des variables comme Color et Breed préalablement encodées. Les correspondances entre les codes et leurs significations sont disponibles dans un fichier Excel annexe.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Normalisation et encodage</h3>
              <p>Aucune transformation supplémentaire (normalisation, standardisation, one-hot encoding) n'a été nécessaire, car les variables étaient déjà adaptées à la modélisation.</p>
            </div>

            <div className="space-y-2">
            <h3 className="text-lg font-medium">Résultat : </h3>
              <p>Un jeu de données nettoyé, optimisé et prêt pour l'analyse exploratoire et la modélisation prédictive.</p>
            </div>
          </section>

          {/* Introduction du graphe */}
          <p className="mb-4">
            Afin d’introduire visuellement les types d’animaux disponibles à l’adoption dans le jeu de données,
            le graphique suivant présente la répartition entre chiens 🐶 et chats 🐱 :
          </p>

          {/* Graphe interactif */}
          <AnimalTypeChart />

          {/* Interprétation */}
          <p className="mt-6">
            On observe que les chiens sont légèrement plus nombreux que les chats dans ce jeu de données.
            Cette dominance peut influencer les résultats des modèles prédictifs, notamment si certains types d’animaux sont adoptés plus vite que d'autres.
            Cette visualisation permet ainsi de poser les bases d’une analyse comparative par type d’animal.
          </p>
          <p className="mb-4">
            En complément de la répartition des types d’animaux, il est également pertinent d’examiner leur âge.
            L’âge joue un rôle crucial dans le processus d’adoption : les jeunes animaux sont généralement plus recherchés,
            tandis que les animaux plus âgés peuvent rencontrer davantage de difficultés à trouver un foyer.
            Le graphique suivant présente la distribution de l’âge des animaux en tranches de 3 mois, ce qui permet de mieux visualiser
            la concentration des profils selon leur stade de vie.
          </p>

          <AgeDistributionChart />

          <p className="mt-6">
            On observe que la majorité des animaux proposés à l’adoption ont moins d’un an, avec une forte concentration dans les 6 premiers mois.
            Cette donnée souligne que les refuges accueillent principalement des jeunes animaux, ce qui pourrait influencer les tendances
            d’adoption observées dans le reste de l’analyse.
          </p>


        </section>


      </div>
    </Wrapper>
  );
}
