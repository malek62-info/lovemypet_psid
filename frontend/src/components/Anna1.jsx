import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";

const Anna1 = () => {
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
  const [topBreedsDataDog, setTopBreedsDataDog] = useState([]);
  const [topBreedsDataCat, setTopBreedsDataCat] = useState([]);
  const [topBreedsAnimal, setTopBreedsAnimal] = useState('dog');

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
          "MaturitySize_1": "Taille à maturité - Petite",
          "MaturitySize_2": "Taille à maturité - Moyenne",
          "MaturitySize_3": "Taille à maturité - Grande",
          "Vaccinated_1": "Vacciné - Oui",
          "Vaccinated_2": "Vacciné - Non",
          "Dewormed_1": "Vermifugé - Oui",
          "Dewormed_2": "Vermifugé - Non",
          "Sterilized_1": "Stérilisé - Oui",
          "Sterilized_2": "Stérilisé - Non",
          "Health_1": "Santé - En bonne santé",
          "Health_2": "Santé - Blessure mineure",
        };
        const filteredData = result.stacked_data
          .filter((entry) => !entry.category.startsWith("FurLength") && !entry.category.startsWith("Gender"))
          .map((entry) => ({
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
        setData(result.data);
      }
    } catch (error) {
      console.error("Erreur API Sterilization Percent Data :", error);
    }
  };

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
        fetchTopBreedsData(1, setTopBreedsDataDog),
        fetchTopBreedsData(2, setTopBreedsDataCat),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const stackedData = view === 'dog' ? stackedDataDog : stackedDataCat;

  return (
    <div className="">
      <Title text="Facteurs Influents sur la Vitesse d'Adoption des Animaux : Chiens vs Chats" number={1} />

      <div className="w-full mb-12">
        <div className="flex justify-end space-x-2">
          <button className="btn" onClick={() => setView("dog")}>🐶 Chiens</button>
          <button className="btn" onClick={() => setView("cat")}>🐱 Chats</button>
        </div>

        <Plot
          data={[
            {
              x: stackedData.map((d) => d.category),
              y: stackedData.map((d) => d.AdoptedSameDay),
              type: "bar",
              name: "Adopté le jour même",
              marker: { color: "#1f77b4" },
              hoverinfo: 'x+y+text',
            },
            {
              x: stackedData.map((d) => d.category),
              y: stackedData.map((d) => d.AdoptedWithin7Days),
              type: "bar",
              name: "Adopté sous 1 à 7 jours",
              marker: { color: "#ff7f0e" },
              hoverinfo: 'x+y+text',
            },
            {
              x: stackedData.map((d) => d.category),
              y: stackedData.map((d) => d.AdoptedWithin1Month),
              type: "bar",
              name: "Adopté en 8 à 30 jours",
              marker: { color: "#2ca02c" },
              hoverinfo: 'x+y+text',
            },
          ]}
          layout={{
            barmode: 'stack',
            showlegend: true,
            margin: { b: 190 },
            title: "Répartition des adoptions selon le délai",
            xaxis: {
              title: "Catégories",
              tickvals: stackedData.map((d) => d.category),
              ticktext: stackedData.map((d) => d.category),
            },
            yaxis: { title: "Nombre d'adoptions" },
            annotations: []
          }}
          style={{ width: "100%", height: "600px", marginBottom: "30px" }}
        />

        <Contexte
          texte="Le graphique présente la répartition des adoptions en fonction de plusieurs critères : vaccination, vermifugation, stérilisation, état de santé et taille à maturité. Les adoptions sont classées en trois catégories."
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
          texte="De manière générale, on observe que la majorité des chiens sont adoptés soit dans la première semaine, soit après plus de 8 jours suivant leur mise à l'adoption. En revanche, les adoptions le même jour sont moins fréquentes."
        />

        <Explication
          title="Facteurs Influant sur la Vitesse d'Adoption (Chiens)"
          points={[
            "État de santé : Les chiens en bonne santé sont adoptés plus rapidement.",
            "Stérilisation : Les chiens non stérilisés connaissent un taux d'adoption plus rapide.",
            "Vermifugation : Les chiens vermifugés semblent être adoptés plus rapidement.",
            "Taille à maturité : Les chiens de taille moyenne sont adoptés plus rapidement.",
            "Vaccination : La vaccination ne semble pas avoir d'impact majeur.",
          ]}
        />

        <Contexte
          texte="Comme observé chez les chiens, les chats sont adoptés soit dans la première semaine, soit après plus de 8 jours suivant leur mise à l'adoption. Les adoptions le jour même sont plus rares."
        />

        <Explication
          title="Facteurs Influant sur l'Adoption (Chats)"
          points={[
            "Santé générale : Les chats en bonne santé sont adoptés plus rapidement.",
            "Stérilisation : Les chats non stérilisés sont adoptés plus rapidement.",
            "Vaccination : La vaccination joue un rôle important chez les chats.",
          ]}
        />

        <Explication
          title="Analyse des Chats et Comparaison avec les Chiens"
          points={[
            "Facteurs de santé : Déterminants pour la rapidité d'adoption.",
            "Stérilisation : Moins stérilisé = adoption plus rapide.",
            "Vaccination : Cruciale pour les chats, secondaire pour les chiens.",
          ]}
        />

        <Conclusions
          conclusions={[
            "Les soins de santé influencent différemment l'adoption chez les chiens et les chats. La non-stérilisation accélère l’adoption pour les deux espèces. La vaccination est clé pour les chats, tandis que la taille joue un rôle chez les chiens."
          ]}
        />
      </div>
    </div>
  );
};

export default Anna1;
