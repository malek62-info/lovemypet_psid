import { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import React from "react";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";

const Anna2 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Appeler l'API et récupérer les données
  useEffect(() => {
    fetch("http://127.0.0.1:8000/age-vaccination-data") // Assurez-vous que l'URL est correcte
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false);
      });
  }, []);

  // Préparer les données pour le graphique
  const processDataForChart = () => {
    const ageGroups = data.map((item) => item.AgeGroup);
    const noVaccinated = data.map((item) => item.NoNumberVaccinated);

    return {
      x: ageGroups,
      y: noVaccinated,
      type: "bar",
      marker: {
        color: "#69b3a2", // Vous pouvez personnaliser la couleur
      },
    };
  };

  // Affichage en attendant que les données arrivent
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Créer le graphique
  return (
    <div>
      <Title
        text="Analyse du lien entre l'âge des animaux et leur non-vaccination"
        number={1}
      />

      <Plot
        data={[processDataForChart()]}
        layout={{
          title: {
            text: "Individus non vaccinés par groupe d'âge",
            font: { size: 20 }, // Taille du titre
            x: 0.5, // Centrer le titre
            xanchor: "center", // Centrer horizontalement
          },
          xaxis: {
            title: {
              text: "Groupe d'âge",
              font: { size: 16 },
            },
            tickangle: -45, // Inclinaison des labels de l'axe X
          },
          yaxis: {
            title: {
              text: "Nombre d'individus non vaccinés",
              font: { size: 16 },
            },
          },
        }}
        style={{ width: "100%", height: "600px", marginBottom: "30px" }}
      />

      <Contexte texte="Cette analyse vise à comprendre les raisons du nombre important d'animaux non vaccinés observé dans les premières données. En regroupant ces données par tranche d'âge, nous cherchons à identifier des tendances pouvant expliquer cette situation." />

      <Explication
        title="Interprétation du graphique"
        points={[
          "Le graphique montre clairement que la majorité des animaux non vaccinés appartiennent à la tranche d’âge 0-10 ans (6580 cas).",
          "Les tranches suivantes présentent une baisse nette : 383 pour 11-20 ans, 134 pour 21-30 ans, 63 pour 31-40 ans, et 67 pour les 41 ans et plus.",
          "Cela suggère que les animaux les plus jeunes sont les moins vaccinés.",
          "Cette tendance peut être liée au fait que certains protocoles de vaccination ne s'appliquent qu'à partir d'un certain âge.",
          "De plus, beaucoup de personnes préfèrent adopter des animaux jeunes, qui n'ont pas encore atteint l'âge requis pour la vaccination.",
        ]}
      />

      <Conclusions
        conclusions={[
          "En général, les animaux non vaccinés sont majoritairement très jeunes.",
          "Cela peut s'expliquer par une préférence des adoptants pour des animaux jeunes, combinée à des délais nécessaires avant de pouvoir administrer les premiers vaccins.",
          "Ce constat n'indique donc pas forcément un problème de sensibilisation, mais plutôt une réalité liée à l'âge des animaux et au calendrier vaccinal.",
        ]}
      />
    </div>
  );
};

export default Anna2;
