import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";

export default function Anna8() {
  const [data, setData] = useState(null);
  const [animalType, setAnimalType] = useState(1); 

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/sterilization_adoption_impact")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-center">Chargement du graphique...</p>;

  const filtered = data.filter((d) => d.Type === animalType);

  const raceCounts = {};
  filtered.forEach((d) => {
    raceCounts[d.BreedName] = (raceCounts[d.BreedName] || 0) + d.total;
  });

  const topRaces = Object.entries(raceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([race]) => race);

  const sterilized = filtered.filter((d) => d.Sterilized === 2 && topRaces.includes(d.BreedName));
  const notSterilized = filtered.filter((d) => d.Sterilized === 1 && topRaces.includes(d.BreedName));

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
        number={6}
      />

      <div className="flex justify-end space-x-2 mb-6">
        <button className="btn" onClick={() => setAnimalType(1)}>
          🐶 Chiens
        </button>
        <button className="btn" onClick={() => setAnimalType(2)}>
          🐱 Chats
        </button>
      </div>

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

      <Contexte texte="Ce graphique compare le pourcentage d'adoption rapide des animaux stérilisés et non stérilisés pour les 10 races les plus fréquentes chez les chiens et chats." />

      <Explication
        title="Analyse comportementale et perception"
        points={[
          "Un levier comportemental et sanitaire : la stérilisation est perçue positivement par les adoptants, car elle est souvent associée à un animal plus calme, moins agressif, et avec un risque réduit de fugue ou de reproduction non contrôlée. Cela explique en partie pourquoi les chiens stérilisés sont adoptés plus rapidement.",
          "Effet renforcé sur certaines races populaires : chez des races comme le Golden Retriever, le Poodle ou le Schnauzer, déjà très prisées, la stérilisation semble booster leur attractivité. Ces races combinent des traits physiques appréciés et un comportement jugé stable, et le fait qu’elles soient stérilisées rassure les adoptants sur leur future gestion.",
          "La stérilisation comme marqueur de soin : un chien stérilisé donne l’image d’un animal ayant reçu des soins, ce qui valorise sa fiche en refuge. Cette perception de sérieux du refuge ou de l'ancien propriétaire peut influencer positivement la décision d’adoption."
        ]}
      />

      <Explication
        title="Limites et nuances selon les races"
        points={[
          "Des exceptions révélatrices : certaines races montrent un effet inverse, comme le Bull Terrier, pour lequel les stérilisés ne sont jamais adoptés rapidement dans l’échantillon. Cela peut traduire une méfiance vis-à-vis de certaines races, où la stérilisation ne compense pas les stéréotypes négatifs associés (race dite 'à risque' ou 'difficile'). Cela met en lumière l’impact de la race sur la perception du public, parfois plus fort que l'état de stérilisation.",
          "Facteurs concurrents à la stérilisation : chez des races comme le Jack Russell Terrier, même stérilisés, les taux d’adoption rapide restent faibles. Ce chien est souvent vu comme hyperactif, difficile à canaliser. Cela montre que les traits comportementaux dominants de la race peuvent neutraliser l’effet bénéfique de la stérilisation.",
          "Effet plafonné sur certaines races très prisées : dans quelques cas, la stérilisation n’a pas d’effet fort car la race est déjà très demandée. Par exemple, les Corgis ou Pugs, avec ou sans stérilisation, présentent des taux d’adoption relativement similaires. Cela reflète un plafonnement de l’impact lorsque la race est déjà attractive par nature."
        ]}
      />

      <Conclusions
        conclusions={[
          "La stérilisation joue un rôle important dans la perception des animaux en refuge. Elle rassure les adoptants sur le plan comportemental et sanitaire, et donne l'image d’un animal bien préparé.",
          "Elle est particulièrement efficace pour améliorer la vitesse d’adoption des races populaires mais neutres ou jugées faciles à vivre.",
          "Cependant, son efficacité est modulée par l’image de la race : certaines races bénéficient peu de la stérilisation en raison de stéréotypes négatifs, tandis que d’autres très prisées n’en ont pas besoin pour être rapidement adoptées.",
          "Il est donc essentiel d’intégrer la stérilisation dans une stratégie d’adoption globale qui prend aussi en compte la communication autour de la race, le comportement, l’âge, et l’apparence visuelle."
        ]}
      />

    </div>
  );
}
