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
        number={1.1}
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

      <Contexte texte="Le graphique précédent a montré qu’un plus grand nombre d’animaux sont adoptés sans être vaccinés, ce qui peut surprendre. Pour mieux comprendre cette situation, nous avons réalisé ce nouveau graphique afin d’analyser la relation entre l’âge des animaux et leur statut vaccinal." />

      <Explication
        title="Ce que montre le graphique"
        points={[
          "La majorité des animaux non vaccinés ont moins de 10 mois (6580 cas), ce qui est une proportion très importante.",
          "Le nombre diminue fortement avec l’âge : 383 entre 11 et 20 mois, et encore moins au-delà.",
          "Cela signifie que beaucoup d’animaux sont adoptés avant même d’avoir atteint l’âge pour recevoir leurs premiers vaccins.",
          "Certains protocoles vétérinaires prévoient en effet la vaccination à partir d’un certain âge, ce qui peut expliquer cet écart.",
          "Enfin, les adoptants ont tendance à préférer les animaux jeunes, ce qui renforce cette tendance naturelle.",
        ]}
      />

      <Conclusions
        conclusions={[
          "Les animaux non vaccinés sont majoritairement très jeunes, souvent âgés de moins de 10 mois.",
          "Cela s’explique par le fait qu’ils n’ont pas encore atteint l’âge de la première vaccination et qu’ils sont adoptés très tôt.",
          "Ce phénomène ne reflète donc pas un manque d'information, mais plutôt une conséquence logique liée à l'âge et aux protocoles de vaccination.",
        ]}
      />
    </div>
  );
};

export default Anna2;
