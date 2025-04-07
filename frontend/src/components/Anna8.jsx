import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";


export default function Anna8() {
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
        text="Impact de la stérilisation sur l’adoption rapide selon la race" number={6}
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
        title="Impact de la stérilisation sur l’adoption rapide"
        points={[
          "De manière générale, les animaux stérilisés présentent un taux d’adoption rapide plus élevé que ceux qui ne le sont pas. Cette tendance est visible chez un grand nombre de races, qu’elles soient populaires ou non.",
          "La stérilisation est perçue comme un gage de responsabilité et de soins vétérinaires déjà effectués, ce qui peut rassurer les adoptants potentiels. Cela réduit les coûts futurs et évite les comportements liés à la reproduction, perçus comme contraignants.",
          "Chez certaines races très représentées dans les refuges, comme les Labradors ou les Beagles, le taux d’adoption rapide est presque doublé lorsque les chiens sont stérilisés. Cela montre que ce critère joue un rôle structurant dans la décision d’adoption.",
          "Toutefois, la stérilisation ne compense pas toujours d'autres facteurs limitants. Pour certaines races au comportement jugé difficile ou à l’apparence moins appréciée, l’effet de la stérilisation est plus faible, voire nul."
        ]}
      />


      <Explication
        title="Influence de la pureté de race sur les chances d’adoption"
        points={[
          "La pureté de race agit comme un facteur d’attractivité supplémentaire. De nombreux adoptants recherchent des animaux de race pure, associés à certaines qualités physiques, comportementales ou symboliques.",
          "Pour les races connues et appréciées comme le Golden Retriever, le Shih Tzu ou le Poodle, les animaux de race pure bénéficient en moyenne de meilleurs taux d’adoption rapide que leurs homologues croisés.",
          "À l’inverse, pour des races plus controversées (Pit Bull Terrier, Bull Terrier, etc.), la race pure peut parfois être un frein si elle est associée à une image négative. Les stéréotypes jouent ici un rôle plus fort que la génétique réelle.",
          "Enfin, les animaux croisés ou 'mixed breed' sont globalement moins favorisés, mais l’effet est atténué lorsqu’ils sont stérilisés. Cela indique que l’image de soin et de stabilité peut compenser l’absence de pedigree dans certains cas."
        ]}
      />


      <Explication
        title="Croisement des effets : stérilisation et pureté de race"
        points={[
          "Les animaux qui cumulent stérilisation et pureté de race sont généralement ceux qui bénéficient du meilleur taux d’adoption rapide. Ce double signal – santé et conformité à une race – semble particulièrement rassurant pour les adoptants.",
          "Chez les races populaires (Poodle, Labrador, Shih Tzu), ce croisement crée un effet amplificateur. Un Poodle pur de race et stérilisé peut avoir un taux d’adoption rapide supérieur à 40 %, contre moins de 20 % pour un équivalent non stérilisé ou croisé.",
          "Chez les races mixtes, la stérilisation est le facteur clé. La pureté de race joue peu ou pas de rôle, mais la stérilisation améliore nettement la perception, en apportant une preuve de soins vétérinaires et d’anticipation de comportements futurs.",
          "Enfin, certaines races très stigmatisées conservent un faible taux d’adoption malgré ces deux attributs. Cela souligne l’importance des représentations culturelles de la race dans le processus d’adoption, qui peuvent surpasser les critères objectifs."
        ]}
      />

      <Conclusions
        conclusions={[
          "La stérilisation est un levier efficace pour favoriser l’adoption rapide, en particulier lorsqu’elle est combinée à d’autres attributs positifs comme la race pure.",
          "La race pure joue un rôle ambivalent : elle augmente l’attractivité pour certaines races populaires mais peut aussi nuire à l’image d’un animal pour des races perçues comme 'à risque'.",
          "Les croisés peuvent bénéficier d’une stérilisation bien mise en valeur, qui améliore leur image de soin et de stabilité.",
          "Les stratégies de communication en refuge doivent être adaptées : valoriser les animaux croisés stérilisés, rassurer sur les races pure breed controversées, et mettre en avant les qualités comportementales et sanitaires de chaque animal.",
          "Une lecture croisée des variables – stérilisation, pureté de race, comportement attendu – permet de mieux orienter les efforts pour maximiser les chances d’adoption rapide."
        ]}
      />


    </div>
  );
}
