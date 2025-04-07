import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";

const Anna7 = () => {
  const [sterilizationDataDog, setSterilizationDataDog] = useState([]);
  const [sterilizationDataCat, setSterilizationDataCat] = useState([]);
  const [sterilizationPercentDataDog, setSterilizationPercentDataDog] = useState([]);
  const [sterilizationPercentDataCat, setSterilizationPercentDataCat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNonSterilized, setShowNonSterilized] = useState(true);
  const [showMalesSterilization, setShowMalesSterilization] = useState(true);
  const [showFemalesSterilization, setShowFemalesSterilization] = useState(true);
  const [sterilizationAnimal, setSterilizationAnimal] = useState("dog");

  const fetchSterilizationData = async (animal, setData) => {
    try {
      const response = await fetch(`http://localhost:8000/sterilization-by-gender/${animal}`);
      const result = await response.json();
      if (result.data) {
        const categoryMapping = {
          "Gender_1": "Sexe - Mâle",
          "Gender_2": "Sexe - Femelle",
          "Gender_3": "Sexe - Mixte",
        };
        const transformedData = result.data.map((entry) => ({
          ...entry,
          Gender: categoryMapping[entry.Gender] || entry.Gender,
        }));
        setData(transformedData);
      }
    } catch (error) {
      console.error("Erreur API Sterilization Data :", error);
    }
  };

  const fetchSterilizationPercentData = async (animal, setData) => {
    try {
      const response = await fetch(`http://localhost:8000/sterilization-percent-by-age/${animal}`);
      const result = await response.json();
      if (result.data) {
        const sortedData = result.data.sort((a, b) => {
          const ageA = parseInt(a.Age.split('-')[0]);
          const ageB = parseInt(b.Age.split('-')[0]);
          return ageA - ageB;
        });
        setData(sortedData);
      }
    } catch (error) {
      console.error("Erreur API Stérilisation Pourcentage Données :", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSterilizationData(1, setSterilizationDataDog),
        fetchSterilizationData(2, setSterilizationDataCat),
        fetchSterilizationPercentData(1, setSterilizationPercentDataDog),
        fetchSterilizationPercentData(2, setSterilizationPercentDataCat),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const sterilizationData = sterilizationAnimal === "dog" ? sterilizationDataDog : sterilizationDataCat;
  const sterilizationPercentData = sterilizationAnimal === "dog" ? sterilizationPercentDataDog : sterilizationPercentDataCat;

  return (
    <div className="">
      <Title text="Comprendre la Stérilisation Animale : Une Question d'Âge et de Genre" number={6} />

      <div className="flex justify-end mb-8">
        <div className="flex space-x-3">
          <button
            className={`btn ${sterilizationAnimal === "dog" ? "btn-primary" : ""}`}
            onClick={() => setSterilizationAnimal("dog")}
          >
            🐶 Chiens
          </button>
          <button
            className={`btn ${sterilizationAnimal === "cat" ? "btn-primary" : ""}`}
            onClick={() => setSterilizationAnimal("cat")}
          >
            🐱 Chats
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-12">
        {/* Graphique 1 - Stérilisation par sexe */}
        <div className="w-full">
          <div className="flex items-center text-lg mb-4">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={showNonSterilized}
              onChange={() => setShowNonSterilized(!showNonSterilized)}
            />
            <span className="ml-2">Afficher les animaux non stérilisés</span>
          </div>

          <Plot
            data={[
              {
                x: sterilizationData.map((d) => d.Gender),
                y: sterilizationData.map((d) => d.Sterilized_Yes),
                type: "bar",
                name: "Stérilisé - Oui",
                marker: { color: "#4CAF50" },
                width: 0.6,
              },
              ...(showNonSterilized ? [{
                x: sterilizationData.map((d) => d.Gender),
                y: sterilizationData.map((d) => d.Sterilized_No),
                type: "bar",
                name: "Stérilisé - Non",
                marker: { color: "#F44336" },
                width: 0.6,
              }] : []),
            ]}
            layout={{
              height: 500,
              xaxis: {
                title: { text: "Sexe", font: { size: 16 } },
                tickfont: { size: 14 },
              },
              yaxis: {
                title: { text: "Nombre d'animaux", font: { size: 16 } },
                tickfont: { size: 14 },
              },
              barmode: "group",
              legend: {
                font: { size: 14 },
                orientation: "h",
                y: 1.1,
              },
              margin: { b: 100 },
            }}
            config={{
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              locale: 'fr'
            }}
            style={{ width: "100%", height: "600px", marginBottom: "30px" }}

          />
        </div>

        {/* Graphique 2 - Pourcentage de stérilisation par âge */}
        <div className="w-full">
          <div className="mb-6 flex space-x-8">
            <div className="flex items-center text-lg">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={showMalesSterilization}
                onChange={() => setShowMalesSterilization(!showMalesSterilization)}
              />
              <span className="ml-2">Afficher les mâles</span>
            </div>
            <div className="flex items-center text-lg">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={showFemalesSterilization}
                onChange={() => setShowFemalesSterilization(!showFemalesSterilization)}
              />
              <span className="ml-2">Afficher les femelles</span>
            </div>
          </div>

          <Plot
            data={[
              ...(showMalesSterilization ? [{
                x: sterilizationPercentData.map((d) => d.Age),
                y: sterilizationPercentData.map((d) => d.Male_Sterilization_Percent),
                type: "scatter",
                mode: "lines+markers",
                name: "Mâles",
                line: { color: "#2196F3", width: 3 },
                marker: { size: 10, color: "#2196F3" },
                hovertemplate: '%{y:.1f}% à l\'âge %{x}<extra></extra>',
              }] : []),
              ...(showFemalesSterilization ? [{
                x: sterilizationPercentData.map((d) => d.Age),
                y: sterilizationPercentData.map((d) => d.Female_Sterilization_Percent),
                type: "scatter",
                mode: "lines+markers",
                name: "Femelles",
                line: { color: "#FF9800", width: 3 },
                marker: { size: 10, color: "#FF9800" },
                hovertemplate: '%{y:.1f}% à l\'âge %{x}<extra></extra>',
              }] : []),
            ]}
            layout={{
              height: 500,
              xaxis: {
                title: { text: "Tranche d'âge (mois)", font: { size: 16 } },
                tickfont: { size: 14 },
                tickangle: -45,
              },
              yaxis: {
                title: { text: "Pourcentage de stérilisation (%)", font: { size: 16 } },
                tickfont: { size: 14 },
                range: [0, 105],
                tickformat: '.1f',
              },
              legend: {
                font: { size: 14 },
                orientation: "h",
                y: 1.1,
              },
              hovermode: "closest",
              margin: { b: 150 },
            }}
            config={{
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              locale: 'fr'
            }}
            style={{ width: "100%", height: "600px", marginBottom: "30px" }}
          />
          <Contexte texte="Les graphiques présentent des données sur la stérilisation des animaux (chiens et chats), différenciées selon le sexe et l'âge. L'objectif est de comprendre les tendances générales de stérilisation et d'identifier d'éventuelles différences entre les groupes." />

          <Explication
            title="1. Stérilisation chez les chiens"
            points={[
              "Le premier graphique montre le nombre total d'animaux stérilisés ou non, selon le sexe.",
              "Prédominance des non-stérilisés : Les animaux non stérilisés (barres rouges) sont plus nombreux que les stérilisés (barres vertes).",
              "Répartition par sexe : Les femelles semblent plus nombreuses que les mâles, et le groupe mixte est minoritaire.",
              "Le deuxième graphique illustre le pourcentage de stérilisation par âge et par sexe.",
              "Corrélation avec l'âge : Le taux de stérilisation augmente significativement avec l'âge (jeunes rarement stérilisés vs adultes/seniors).",
              "Différence entre sexes : La tendance est plus marquée chez les femelles, reflétant une plus forte incitation à leur stérilisation.",
            ]}
          />

          <Explication
            title="2. Stérilisation chez les chats"
            points={[
              "Comme chez les chiens, les non-stérilisés sont majoritaires.",
              "Équilibre entre sexes : La différence est moins marquée que chez les chiens, suggérant une approche plus équilibrée.",
              "Augmentation similaire à celle observée chez les chiens, mais taux plus élevé chez les adultes.",
              "Chez les seniors, la différence entre mâles et femelles est moins prononcée que chez les chiens.",
            ]}
          />

          {/* Section Comparaison entre chiens et chats */}
          <Explication
            title="Comparaison entre chiens et chats"
            points={[
              "les chien sont  plus stérilisés que les chats",
              "Priorité aux femelles : La stérilisation des chiennes semble plus ciblée que celle des mâles.",
              "Jeunes rarement stérilisés : Constat commun aux deux espèces.",
              "Chez les chiens : La stérilisation progresse de manière graduelle et constante.",
              "Chez les chats : Le taux de stérilisation augmente rapidement, atteignant des niveaux élevés plus tôt.",
            ]}
          />

          <Conclusions
            conclusions={[
              "Ces analyses mettent en lumière des tendances et des écarts qui pourraient être optimisés par des campagnes de sensibilisation et des politiques de stérilisation adaptées à chaque espèce et groupe d'âge.",
            ]}
          />

        </div>


      </div>




    </div>
  );
};

export default Anna7;