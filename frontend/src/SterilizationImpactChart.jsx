import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export default function SterilizationImpactChart() {
  const [data, setData] = useState(null);
  const [animalType, setAnimalType] = useState(1); // 1 = chiens, 2 = chats

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/sterilization_adoption_impact")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-center">Chargement du graphique...</p>;

  const filtered = data.filter((d) => d.Type === animalType);

  // Trouver les 10 races les plus fréquentes (stérilisés + non stérilisés)
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

  const getText = (dataset) =>
    xLabels.map((race) => {
      const entry = dataset.find((d) => d.BreedName === race);
      return entry ? `${entry.adopted_fast} sur ${entry.total}` : "Aucune donnée";
    });

  return (
    <div className="flex flex-col items-center my-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Impact de la stérilisation sur l’adoption rapide ({animalType === 1 ? "Chiens 🐶" : "Chats 🐱"})
      </h2>

      <div className="mb-4">
        <button
          onClick={() => setAnimalType(1)}
          className={`px-4 py-2 mr-2 rounded ${animalType === 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Chiens
        </button>
        <button
          onClick={() => setAnimalType(2)}
          className={`px-4 py-2 rounded ${animalType === 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Chats
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
          xaxis: { title: "Race", tickangle: -45 },
          yaxis: { title: "% d'adoption rapide", range: [0, 100] },
          height: 500,
          margin: { t: 40, b: 100, l: 60, r: 30 },
          legend: { orientation: "h", y: -0.25 },
          plot_bgcolor: "#f9fafb",
          paper_bgcolor: "#f9fafb",
          font: { family: "Inter, sans-serif" },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", maxWidth: "900px" }}
      />

      {/* === Interprétation === */}
      <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl text-justify leading-relaxed text-gray-800 mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Analyse de l’impact de la stérilisation sur l’adoption rapide
        </h3>
        <p className="mb-4">
          Cette analyse se base sur un comparatif du <strong>taux d’adoption rapide (%)</strong> entre animaux <strong>stérilisés</strong> et <strong>non stérilisés</strong>, parmi les <strong>10 races les plus représentées</strong> chez les chiens 🐶 et les chats 🐱. Elle vise à identifier si la stérilisation peut jouer un rôle significatif dans la rapidité d’adoption.
        </p>
        <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600">Une tendance globale en faveur des animaux stérilisés</h4>
        <p>
          Les résultats montrent que, pour la majorité des races étudiées, les <strong>animaux stérilisés sont adoptés plus rapidement</strong> que leurs homologues non stérilisés. Voici quelques exemples marquants :
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li><strong>Golden Retriever</strong> : 41,2 % (stérilisés) vs 22,7 % (non stérilisés)</li>
          <li><strong>Poodle</strong> : 47,9 % vs 29,8 %</li>
          <li><strong>Shih Tzu</strong> : 43,6 % vs 37,1 %</li>
          <li><strong>Rottweiler</strong> : 43,8 % vs 25,0 %</li>
          <li><strong>Schnauzer</strong> : 48,3 % vs 20,0 %</li>
        </ul>
        <p>
          Ces chiffres illustrent une <strong>préférence des adoptants</strong> pour les animaux déjà stérilisés, souvent perçus comme plus faciles à intégrer dans leur nouveau foyer.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600"> Des exceptions et nuances selon la race</h4>
        <p>
          Certaines races montrent des écarts plus faibles ou même inverses :
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li><strong>Bull Terrier</strong> : 22,2 % d’adoption rapide non stérilisés contre 0 % stérilisés</li>
          <li><strong>Jack Russell Terrier</strong> : 23,3 % vs 11,1 %</li>
        </ul>
        <p>
          Ces cas soulignent que <strong>l’impact de la stérilisation varie selon la race</strong> et n’est pas le seul facteur déterminant de l’adoption.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600"> Un levier stratégique pour les refuges</h4>
        <p>
          En priorisant la stérilisation des races qui en tirent le plus de bénéfices (Labrador, Husky, Pomeranian…), les refuges peuvent <strong>accélérer l’adoption</strong> et mieux gérer la rotation des animaux.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600"> Conclusion</h4>
        <p>
          Cette analyse démontre que la stérilisation est un <strong>facteur-clé d’accélération de l’adoption</strong> pour de nombreuses races. Elle renforce l’idée que des décisions ciblées sur certaines races peuvent améliorer l’efficacité des campagnes d’adoption.
        </p>
      </div>


    </div>

  );
}
