import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

const App = () => {
  const [stackedData, setStackedData] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchStackedBarData = async (animal) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/stacked-bar/${animal}`);
      const result = await response.json();
      if (result.stacked_data) {
        // Mapping des catégories pour inclure les significations
        const categoryMapping = {
          // Taille à maturité
          "MaturitySize_1": "Taille à maturité - Petite (1)",
          "MaturitySize_2": "Taille à maturité - Moyenne (2)",
          "MaturitySize_3": "Taille à maturité - Grande (3)",
          // Âge (catégorisé comme Jeune, Adulte, Senior)
          "Jeune": "Âge - Jeune",
          "Adulte": "Âge - Adulte",
          "Senior": "Âge - Senior",
          // Sexe
          "Gender_1": "Sexe - Mâle (1)",
          "Gender_2": "Sexe - Femelle (2)",
          "Gender_3": "Sexe - Mixte (3)",
          // Longueur de la fourrure
          "FurLength_1": "Longueur de la fourrure - Court (1)",
          "FurLength_2": "Longueur de la fourrure - Moyen (2)",
          "FurLength_3": "Longueur de la fourrure - Long (3)",
          // Vacciné
          "Vaccinated_1": "Vacciné - Oui (1)",
          "Vaccinated_2": "Vacciné - Non (2)",
          // Vermifugé
          "Dewormed_1": "Vermifugé - Oui (1)",
          "Dewormed_2": "Vermifugé - Non (2)",
          // Stérilisé
          "Sterilized_1": "Stérilisé - Oui (1)",
          "Sterilized_2": "Stérilisé - Non (2)",
          // Santé
          "Health_1": "Santé - En bonne santé (1)",
          "Health_2": "Santé - Blessure mineure (2)",
          // Vitesse d'adoption
          "Adopté jour même": "Vitesse d'adoption - Adopté jour même",
          "1-7 jours": "Vitesse d'adoption - 1 à 7 jours",
        };

        // Transformer les données pour renommer les clés et les étiquettes des catégories
        const filteredData = result.stacked_data.map((entry) => {
          return {
            ...entry,
            category: categoryMapping[entry.category] || entry.category, // Renomme la catégorie avec sa signification
            AdoptedSameDay: entry.speed_0,  // Renommé de "speed_0" à "AdoptedSameDay"
            AdoptedWithin7Days: entry.speed_1,  // Renommé de "speed_1" à "AdoptedWithin7Days"
          };
        });
        setStackedData(filteredData);
      }
    } catch (error) {
      console.error("Erreur API Stacked Bar :", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStackedBarData(selectedAnimal);
  }, [selectedAnimal]);

  // Function to render labels
  const renderLabel = (value) => {
    return value;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Analyse des Animaux</h1>

      <div className="mb-6 flex space-x-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium ${selectedAnimal === 1 ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}
          onClick={() => setSelectedAnimal(1)}
        >
          🐶 Chien
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${selectedAnimal === 2 ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}
          onClick={() => setSelectedAnimal(2)}
        >
          🐱 Chat
        </button>
      </div>

      {loading ? (
        <p className="text-lg font-semibold text-gray-600">Chargement...</p>
      ) : (
        <div className="w-full bg-white p-6 rounded-xl shadow-sm overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Nombre d'Animaux Adoptés par Variable et Catégorie
          </h2>
          <div style={{ width: `${stackedData.length * 50}px`, minWidth: "100%", maxWidth: "1200px" }}>
            <ResponsiveContainer height={900}>
              <BarChart data={stackedData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                <CartesianGrid stroke="#d1d5db" strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />

                {/* Barres avec labels */}
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
      )}
    </div>
  );
};

export default App;