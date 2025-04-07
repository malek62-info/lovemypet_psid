import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";

const Anna10 = () => {
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
        <Title text="Top 10 Races Pures et Mixtes les Plus Rapides à Être Adoptées " number={7} />

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
            texte="   Les graphiques présentent les 10 races pures et les 10 races mixtes
             de chiens et de chats adoptées le plus rapidement, basées sur la vitesse d’adoption moyenne 
             . L’objectif est de comprendre les préférences des adoptants et d’identifier les différences entre chiens et chats."

          />


          <Explication
            title="Vitesse d'adoption chez les chiens"
            points={[
              "Le premier graphique montre les 10 races pures et mixtes de chiens adoptés le plus rapidement.",
              "races pures dominantes : Le Basset Hound  est le plus rapide",
              "races mixtes compétitives : Le collie mixte  est le plus rapide de tous, suivi du maltese mixte .",
              "Écart Pure vs Mixte : Certaines races comme le Cocker Spaniel sont adoptées plus vite sous forme mixte que pure.",
              "Préférence pour certaines races pures : Les races pures comme le Basset Hound ",
              "Attrait des mixtes : Le Maltais mixte  montre une forte demande pour les croisements de petite taille."
            ]}
          />

          <Explication
            title="Vitesse d'adoption chez les chats"
            points={[
              "Le deuxième graphique montre les 10 races pures et mixtes de chats adoptés le plus rapidement.",
              "Races mixtes en tête : Le burmese Ragdoll mixte  et le Maine Coon mixte sont les plus rapides.",
              "Races pures compétitives : Le Domestic Long Hair  est la race pure la plus rapide, suivi du Russian Blue.",
              "Écart Pure vs Mixte : Des races comme le Maine Coon  et le Siamese sont adoptées plus vite sous forme mixte.",
            ]}
          />


          <Conclusions
            conclusions={[
              "Chez les chiens, les races pures sont généralement adoptées plus rapidement, avec le Basset Hound en tête.",
              "Certaines races mixtes, comme le Collie mixte, restent très compétitives.",
              "Chez les chats, les races mixtes sont privilégiées, notamment le Burmese Ragdoll mixte et le Maine Coon mixte.",
              "Cela montre une préférence pour les races pures chez les chiens, souvent liées à des critères physiques précis.",
              "Chez les chats, les adoptants semblent apprécier davantage la variété et le caractère unique des races mixtes."
            ]}
          />
        </div>
      </>
    </div>
  );
};

export default Anna10;
