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
  const [loading, setLoading] = useState(false);
  const [showNonSterilized, setShowNonSterilized] = useState(true);
  const [showMales, setShowMales] = useState(true);
  const [showFemales, setShowFemales] = useState(true);
  const [view, setView] = useState('dog');
  const [sterilizationAnimal, setSterilizationAnimal] = useState('dog');

  // Fonctions fetch inchangées (pour brièveté, elles restent identiques)
  const fetchStackedBarData = async (animal, setData) => { /* ... */ };
  const fetchSterilizationData = async (animal, setData) => { /* ... */ };
  const fetchSterilizationPercentData = async (animal, setData) => { /* ... */ };

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
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const renderLabel = (value) => value;

  const stackedData = view === 'dog' ? stackedDataDog : stackedDataCat;
  const sterilizationData = sterilizationAnimal === 'dog' ? sterilizationDataDog : sterilizationDataCat;
  const sterilizationPercentData = sterilizationAnimal === 'dog' ? sterilizationPercentDataDog : sterilizationPercentDataCat;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Analyse des Animaux</h1>

        {/* Section des filtres pour le Graphique 1 */}
        <div className="mb-8 flex justify-center items-center gap-4">
          <span className="text-lg font-medium text-gray-700">Vitesse d'adoption :</span>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${view === 'dog' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setView('dog')}
          >
            Chiens
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${view === 'cat' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setView('cat')}
          >
            Chats
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Chargement des données...</p>
        ) : (
          <>
            {/* Graphique 1 : Vitesse d'adoption */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Vitesse d'Adoption - {view === 'dog' ? 'Chiens' : 'Chats'}
              </h2>
              <div style={{ width: `${stackedData.length * 50}px`, minWidth: "100%", maxWidth: "1200px", margin: "0 auto" }}>
                <ResponsiveContainer height={600}>
                  <BarChart data={stackedData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="AdoptedSameDay" stackId="a" fill="#1f77b4" name="Adopté le jour même">
                      <LabelList dataKey="AdoptedSameDay" position="center" fill="white" fontSize={14} fontWeight="bold" formatter={renderLabel} />
                    </Bar>
                    <Bar dataKey="AdoptedWithin7Days" stackId="a" fill="#ff7f0e" name="Adopté sous 1 à 7 jours">
                      <LabelList dataKey="AdoptedWithin7Days" position="center" fill="white" fontSize={14} fontWeight="bold" formatter={renderLabel} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section des Graphiques 2 et 3 avec les boutons sur le côté droit */}
            <div className="relative">
              {/* Boutons de filtrage pour les Graphiques 2 et 3 (positionnés à droite) */}
              <div className="absolute right-0 top-0 flex flex-col gap-3">
                <span className="text-lg font-medium text-gray-700 mb-2">Stérilisation :</span>
                <button
                  className={`px-4 py-2 rounded-md font-medium transition-colors w-32 text-left ${sterilizationAnimal === 'dog' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setSterilizationAnimal('dog')}
                >
                  Chiens
                </button>
                <button
                  className={`px-4 py-2 rounded-md font-medium transition-colors w-32 text-left ${sterilizationAnimal === 'cat' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setSterilizationAnimal('cat')}
                >
                  Chats
                </button>
              </div>

              {/* Graphiques 2 et 3 côte à côte */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pr-40"> {/* pr-40 pour laisser de l'espace à droite pour les boutons */}
                {/* Graphique 2 : Nombre total d'animaux stérilisés par sexe */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Nombre Total d'Animaux Stérilisés par Sexe
                  </h3>
                  <div className="mb-4 flex justify-center">
                    <label className="flex items-center text-gray-700">
                      <input
                        type="checkbox"
                        checked={showNonSterilized}
                        onChange={() => setShowNonSterilized(!showNonSterilized)}
                        className="mr-2 h-4 w-4"
                      />
                      Afficher les non-stérilisés
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <Plot
                      data={[
                        {
                          x: sterilizationData.map((d) => d.Gender),
                          y: sterilizationData.map((d) => d.Sterilized_Yes),
                          type: 'bar',
                          name: 'Stérilisé - Oui',
                          marker: { color: '#2ca02c' },
                        },
                        ...(showNonSterilized
                          ? [{
                              x: sterilizationData.map((d) => d.Gender),
                              y: sterilizationData.map((d) => d.Sterilized_No),
                              type: 'bar',
                              name: 'Stérilisé - Non',
                              marker: { color: '#d62728' },
                            }]
                          : []),
                      ]}
                      layout={{
                        width: 450,
                        height: 400,
                        xaxis: { title: 'Sexe' },
                        yaxis: { title: 'Nombre d’animaux' },
                        barmode: 'group',
                        showlegend: true,
                        margin: { t: 20 },
                      }}
                      config={{ displayModeBar: false }}
                    />
                  </div>
                </div>

                {/* Graphique 3 : Pourcentage de stérilisation par âge */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Pourcentage de Stérilisation par Âge et Sexe
                  </h3>
                  <div className="mb-4 flex justify-center gap-6">
                    <label className="flex items-center text-gray-700">
                      <input
                        type="checkbox"
                        checked={showMales}
                        onChange={() => setShowMales(!showMales)}
                        className="mr-2 h-4 w-4"
                      />
                      Mâles
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="checkbox"
                        checked={showFemales}
                        onChange={() => setShowFemales(!showFemales)}
                        className="mr-2 h-4 w-4"
                      />
                      Femelles
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <Plot
                      data={[
                        ...(showMales
                          ? [{
                              x: sterilizationPercentData.map((d) => d.Age),
                              y: sterilizationPercentData.map((d) => d.Male_Sterilization_Percent),
                              type: 'scatter',
                              mode: 'lines+markers',
                              name: 'Mâles',
                              line: { color: '#1f77b4' },
                              marker: { size: 8 },
                            }]
                          : []),
                        ...(showFemales
                          ? [{
                              x: sterilizationPercentData.map((d) => d.Age),
                              y: sterilizationPercentData.map((d) => d.Female_Sterilization_Percent),
                              type: 'scatter',
                              mode: 'lines+markers',
                              name: 'Femelles',
                              line: { color: '#ff7f0e' },
                              marker: { size: 8 },
                            }]
                          : []),
                      ]}
                      layout={{
                        width: 450,
                        height: 400,
                        xaxis: { title: 'Âge' },
                        yaxis: { title: 'Pourcentage (%)', range: [0, 100] },
                        showlegend: true,
                        margin: { t: 20 },
                      }}
                      config={{ displayModeBar: false }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;