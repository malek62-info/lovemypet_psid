import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Title from "./Title";
import Contexte from "./Contexte";

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
      text: "Répartition des adoptions rapides par longueur de fourrure",
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
      <Title text="Impact de la Longueur de Fourrure sur les Adoptions Rapides" number={5} />

      <Contexte
        texte="Analyse des adoptions qui ont eu lieu le même jour ou dans les 7 jours suivants."
      />

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
    </div>
  );
};

export default Anna5;