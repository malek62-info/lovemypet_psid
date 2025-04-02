import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
import Plot from 'react-plotly.js';

const App = () => {
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
    <div className="flex flex-col items-center p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Analyse des Animaux</h1>

      {loading ? (
        <p className="text-lg font-semibold text-gray-600">Chargement...</p>
      ) : (
        <>
          {/* Graphique 1 : Vitesse d'adoption par variable */}
          <div className="w-full mb-12">
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

            {/* Graphique */}
            <div className="w-full bg-white p-6 rounded-xl shadow-sm overflow-x-auto mb-8">
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
                    <Bar dataKey="AdoptedWithin1Month" stackId="a" fill="#2ca02c" name="Adopté en 8 à 30 jours">
                      <LabelList dataKey="AdoptedWithin1Month" position="center" fill="white" fontSize={16} fontWeight="bold" formatter={renderLabel} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Analyse détaillée */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">🔍 Analyse de la Vitesse d'Adoption</h2>
              
              {/* Section Chiens */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">🐶</span> Analyse des Chiens
                </h3>
                
                <h4 className="font-semibold text-gray-700 mb-3">📊 Distribution Générale</h4>
                <p className="text-gray-600 mb-4">
                  Le graphique présente la répartition des adoptions de chiens en fonction de plusieurs criteria : longueur de la fourrure, vaccination, vermifugation, stérilisation, état de santé, sexe et taille à maturité. Les adoptions sont classées en trois catégories :
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                  <li><span className="font-medium text-blue-600">Adopté le jour même</span> (barres bleues)</li>
                  <li><span className="font-medium text-orange-500">Adopté sous 1 à 7 jours</span> (barres oranges)</li>
                  <li><span className="font-medium text-green-600">Adopté en 8 à 30 jours</span> (barres vertes)</li>
                </ul>
                <p className="text-gray-600 mb-6">
                  Globalement, on constate que la majorité des chiens sont adoptés dans la première semaine suivant leur mise à l'adoption (barres oranges), tandis que les adoptions immédiates et celles prenant plus de 8 jours sont moins fréquentes.
                </p>

                <h4 className="font-semibold text-gray-700 mb-3">📌 Facteurs Influant sur la Vitesse d'Adoption</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-3">
                  <li><span className="font-medium">État de santé</span> : Les chiens en bonne santé sont adoptés plus rapidement, confirmant que les adoptants privilégient les animaux qui semblent en pleine forme.</li>
                  <li><span className="font-medium">Stérilisation</span> : Les chiens non stérilisés connaissent un taux d'adoption plus rapide. Cela pourrait s'expliquer par leur jeune âge ou par une préférence des adoptants pour des animaux reproductibles.</li>
                  <li><span className="font-medium">Vermifugation</span> : Les chiens vermifugés semblent être adoptés plus rapidement, ce qui peut refléter une préférence pour les animaux bénéficiant déjà de soins préventifs.</li>
                  <li><span className="font-medium">Taille à maturité</span> : Les chiens de taille moyenne sont adoptés plus rapidement que ceux de petite ou grande taille.</li>
                  <li><span className="font-medium">Vaccination</span> : Contrairement aux attentes, la vaccination ne semble pas avoir d'impact majeur sur la vitesse d'adoption, car la différence entre les chiens vaccinés et non vaccinés est minime.</li>
                </ul>
              </div>

              {/* Section Chats */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                  <span className="mr-2">🐱</span> Analyse des Chats
                </h3>
                
                <h4 className="font-semibold text-gray-700 mb-3">📊 Distribution Générale</h4>
                <p className="text-gray-600 mb-4">
                  Comme observé chez les chiens, la majorité des adoptions de chats ont lieu dans la première semaine suivant leur mise à l'adoption (barres oranges), suivies par les adoptions plus tardives (barres vertes) et celles effectuées le jour même (barres bleues).
                </p>
                <p className="text-gray-600 mb-6">
                  Les facteurs liés à la santé, tels que la vaccination, la vermifugation et l'état général de l'animal, semblent jouer un rôle déterminant dans la rapidité d'adoption, comme c'était le cas pour les chiens.
                </p>

                <h4 className="font-semibold text-gray-700 mb-3">📌 Facteurs Influant sur la Vitesse d'Adoption</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-3">
                  <li><span className="font-medium">État de santé et stérilisation</span> : Les chats en bonne santé et non stérilisés sont adoptés plus rapidement. En revanche, ceux présentant des problèmes de santé ou étant déjà stérilisés ont un taux d'adoption nettement plus faible. Cela pourrait s'expliquer par une préférence pour les jeunes animaux ou par l'intention des adoptants de gérer eux-mêmes la stérilisation.</li>
                  <li><span className="font-medium">Vaccination</span> : Contrairement aux chiens, la vaccination semble jouer un rôle clé dans l'adoption des chats. Les chats vaccinés ont tendance à être adoptés plus rapidement, ce qui pourrait refléter une perception des adoptants selon laquelle un chat vacciné est plus sécurisé sur le plan sanitaire.</li>
                  <li><span className="font-medium">Taille à maturité</span> : Contrairement aux chiens, la taille ne semble pas être un facteur déterminant dans l'adoption des chats, leur gabarit étant plus uniforme.</li>
                </ul>
              </div>

              {/* Comparaison */}
              <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🔄 Comparaison Chiens/Chats</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">1. Vitesse générale d'adoption</h4>
                    <p className="text-gray-600">
                      Chez les chiens comme les chats, la majorité des adoptions se font entre 1 et 7 jours après la mise à l'adoption. Les adoptions immédiates (jour même) et tardives (8 à 30 jours) sont moins fréquentes. Cela suggère que les adoptants prennent généralement quelques jours pour réfléchir avant de choisir un animal.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">2. Influence de l'état de santé</h4>
                    <p className="text-gray-600">
                      La bonne santé est un facteur clé pour les deux espèces : les chiens et chats en bonne forme physique sont adoptés plus rapidement. Cela confirme que les adoptants privilégient les animaux sans problèmes médicaux visibles.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">3. Impact de la stérilisation</h4>
                    <p className="text-gray-600">
                      Les chiens et chats non stérilisés sont adoptés plus vite que ceux qui le sont. Cela pourrait s'expliquer par deux raisons : les animaux non stérilisés sont souvent plus jeunes, et certains adoptants préfèrent gérer eux-mêmes la stérilisation. La différence est plus marquée chez les chats.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">4. Rôle de la vaccination</h4>
                    <p className="text-gray-600">
                      La vaccination a un impact différent selon l'espèce : cruciale pour les chats mais secondaire pour les chiens. Les adoptants perçoivent probablement les chats comme plus vulnérables aux maladies.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">5. Importance de la taille</h4>
                    <p className="text-gray-600">
                      Chez les chiens, la taille moyenne est privilégiée (contraintes d'espace), tandis que chez les chats, la taille n'a presque pas d'influence (gabarit uniforme).
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">6. Effet de la vermifugation</h4>
                    <p className="text-gray-600">
                      Dans les deux cas, les animaux vermifugés sont adoptés plus rapidement, ce qui indique que les adoptants valorisent les soins préventifs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h4 className="font-bold text-gray-800 mb-2">💡 Conclusion</h4>
                <p className="text-gray-700">
                  Les facteurs de santé et de soins préventifs influencent différemment chiens et chats. La vaccination est cruciale pour les chats mais secondaire pour les chiens, tandis que la taille compte surtout pour les chiens. La non-stérilisation accélère l'adoption dans les deux cas.
                </p>
              </div>
            </div>
          </div>

          {/* Graphique 2 : Stérilisation */}
          <div className="w-full mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Stérilisation des {sterilizationAnimal === 'dog' ? 'Chiens 🐶' : 'Chats 🐱'}
            </h2>
            
            {/* Boutons de filtre */}
            <div className="mb-8 flex space-x-6">
              <h3 className="text-xl font-semibold text-gray-800 mr-4">Filtrer les graphiques :</h3>
              <button
                className={`px-6 py-3 rounded-lg font-medium text-lg ${sterilizationAnimal === 'dog' ? "bg-blue-100 text-blue-800 border-2 border-blue-300" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setSterilizationAnimal('dog')}
              >
                🐶 Chiens
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium text-lg ${sterilizationAnimal === 'cat' ? "bg-orange-100 text-orange-800 border-2 border-orange-300" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setSterilizationAnimal('cat')}
              >
                🐱 Chats
              </button>
            </div>

            {/* Grille des graphiques */}
            <div className="grid grid-cols-1 gap-8">
              {/* Graphique 1 - Nombre total */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Nombre Total d'Animaux Stérilisés par Sexe
                </h3>
                <div className="mb-6">
                  <label className="flex items-center text-lg">
                    <input
                      type="checkbox"
                      checked={showNonSterilized}
                      onChange={() => setShowNonSterilized(!showNonSterilized)}
                      className="mr-3 h-5 w-5"
                    />
                    Afficher les animaux non stérilisés
                  </label>
                </div>
                <div className="w-full h-[500px]">
                  <Plot
                    data={[
                      {
                        x: sterilizationData.map((d) => d.Gender),
                        y: sterilizationData.map((d) => d.Sterilized_Yes),
                        type: 'bar',
                        name: 'Stérilisé - Oui (1)',
                        marker: { color: '#4CAF50' },
                        width: 0.6
                      },
                      ...(showNonSterilized
                        ? [{
                            x: sterilizationData.map((d) => d.Gender),
                            y: sterilizationData.map((d) => d.Sterilized_No),
                            type: 'bar',
                            name: 'Stérilisé - Non (2)',
                            marker: { color: '#F44336' },
                            width: 0.6
                          }]
                        : []),
                    ]}
                    layout={{
                      height: 500,
                      xaxis: { 
                        title: { text: 'Sexe', font: { size: 16 } },
                        tickfont: { size: 14 }
                      },
                      yaxis: { 
                        title: { text: "Nombre d'animaux", font: { size: 16 } },
                        tickfont: { size: 14 }
                      },
                      barmode: 'group',
                      legend: {
                        font: { size: 14 },
                        orientation: 'h',
                        y: 1.1
                      },
                      margin: { l: 80, r: 50, t: 30, b: 80 },
                      plot_bgcolor: '#f8fafc',
                      paper_bgcolor: '#ffffff'
                    }}
                    config={{
                      responsive: true,
                      displayModeBar: true,
                      displaylogo: false
                    }}
                  />
                </div>
              </div>

              {/* Graphique 2 - Pourcentage par âge */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Pourcentage d'Animaux Stérilisés par Âge et Sexe
                </h3>
                <div className="mb-6 flex space-x-8">
                  <label className="flex items-center text-lg">
                    <input
                      type="checkbox"
                      checked={showMalesSterilization}
                      onChange={() => setShowMalesSterilization(!showMalesSterilization)}
                      className="mr-3 h-5 w-5"
                    />
                    Afficher les mâles
                  </label>
                  <label className="flex items-center text-lg">
                    <input
                      type="checkbox"
                      checked={showFemalesSterilization}
                      onChange={() => setShowFemalesSterilization(!showFemalesSterilization)}
                      className="mr-3 h-5 w-5"
                    />
                    Afficher les femelles
                  </label>
                </div>
                <div className="w-full h-[500px]">
                  <Plot
                    data={[
                      ...(showMalesSterilization
                        ? [{
                            x: sterilizationPercentData.map((d) => d.Age),
                            y: sterilizationPercentData.map((d) => d.Male_Sterilization_Percent),
                            type: 'scatter',
                            mode: 'lines+markers',
                            name: 'Sexe - Mâle (1)',
                            line: { color: '#2196F3', width: 3 },
                            marker: { size: 10, color: '#2196F3' },
                          }]
                        : []),
                      ...(showFemalesSterilization
                        ? [{
                            x: sterilizationPercentData.map((d) => d.Age),
                            y: sterilizationPercentData.map((d) => d.Female_Sterilization_Percent),
                            type: 'scatter',
                            mode: 'lines+markers',
                            name: 'Sexe - Femelle (2)',
                            line: { color: '#FF9800', width: 3 },
                            marker: { size: 10, color: '#FF9800' },
                          }]
                        : []),
                    ]}
                    layout={{
                      height: 500,
                      xaxis: { 
                        title: { text: 'Âge', font: { size: 16 } },
                        tickfont: { size: 14 }
                      },
                      yaxis: { 
                        title: { text: 'Pourcentage de stérilisation (%)', font: { size: 16 } },
                        tickfont: { size: 14 },
                        range: [0, 100]
                      },
                      legend: {
                        font: { size: 14 },
                        orientation: 'h',
                        y: 1.1
                      },
                      margin: { l: 80, r: 50, t: 30, b: 80 },
                      plot_bgcolor: '#f8fafc',
                      paper_bgcolor: '#ffffff',
                      hovermode: 'closest'
                    }}
                    config={{
                      responsive: true,
                      displayModeBar: true,
                      displaylogo: false
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Analyse de la stérilisation */}
            <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
                Analyse de la stérilisation des animaux selon le sexe et l'âge
              </h3>
              
              <div className="space-y-8">
                {/* Introduction */}
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Les graphiques présentent des données sur la stérilisation des animaux (chiens et chats), 
                    différenciées selon le sexe et l'âge. L'objectif est de comprendre les tendances générales 
                    de stérilisation et d'identifier d'éventuelles différences entre les groupes.
                  </p>
                </div>

                {/* Section Chiens */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-blue-800 mb-4">1. Stérilisation chez les chiens</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-lg font-medium text-blue-700 mb-2">Distribution générale</h5>
                      <p className="text-gray-700 mb-3">
                        Le premier graphique montre le nombre total d'animaux stérilisés ou non, selon le sexe.
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                        <li className="leading-relaxed">
                          <span className="font-medium">Prédominance des non-stérilisés :</span> Les animaux non stérilisés 
                          (barres rouges) sont plus nombreux que les stérilisés (barres vertes).
                        </li>
                        <li className="leading-relaxed">
                          <span className="font-medium">Répartition par sexe :</span> Les femelles semblent plus nombreuses 
                          que les mâles, et le groupe mixte est minoritaire.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-lg font-medium text-blue-700 mb-2">Tendance selon l'âge</h5>
                      <p className="text-gray-700 mb-3">
                        Le deuxième graphique illustre le pourcentage de stérilisation par âge et par sexe.
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                        <li className="leading-relaxed">
                          <span className="font-medium">Corrélation avec l'âge :</span> Le taux de stérilisation augmente 
                          significativement avec l'âge (jeunes rarement stérilisés vs adultes/seniors).
                        </li>
                        <li className="leading-relaxed">
                          <span className="font-medium">Différence entre sexes :</span> La tendance est plus marquée chez 
                          les femelles, reflétant une plus forte incitation à leur stérilisation.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section Chats */}
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-orange-800 mb-4">2. Stérilisation chez les chats</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-lg font-medium text-orange-700 mb-2">Distribution générale</h5>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                        <li className="leading-relaxed">
                          <span className="font-medium">Prédominance des non-stérilisés :</span> Comme chez les chiens, 
                          les non-stérilisés sont majoritaires.
                        </li>
                        <li className="leading-relaxed">
                          <span className="font-medium">Équilibre entre sexes :</span> La différence est moins marquée 
                          que chez les chiens, suggérant une approche plus équilibrée.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-lg font-medium text-orange-700 mb-2">Tendance selon l'âge</h5>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                        <li className="leading-relaxed">
                          <span className="font-medium">Progression avec l'âge :</span> Augmentation similaire à celle 
                          observée chez les chiens, mais taux plus élevé chez les adultes.
                        </li>
                        <li className="leading-relaxed">
                          <span className="font-medium">Écart réduit :</span> Chez les seniors, la différence entre 
                          mâles et femelles est moins prononcée que chez les chiens.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section Comparaison */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-purple-800 mb-4">Comparaison entre chiens et chats</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-lg font-medium text-purple-700 mb-2">Fréquence de stérilisation</h5>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                        <li className="leading-relaxed">
                          <span className="font-medium">Chats plus stérilisés :</span> Probablement dû à la nécessité 
                          de contrôler les populations de chats errants.
                        </li>
                        <li className="leading-relaxed">
                          <span className="font-medium">Priorité aux femelles canines :</span> La stérilisation des 
                          chiennes semble plus ciblée que celle des mâles.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-lg font-medium text-purple-700 mb-2">Évolution avec l'âge</h5>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                        <li className="leading-relaxed">
                          <span className="font-medium">Jeunes rarement stérilisés :</span> Constat commun aux deux espèces.
                        </li>
                        <li className="leading-relaxed">
                          <span className="font-medium">Progression différente :</span> Plus graduelle chez les chiens, 
                          alors que les chats atteignent rapidement un taux élevé.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommandations */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-green-800 mb-4">Interprétation et recommandations</h4>
                  <ul className="list-disc list-inside space-y-3 text-gray-700 pl-4">
                    <li className="leading-relaxed">
                      <span className="font-medium">Stérilisation précoce :</span> Sensibiliser à une intervention 
                      plus précoce, surtout chez les chiens, pour limiter la reproduction incontrôlée.
                    </li>
                    <li className="leading-relaxed">
                      <span className="font-medium">Équilibre entre sexes :</span> Promouvoir la stérilisation des 
                      mâles canins pour un contrôle plus efficace des populations.
                    </li>
                    <li className="leading-relaxed">
                      <span className="font-medium">Modèle félin :</span> S'inspirer de l'approche équilibrée observée 
                      chez les chats pour les chiens.
                    </li>
                  </ul>
                </div>

                {/* Conclusion */}
                <div className="mt-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Ces analyses mettent en lumière des tendances et des écarts qui pourraient être optimisés par 
                    des campagnes de sensibilisation et des politiques de stérilisation adaptées à chaque espèce 
                    et groupe d'âge.
                  </p>
                </div>
              </div>
            </div>
          </div>

      {/* Nouveau Graphique 3 : Top 10 races pures vs mixtes */}
<div className="w-full mb-12">
  <h2 className="text-3xl font-bold text-gray-800 mb-8">
    Top 10 Races Pures et Mixtes les Plus Rapides à Être Adoptées ({topBreedsAnimal === 'dog' ? 'Chiens 🐶' : 'Chats 🐱'})
  </h2>
  <div className="mb-8 flex space-x-6">
    <h3 className="text-xl font-semibold text-gray-800 mr-4">Filtrer le graphique :</h3>
    <button
      className={`px-6 py-3 rounded-lg font-medium text-lg ${topBreedsAnimal === 'dog' ? "bg-blue-100 text-blue-800 border-2 border-blue-300" : "bg-gray-100 text-gray-600"}`}
      onClick={() => setTopBreedsAnimal('dog')}
    >
      🐶 Chiens
    </button>
    <button
      className={`px-6 py-3 rounded-lg font-medium text-lg ${topBreedsAnimal === 'cat' ? "bg-orange-100 text-orange-800 border-2 border-orange-300" : "bg-gray-100 text-gray-600"}`}
      onClick={() => setTopBreedsAnimal('cat')}
    >
      🐱 Chats
    </button>
  </div>
  <div className="bg-white p-8 rounded-xl shadow-lg">
    <div className="w-full h-[600px]">
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
          height: 600,
          xaxis: {
            title: { text: 'Races (Pure/Mixte)', font: { size: 16 } },
            tickfont: { size: 12 },
            tickangle: -45,
          },
          yaxis: {
            title: { text: 'Vitesse d’adoption moyenne (0-4)', font: { size: 16 } },
            tickfont: { size: 14 },
            range: [0, 4],
          },
          margin: { l: 80, r: 50, t: 50, b: 150 },
          plot_bgcolor: '#f8fafc',
          paper_bgcolor: '#ffffff',
          barmode: 'group',
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: true, displaylogo: false }}
      />
    </div>
  </div>

  {/* Analyse intégrée */}
  <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">🔍 Analyse des Top Races par Vitesse d'Adoption</h2>
    
    <div className="space-y-8">
      {/* Introduction */}
      <div>
        <p className="text-lg text-gray-700 leading-relaxed">
          Les graphiques présentent les 10 races pures (barres vertes) et les 10 races mixtes (barres rouges) de chiens et de chats adoptées le plus rapidement, basées sur la vitesse d’adoption moyenne (0 = adopté le jour même, 4 = non adopté après 100 jours). L’objectif est de comprendre les préférences des adoptants et d’identifier les différences entre chiens et chats.
        </p>
      </div>

      {/* Section Chiens */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-xl font-semibold text-blue-800 mb-4">1. Vitesse d’adoption chez les chiens</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-lg font-medium text-blue-700 mb-2">Distribution générale</h5>
            <p className="text-gray-700 mb-3">
              Le premier graphique montre les 10 races pures et mixtes de chiens adoptées le plus rapidement.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li className="leading-relaxed">
                <span className="font-medium">Races pures dominantes :</span> Le Basset Hound (1.60) est le plus rapide, suivi du Border Collie (1.69) et du Pug (1.71).
              </li>
              <li className="leading-relaxed">
                <span className="font-medium">Races mixtes compétitives :</span> Le Maltese mixte (1.30) est le plus rapide de tous, suivi du Cocker Spaniel mixte (1.50).
              </li>
              <li className="leading-relaxed">
                <span className="font-medium">Écart Pure vs Mixte :</span> Certaines races comme le Cocker Spaniel sont adoptées plus vite sous forme mixte (1.50) que pure (1.88).
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-medium text-blue-700 mb-2">Tendance générale</h5>
            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li className="leading-relaxed">
                <span className="font-medium">Préférence pour certaines races pures :</span> Les races pures comme le Basset Hound et le Border Collie sont très prisées.
              </li>
              <li className="leading-relaxed">
                <span className="font-medium">Attrait des mixtes :</span> Le Maltese mixte (1.30) montre une forte demande pour les croisements de petite taille.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section Chats */}
      <div className="bg-orange-50 p-6 rounded-lg">
        <h4 className="text-xl font-semibold text-orange-800 mb-4">2. Vitesse d’adoption chez les chats</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-lg font-medium text-orange-700 mb-2">Distribution générale</h5>
            <p className="text-gray-700 mb-3">
              Le deuxième graphique montre les 10 races pures et mixtes de chats adoptées le plus rapidement.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li className="leading-relaxed">
                <span className="font-medium">Races mixtes en tête :</span> Le Ragdoll mixte (1.70) et le Maine Coon mixte (1.75) sont les plus rapides.
              </li>
              <li className="leading-relaxed">
                <span className="font-medium">Races pures compétitives :</span> Le Domestic Long Hair (1.70) est la race pure la plus rapide, suivi du Russian Blue (1.91).
              </li>
              <li className="leading-relaxed">
                <span className="font-medium">Écart Pure vs Mixte :</span> Des races comme le Maine Coon (1.75 mixte vs 2.00 pure) et le Siamese (1.91 mixte vs 2.12 pure) sont adoptées plus vite sous forme mixte.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-medium text-orange-700 mb-2">Tendance générale</h5>
            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li className="leading-relaxed">
                <span className="font-medium">Popularité des mixtes :</span> Les croisements comme le Ragdoll et le Maine Coon dominent, reflétant une préférence pour les mixtes.
              </li>
              <li className="leading-relaxed">
                <span className="font-medium">Races pures attractives :</span> Le Domestic Long Hair et le Russian Blue attirent, mais les mixtes sont souvent plus rapides.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section Comparaison */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="text-xl font-semibold text-purple-800 mb-4">Comparaison entre chiens et chats</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-lg font-medium text-purple-700 mb-2">Préférences pour la pureté</h5>
            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li className="leading-relaxed">
                <span className="font-medium">Chiens :</span> Les races pures comme le Basset Hound (1.60) sont souvent plus rapides que les mixtes, sauf pour le Maltese (1.30).
              </li>
              <li className="leading-relaxed">
                <span className="font-medium">Chats :</span> Les races mixtes (ex. : Ragdoll à 1.70) rivalisent avec les pures, montrant une moindre importance de la pureté.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-medium text-purple-700 mb-2">Popularité des races</h5>
            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
              <li className="leading-relaxed">
                <span className="font-medium">Chiens :</span> Les races pures (Border Collie, Pug) et certains mixtes (Maltese) dominent, reflétant des préférences marquées.
              </li>
              <li className="leading-relaxed">
                <span className="font-medium">Chats :</span> Les mixtes (Ragdoll, Maine Coon) sont plus populaires, les adoptants étant moins attachés à la pureté.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="text-xl font-semibold text-green-800 mb-4">Interprétation et recommandations</h4>
        <ul className="list-disc list-inside space-y-3 text-gray-700 pl-4">
          <li className="leading-relaxed">
            <span className="font-medium">Mise en avant des races populaires :</span> Promouvoir les races pures comme le Basset Hound pour les chiens et les mixtes comme le Ragdoll pour les chats.
          </li>
          <li className="leading-relaxed">
            <span className="font-medium">Sensibilisation aux races moins populaires :</span> Encourager l’adoption de races comme le Silky Terrier (chiens, 2.34) et le Bengal (chats, 2.34).
          </li>
          <li className="leading-relaxed">
            <span className="font-medium">Focus sur les mixtes pour les chats :</span> Les refuges peuvent mettre en avant les croisements de races prisées pour accélérer les adoptions.
          </li>
        </ul>
      </div>

      {/* Conclusion */}
      <div className="mt-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          Ces analyses montrent des préférences distinctes entre chiens et chats, qui peuvent guider les refuges dans leurs stratégies d’adoption.
        </p>
      </div>
    </div>
  </div>
</div>  
        </>
      )}
    </div>
  );
};

export default App;