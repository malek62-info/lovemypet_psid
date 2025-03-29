import { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   LabelList,
// } from "recharts";
import Plot from "react-plotly.js";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";

const Annalyse3 = () => {
  // États pour stocker les données des différents graphiques
  const [stackedDataDog, setStackedDataDog] = useState([]);
  const [stackedDataCat, setStackedDataCat] = useState([]);
  const [sterilizationDataDog, setSterilizationDataDog] = useState([]);
  const [sterilizationDataCat, setSterilizationDataCat] = useState([]);
  const [sterilizationPercentDataDog, setSterilizationPercentDataDog] =
    useState([]);
  const [sterilizationPercentDataCat, setSterilizationPercentDataCat] =
    useState([]);
  const [adoptionSpeedDataDog, setAdoptionSpeedDataDog] = useState([]);
  const [adoptionSpeedDataCat, setAdoptionSpeedDataCat] = useState([]);
  const [lineDataDog, setLineDataDog] = useState({ male: {}, female: {} });
  const [lineDataCat, setLineDataCat] = useState({ male: {}, female: {} });
  const [loading, setLoading] = useState(false);
  const [showNonSterilized, setShowNonSterilized] = useState(true);
  const [showMalesSterilization, setShowMalesSterilization] = useState(true);
  const [showFemalesSterilization, setShowFemalesSterilization] =
    useState(true);
  const [view, setView] = useState("dog");
  const [sterilizationAnimal, setSterilizationAnimal] = useState("dog");
  const [adoptionSpeedAnimal, setAdoptionSpeedAnimal] = useState("dog");
  const [showMalesAdoption, setShowMalesAdoption] = useState(true);
  const [showFemalesAdoption, setShowFemalesAdoption] = useState(true);
  const [lineAnimal, setLineAnimal] = useState("dog");

  // Labels pour les vitesses d'adoption
  const adoptionSpeedLabels = {
    0: "Adopté le jour même",
    1: "Adopté en 1-7 jours",
    2: "Adopté en 8-30 jours",
    3: "Adopté en 31-90 jours",
    4: "Non adopté après 100 jours",
  };

  // Couleurs distinctes pour chaque vitesse d'adoption (mâles et femelles)
  const maleColors = [
    "#2ecc71", // Vert émeraude (speed 0)
    "#3498db", // Bleu ciel (speed 1)
    "#9b59b6", // Violet (speed 2)
    "#e74c3c", // Rouge (speed 3)
    "#f1c40f", // Jaune (speed 4)
  ];
  const femaleColors = [
    "#e91e63", // Rose fuchsia (speed 0)
    "#1abc9c", // Turquoise (speed 1)
    "#8e44ad", // Violet foncé (speed 2)
    "#d35400", // Orange citrouille (speed 3)
    "#34495e", // Gris bleu foncé (speed 4)
  ];

  // Fonction pour récupérer les données du graphique à barres empilées
  const fetchStackedBarData = async (animal, setData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/stacked-bar/${animal}`
      );
      const result = await response.json();
      if (result.stacked_data) {
        const categoryMapping = {
          MaturitySize_1: "Taille à maturité - Petite (1)",
          MaturitySize_2: "Taille à maturité - Moyenne (2)",
          MaturitySize_3: "Taille à maturité - Grande (3)",
          Gender_1: "Sexe - Mâle (1)",
          Gender_2: "Sexe - Femelle (2)",
          Gender_3: "Sexe - Mixte (3)",
          FurLength_1: "Longueur de la fourrure - Court (1)",
          FurLength_2: "Longueur de la fourrure - Moyen (2)",
          FurLength_3: "Longueur de la fourrure - Long (3)",
          Vaccinated_1: "Vacciné - Oui (1)",
          Vaccinated_2: "Vacciné - Non (2)",
          Dewormed_1: "Vermifugé - Oui (1)",
          Dewormed_2: "Vermifugé - Non (2)",
          Sterilized_1: "Stérilisé - Oui (1)",
          Sterilized_2: "Stérilisé - Non (2)",
          Health_1: "Santé - En bonne santé (1)",
          Health_2: "Santé - Blessure mineure (2)",
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
          Gender_1: "Sexe - Mâle (1)",
          Gender_2: "Sexe - Femelle (2)",
          Gender_3: "Sexe - Mixte (3)",
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

  // Fonction pour récupérer les données du graphique en lignes (adoptions par intervalle d'âge)
  const fetchAdoptionSpeedLine = async (animal, setData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/adoption-speed-density/${animal}`
      );
      const result = await response.json();
      if (result.line_data) {
        setData(result.line_data);
      }
    } catch (error) {
      console.error("Erreur API Line Data :", error);
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
        fetchAdoptionSpeedLine(1, setLineDataDog),
        fetchAdoptionSpeedLine(2, setLineDataCat),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const renderLabel = (value) => value;

  // Sélection des données en fonction des filtres
  const stackedData = view === "dog" ? stackedDataDog : stackedDataCat;
  const sterilizationData =
    sterilizationAnimal === "dog" ? sterilizationDataDog : sterilizationDataCat;
  const sterilizationPercentData =
    sterilizationAnimal === "dog"
      ? sterilizationPercentDataDog
      : sterilizationPercentDataCat;
  const adoptionSpeedData =
    adoptionSpeedAnimal === "dog" ? adoptionSpeedDataDog : adoptionSpeedDataCat;
  const adoptionSpeedTitle =
    adoptionSpeedAnimal === "dog" ? "Chiens 🐶" : "Chats 🐱";
  const lineData = lineAnimal === "dog" ? lineDataDog : lineDataCat;
  const lineTitle = lineAnimal === "dog" ? "Chiens 🐶" : "Chats 🐱";

  return (
    <div className="">
      <>
        <Title text="Titre du graphe ?" number={3} />
        {/* Graphique 1 : Vitesse d'adoption par variable */}
        <div className="w-full mb-12">
          <div className="flex  justify-end space-x-2">
            <button className="btn" onClick={() => setView("dog")}>
              🐶 Chiens
            </button>
            <button className="btn " onClick={() => setView("cat")}>
              🐱 Chats
            </button>
          </div>

          {/* <ResponsiveContainer height={600}>
                <BarChart
                  data={stackedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                >
                  <CartesianGrid stroke="#d1d5db" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="AdoptedSameDay"
                    stackId="a"
                    fill="#1f77b4"
                    name="Adopté le jour même"
                  >
                    <LabelList
                      dataKey="AdoptedSameDay"
                      position="center"
                      fill="white"
                      fontSize={16}
                      fontWeight="bold"
                      formatter={renderLabel}
                    />
                  </Bar>
                  <Bar
                    dataKey="AdoptedWithin7Days"
                    stackId="a"
                    fill="#ff7f0e"
                    name="Adopté sous 1 à 7 jours"
                  >
                    <LabelList
                      dataKey="AdoptedWithin7Days"
                      position="center"
                      fill="white"
                      fontSize={16}
                      fontWeight="bold"
                      formatter={renderLabel}
                    />
                  </Bar>
                  <Bar
                    dataKey="AdoptedWithin1Month"
                    stackId="a"
                    fill="#2ca02c"
                    name="Adopté en 8 à 30 jours"
                  >
                    <LabelList
                      dataKey="AdoptedWithin1Month"
                      position="center"
                      fill="white"
                      fontSize={16}
                      fontWeight="bold"
                      formatter={renderLabel}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer> */}

          <Plot
            data={[
              {
                x: stackedData.map((d) => d.category),
                y: stackedData.map((d) => d.AdoptedSameDay),
                type: "bar",
                name: "Adopté le jour même",
                marker: { color: "#1f77b4" },
              },
              {
                x: stackedData.map((d) => d.category),
                y: stackedData.map((d) => d.AdoptedWithin7Days),
                type: "bar",
                name: "Adopté sous 1 à 7 jours",
                marker: { color: "#ff7f0e" },
              },
              {
                x: stackedData.map((d) => d.category),
                y: stackedData.map((d) => d.AdoptedWithin1Month),
                type: "bar",
                name: "Adopté en 8 à 30 jours",
                marker: { color: "#2ca02c" },
              },
            ]}
            layout={{
              barmode: "stack",
            }}
            style={{ width: "100%", height: "600px", marginBottom: "30px" }}
          />

          <Contexte
            texte="  Le graphique présente la répartition des adoptions de chiens en
                fonction de plusieurs critères : longueur de la fourrure,
                vaccination, vermifugation, stérilisation, état de santé, sexe
                et taille à maturité. Les adoptions sont classées en trois
                catégories"
          />

          <Explication
            title="Distribution Générale"
            points={[
              "Adopté le jour même (barres bleues)",
              "Adopté sous 1 à 7 jours (barres oranges)",
              "Adopté en 8 à 30 jours (barres vertes)",
            ]}
          />

          <Contexte
            texte=" Globalement, on constate que la majorité des chiens sont adoptés
                dans la première semaine suivant leur mise à l'adoption (barres
                oranges), tandis que les adoptions immédiates et celles prenant
                plus de 8 jours sont moins fréquentes."
          />

          <Explication
            title="Facteurs Influant sur la Vitesse d'Adoption (Chiens)"
            points={[
              "État de santé : Les chiens en bonne santé sont adoptés plus rapidement, confirmant que les adoptants privilégient les animaux qui semblent en pleine forme.",
              "Stérilisation : Les chiens non stérilisés connaissent un taux d'adoption plus rapide. Cela pourrait s'expliquer par leur jeune âge ou par une préférence des adoptants pour des animaux reproductibles.",
              "Vermifugation : Les chiens vermifugés semblent être adoptés plus rapidement, ce qui peut refléter une préférence pour les animaux bénéficiant déjà de soins préventifs.",
              "Taille à maturité : Les chiens de taille moyenne sont adoptés plus rapidement que ceux de petite ou grande taille.",
              "Vaccination : Contrairement aux attentes, la vaccination ne semble pas avoir d'impact majeur sur la vitesse d'adoption, car la différence entre les chiens vaccinés et non vaccinés est minime.",
            ]}
          />

          <Explication
            title="Facteurs Influant sur l'Adoption (Chats)"
            points={[
              "Distribution Générale : Comme observé chez les chiens, la majorité des adoptions de chats ont lieu dans la première semaine suivant leur mise à l'adoption (barres oranges), suivies par les adoptions plus tardives (barres vertes) et celles effectuées le jour même (barres bleues).",
              "Facteurs de Santé : Les facteurs liés à la santé, tels que la vaccination, la vermifugation et l'état général de l'animal, semblent jouer un rôle déterminant dans la rapidité d'adoption, comme c'était le cas pour les chiens.",
              "État de santé et stérilisation : Les chats en bonne santé et non stérilisés sont adoptés plus rapidement. En revanche, ceux présentant des problèmes de santé ou étant déjà stérilisés ont un taux d'adoption nettement plus faible. Cela pourrait s'expliquer par une préférence pour les jeunes animaux ou par l'intention des adoptants de gérer eux-mêmes la stérilisation.",
              "Vaccination : Contrairement aux chiens, la vaccination semble jouer un rôle clé dans l'adoption des chats. Les chats vaccinés ont tendance à être adoptés plus rapidement, ce qui pourrait refléter une perception des adoptants selon laquelle un chat vacciné est plus sécurisé sur le plan sanitaire.",
              "Taille à maturité : Contrairement aux chiens, la taille ne semble pas être un facteur déterminant dans l'adoption des chats, leur gabarit étant plus uniforme.",
            ]}
          />

          <Explication
            title="Analyse des Chats et Comparaison avec les Chiens"
            points={[
              "Distribution Générale : Comme observé chez les chiens, la majorité des adoptions de chats ont lieu dans la première semaine suivant leur mise à l'adoption (barres oranges), suivies par les adoptions plus tardives (barres vertes) et celles effectuées le jour même (barres bleues).",
              "Facteurs de Santé : Les facteurs liés à la santé, tels que la vaccination, la vermifugation et l'état général de l'animal, semblent jouer un rôle déterminant dans la rapidité d'adoption, comme c'était le cas pour les chiens.",
              "État de santé et stérilisation : Les chats en bonne santé et non stérilisés sont adoptés plus rapidement. En revanche, ceux présentant des problèmes de santé ou étant déjà stérilisés ont un taux d'adoption nettement plus faible. Cela pourrait s'expliquer par une préférence pour les jeunes animaux ou par l'intention des adoptants de gérer eux-mêmes la stérilisation.",
              "Vaccination : Contrairement aux chiens, la vaccination semble jouer un rôle clé dans l'adoption des chats. Les chats vaccinés ont tendance à être adoptés plus rapidement, ce qui pourrait refléter une perception des adoptants selon laquelle un chat vacciné est plus sécurisé sur le plan sanitaire.",
              "Taille à maturité : Contrairement aux chiens, la taille ne semble pas être un facteur déterminant dans l'adoption des chats, leur gabarit étant plus uniforme.",
              "Vitesse Générale d'Adoption : Chez les chiens comme les chats, la majorité des adoptions se font entre 1 et 7 jours après la mise à l'adoption. Les adoptions immédiates (jour même) et tardives (8 à 30 jours) sont moins fréquentes, suggérant que les adoptants prennent généralement quelques jours pour réfléchir avant de choisir un animal.",
              "Influence de l'État de Santé : Les chiens et chats en bonne santé sont adoptés plus rapidement, confirmant que les adoptants privilégient les animaux sans problèmes médicaux visibles.",
              "Impact de la Stérilisation : Les chiens et chats non stérilisés sont adoptés plus vite que ceux qui le sont, probablement car ils sont souvent plus jeunes et que certains adoptants préfèrent gérer eux-mêmes la stérilisation. Cette différence est plus marquée chez les chats.",
              "Rôle de la Vaccination : La vaccination est essentielle pour l’adoption des chats mais joue un rôle secondaire chez les chiens. Les adoptants semblent considérer les chats comme plus vulnérables aux maladies.",
              "Importance de la Taille : Les chiens de taille moyenne sont privilégiés (contraintes d’espace), alors que la taille n’a presque pas d’impact sur l’adoption des chats, leur gabarit étant plus uniforme.",
              "Effet de la Vermifugation : Dans les deux cas, les animaux vermifugés sont adoptés plus rapidement, montrant que les adoptants valorisent les soins préventifs.",
            ]}
          />

          <Conclusions
            conclusions={[
              " Les facteurs de santé et de soins préventifs influencent différemment chiens et chats. La vaccination est cruciale pourles chats mais secondaire pour les chiens, tandis que la taille compte surtout pour les chiens. La non-stérilisation accélère l'adoption dans les deux cas.",
            ]}
          />
        </div>

        {/* Graphique 2 : Stérilisation */}
        <div className="">
          <Title
            text="Analyse de la stérilisation des animaux selon le sexe et l'âge"
            number={3}
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
                    margin: { l: 80, r: 50, t: 30, b: 80 },
                    plot_bgcolor: "#f8fafc",
                    paper_bgcolor: "#ffffff",
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
                    margin: { l: 80, r: 50, t: 30, b: 80 },
                    plot_bgcolor: "#f8fafc",
                    paper_bgcolor: "#ffffff",
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
            "Chats plus stérilisés : Probablement dû à la nécessité de contrôler les populations de chats errants.",
            "Priorité aux femelles canines : La stérilisation des chiennes semble plus ciblée que celle des mâles.",
            "Jeunes rarement stérilisés : Constat commun aux deux espèces.",
            "Progression différente : Plus graduelle chez les chiens, alors que les chats atteignent rapidement un taux élevé.",
          ]}
        />

        {/* Section Interprétation et recommandations */}
        <Explication
          title="Interprétation et recommandations"
          points={[
            "Stérilisation précoce : Sensibiliser à une intervention plus précoce, surtout chez les chiens, pour limiter la reproduction incontrôlée.",
            "Équilibre entre sexes : Promouvoir la stérilisation des mâles canins pour un contrôle plus efficace des populations.",
            "Modèle félin : S'inspirer de l'approche équilibrée observée chez les chats pour les chiens.",
          ]}
        />

        <Conclusions
          conclusions={[
            "Ces analyses mettent en lumière des tendances et des écarts qui pourraient être optimisés par des campagnes de sensibilisation et des politiques de stérilisation adaptées à chaque espèce et groupe d'âge.",
          ]}
        />

        <Title text="Nombre d'Adoptions par Intervalle d'Âge " number={3} />

        {/* Graphique 4 : Lignes simples avec intervalles d'âge et couleurs différentes */}
        <div className="w-full mb-12">
          <h2 className=" mb-4 text-xl">Pour {lineTitle}</h2>

          <div className="flex justify-between">
            <div className="flex space-x-3">
              <button className="btn" onClick={() => setLineAnimal("dog")}>
                🐶 Chiens
              </button>
              <button className="btn" onClick={() => setLineAnimal("cat")}>
                🐱 Chats
              </button>
            </div>
            <div className="flex space-x-3">
              <div className="flex items-center text-lg">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={showMalesAdoption}
                  onChange={() => setShowMalesAdoption(!showMalesAdoption)}
                />

                <span className="ml-2"> Mâles </span>
              </div>

              <div className="flex items-center text-lg">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={showFemalesAdoption}
                  onChange={() => setShowFemalesAdoption(!showFemalesAdoption)}
                />

                <span className="ml-2"> Femelles </span>
              </div>
            </div>
          </div>
          <div className="">
       
            <Plot
              data={[
                ...(showMalesAdoption
                  ? Object.entries(lineData.male).map(
                      ([speed, data], index) => ({
                        x: data.x,
                        y: data.y,
                        type: "scatter",
                        mode: "lines+markers",
                        name: `${adoptionSpeedLabels[speed]} (Mâle)`,
                        line: { color: maleColors[index], width: 2 },
                        marker: { size: 8, color: maleColors[index] },
                      })
                    )
                  : []),
                ...(showFemalesAdoption
                  ? Object.entries(lineData.female).map(
                      ([speed, data], index) => ({
                        x: data.x,
                        y: data.y,
                        type: "scatter",
                        mode: "lines+markers",
                        name: `${adoptionSpeedLabels[speed]} (Femelle)`,
                        line: { color: femaleColors[index], width: 2 },
                        marker: { size: 8, color: femaleColors[index] },
                      })
                    )
                  : []),
              ]}
              layout={{
          
                xaxis: {
                  title: "Intervalles d'âge",
                  tickangle: -45,
                  automargin: true,
                },
                yaxis: {
                  title: "Nombre d'adoptions",
                },
                showlegend: true,
             
              }}
              config={{
                displayModeBar: true,
                displaylogo: false,
              }}

              style={{ width: "100%", height: "600px", marginBottom: "30px" }}
            />
          </div>
        </div>
      </>
    </div>
  );
};

export default Annalyse3;
