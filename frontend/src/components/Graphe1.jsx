import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";

const Graphe1  = () => {
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
        <Title text="Facteurs Influents sur la Vitesse d'Adoption des Animaux : Chiens vs Chats" number={1} />
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
              "Vaccination : Contrairement aux chiens, la vaccination semble jouer un rôle clé dans l'adoption des chats. Les chats vaccinés ont tendance à être adoptés plus rapidement, ce qui pourrait refléter une perception des adoptants selon laquelle un chat vacciné est plus sécurisé sur le plan sanitaire.",
              "Taille à maturité : Contrairement aux chiens, la taille ne semble pas être un facteur déterminant dans l'adoption des chats, leur gabarit étant plus uniforme.",
            ]}
          />

          <Explication
            title="Analyse des Chats et Comparaison avec les Chiens"
            points={[
              "Facteurs de Santé : Les facteurs liés à la santé, tels que la vaccination, la vermifugation et l'état général de l'animal, semblent jouer un rôle déterminant dans la rapidité d'adoption, comme c'était le cas pour les chiens.",
              "État de santé et stérilisation : Les chats en bonne santé et non stérilisés sont adoptés plus rapidement. En revanche, ceux présentant des problèmes de santé ou étant déjà stérilisés ont un taux d'adoption nettement plus faible. Cela pourrait s'expliquer par une préférence pour les jeunes animaux ou par l'intention des adoptants de gérer eux-mêmes la stérilisation.",
              "Vaccination : Contrairement aux chiens, la vaccination semble jouer un rôle clé dans l'adoption des chats. Les chats vaccinés ont tendance à être adoptés plus rapidement, ce qui pourrait refléter une perception des adoptants selon laquelle un chat vacciné est plus sécurisé sur le plan sanitaire.",
              "Taille à maturité : Contrairement aux chiens, la taille ne semble pas être un facteur déterminant dans l'adoption des chats, leur gabarit étant plus uniforme.",
            ]}
          />

          <Conclusions
            conclusions={[
              " Les facteurs de santé et de soins préventifs influencent différemment chiens et chats. La vaccination est cruciale pour les chats mais secondaire pour les chiens, tandis que la taille compte surtout pour les chiens. La non-stérilisation accélère l'adoption dans les deux cas.",
            ]}
          />
        </div>
      </>
    </div>
  );
};

export default Graphe1 ;
