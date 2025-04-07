import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Title from "./Title";
import Contexte from "./Contexte";
import Explication from "./Explications";
import Conclusions from "./Conclusions";

const Anna5 = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genderFilter, setGenderFilter] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:8000/furlength-early-adoption";
      if (genderFilter !== null) {
        url += `?gender=${genderFilter}`;
      }
      const response = await fetch(url);
      const responseData = await response.json();

      if (responseData.fur_length) {
        setData(responseData);
      } else {
        console.error("Erreur dans la réponse de l'API :", responseData.error);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [genderFilter]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!data) {
    return <div></div>;
  }

  const pieChartLayout = {
    title: {
      font: {
        size: 20,
        family: "Arial, sans-serif",
        color: "#000000",
      },
    },
    height: 500,
    showlegend: true,
    legend: {
      orientation: "h",
      y: -0.2,
    },
    margin: { t: 50, b: 100, l: 50, r: 50 },
    plot_bgcolor: "white",
  };

  return (
    <div>
      <Title text="Plus c’est court, plus c’est adopté ? Étude sur la rapidité d’adoption selon la fourrure" number={5} />

      <div className="mb-8">
        <label htmlFor="gender" className="mr-2 font-semibold">
          Filtrer par sexe :
        </label>
        <select
          id="gender"
          value={genderFilter || ""}
          onChange={(e) => setGenderFilter(e.target.value ? parseInt(e.target.value) : null)}
          className="p-2 border rounded"
        >
          <option value="">Tous</option>
          <option value="1">Mâle</option>
          <option value="2">Femelle</option>
        </select>
      </div>

      <Plot
        data={[
          {
            values: data.count,
            labels: data.fur_length,
            type: "pie",
            hole: 0.4,
            textinfo: "percent+label",
            hoverinfo: "label+percent+value",
            marker: {
              colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
          },
        ]}
        layout={pieChartLayout}
        style={{ width: "100%", height: "500px" }}
        config={{
          displayModeBar: false,
          responsive: true,
        }}
      />

      <Contexte
        texte="Cette analyse examine l’impact de la longueur de fourrure sur la rapidité d’adoption des animaux,
     en se concentrant exclusivement sur les adoptions rapides : celles réalisées le même jour 
     ou entre 1 et 7 jours 
      après leur mise en adoption. Le graphique illustre comment les différentes longueurs de fourrure
       (courte, moyenne, longue) influencent la probabilité d’une adoption immédiate ou très rapide, 
       mettant en lumière les préférences potentielles des adoptants face à ce critère physique."
      />

      <Explication
        title="Distribution Générale"

        points={[
          "Fourrure courte : Avec 52.7%, les animaux à poil court sont ceux qui sont le plus souvent adoptés rapidement.",
          "Ils représentent plus de la moitié des adoptions dans les 7 premiers jours.",
          "Fourrure moyenne : Représente 38.5% des adoptions rapides.",
          "Une proportion non négligeable, mais nettement inférieure à celle des poils courts.",
          "Fourrure longue : Seulement 8.86%.",
          "Une très faible part, suggérant que ces animaux mettent plus de temps à trouver une famille.",
        ]}
      />


      <Explication
      title="Influence de la Longueur de la Fourrure"
        points={[
          "La longueur de la fourrure influence clairement la vitesse d’adoption.",
          "Animaux à fourrure courte :",
          "Perçus comme plus faciles à entretenir (moins de toilettage, moins de poils).",
          "Jugés plus pratiques pour les foyers actifs.",
          "Parfois considérés comme plus “propres”.",
          "Animaux à fourrure longue :",
          "Considérés comme plus exigeants (brossage régulier, risque de nœuds).",
          "Moins recherchés sur le plan esthétique dans certains cas.",
        ]}
      />

      <Conclusions
        conclusions={[
          "Les animaux à poil court sont adoptés plus rapidement, probablement en raison de leur entretien perçu comme plus simple.",
          "Les animaux à poil long connaissent une adoption plus lente, ce qui peut refléter des préférences pratiques ou esthétiques des adoptants.",
          "Cette donnée peut guider les refuges à adapter leur communication en mettant en avant les avantages pratiques des animaux à poil long.",
        ]}
      />
    </div>
  );
};

export default Anna5;
