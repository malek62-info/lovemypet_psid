import { useState, useEffect } from "react";
import Plot from "react-plotly.js";

import React from "react";

function Annalyse1() {
  const [data, setData] = useState(null); // Utilisation de null comme valeur initiale

  useEffect(() => {
    // Appel de l'API pour récupérer les données
    fetch("http://localhost:8000/photos") // L'URL de ton API FastAPI
      .then((response) => response.json())
      .then((data) => setData(data)) // Assigner les données au state
      .catch((error) => console.log(error));
  }, []);

  // Vérifier si les données sont chargées
  if (!data) {
    return <div>Loading...</div>;
  }

  // Première partie : graphique de la vitesse d'adoption par groupe de photos
  const adoptionSpeeds = ["0", "1", "2", "3", "4"]; // Vitesses d'adoption : 0, 1, 2, 3, 4
  const photoGroups = Object.keys(data); // Groupes de photos : "0-5", "6-10", etc.

  // Récupérer les données d'adoption pour chaque tranche de photos
  const adoptionSpeedData = adoptionSpeeds.map(
    (speed) => photoGroups.map((group) => data[group][speed]) // Récupérer les valeurs de chaque vitesse d'adoption pour chaque groupe de photos
  );

  // Tracer les données pour la vitesse d'adoption
  const traces = photoGroups.map((group, groupIndex) => ({
    x: adoptionSpeeds, // Vitesses d'adoption sur l'axe X
    y: adoptionSpeedData.map((data) => data[groupIndex]), // Récupérer les valeurs d'adoption pour ce groupe de photos
    type: "bar",
    name: group, // Afficher les tranches de photos dans la légende
  }));

  const layout = {
    barmode: "stack", // Empiler les barres
    title: {
      text: "Vitesse d'adoption des animaux par groupe de photos",
      font: {
        size: 20, // Taille du titre
        family: "Arial, sans-serif", // Police du titre
        color: "#000000",
      },
    },
    xaxis: {
      title: {
        text: "Vitesse d'adoption",
        font: {
          size: 16,
          family: "Arial, sans-serif",
          color: "#000000",
        },
      },
      tickmode: "array",
      tickvals: adoptionSpeeds, // Définir les vitesses d'adoption
      ticktext: [
        "le jour même",
        "dans la première semaine",
        "dans le premier mois",
        "entre 31 et 90 jours",
        "Pas d'adoption après 90 jours",
      ], // Texte personnalisé pour chaque vitesse d'adoption
    },
    yaxis: {
      title: {
        text: "Nombre d'animaux",
        font: {
          size: 16,
          family: "Arial, sans-serif",
          color: "#000000",
        },
      },
    },
    margin: {
      t: 50, // Marge en haut pour le titre
      b: 100, // Marge en bas pour les labels X
      l: 50, // Marge à gauche pour les labels Y
      r: 50, // Marge à droite
    },
  };

  // Deuxième graphique : Nombre total d'adoptions par tranche de photos

  // 🔥 Calcul des nombres d'animaux adoptés et non adoptés
  const adoptedCounts = photoGroups.map((group) =>
    adoptionSpeeds
      .filter((speed) => speed !== "4") // Exclure "4" pour les adoptés
      .reduce((acc, speed) => acc + data[group][speed], 0)
  );

  const notAdoptedCounts = photoGroups.map((group) => data[group]["4"]); // Seuls les "4"

  // Traces pour le graphique en ligne
  const adoptionCountTrace = [
    {
      x: photoGroups,
      y: adoptedCounts,
      type: "line", // Change de "bar" à "line" pour un graphique en ligne
      name: "Adoptés",
      line: { color: "green", width: 3 },
    },
    {
      x: photoGroups,
      y: notAdoptedCounts,
      type: "line", // Change de "bar" à "line" pour un graphique en ligne
      name: "Non Adoptés",
      line: { color: "red", width: 3 },
    },
  ];

  // Configuration du graphique
  const adoptionCountLayout = {
    title: {
      text: "Proportion d'animaux adoptés et non adoptés par groupe de photos",
      font: {
        size: 20,
        family: "Arial, sans-serif",
        color: "#000000",
      },
    },
    xaxis: {
      title: {
        text: "Groupe de photos",
        font: {
          size: 16,
          family: "Arial, sans-serif",
          color: "#000000",
        },
      },
    },
    yaxis: {
      title: {
        text: "Nombre d'animaux",
        font: {
          size: 16,
          family: "Arial, sans-serif",
          color: "#000000",
        },
      },
    },
    margin: { t: 50, b: 100, l: 50, r: 50 },
    showlegend: true, // Afficher la légende
    plot_bgcolor: "white", // Arrière-plan du graphique
  };
  return (
    <div>
      <h1 className="text-xl font-semibold my-4">
        <span className="badge badge-xl  badge-soft badge-primary">
          Est-ce que le nombre de photos postées sur l'annimal augmente la
          vitesse d'adoption ?
        </span>
      </h1>

      {/* Premier graphique : vitesse d'adoption */}
      <Plot
        data={traces} // Passer les données préparées à Plotly
        layout={layout}
        style={{ width: "100%", height: "500px" }}
        config={{
          displayModeBar: false,
          responsive: true,
        }}
      />

      {/* Explication détaillée du premier graphique */}
      <div className="mt-4 bg-base-200 p-5 shadow rounded-3xl">
        <p>
          Le graphique divise les vitesses d'adoption en cinq catégories
          distinctes et associe ces catégories à des intervalles spécifiques de
          photos affichées. Cela facilite l'analyse des tendances entre le
          nombre de photos et la rapidité d'adoption, tout en mettant en lumière
          des anomalies et des points intéressants.
        </p>

        <h1 className="text-lg font-semibold my-4">
          <span className="badge badge-xl  badge-outline  badge-primary">
            Impact des photos sur l'adoption immédiate
          </span>
        </h1>
        <ul className="list-disc ml-5">
          <li className="my-2">
            Dans le groupe "0-5 photos", 302 animaux ont été adoptés le jour
            même, ce qui montre une forte adoption immédiate.
          </li>
          <li className="my-2">
            Dans "6-10 photos", seulement 94 animaux ont été adoptés
            immédiatement, marquant une baisse significative.
          </li>
          <li className="my-2">
            Pour "11-20 photos", ce chiffre chute drastiquement à 13 animaux.
          </li>
          <li className="my-2">
            Enfin, dans le groupe "21-30 photos", 1 seul animal a été adopté
            immédiatement, révélant une adoption quasi nulle à ce stade.
          </li>
          <li className="my-2">
            Anomalie notable : bien que le nombre de photos augmente, la
            rapidité d'adoption diminue drastiquement, ce qui peut suggérer une
            saturation ou un effet de surcharge cognitive pour les adoptants.
          </li>
        </ul>

        <h1 className="text-lg font-semibold my-4">
          <span className="badge badge-xl  badge-outline  badge-primary">
            Adoption dans la première semaine
          </span>
        </h1>
        <ul className="list-disc ml-5">
          <li className="my-2">
            Dans le groupe "0-5 photos", 2 157 animaux ont été adoptés dans la
            première semaine, confirmant une forte dynamique d'adoption.
          </li>
          <li className="my-2">
            Pour "6-10 photos", 791 animaux ont été adoptés, soit une diminution
            notable par rapport au groupe précédent.
          </li>
          <li className="my-2">
            Dans "11-20 photos", seuls 124 animaux ont trouvé un foyer, marquant
            une tendance à la baisse.
          </li>
          <li className="my-2">
            Pour "21-30 photos", seulement 17 animaux ont été adoptés en une
            semaine, ce qui illustre une adoption quasiment stagnante.
          </li>
          <li className="my-2">
            Observation clé : les groupes ayant plus de photos montrent une
            baisse uniforme des adoptions rapides, probablement due à un temps
            de réflexion accru des adoptants.
          </li>
        </ul>

        <h1 className="text-lg font-semibold my-4">
          <span className="badge badge-xl  badge-outline  badge-primary">
            Adoption sur des périodes plus longues
          </span>
        </h1>
        <ul className="list-disc ml-5">
          <li className="my-2">
            Dans la période "8-30 jours", "0-5 photos" reste dominant avec 2 670
            animaux adoptés.
          </li>
          <li className="my-2">
            Pour "6-10 photos", 1 103 animaux ont été adoptés, soit environ la
            moitié du groupe précédent.
          </li>
          <li className="my-2">
            Dans "11-20 photos", 234 animaux ont été adoptés, montrant une forte
            diminution.
          </li>
          <li className="my-2">
            Enfin, dans "21-30 photos", seulement 21 animaux ont été adoptés,
            confirmant une adoption très faible pour ce groupe.
          </li>
          <li className="my-2">
            Anomalie : bien que les animaux avec plus de photos restent
            visibles, cela n'augmente pas significativement leurs chances
            d'adoption sur des périodes plus longues.
          </li>
        </ul>

        <h1 className="text-lg font-semibold my-4">
          <span className="badge badge-xl  badge-outline  badge-primary">
            Animaux non adoptés après 100 jours
          </span>
        </h1>
        <ul className="list-disc ml-5">
          <li className="my-2">
            Dans "0-5 photos", 3 186 animaux n'ont pas été adoptés après 100
            jours, ce qui représente un grand volume non adopté.
          </li>
          <li className="my-2">
            Pour "6-10 photos", 834 animaux sont restés non adoptés, soit un
            chiffre significatif mais moindre.
          </li>
          <li className="my-2">
            Dans "11-20 photos", 146 animaux n'ont pas trouvé de foyer, marquant
            une nette diminution.
          </li>
          <li className="my-2">
            Enfin, pour "21-30 photos", seulement 28 animaux sont restés non
            adoptés après 100 jours.
          </li>
          <li className="my-2">
            Analyse importante : bien que le groupe "0-5 photos" ait une forte
            adoption rapide, il enregistre aussi le plus grand nombre d'animaux
            non adoptés sur le long terme, ce qui peut suggérer une attention
            initiale non maintenue.
          </li>
        </ul>
      </div>

      <h1 className="text-xl font-semibold my-4">
        <span className="badge badge-xl  badge-soft badge-primary">
          Nombre total d'adoptions par groupe de photos
        </span>
      </h1>

      <Plot
        data={adoptionCountTrace}
        layout={adoptionCountLayout}
        style={{ width: "100%", height: "500px" }}
        config={{
          displayModeBar: false,
          responsive: true,
        }}
      />

      <div className="mt-4 bg-base-200 p-5 shadow rounded-3xl">
        <p>
          Ce graphique met en évidence le nombre total d'animaux adoptés (barres
          vertes) et non adoptés (barres rouges) en fonction des groupes de
          photos ("0-5", "6-10", "11-20", "21-30"). Il illustre clairement les
          tendances générales et pointe certaines anomalies concernant l'impact
          du nombre de photos sur les décisions d'adoption.
        </p>

        <h1 className="text-lg font-semibold my-4">
          <span className="badge badge-xl badge-outline badge-primary">
            Nombre total d'adoptions
          </span>
        </h1>
        <ul className="list-disc ml-5">
          <li className="my-2">
            Le groupe "0-5 photos" domine avec 7 140 adoptions, représentant la
            majorité.
          </li>
          <li className="my-2">
            Le groupe "6-10 photos" suit avec 2 911 adoptions, montrant une
            baisse significative.
          </li>
          <li className="my-2">
            Seulement 643 animaux ont été adoptés pour "11-20 photos".
          </li>
          <li className="my-2">
            Enfin, "21-30 photos" affiche un chiffre très faible de 86
            adoptions.
          </li>
        </ul>

        <h1 className="text-lg font-semibold my-4">
          <span className="badge badge-xl badge-outline badge-primary">
            Nombre total de non-adoptions
          </span>
        </h1>
        <ul className="list-disc ml-5">
          <li className="my-2">
            Le groupe "0-5 photos" compte également le plus grand nombre de
            non-adoptés, avec 3 186 animaux.
          </li>
          <li className="my-2">
            Pour "6-10 photos", 834 animaux n'ont pas trouvé de foyer.
          </li>
          <li className="my-2">"11-20 photos" enregistre 146 non-adoptions.</li>
          <li className="my-2">
            Enfin, "21-30 photos" ne compte que 28 animaux non adoptés, lié au
            faible effectif global de ce groupe.
          </li>
        </ul>

        <h1 className="text-lg font-semibold my-4">
          <span className="badge badge-xl badge-outline badge-primary">
            Analyse des tendances
          </span>
        </h1>
        <ul className="list-disc ml-5">
          <li className="my-2">
            Le groupe "0-5 photos" montre une dominance à la fois dans les
            adoptions et les non-adoptions, indiquant une forte visibilité
            initiale.
          </li>
          <li className="my-2">
            L'augmentation du nombre de photos s'accompagne d'une baisse
            progressive des adoptions, particulièrement marquée dans les groupes
            "11-20" et "21-30".
          </li>
          <li className="my-2">
            Les faibles chiffres des non-adoptions dans les groupes avec plus de
            photos peuvent être attribués à leur faible volume total d'animaux.
          </li>
          <li className="my-2">
            Un contraste important dans les groupes intermédiaires ("6-10" et
            "11-20") pourrait refléter un effet de saturation, où trop de photos
            ralentissent la décision des adoptants.
          </li>
        </ul>

        <h1 className="text-lg font-semibold my-4">
          <span className="badge badge-xl badge-outline badge-primary">
            Hypothèses
          </span>
        </h1>
        <ul className="list-disc ml-5">
          <li className="my-2">
            Un faible nombre de photos (0-5) attire rapidement l'attention des
            adoptants, facilitant la prise de décision.
          </li>
          <li className="my-2">
            Des groupes avec un nombre élevé de photos pourraient souffrir de
            surcharge cognitive, rendant les choix plus difficiles pour les
            adoptants.
          </li>
          <li className="my-2">
            La qualité et la pertinence des photos jouent potentiellement un
            rôle aussi important que leur quantité.
          </li>
          <li className="my-2">
            Les animaux restés non adoptés après 100 jours nécessitent des
            stratégies de renouvellement pour raviver l'intérêt (par ex.
            nouvelles photos ou descriptions).
          </li>
        </ul>

        <h1 className="text-lg font-semibold my-4">
          <span className="badge badge-xl badge-outline badge-primary">
            Conclusions
          </span>
        </h1>
        <ul className="list-disc ml-5">
          <li className="my-2">
            Un nombre de photos modéré (entre 5 et 10) équilibre efficacité et
            adoption rapide.
          </li>
          <li className="my-2">
            Renouveler régulièrement les annonces (photos et descriptions)
            améliore les chances des animaux non adoptés après 100 jours.
          </li>
          <li className="my-2">
            Intensifier les efforts de promotion dans les 90 premiers jours est
            crucial pour maximiser les adoptions.
          </li>
          <li className="my-2">
            Réduire le nombre de photos pour les groupes "21-30" ou améliorer
            leur qualité pourrait relancer l'intérêt.
          </li>
          <li className="my-2">
            Une présentation visuelle optimisée (qualité et pertinence des
            images) reste clé pour captiver les adoptants potentiels.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Annalyse1;
