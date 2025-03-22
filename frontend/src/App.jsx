import { useEffect, useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip
} from "recharts";

const App = () => {
  const [radarData, setRadarData] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(1); // 1 = Chien, 2 = Chat
  const [loading, setLoading] = useState(false);

  // Fetch pour le RadarChart
  const fetchRadarData = async (animal) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/data/${animal}`);
      const result = await response.json();
      if (result.data) {
        const formattedData = result.data.map((item) => ({
          attribute: item.attribute,
          value: item.value * 50,  // Multiplier les valeurs par 10
        }));
        setRadarData(formattedData);
      }
    } catch (error) {
      console.error("Erreur API Radar :", error);
    }
    setLoading(false);
  };

  // Charger les données au démarrage et à chaque changement
  useEffect(() => {
    fetchRadarData(selectedAnimal);
  }, [selectedAnimal]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Analyse des animaux
      </h1>

      {/* Boutons pour Chien & Chat */}
      <div className="mb-6 flex space-x-4">
        <button
          className={`px-6 py-2 rounded-lg font-medium shadow-md transition-all duration-300 ${
            selectedAnimal === 1 ? "bg-blue-600 text-white scale-105" : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setSelectedAnimal(1)}
        >
          🐶 Chien
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-medium shadow-md transition-all duration-300 ${
            selectedAnimal === 2 ? "bg-blue-600 text-white scale-105" : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setSelectedAnimal(2)}
        >
          🐱 Chat
        </button>
      </div>

      {/* Affichage du chargement ou des graphiques */}
      {loading ? (
        <p className="text-lg font-semibold text-gray-600">Chargement...</p>
      ) : (
        <div className="flex flex-col space-y-10">
          {/* Premier graphique : RadarChart */}
          {radarData.length > 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Caractéristiques générales</h2>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" width={500} height={400} data={radarData}>
                <PolarGrid stroke="#ddd" />
                <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 14, fill: "#4A5568" }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} /> {/* Domaine de l'axe radiale ajusté pour les nouvelles valeurs */}

                {/* Affichage des données dans le Radar */}
                <Radar
                  name="Facteurs"
                  dataKey="value"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.6}
                />

                <Tooltip content={({ payload }) => {
                  if (payload && payload.length) {
                    const { name, value } = payload[0];
                    return (
                      <div>
                        <p><strong>{name}</strong></p>
                        <p>{`Corrélation: ${value.toFixed(2)}`}</p> {/* Affichage avec 2 décimales */}
                      </div>
                    );
                  }
                  return null;
                }} />
              </RadarChart>
            </div>
          ) : (
            <p className="text-lg text-red-600">Aucune donnée disponible</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
