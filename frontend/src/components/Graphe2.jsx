import { useState, useEffect } from "react";
import Plot from "react-plotly.js";

import React from "react";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";

function Graphe2() {
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
    return <div></div>;
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
      <Title
        text="Est-ce que le nombre de photos postées sur l'animal augmente la
          vitesse d'adoption ?"
        number={2}
      />

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
      <div className="">
        <Contexte
          texte=" Le graphique divise les vitesses d'adoption en cinq catégories
          distinctes et associe ces catégories à des intervalles spécifiques de
          photos affichées. Cela facilite l'analyse des tendances entre le
          nombre de photos et la rapidité d'adoption, tout en mettant en lumière
          des anomalies et des points intéressants."
        />

        <Explication
          title="Impact des photos sur l'adoption immédiate"
          points={[
            "Dans le groupe '0-5 photos', 302 animaux ont été adoptés le jour même, ce qui montre une forte adoption immédiate.",
            "Dans '6-10 photos', seulement 94 animaux ont été adoptés immédiatement, marquant une baisse significative.",
            "Pour '11-20 photos', ce chiffre chute drastiquement à 13 animaux.",
            "Enfin, dans le groupe '21-30 photos', 1 seul animal a été adopté immédiatement, révélant une adoption quasi nulle à ce stade.",
            "Anomalie notable : bien que le nombre de photos augmente, la rapidité d'adoption diminue drastiquement, ce qui peut suggérer une saturation ou un effet de surcharge cognitive pour les adoptants.",
          ]}
        />

        <Explication
          title="Adoption dans la première semaine"
          points={[
            "Dans le groupe '0-5 photos', 2 157 animaux ont été adoptés dans la première semaine, confirmant une forte dynamique d'adoption.",
            "Pour '6-10 photos', 791 animaux ont été adoptés, soit une diminution notable par rapport au groupe précédent.",
            "Dans '11-20 photos', seuls 124 animaux ont trouvé un foyer, marquant une tendance à la baisse.",
            "Pour '21-30 photos', seulement 17 animaux ont été adoptés en une semaine, ce qui illustre une adoption quasiment stagnante.",
            "Observation clé : les groupes ayant plus de photos montrent une baisse uniforme des adoptions rapides, probablement due à un temps de réflexion accru des adoptants.",
          ]}
        />
        <Explication
          title="Adoption sur des périodes plus longues"
          points={[
            'Dans la période "8-30 jours", "0-5 photos" reste dominant avec 2 670 animaux adoptés.',
            'Pour "6-10 photos", 1 103 animaux ont été adoptés, soit environ la moitié du groupe précédent.',
            'Dans "11-20 photos", 234 animaux ont été adoptés, montrant une forte diminution.',
            'Enfin, dans "21-30 photos", seulement 21 animaux ont été adoptés, confirmant une adoption très faible pour ce groupe.',
            "Anomalie : bien que les animaux avec plus de photos restent visibles, cela n'augmente pas significativement leurs chances d'adoption sur des périodes plus longues.",
          ]}
        />

        <Explication
          title="Animaux non adoptés après 100 jours"
          points={[
            'Dans "0-5 photos", 3 186 animaux n\'ont pas été adoptés après 100 jours, ce qui représente un grand volume non adopté.',
            'Pour "6-10 photos", 834 animaux sont restés non adoptés, soit un chiffre significatif mais moindre.',
            'Dans "11-20 photos", 146 animaux n\'ont pas trouvé de foyer, marquant une nette diminution.',
            'Enfin, pour "21-30 photos", seulement 28 animaux sont restés non adoptés après 100 jours.',
            'Analyse importante : bien que le groupe "0-5 photos" ait une forte adoption rapide, il enregistre aussi le plus grand nombre d\'animaux non adoptés sur le long terme, ce qui peut suggérer une attention initiale non maintenue.',
          ]}
        />
      </div>

      <Plot
        data={adoptionCountTrace}
        layout={adoptionCountLayout}
        style={{ width: "100%", height: "500px" }}
        config={{
          displayModeBar: false,
          responsive: true,
        }}
      />

      <div className="">
        <Contexte
          texte="Ce graphique met en évidence le nombre total d'animaux adoptés (barres
          vertes) et non adoptés (barres rouges) en fonction des groupes de
          photos ('0-5', '6-10', '11-20', '21-30'). Il illustre clairement les
          tendances générales et pointe certaines anomalies concernant l'impact
          du nombre de photos sur les décisions d'adoption."
        />
        <Explication
          title="Nombre total d'adoptions"
          points={[
            "Le groupe '0-5 photos' domine avec 7 140 adoptions, représentant la majorité.",
            "Le groupe '6-10 photos' suit avec 2 911 adoptions, montrant une baisse significative.",
            "Seulement 643 animaux ont été adoptés pour '11-20 photos'.",
            "Enfin, '21-30 photos' affiche un chiffre très faible de 86 adoptions.",
          ]}
        />
        <Explication
          title="Nombre total de non-adoptions"
          points={[
            "Le groupe '0-5 photos' compte également le plus grand nombre de non-adoptés, avec 3 186 animaux.",
            "Pour '6-10 photos', 834 animaux n'ont pas trouvé de foyer.",
            "'11-20 photos' enregistre 146 non-adoptions.",
            "Enfin, '21-30 photos' ne compte que 28 animaux non adoptés, lié au faible effectif global de ce groupe.",
          ]}
        />
        <Explication
          title="Analyse des tendances"
          points={[
            "Le groupe '0-5 photos' montre une dominance à la fois dans les adoptions et les non-adoptions, indiquant une forte visibilité initiale.",
            "L'augmentation du nombre de photos s'accompagne d'une baisse progressive des adoptions, particulièrement marquée dans les groupes '11-20' et '21-30'.",
            "Les faibles chiffres des non-adoptions dans les groupes avec plus de photos peuvent être attribués à leur faible volume total d'animaux.",
            "Un contraste important dans les groupes intermédiaires ('6-10' et '11-20') pourrait refléter un effet de saturation, où trop de photos ralentissent la décision des adoptants.",
          ]}
        />
        <Explication
          title="Hypothèses"
          points={[
            "Un faible nombre de photos (0-5) attire rapidement l'attention des adoptants, facilitant la prise de décision.",
            "Des groupes avec un nombre élevé de photos pourraient souffrir de surcharge cognitive, rendant les choix plus difficiles pour les adoptants.",
            "La qualité et la pertinence des photos jouent potentiellement un rôle aussi important que leur quantité.",
            "Les animaux restés non adoptés après 100 jours nécessitent des stratégies de renouvellement pour raviver l'intérêt (par ex. nouvelles photos ou descriptions).",
          ]}
        />
      </div>

      <Conclusions
        conclusions={[
          "Un nombre de photos modéré (entre 5 et 10) équilibre efficacité et adoption rapide.",
          "Renouveler régulièrement les annonces (photos et descriptions) améliore les chances des animaux non adoptés après 100 jours.",
          "Intensifier les efforts de promotion dans les 90 premiers jours est crucial pour maximiser les adoptions.",
          "Réduire le nombre de photos pour les groupes '21-30' ou améliorer leur qualité pourrait relancer l'intérêt.",
          "Une présentation visuelle optimisée (qualité et pertinence des images) reste clé pour captiver les adoptants potentiels.",
        ]}
      />
    </div>
  );
}

export default Graphe2;
