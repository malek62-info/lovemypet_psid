import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Title from "./Title";
import Contexte from "./Contexte";

const Annalyse6 = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = "http://localhost:8000/furlength-dewormed";
      const response = await fetch(url);
      const result = await response.json();

      if (result.fur_length && result.dewormed_count && result.non_dewormed_count) {
        // Filtrer pour exclure les "Inconnu"
        const filteredData = {
          fur_length: [],
          dewormed_count: [],
          non_dewormed_count: [],
        };

        for (let i = 0; i < result.fur_length.length; i++) {
          if (result.fur_length[i] !== "Inconnu") {
            filteredData.fur_length.push(result.fur_length[i]);
            filteredData.dewormed_count.push(result.dewormed_count[i]);
            filteredData.non_dewormed_count.push(result.non_dewormed_count[i]);
          }
        }

        setData(filteredData);
      } else {
        console.error("Invalid API response:", result.error);
        setData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!data || !data.fur_length || !data.dewormed_count || !data.non_dewormed_count) {
    return <div>Aucune donnée valide disponible pour affichage.</div>;
  }

  return (
    <div className="">
      <Title text="Répartition de la Longueur de Fourrure et de la Vermifugation" number={6} />

      <Contexte
        texte="Analyse des longueurs de fourrure en fonction de l'état de vermifugation des animaux."
      />

      <div className="w-full mb-12">
        <Plot
          data={[
            {
              values: data.dewormed_count,
              labels: data.fur_length,
              type: "pie",
              hole: 0.4,
              textinfo: "percent+label",
              hoverinfo: "label+percent+value",
              name: "Vermifugé (Oui)",
              marker: { colors: ["#36A2EB", "#FFCE56", "#FF6384"] },
            },
            {
              values: data.non_dewormed_count,
              labels: data.fur_length,
              type: "pie",
              hole: 0.4,
              textinfo: "percent+label",
              hoverinfo: "label+percent+value",
              name: "Non vermifugé (Non)",
              marker: { colors: ["#FF6384", "#36A2EB", "#FFCE56"] },
            },
          ]}
          layout={{
            height: 600,
            title: {
              text: "Répartition de la longueur de fourrure selon la vermifugation",
              font: { size: 20, family: "Arial, sans-serif", color: "#000000" },
            },
            showlegend: true,
            legend: {
              orientation: "h",
              y: -0.2,
              font: { size: 14 },
            },
            margin: { t: 50, b: 100, l: 50, r: 50 },
            plot_bgcolor: "white",
          }}
          style={{ width: "100%" }}
          config={{
            responsive: true,
            displayModeBar: false,
          }}
        />
      </div>
    </div>
  );
};

export default Annalyse6;
