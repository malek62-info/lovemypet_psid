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
  const [sterilizationPercentDataDog, setSterilizationPercentDataDog] = useState([]);
  const [sterilizationPercentDataCat, setSterilizationPercentDataCat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNonSterilized, setShowNonSterilized] = useState(true);
  const [showMalesSterilization, setShowMalesSterilization] = useState(true);
  const [showFemalesSterilization, setShowFemalesSterilization] = useState(true);
  const [view, setView] = useState('dog');
  const [sterilizationAnimal, setSterilizationAnimal] = useState('dog');

  // Nouvel état pour les données des top races
  const [topBreedsDataDog, setTopBreedsDataDog] = useState([]);
  const [topBreedsDataCat, setTopBreedsDataCat] = useState([]);
  const [topBreedsAnimal, setTopBreedsAnimal] = useState('dog');

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
      const response = await fetch(`http://localhost:8000/stacked-bar/${animal}`);
      const result = await response.json();
      if (result.stacked_data) {
        const categoryMapping = {
          "MaturitySize_1": "Taille à maturité - Petite",
          "MaturitySize_2": "Taille à maturité - Moyenne",
          "MaturitySize_3": "Taille à maturité - Grande",
          "Gender_1": "Sexe - Mâle",
          "Gender_2": "Sexe - Femelle",
          "Gender_3": "Sexe - Mixte",
          "FurLength_1": "Longueur de la fourrure - Court",
          "FurLength_2": "Longueur de la fourrure - Moyen",
          "FurLength_3": "Longueur de la fourrure - Long",
          "Vaccinated_1": "Vacciné - Oui",
          "Vaccinated_2": "Vacciné - Non",
          "Dewormed_1": "Vermifugé - Oui",
          "Dewormed_2": "Vermifugé - Non",
          "Sterilized_1": "Stérilisé - Oui",
          "Sterilized_2": "Stérilisé - Non",
          "Health_1": "Santé - En bonne santé",
          "Health_2": "Santé - Blessure mineure",
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

  // Fonction pour récupérer les données de pourcentage de stérilisation par âge
  const fetchSterilizationPercentData = async (animal, setData) => {
    try {
      const response = await fetch(`http://localhost:8000/sterilization-percent-by-age/${animal}`);
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
      const response = await fetch(`http://localhost:8000/top-breeds-adoption/${animal}`);
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
  const stackedData = view === 'dog' ? stackedDataDog : stackedDataCat;
  const sterilizationData = sterilizationAnimal === 'dog' ? sterilizationDataDog : sterilizationDataCat;
  const sterilizationPercentData = sterilizationAnimal === 'dog' ? sterilizationPercentDataDog : sterilizationPercentDataCat;
  const topBreedsData = topBreedsAnimal === 'dog' ? topBreedsDataDog : topBreedsDataCat;


  return (
    <div className="">
      <>
        <Title text="Facteurs Influents sur la Vitesse d'Adoption des Animaux : Chiens vs Chats" number={3} />
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

          <Plot
            data={[
              {
                x: stackedData.map((d) => d.category),
                y: stackedData.map((d) => d.AdoptedSameDay),
                type: "bar",
                name: "Adopté le jour même",
                marker: { color: "#1f77b4" },
                hoverinfo: 'x+y+text',  // Affiche les infos de l'axe x, y et texte au survol
                // On supprime le texte des barres ici
              },
              {
                x: stackedData.map((d) => d.category),
                y: stackedData.map((d) => d.AdoptedWithin7Days),
                type: "bar",
                name: "Adopté sous 1 à 7 jours",
                marker: { color: "#ff7f0e" },
                hoverinfo: 'x+y+text',
                // On supprime le texte des barres ici
              },
              {
                x: stackedData.map((d) => d.category),
                y: stackedData.map((d) => d.AdoptedWithin1Month),
                type: "bar",
                name: "Adopté en 8 à 30 jours",
                marker: { color: "#2ca02c" },
                hoverinfo: 'x+y+text',
                // On supprime le texte des barres ici
              },
            ]}
            layout={{
              barmode: 'stack',
              showlegend: true,  // Légende activée pour expliquer les couleurs
              margin: {
                b: 190, // 👈 Ajoute ça ! (bottom margin)
              },
              title: "Répartition des adoptions selon le délai",
              xaxis: {
                title: "Catégories",
                tickvals: stackedData.map((d) => d.category),
                ticktext: stackedData.map((d) => d.category), // Garder les labels de catégorie visibles
              },
              yaxis: {
                title: "Nombre d'adoptions",
              },
              annotations: []  // On désactive les annotations sur les barres
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
            texte=" De manière générale, on observe que la majorité des chiens sont adoptés soit dans la première semaine, soit après plus de 8 jours suivant leur mise à l'adoption. En revanche, les adoptions le même jour sont moins fréquentes."
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

          <Contexte
            texte=" Comme observé chez les chiens, les chats sont adoptés soit dans la première semaine, soit après plus de 8 jours suivant leur mise à l'adoption et celles effectuées le jour même (barres bleues) sont moins fréquentes "
          />

          <Explication
            title="Facteurs Influant sur l'Adoption (Chats)"
            points={[
              "Facteurs de Santé : Les facteurs liés à la santé, tels que la vaccination, la vermifugation et l'état général de l'animal, semblent jouer un rôle déterminant dans la rapidité d'adoption, comme c'était le cas pour les chiens.",
              "État de santé et stérilisation : Les chats en bonne santé et non stérilisés sont adoptés plus rapidement. En revanche, ceux présentant des problèmes de santé ou étant déjà stérilisés ont un taux d'adoption nettement plus faible. Cela pourrait s'expliquer par une préférence pour les jeunes animaux ou par l'intention des adoptants de gérer eux-mêmes la stérilisation.",
              "Vaccination : Contrairement à ce qu'on pourrait attendre, la vaccination ne semble pas accélérer l'adoption des chats. Les chats non vaccinés sont adoptés plus rapidement que les chats vaccinés, ce qui pourrait indiquer que les adoptants ne perçoivent pas la vaccination comme un facteur déterminant",
              "Taille à maturité : Contrairement aux chiens, la taille ne semble pas être un facteur déterminant dans l'adoption des chats, leur gabarit étant plus uniforme.",
            ]}
          />

          <Explication
            title="Analyse des Chats et Comparaison avec les Chiens"
            points={[
              "Facteurs de Santé : Les facteurs liés à la santé, tels que la vaccination, la vermifugation et l'état général de l'animal, semblent jouer un rôle déterminant dans la rapidité d'adoption, comme c'était le cas pour les chiens.",
              "État de santé et stérilisation : Les chats en bonne santé et non stérilisés sont adoptés plus rapidement. En revanche, ceux présentant des problèmes de santé ou étant déjà stérilisés ont un taux d'adoption nettement plus faible. Cela pourrait s'expliquer par une préférence pour les jeunes animaux ou par l'intention des adoptants de gérer eux-mêmes la stérilisation.",
              "Taille à maturité : Contrairement aux chiens, la taille ne semble pas être un facteur déterminant dans l'adoption des chats, leur gabarit étant plus uniforme.",
            ]}
          />

          <Conclusions
            conclusions={[
              " Les facteurs de santé et de soins préventifs influencent différemment chiens et chats. La vaccination est cruciale pour les chats mais secondaire pour les chiens, tandis que la taille compte surtout pour les chiens. La non-stérilisation accélère l'adoption dans les deux cas.",
            ]}
          />
        </div>

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
            "On observe une augmentation comparable à celle des chiens, mais avec des taux plus élevés chez les chats adultes",
            "Chez les chats seniors, la distinction entre mâles et femelles est moins marquée que chez les chiens",
          ]}
        />


        <Conclusions
          conclusions={[
            "les chien sont  plus stérilisés que les chats",
            "Priorité aux femelles : La stérilisation des chiennes semble plus ciblée que celle des mâles.",
            "Jeunes rarement stérilisés : Constat commun aux deux espèces.",
            "Chez les chiens : La stérilisation progresse de manière graduelle et constante.",
            "Chez les chats : Le taux de stérilisation augmente rapidement, atteignant des niveaux élevés plus tôt.",
          ]}
        />



        <Title text="Les Animaux les Plus Vite Adoptés : Races Pures vs Mixtes" number={5} />

        {/* Nouveau Graphique 3 : Top 10 races pures vs mixtes */}
        <div className="w-full mb-12">
          <div className="flex justify-end">
            <div className="space-x-2">
              <button
                className={"btn"}
                onClick={() => setTopBreedsAnimal('dog')}
              >
                🐶 Chiens
              </button>
              <button
                className={"btn"}
                onClick={() => setTopBreedsAnimal('cat')}
              >
                🐱 Chats
              </button>
            </div>
          </div>


          <Plot
            data={[
              {
                x: topBreedsData.map((d) => `${d.breed} (${d.purity})`),
                y: topBreedsData.map((d) => d.speed),
                type: 'bar',
                marker: {
                  color: topBreedsData.map((d) => (d.purity === 'Pure' ? '#4CAF50' : '#F44336')),
                },
                name: 'Vitesse d’adoption',
                text: topBreedsData.map((d) => d.speed.toFixed(2)),
                textposition: 'auto',
              },
            ]}
            layout={{
              xaxis: {
                title: { text: 'Races (Pure/Mixte)', font: { size: 16 } },
                tickfont: { size: 12 },
                tickangle: -45,
              },
              yaxis: {
                title: { text: 'Vitesse d’adoption moyenne ', font: { size: 16 } },
                tickfont: { size: 14 },
                range: [0, 4],
              },
              barmode: 'group',
              showlegend: false,
              margin: {
                b: 155, // 👈 Ajoute ça ! (bottom margin)
              },
            }}
            config={{ responsive: true, displayModeBar: true, displaylogo: false }}
            style={{ width: "100%", height: "600px", marginBottom: "5rem" }}
          />



          <Contexte
            texte="   Les graphiques présentent les 10 races pures  et les 10 races mixtes
             de chiens et de chats adoptées le plus rapidement, basées sur la vitesse d’adoption moyenne 
             L’objectif est de comprendre les préférences des adoptants et d’identifier les différences entre chiens et chats."

          />


          <Explication
            title="Vitesse d'adoption chez les chiens"
            points={[
              "Les races pures sont généralement adoptées plus rapidement.",
              "Les races mixtes ont tendance à attendre plus longtemps avant adoption.",
              "Le Basset Hound, le Yorkshire Terrier et le Border Collie sont parmi les races pures adoptées rapidement.",
              "Le Husky mixte, le Shih Tzu mixte et le Schnauzer mixte prennent plus de temps à être adoptés.",
              "Il existe des exceptions parmi les races mixtes, comme le Collie mixte qui est adopté rapidement.",
              "Certaines races pures, comme l’English Cocker Spaniel, connaissent des délais d’adoption plus longs que d’autres races pures.",
              "La pureté de la race n'est pas le seul facteur qui influence la vitesse d’adoption.",
              "D’autres critères influencent l’adoption : la popularité de la race, le tempérament, la taille de l’animal et les besoins d’entretien."
            ]}
          />



          <Explication
            title="Vitesse d'adoption chez les chats"
            points={[
              "Les races pures de chats sont en général adoptées plus rapidement que les races mixtes. Elles attirent davantage, sans doute en raison de leur apparence distinctive, de leur notoriété ou encore d'une image valorisante associée à leur pedigree.",
              "Parmi ces races pures, certaines se distinguent particulièrement et trouvent un foyer très rapidement. C’est souvent le cas de chats à l’allure élégante, au tempérament connu, ou issus de races très populaires comme le Persan, le Siamois ou le Maine Coon.",
              "À l’inverse, les races mixtes ont tendance à rester plus longtemps en attente d’adoption. Cette différence peut s’expliquer par une visibilité plus faible, des traits physiques moins marqués, ou un manque de reconnaissance du public.",
              "Cependant, certaines races mixtes réussissent à être adoptées aussi rapidement, voire plus rapidement que certaines races pures. Cela montre que la personnalité, l’apparence ou les interactions humaines jouent un rôle essentiel.",
              "Certaines races mixtes issues de lignées reconnues, comme le Siamese Mixte ou le Maine Coon Mixte, se rapprochent de leurs équivalents pures en popularité et rapidité d’adoption, bien qu’un léger écart subsiste.",
              "Comme chez les chiens, la pureté de la race n’est pas le seul facteur déterminant. Tempérament, besoins d’entretien, taille, énergie et compatibilité avec les familles influencent fortement la décision d’adoption.",
              "Le lien émotionnel entre l’adoptant et l’animal dépasse souvent les considérations de race. L'attachement et la connexion jouent un rôle clé dans le choix final."
            ]}
          />




          <Explication
            title="Comparaison entre chiens et chats"
            points={[
              "Chiens : Les races pures comme le Basset Hound (1,60) sont souvent adoptées plus rapidement que les mixtes, sauf pour le Maltais (1,30).",
              "Chats : Les races mixtes (ex. : Ragdoll à 1.70) rivalisent avec les pures, démontrant une moindre importance de la pureté.",
              "Chiens : Les races pures (Border Collie, Pug) et certains mixtes (Maltais) sont dominants, reflétant des préférences marquées.",
              "Chats : Les mixtes (Ragdoll, Maine Coon) sont plus populaires, les adoptants étant moins attachés à la pureté."
            ]}
          />

          <Conclusions
         conclusions= {["En analysant les tendances d'adoption des chiens et des chats, il apparaît que la race pure tend à être adoptée plus rapidement que les races mixtes, tant chez les chiens que chez les chats. Cependant, plusieurs facteurs, au-delà de la pureté de la race, influencent la vitesse d'adoption.",
            ]}
          />

        </div>



      </>
    </div>
  );
};

export default Annalyse3;
