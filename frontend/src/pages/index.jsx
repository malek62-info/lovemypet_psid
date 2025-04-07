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
          {/* Introduction du graphe */}
          <p className="mb-4">
            Afin d’introduire visuellement les types d’animaux disponibles à l’adoption dans le jeu de données,
            le graphique suivant présente la répartition entre chiens 🐶 et chats 🐱 :
          </p>
          <section>


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
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Description des données</h2>

          <p className="mb-4">
            Le jeu de données utilisé dans ce projet provient de la plateforme <strong>PetFinder</strong> et contient les profils d’animaux mis en adoption en Malaisie.
            Chaque ligne représente un animal (ou un groupe d’animaux) et décrit ses caractéristiques via des données tabulaires, textuelles et visuelles.
            L’objectif est de prédire la variable <strong>AdoptionSpeed</strong>, représentant le délai avant adoption selon cinq catégories (0 à 4).
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identifiants :</strong>
              <span> chaque animal est identifié par un <em>PetID</em> unique. Un <em>RescuerID</em> permet de savoir qui a inscrit l’animal.</span>
            </li>
            <li><strong>Informations générales :</strong>
              <span> type (chien ou chat), nom (facultatif), âge (en mois), race principale et secondaire, sexe (1 = mâle, 2 = femelle, 3 = groupe).</span>
            </li>
            <li><strong>Apparence physique :</strong>
              <span> trois couleurs possibles pour décrire le pelage (Color1, Color2, Color3), taille à maturité (de petit à très grand), longueur du pelage.</span>
            </li>
            <li><strong>État de santé :</strong>
              <span> statut vaccinal, vermifugation, stérilisation, et condition de santé (sain, blessure mineure ou grave).</span>
            </li>
            <li><strong>Conditions d’adoption :</strong>
              <span> frais d’adoption (Fee), nombre d’animaux dans le profil (Quantity), État géographique en Malaisie (State).</span>
            </li>
            <li><strong>Contenu multimédia :</strong>
              <span> nombre de photos (PhotoAmt), nombre de vidéos (VideoAmt), description textuelle du profil (en anglais, malais ou chinois).</span>
            </li>
            <li><strong>Données cibles :</strong>
              <span><em>AdoptionSpeed</em>, qui prend une valeur entre 0 et 4 selon le temps mis avant l’adoption :</span>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>0 : adopté le jour même</li>
                <li>1 : adopté en moins d’une semaine</li>
                <li>2 : entre 8 et 30 jours</li>
                <li>3 : entre 31 et 90 jours</li>
                <li>4 : pas adopté après 100 jours</li>
              </ul>
            </li>
          </ul>

          <p className="mt-6">
            En complément, des métadonnées issues de l’<strong>API Google Vision</strong> ont été générées à partir des images (ex. : étiquettes, propriétés visuelles, détection de visages),
            et les descriptions ont été analysées via l’<strong>API Natural Language</strong> de Google pour obtenir des mesures de sentiment et d'entités clés.
            Bien que non exploitées dans ce projet, ces données offrent des perspectives d'analyse enrichies.
          </p>

          <p className="mt-4">
            Enfin, un ensemble de fichiers de correspondance permet de relier les identifiants numériques aux noms de races, de couleurs et d’États :
          </p>

          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><code>breed_labels.csv</code> : correspondance entre BreedID, BreedName et Type (1 = chien, 2 = chat)</li>
            <li><code>color_labels.csv</code> : correspondance entre ColorID et nom de couleur</li>
            <li><code>state_labels.csv</code> : correspondance entre StateID et nom de l’État malaisien</li>
          </ul>

          <p className="mt-4">
            Ce jeu de données riche, structuré et nettoyé permet une analyse complète de la rapidité d’adoption en croisant de multiples dimensions (visuelles, comportementales, économiques).
          </p>



          




        </section>


      </div>
    </Wrapper>
  );
}
