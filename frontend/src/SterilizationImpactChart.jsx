import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Title from "./components/Title";
import Contexte from "./components/Contexte";
import Explication from "./components/Explications";
import Conclusions from "./components/Conclusions";

export default function SterilizationImpactChart() {
  const [data, setData] = useState(null);
  const [animalType, setAnimalType] = useState(1); // 1 = chiens, 2 = chats
  const [pureFilter, setPureFilter] = useState("all"); // "all", "pure", "mixed"

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/sterilization_adoption_impact")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-center">Chargement du graphique...</p>;

  const filtered = data.filter((d) => {
    if (d.Type !== animalType) return false;
    if (pureFilter === "pure" && d.IsPureBreed !== true) return false;
    if (pureFilter === "mixed" && d.IsPureBreed !== false) return false;
    return true;
  });

  const raceCounts = {};
  filtered.forEach((d) => {
    raceCounts[d.BreedName] = (raceCounts[d.BreedName] || 0) + d.total;
  });

  const topRaces = Object.entries(raceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([race]) => race);

  const sterilized = filtered.filter(
    (d) => d.Sterilized === 2 && topRaces.includes(d.BreedName)
  );
  const notSterilized = filtered.filter(
    (d) => d.Sterilized === 1 && topRaces.includes(d.BreedName)
  );

  const xLabels = topRaces;

  const getY = (dataset) =>
    xLabels.map((race) => {
      const entry = dataset.find((d) => d.BreedName === race);
      return entry ? entry.adoption_rate : null;
    });

  return (
    <div className="w-full mb-12">
      <Title
        text="Impact de la stérilisation sur l’adoption rapide selon la race"
        number={8}
      />

      {/* Filtres animaux et race pure/mixte */}
      <div className="flex justify-end space-x-2 mb-4">
        <button className="btn" onClick={() => setAnimalType(1)}>
          🐶 Chiens
        </button>
        <button className="btn" onClick={() => setAnimalType(2)}>
          🐱 Chats
        </button>
      </div>
      <div className="flex justify-end space-x-2 mb-6">
        <button className="btn" onClick={() => setPureFilter("all")}>
          Toutes les races
        </button>
        <button className="btn" onClick={() => setPureFilter("pure")}>
          Races pures
        </button>
        <button className="btn" onClick={() => setPureFilter("mixed")}>
          Races mixtes
        </button>
      </div>

      {/* Graphique Plotly */}
      <Plot
        data={[
          {
            x: xLabels,
            y: getY(sterilized),
            name: "Stérilisés",
            type: "bar",
            marker: { color: "#34D399" },
            hovertemplate: "%{y}% adoptés rapidement<br>%{x}<extra></extra>",
          },
          {
            x: xLabels,
            y: getY(notSterilized),
            name: "Non stérilisés",
            type: "bar",
            marker: { color: "#F87171" },
            hovertemplate: "%{y}% adoptés rapidement<br>%{x}<extra></extra>",
          },
        ]}
        layout={{
          barmode: "group",
          xaxis: {
            title: { text: "Race", font: { size: 16 } },
            tickangle: -45,
            tickfont: { size: 12 },
          },
          yaxis: {
            title: { text: "% d'adoption rapide", font: { size: 16 } },
            tickfont: { size: 14 },
            range: [0, 100],
          },
          legend: {
            font: { size: 14 },
            orientation: "h",
            y: -0.3,
          },
          height: 500,
          margin: { t: 40, b: 100, l: 60, r: 30 },
          plot_bgcolor: "#ffffff",
          paper_bgcolor: "#ffffff",
          font: { family: "Inter, sans-serif" },
        }}
        config={{ responsive: true, displayModeBar: true, displaylogo: false }}
        style={{ width: "100%", height: "600px", marginBottom: "30px" }}
      />

      <Contexte texte="Ce graphique compare le pourcentage d'adoption rapide des animaux stérilisés et non stérilisés pour les 10 races les plus fréquentes. Vous pouvez filtrer les résultats par type d’animal et par pureté de race." />

      {/* Explications et conclusions (inchangées) */}
      <Explication
        title="Analyse comportementale et perception"
        points={[
          "Un levier comportemental et sanitaire : la stérilisation est perçue positivement par les adoptants, car elle est souvent associée à un animal plus calme, moins agressif, et avec un risque réduit de fugue ou de reproduction non contrôlée.",
          "Effet renforcé sur certaines races populaires : chez des races comme le Golden Retriever, le Poodle ou le Schnauzer, déjà très prisées, la stérilisation semble booster leur attractivité.",
          "La stérilisation comme marqueur de soin : elle renforce l’image d’un animal préparé, ce qui valorise sa fiche en refuge.",
        ]}
      />

      <Explication
        title="Limites et nuances selon les races"
        points={[
          "Certaines races comme le Bull Terrier ne profitent pas de la stérilisation dans l’échantillon observé.",
          "Chez des races comme le Jack Russell Terrier, les traits comportementaux dominants peuvent neutraliser l’effet de la stérilisation.",
          "Pour les races déjà très prisées (Corgis, Pugs), la stérilisation n’apporte pas forcément d’effet supplémentaire.",
        ]}
      />

      <Conclusions
        conclusions={[
          "La stérilisation joue un rôle positif sur la perception des animaux par les adoptants.",
          "Elle influence particulièrement les races perçues comme équilibrées ou faciles à vivre.",
          "Son impact dépend aussi du type de race (pure ou mixte) et de l’image associée.",
        ]}
      />
    </div>
  );
}
