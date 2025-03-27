import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
import Plot from 'react-plotly.js';

const App = () => {
  const [stackedDataDog, setStackedDataDog] = useState([]);
  const [stackedDataCat, setStackedDataCat] = useState([]);
  const [sterilizationDataDog, setSterilizationDataDog] = useState([]);
  const [sterilizationDataCat, setSterilizationDataCat] = useState([]);
  const [sterilizationPercentDataDog, setSterilizationPercentDataDog] = useState([]);
  const [sterilizationPercentDataCat, setSterilizationPercentDataCat] = useState([]);
  const [adoptionSpeedDataDog, setAdoptionSpeedDataDog] = useState([]);
  const [adoptionSpeedDataCat, setAdoptionSpeedDataCat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNonSterilized, setShowNonSterilized] = useState(true);
  const [showMalesSterilization, setShowMalesSterilization] = useState(true);
  const [showFemalesSterilization, setShowFemalesSterilization] = useState(true);
  const [view, setView] = useState('dog');
  const [sterilizationAnimal, setSterilizationAnimal] = useState('dog');
  const [adoptionSpeedAnimal, setAdoptionSpeedAnimal] = useState('dog');
  const [showMalesAdoption, setShowMalesAdoption] = useState(true);
  const [showFemalesAdoption, setShowFemalesAdoption] = useState(true);

  const adoptionSpeedLabels = {
    0: "Adopté le jour même",
    1: "Adopté en 1-7 jours",
    2: "Adopté en 8-30 jours",
    3: "Adopté en 31-90 jours",
    4: "Non adopté après 100 jours",
  };

  const fetchStackedBarData = async (animal, setData) => {
    try {
      const response = await fetch(`http://localhost:8000/stacked-bar/${animal}`);
      const result = await response.json();
      if (result.stacked_data) {
        const categoryMapping = {
          "MaturitySize_1": "Taille à maturité - Petite (1)",
          "MaturitySize_2": "Taille à maturité - Moyenne (2)",
          "MaturitySize_3": "Taille à maturité - Grande (3)",
          "Gender_1": "Sexe - Mâle (1)",
          "Gender_2": "Sexe - Femelle (2)",
          "Gender_3": "Sexe - Mixte (3)",
          "FurLength_1": "Longueur de la fourrure - Court (1)",
          "FurLength_2": "Longueur de la fourrure - Moyen (2)",
          "FurLength_3": "Longueur de la fourrure - Long (3)",
          "Vaccinated_1": "Vacciné - Oui (1)",
          "Vaccinated_2": "Vacciné - Non (2)",
          "Dewormed_1": "Vermifugé - Oui (1)",
          "Dewormed_2": "Vermifugé - Non (2)",
          "Sterilized_1": "Stérilisé - Oui (1)",
          "Sterilized_2": "Stérilisé - Non (2)",
          "Health_1": "Santé - En bonne santé (1)",
          "Health_2": "Santé - Blessure mineure (2)",
        };
        const filteredData = result.stacked_data.map((entry) => ({
          ...entry,
          category: categoryMapping[entry.category] || entry.category,
          AdoptedSameDay: entry.speed_0,
          AdoptedWithin7Days: entry.speed_1,
        }));
        setData(filteredData);
      }
    } catch (error) {
      console.error("Erreur API Stacked Bar :", error);
    }
  };

  const fetchSterilizationData = async (animal, setData) => {
    try {
      const response = await fetch(`http://localhost:8000/sterilization-by-gender/${animal}`);
      const result = await response.json();
      if (result.data) {
        const categoryMapping = {
          "Gender_1": "Sexe - Mâle (1)",
          "Gender_2": "Sexe - Femelle (2)",
          "Gender_3": "Sexe - Mixte (3)",
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
        setData(result.data);
      }
    } catch (error) {
      console.error("Erreur API Sterilization Percent Data :", error);
    }
  };

  const fetchAdoptionSpeedByAge = async (animal, setData) => {
    try {
      const response = await fetch(`http://localhost:8000/adoption-speed-by-age/${animal}`);
      const result = await response.json();
      if (result.boxplot_data) {
        setData(result.boxplot_data);
      }
    } catch (error) {
      console.error("Erreur API Adoption Speed by Age :", error);
    }
  };

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
        fetchAdoptionSpeedByAge(1, setAdoptionSpeedDataDog),
        fetchAdoptionSpeedByAge(2, setAdoptionSpeedDataCat),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const renderLabel = (value) => value;

  const stackedData = view === 'dog' ? stackedDataDog : stackedDataCat;
  const sterilizationData = sterilizationAnimal === 'dog' ? sterilizationDataDog : sterilizationDataCat;
  const sterilizationPercentData = sterilizationAnimal === 'dog' ? sterilizationPercentDataDog : sterilizationPercentDataCat;
  const adoptionSpeedData = adoptionSpeedAnimal === 'dog' ? adoptionSpeedDataDog : adoptionSpeedDataCat;
  const adoptionSpeedTitle = adoptionSpeedAnimal === 'dog' ? 'Chiens 🐶' : 'Chats 🐱';

  return (
    <div className="flex flex-col items-center p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Analyse des Animaux</h1>

      {loading ? (
        <p className="text-lg font-semibold text-gray-600">Chargement...</p>
      ) : (
        <>
          {/* Graphique 1 : Vitesse d'adoption par variable */}
          <div className="w-full mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Analyse de la Vitesse d'Adoption {view === 'dog' ? 'des Chiens 🐶' : 'des Chats 🐱'}
            </h2>
            <div className="mb-6 flex space-x-6">
              <h3 className="text-xl font-semibold text-gray-800 mr-4">Filtrer le graphique :</h3>
              <button
                className={`px-4 py-2 rounded-lg font-medium ${view === 'dog' ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setView('dog')}
              >
                🐶 Chiens
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium ${view === 'cat' ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setView('cat')}
              >
                🐱 Chats
              </button>
            </div>
            <div className="w-full bg-white p-6 rounded-xl shadow-sm overflow-x-auto mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Nombre d'Animaux Adoptés par Variable et Catégorie ({view === 'dog' ? 'Chiens' : 'Chats'})
              </h3>
              <div style={{ width: `${stackedData.length * 50}px`, minWidth: "100%", maxWidth: "1200px" }}>
                <ResponsiveContainer height={900}>
                  <BarChart data={stackedData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                    <CartesianGrid stroke="#d1d5db" strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="AdoptedSameDay" stackId="a" fill="#1f77b4" name="Adopté le jour même">
                      <LabelList dataKey="AdoptedSameDay" position="center" fill="white" fontSize={16} fontWeight="bold" formatter={renderLabel} />
                    </Bar>
                    <Bar dataKey="AdoptedWithin7Days" stackId="a" fill="#ff7f0e" name="Adopté sous 1 à 7 jours">
                      <LabelList dataKey="AdoptedWithin7Days" position="center" fill="white" fontSize={16} fontWeight="bold" formatter={renderLabel} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Graphique 2 : Stérilisation */}
          <div className="w-full mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Stérilisation des {sterilizationAnimal === 'dog' ? 'Chiens 🐶' : 'Chats 🐱'}
            </h2>
            <div className="mb-6 flex space-x-6">
              <h3 className="text-xl font-semibold text-gray-800 mr-4">Filtrer les graphiques :</h3>
              <button
                className={`px-4 py-2 rounded-lg font-medium ${sterilizationAnimal === 'dog' ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setSterilizationAnimal('dog')}
              >
                🐶 Chiens
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium ${sterilizationAnimal === 'cat' ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setSterilizationAnimal('cat')}
              >
                🐱 Chats
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Nombre Total d'Animaux Stérilisés par Sexe
                </h3>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showNonSterilized}
                      onChange={() => setShowNonSterilized(!showNonSterilized)}
                      className="mr-2"
                    />
                    Afficher les animaux non stérilisés
                  </label>
                </div>
                <Plot
                  data={[
                    {
                      x: sterilizationData.map((d) => d.Gender),
                      y: sterilizationData.map((d) => d.Sterilized_Yes),
                      type: 'bar',
                      name: 'Stérilisé - Oui (1)',
                      marker: { color: '#2ca02c' },
                    },
                    ...(showNonSterilized
                      ? [{
                          x: sterilizationData.map((d) => d.Gender),
                          y: sterilizationData.map((d) => d.Sterilized_No),
                          type: 'bar',
                          name: 'Stérilisé - Non (2)',
                          marker: { color: '#d62728' },
                        }]
                      : []),
                  ]}
                  layout={{
                    width: 500,
                    height: 400,
                    xaxis: { title: 'Sexe' },
                    yaxis: { title: 'Nombre d’animaux' },
                    barmode: 'group',
                    showlegend: true,
                    margin: { t: 20 },
                  }}
                  config={{
                    displayModeBar: true,
                    displaylogo: false,
                  }}
                />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Pourcentage d'Animaux Stérilisés par Âge et Sexe
                </h3>
                <div className="mb-4 flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showMalesSterilization}
                      onChange={() => setShowMalesSterilization(!showMalesSterilization)}
                      className="mr-2"
                    />
                    Afficher les mâles
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showFemalesSterilization}
                      onChange={() => setShowFemalesSterilization(!showFemalesSterilization)}
                      className="mr-2"
                    />
                    Afficher les femelles
                  </label>
                </div>
                <Plot
                  data={[
                    ...(showMalesSterilization
                      ? [{
                          x: sterilizationPercentData.map((d) => d.Age),
                          y: sterilizationPercentData.map((d) => d.Male_Sterilization_Percent),
                          type: 'scatter',
                          mode: 'lines+markers',
                          name: 'Sexe - Mâle (1)',
                          line: { color: '#1f77b4' },
                          marker: { size: 8 },
                        }]
                      : []),
                    ...(showFemalesSterilization
                      ? [{
                          x: sterilizationPercentData.map((d) => d.Age),
                          y: sterilizationPercentData.map((d) => d.Female_Sterilization_Percent),
                          type: 'scatter',
                          mode: 'lines+markers',
                          name: 'Sexe - Femelle (2)',
                          line: { color: '#ff7f0e' },
                          marker: { size: 8 },
                        }]
                      : []),
                  ]}
                  layout={{
                    width: 500,
                    height: 400,
                    xaxis: { title: 'Âge' },
                    yaxis: { title: 'Pourcentage de stérilisation (%)', range: [0, 100] },
                    showlegend: true,
                    margin: { t: 20 },
                  }}
                  config={{
                    displayModeBar: true,
                    displaylogo: false,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Texte d'analyse inséré après le 2e graphique */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Analyse de la stérilisation des animaux selon le sexe et l'âge</h3>
            <p className="text-gray-600 mb-4">
              Les graphiques présentent des données sur la stérilisation des animaux (chiens et chats), différenciées selon le sexe et l'âge. L'objectif est de comprendre les tendances générales de stérilisation et d'identifier d'éventuelles différences entre les groupes.
            </p>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">1. Stérilisation chez les chiens</h4>
            <h5 className="text-md font-semibold text-gray-700 mb-1">Distribution générale</h5>
            <p className="text-gray-600 mb-2">
              Le premier graphique montre le nombre total d'animaux stérilisés ou non, selon le sexe.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>On observe une prédominance des animaux non stérilisés (barres rouges) par rapport aux animaux stérilisés (barres vertes).</li>
              <li>Les femelles semblent plus nombreuses que les mâles, et le groupe mixte est minoritaire.</li>
            </ul>
            <h5 className="text-md font-semibold text-gray-700 mb-1">Tendance selon l'âge</h5>
            <p className="text-gray-600 mb-2">
              Le deuxième graphique illustre le pourcentage de stérilisation par âge et par sexe.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>On constate une augmentation du taux de stérilisation avec l'âge : les jeunes sont rarement stérilisés, alors que le taux augmente de manière significative chez les adultes et les seniors.</li>
              <li>La tendance est plus marquée chez les femelles que chez les mâles, ce qui pourrait refléter une plus forte incitation à la stérilisation des femelles pour éviter les portées non désirées.</li>
            </ul>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">2. Stérilisation chez les chats</h4>
            <h5 className="text-md font-semibold text-gray-700 mb-1">Distribution générale</h5>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Comme chez les chiens, les animaux non stérilisés sont plus nombreux que ceux stérilisés.</li>
              <li>La différence entre mâles et femelles est moins marquée que chez les chiens, ce qui pourrait indiquer une approche plus équilibrée en matière de stérilisation chez les chats.</li>
            </ul>
            <h5 className="text-md font-semibold text-gray-700 mb-1">Tendance selon l'âge</h5>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Le pourcentage de stérilisation augmente avec l'âge, suivant une tendance similaire à celle observée chez les chiens.</li>
              <li>Contrairement aux chiens, l'écart entre mâles et femelles est plus réduit chez les chats seniors, suggérant une politique de stérilisation plus uniforme entre les sexes.</li>
            </ul>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Comparaison entre chiens et chats</h4>
            <h5 className="text-md font-semibold text-gray-700 mb-1">Fréquence de stérilisation</h5>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Les chats semblent globalement plus souvent stérilisés que les chiens, ce qui pourrait s'expliquer par la forte reproduction des chats errants et la nécessité de contrôle des populations.</li>
              <li>Chez les chiens, la décision de stérilisation semble plus influencée par le sexe, avec une priorité donnée aux femelles.</li>
            </ul>
            <h5 className="text-md font-semibold text-gray-700 mb-1">Évolution avec l'âge</h5>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Dans les deux cas, les jeunes sont rarement stérilisés, mais le taux augmente chez les adultes et les seniors.</li>
              <li>L'augmentation est plus progressive chez les chiens, alors que chez les chats, le taux atteint rapidement un niveau élevé dès l'âge adulte.</li>
            </ul>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Interprétation et recommandations</h4>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Ces données révèlent que la stérilisation est souvent réalisée tardivement, notamment chez les chiens. Une sensibilisation à une stérilisation plus précoce pourrait être bénéfique pour limiter la reproduction incontrôlée.</li>
              <li>La différence de taux entre les sexes indique que la stérilisation des femelles est plus prioritaire. Or, pour un contrôle efficace des populations, la stérilisation des mâles est tout aussi importante.</li>
              <li>Chez les chats, l'équilibre entre mâles et femelles indique une meilleure prise de conscience de l'importance de la stérilisation pour tous les individus.</li>
            </ul>
            <p className="text-gray-600">
              En conclusion, ces graphiques mettent en lumière des tendances et des écarts qui pourraient être optimisés par des campagnes de sensibilisation et des politiques de stérilisation adaptées à chaque espèce et à chaque groupe d'âge.
            </p>
          </div>

          {/* Graphique 3 : Vitesse d'adoption par âge */}
          <div className="w-full mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Vitesse d'Adoption en Fonction de l'Âge des {adoptionSpeedTitle}
            </h2>
            <div className="mb-6 flex flex-col space-y-4">
              <div className="flex space-x-6">
                <h3 className="text-xl font-semibold text-gray-800 mr-4">Filtrer par type :</h3>
                <button
                  className={`px-4 py-2 rounded-lg font-medium ${adoptionSpeedAnimal === 'dog' ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}
                  onClick={() => setAdoptionSpeedAnimal('dog')}
                >
                  🐶 Chiens
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium ${adoptionSpeedAnimal === 'cat' ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}
                  onClick={() => setAdoptionSpeedAnimal('cat')}
                >
                  🐱 Chats
                </button>
              </div>
              <div className="flex space-x-6">
                <h3 className="text-xl font-semibold text-gray-800 mr-4">Filtrer par sexe :</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showMalesAdoption}
                    onChange={() => setShowMalesAdoption(!showMalesAdoption)}
                    className="mr-2"
                  />
                  Mâles
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFemalesAdoption}
                    onChange={() => setShowFemalesAdoption(!showFemalesAdoption)}
                    className="mr-2"
                  />
                  Femelles
                </label>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Distribution de l'Âge par Vitesse d'Adoption et Sexe ({adoptionSpeedTitle})
              </h3>
              <Plot
                data={adoptionSpeedData
                  .filter((group) =>
                    (showMalesAdoption && group.Gender === 'Gender_1') ||
                    (showFemalesAdoption && group.Gender === 'Gender_2')
                  )
                  .map((group) => ({
                    y: group.Ages,
                    x: Array(group.Ages.length).fill(
                      `${adoptionSpeedLabels[group.AdoptionSpeed]} (${group.Gender === 'Gender_1' ? 'Mâle' : 'Femelle'})`
                    ),
                    type: 'box',
                    name: `${adoptionSpeedLabels[group.AdoptionSpeed]} (${group.Gender === 'Gender_1' ? 'Mâle' : 'Femelle'})`,
                    boxpoints: 'outliers',
                    jitter: 0.3,
                    marker: { color: group.Gender === 'Gender_1' ? '#1f77b4' : '#ff7f0e' },
                    width: 0.7,
                    boxmean: true,
                    whiskerwidth: 0.7,
                  }))}
                layout={{
                  width: 1500,
                  height: 800,
                  xaxis: {
                    title: 'Vitesse d\'adoption',
                    tickangle: -45,
                    automargin: true,
                  },
                  yaxis: {
                    title: 'Âge (mois)',
                    range: [0, 150],
                  },
                  boxmode: 'group',
                  showlegend: true,
                  margin: { t: 20, b: 150, l: 50, r: 50 },
                }}
                config={{
                  displayModeBar: true,
                  displaylogo: false,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;