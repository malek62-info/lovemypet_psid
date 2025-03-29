import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const AdoptionSpeedChart = () => {
  const [data, setData] = useState([]);
  const [sizeFilter, setSizeFilter] = useState("all");
  const [feeRange, setFeeRange] = useState([0, 500]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/adoption-speed-gender")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  // 🎯 Appliquer les filtres côté Frontend
  const filteredData = data.filter((item) => {
    return (
      (sizeFilter === "all" || item.MaturitySize === parseInt(sizeFilter)) &&
      item.Fee >= feeRange[0] &&
      item.Fee <= feeRange[1]
    );
  });
  console.log(filteredData);
  console.log(data);

  // 🏗️ Regrouper par Adoption Speed
  const adoptionSpeeds = [
    "Le jour même",
    "1-7 jours",
    "8-30 jours",
    "31-90 jours",
    "Non adopté",
  ];
  const maleCounts = {};
  const femaleCounts = {};

  adoptionSpeeds.forEach((speed) => {
    maleCounts[speed] = 0;
    femaleCounts[speed] = 0;
  });

  filteredData.forEach((item) => {
    if (item.Gender === "Mâle") {
      maleCounts[item.AdoptionSpeed] += 1;
    } else if (item.Gender === "Femelle") {
      femaleCounts[item.AdoptionSpeed] += 1;
    }
  });

  return (
    <div>
      <h1 className="text-xl font-semibold my-4">
        <span className="badge badge-xl  badge-soft badge-primary">
          Analyse de la vitesse d'adoption par genre et par catégorie de frais
        </span>
      </h1>
      {/* 🎛 Filtres interactifs */}
      <div className="flex justify-between p-5">
        <div>
          <input
            className="range range-primary"
            type="range"
            min="0"
            max="500"
            step="10"
            value={feeRange[1]}
            onChange={(e) => setFeeRange([0, parseInt(e.target.value)])}
          />
          <span className="badge mt-2">Frais max : {feeRange[1]}€</span>
        </div>

        <select
          className="select"
          onChange={(e) => setSizeFilter(e.target.value)}
        >
          <option value="all">Toutes tailles</option>
          <option value="1">Petit</option>
          <option value="2">Moyenne</option>
          <option value="3">Grand</option>
          <option value="4">Très grand</option>
        </select>
      </div>

      {/* 📊 Graphique */}
      {/* <Plot
        data={[
          {
            x: adoptionSpeeds,
            y: Object.values(maleCounts),
            type: "bar",
            name: "Mâle",
            marker: { color: "blue" },
          },
          {
            x: adoptionSpeeds,
            y: Object.values(femaleCounts),
            type: "bar",
            name: "Femelle",
            marker: { color: "red" },
          },
        ]}
        layout={{
          title: "Vitesse d'adoption par genre",
          xaxis: { title: "Vitesse d'adoption" },
          yaxis: { title: "Nombre" },
          barmode: "group", // Mode "groupé" pour comparer Homme vs Femme
        }}
        style={{ width: "100%", height: "500px" }}
      /> */}

{/* <Plot
   data={[
     {
       x: adoptionSpeeds,
       y: Object.values(maleCounts),
       fill: "tozeroy",
       type: "scatter",
       name: "Mâle",
       line: { color: "blue" },
     },
     {
       x: adoptionSpeeds,
       y: Object.values(femaleCounts),
       fill: "tozeroy",
       type: "scatter",
       name: "Femelle",
       line: { color: "red" },
     },
   ]}
   layout={{
     title: "Vitesse d'adoption par genre (Aire)",
     xaxis: { title: "Vitesse d'adoption" },
     yaxis: { title: "Nombre" },
   }}
   style={{ width: "100%", height: "500px" }}
/>

 */}

 
<Plot
   data={[
     {
       type: "scatterpolar",
       r: Object.values(maleCounts),
       theta: adoptionSpeeds,
       fill: "toself",
       name: "Mâle",
       line: { color: "blue" },
     },
     {
       type: "scatterpolar",
       r: Object.values(femaleCounts),
       theta: adoptionSpeeds,
       fill: "toself",
       name: "Femelle",
       line: { color: "red" },
     },
   ]}
   layout={{
     title: "Vitesse d'adoption par genre (Radar)",
     polar: {
       radialaxis: {
         visible: true,
         range: [0, Math.max(...Object.values(maleCounts), ...Object.values(femaleCounts))],
       },
     },
   }}
   style={{ width: "100%", height: "500px" }}
/>




      <h1 className="text-lg font-semibold my-4">
        <span className="badge badge-xl badge-outline badge-primary">
          Analyse des tendances d'adoption en fonction des frais et de la taille
          des animaux
        </span>
      </h1>
      <ul className="list-disc ml-5">
        <li className="my-2">
          Les frais d'adoption compris entre 0 et 500 euros montrent une faible
          adoption le premier jour (176 femelles, 141 mâles). Cependant, entre
          le 2ᵉ et le 90ᵉ jour, les adoptions augmentent significativement (au
          moins 1 667 femelles et 1 107 mâles adoptés).
        </li>
        <li className="my-2">
          Les femelles sont généralement adoptées en plus grand nombre que les
          mâles pour toutes les tailles, sauf pour les animaux de grande taille
          où les mâles sont plus adoptés et dominent également parmi les
          non-adoptés. Pour les très grandes tailles, bien que les adoptions
          soient initialement égales, les mâles surpassent ensuite les femelles.
        </li>
        <li className="my-2">
          Les frais d'adoption n'ont pas d'impact significatif sur la rapidité
          des adoptions, bien qu'une légère baisse soit observée lorsque les
          frais augmentent.
        </li>
      </ul>

      <h1 className="text-lg font-semibold my-4">
        <span className="badge badge-xl badge-outline badge-primary">
          Hypothèses
        </span>
      </h1>
      <ul className="list-disc ml-5">
        <li className="my-2">
          La différence de taux d'adoption entre femelles et mâles pourrait être
          liée à des préférences des adoptants basées sur la taille ou le
          comportement attendu des animaux.
        </li>
        <li className="my-2">
          La légère diminution des adoptions lors de l'augmentation des frais
          pourrait indiquer une sensibilité au coût, mais cet effet reste
          limité.
        </li>
        <li className="my-2">
          Les grandes tailles semblent être favorisées pour les mâles, ce qui
          pourrait refléter un rôle perçu de protection ou d’utilité des chiens
          plus grands.
        </li>
      </ul>

      <h1 className="text-lg font-semibold my-4">
        <span className="badge badge-xl badge-outline badge-primary">
          Conclusions
        </span>
      </h1>
      <ul className="list-disc ml-5">
        <li className="my-2">
          Les femelles sont majoritairement adoptées pour les petites et
          moyennes tailles, tandis que les mâles dominent pour les grandes
          tailles après les premiers jours.
        </li>
        <li className="my-2">
          Bien que les frais aient peu d'impact sur la rapidité des adoptions,
          des politiques de frais modérés peuvent encourager davantage
          d'adoptions.
        </li>
        <li className="my-2">
          Les stratégies d'adoption pourraient être optimisées en tenant compte
          de ces tendances, comme des campagnes ciblées en fonction de la taille
          et du sexe des animaux.
        </li>
      </ul>
    </div>
  );
};

export default AdoptionSpeedChart;
