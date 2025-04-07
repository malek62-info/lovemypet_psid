import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";

const Anna7 = () => {
  // États pour stocker les données des différents graphiques
  const [stackedDataDog, setStackedDataDog] = useState([]);
  const [stackedDataCat, setStackedDataCat] = useState([]);
  const [sterilizationDataDog, setSterilizationDataDog] = useState([]);
  const [sterilizationDataCat, setSterilizationDataCat] = useState([]);
  const [sterilizationPercentDataDog, setSterilizationPercentDataDog] =
    useState([]);
  const [sterilizationPercentDataCat, setSterilizationPercentDataCat] =
    useState([]);
  const [loading, setLoading] = useState(false);
  const [showNonSterilized, setShowNonSterilized] = useState(true);
  const [showMalesSterilization, setShowMalesSterilization] = useState(true);
  const [showFemalesSterilization, setShowFemalesSterilization] =
    useState(true);
  const [view, setView] = useState("dog");
  const [sterilizationAnimal, setSterilizationAnimal] = useState("dog");

  // Nouvel état pour les données des top races
  const [topBreedsDataDog, setTopBreedsDataDog] = useState([]);
  const [topBreedsDataCat, setTopBreedsDataCat] = useState([]);
  const [topBreedsAnimal, setTopBreedsAnimal] = useState("dog");

  // Labels pour les vitesses d'adoption
  const adoptionSpeedLabels = {
    0: "Adopté le jour même",
    1: "Adopté en 1-7 jours",
    2: "Adopté en 8-30 jours",
    3: "Adopté en 31-90 jours",
    4: "Non adopté après 100 jours",
  };

  // Fonction pour récupérer les données du graphique à barres empilées
  const fetchStackedBarData = async (animal, setData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/stacked-bar/${animal}`
      );
      const result = await response.json();
      if (result.stacked_data) {
        const categoryMapping = {
          MaturitySize_1: "Taille à maturité - Petite",
          MaturitySize_2: "Taille à maturité - Moyenne",
          MaturitySize_3: "Taille à maturité - Grande",
          Gender_1: "Sexe - Mâle",
          Gender_2: "Sexe - Femelle",
          Gender_3: "Sexe - Mixte",
          FurLength_1: "Longueur de la fourrure - Court",
          FurLength_2: "Longueur de la fourrure - Moyen",
          FurLength_3: "Longueur de la fourrure - Long",
          Vaccinated_1: "Vacciné - Oui",
          Vaccinated_2: "Vacciné - Non",
          Dewormed_1: "Vermifugé - Oui",
          Dewormed_2: "Vermifugé - Non",
          Sterilized_1: "Stérilisé - Oui",
          Sterilized_2: "Stérilisé - Non",
          Health_1: "Santé - En bonne santé",
          Health_2: "Santé - Blessure mineure",
        };
        const filteredData = result.stacked_data.map((entry) => ({
          ...entry,
          category: categoryMapping[entry.category] || entry.category,
          AdoptedSameDay: entry.speed_0,
          AdoptedWithin7Days: entry.speed_1,
          AdoptedWithin1Month: entry.speed_2,
        }));
        setData(filteredData);
      }
    } catch (error) {
      console.error("Erreur API Stacked Bar :", error);
    }
  };

  // Fonction pour récupérer les données de stérilisation par sexe
  const fetchSterilizationData = async (animal, setData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/sterilization-by-gender/${animal}`
      );
      const result = await response.json();
      if (result.data) {
        const categoryMapping = {
          Gender_1: "Sexe - Mâle",
          Gender_2: "Sexe - Femelle",
          Gender_3: "Sexe - Mixte",
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

  // Fonction pour récupérer les données de pourcentage de stérilisation par âge
  const fetchSterilizationPercentData = async (animal, setData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/sterilization-percent-by-age/${animal}`
      );
      const result = await response.json();
      if (result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Erreur API Sterilization Percent Data :", error);
    }
  };

  // Nouvelle fonction pour récupérer les données des top races
  const fetchTopBreedsData = async (animal, setData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/top-breeds-adoption/${animal}`
      );
      const result = await response.json();
      if (result.bar_data) {
        setData(result.bar_data);
      }
    } catch (error) {
      console.error("Erreur API Top Breeds :", error);
    }
  };

  // Chargement des données au montage du composant
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStackedBarData(1, setStackedDataDog),
        fetchStackedBarData(2, setStackedDataCat),
        fetchSterilizationData(1, setSterilizationDataDog),
        fetchSterilizationData(2, setSterilizationDataCat),
        fetchSterilizationPercentData(1, setSterilizationPercentDataDog),
        fetchSterilizationPercentData(2, setSterilizationPercentDataCat),
        fetchTopBreedsData(1, setTopBreedsDataDog), // Ajout pour chiens
        fetchTopBreedsData(2, setTopBreedsDataCat), // Ajout pour chats
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const renderLabel = (value) => value;

  // Sélection des données en fonction des filtres
  const sterilizationData =
    sterilizationAnimal === "dog" ? sterilizationDataDog : sterilizationDataCat;
  const sterilizationPercentData =
    sterilizationAnimal === "dog"
      ? sterilizationPercentDataDog
      : sterilizationPercentDataCat;

  return (
    <div className="">
      <>
        {/* Graphique 2 : Stérilisation */}
        <div className="">
          <Title
            text="Analyse de la stérilisation des animaux selon le sexe et l'âge"
            number={4}
          />

          {/* Boutons de filtre */}
          <div className="flex justify-end">
            <div className="mb-8 flex space-x-3">
              <button
                className="btn"
                onClick={() => setSterilizationAnimal("dog")}
              >
                🐶 Chiens
              </button>
              <button
                className="btn"
                onClick={() => setSterilizationAnimal("cat")}
              >
                🐱 Chats
              </button>
            </div>
          </div>

          {/* Grille des graphiques */}
          <div className=" flex ">
            {/* Graphique 1 - Nombre total */}
            <div className="w-1/2">
              <div className="flex items-center text-lg">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={showNonSterilized}
                  onChange={() => setShowNonSterilized(!showNonSterilized)}
                />

                <span className="ml-2">
                  {" "}
                  Afficher les animaux non stérilisés
                </span>
              </div>

              <div className="">
                <Plot
                  data={[
                    {
                      x: sterilizationData.map((d) => d.Gender),
                      y: sterilizationData.map((d) => d.Sterilized_Yes),
                      type: "bar",
                      name: "Stérilisé - Oui (1)",
                      marker: { color: "#4CAF50" },
                      width: 0.6,
                    },
                    ...(showNonSterilized
                      ? [
                          {
                            x: sterilizationData.map((d) => d.Gender),
                            y: sterilizationData.map((d) => d.Sterilized_No),
                            type: "bar",
                            name: "Stérilisé - Non (2)",
                            marker: { color: "#F44336" },
                            width: 0.6,
                          },
                        ]
                      : []),
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
                  }}
                  config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                  }}
                />
              </div>
            </div>

            {/* Graphique 2 - Pourcentage par âge */}
            <div className="w-1/2">
              <div className="mb-6 flex space-x-8">
                <div className="flex items-center text-lg">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={showMalesSterilization}
                    onChange={() =>
                      setShowMalesSterilization(!showMalesSterilization)
                    }
                  />

                  <span className="ml-2">Afficher les mâles</span>
                </div>

                <div className="flex items-center text-lg">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={showFemalesSterilization}
                    onChange={() =>
                      setShowFemalesSterilization(!showFemalesSterilization)
                    }
                  />

                  <span className="ml-2">Afficher les femelles</span>
                </div>
              </div>
              <div className="w-full h-[500px]">
                <Plot
                  data={[
                    ...(showMalesSterilization
                      ? [
                          {
                            x: sterilizationPercentData.map((d) => d.Age),
                            y: sterilizationPercentData.map(
                              (d) => d.Male_Sterilization_Percent
                            ),
                            type: "scatter",
                            mode: "lines+markers",
                            name: "Sexe - Mâle (1)",
                            line: { color: "#2196F3", width: 3 },
                            marker: { size: 10, color: "#2196F3" },
                          },
                        ]
                      : []),
                    ...(showFemalesSterilization
                      ? [
                          {
                            x: sterilizationPercentData.map((d) => d.Age),
                            y: sterilizationPercentData.map(
                              (d) => d.Female_Sterilization_Percent
                            ),
                            type: "scatter",
                            mode: "lines+markers",
                            name: "Sexe - Femelle (2)",
                            line: { color: "#FF9800", width: 3 },
                            marker: { size: 10, color: "#FF9800" },
                          },
                        ]
                      : []),
                  ]}
                  layout={{
                    height: 500,
                    xaxis: {
                      title: { text: "Âge", font: { size: 16 } },
                      tickfont: { size: 14 },
                    },
                    yaxis: {
                      title: {
                        text: "Pourcentage de stérilisation (%)",
                        font: { size: 16 },
                      },
                      tickfont: { size: 14 },
                      range: [0, 100],
                    },
                    legend: {
                      font: { size: 14 },
                      orientation: "h",
                      y: 1.1,
                    },
                    hovermode: "closest",
                  }}
                  config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

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
      </>
    </div>
  );
};

export default Anna7;
