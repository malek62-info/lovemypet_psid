import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";

const Anna4 = () => {
  const [data, setData] = useState([]);
  const [sizeFilter, setSizeFilter] = useState("all");
  const [feeRange, setFeeRange] = useState([0, 800]);

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
      <Title
        text="Analyse de la vitesse d'adoption par genre et par Taille"
        number={3}
      />

      {/* 🎛 Filtres interactifs */}
      <div className="flex p-5">
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
              range: [
                0,
                Math.max(
                  ...Object.values(maleCounts),
                  ...Object.values(femaleCounts)
                ),
              ],
            },
          },
        }}
        style={{ width: "100%", height: "600px" }}
      />

      <Contexte texte="Le graphique présente une visualisation en radar de la répartition des adoptions en fonction de la vitesse d'adoption et de la taille de l'animal. Il est dynamique et permet de filtrer par taille d'animaux." />

      <Explication
        title="Analyse des tendances d'adoption en fonction de la taille des animaux"
        points={[
          "Les femelles sont généralement adoptées en plus grand nombre que les mâles pour toutes les tailles, sauf pour les animaux de grande taille où les mâles sont plus adoptés et dominent également parmi les non-adoptés. Pour les très grandes tailles, bien que les adoptions soient initialement égales, les mâles surpassent ensuite les femelles.",
          "Les tendances montrent que la taille de l'animal peut influencer la rapidité et la fréquence d'adoption, notamment dans les premiers jours.",
        ]}
      />

      <Explication
        title="Hypothèses"
        points={[
          "La différence de taux d'adoption entre femelles et mâles pourrait être liée à des préférences des adoptants basées sur la taille ou le comportement attendu des animaux.",
          "Les grandes tailles semblent être favorisées pour les mâles, ce qui pourrait refléter un rôle perçu de protection ou d’utilité des chiens plus grands.",
        ]}
      />

      <Conclusions
        conclusions={[
          "Les femelles sont majoritairement adoptées pour les petites et moyennes tailles, tandis que les mâles dominent pour les grandes tailles après les premiers jours.",
          "Les stratégies d'adoption pourraient être optimisées en tenant compte de ces tendances, comme des campagnes ciblées en fonction de la taille et du sexe des animaux.",
        ]}
      />
    </div>
  );
};

export default Anna4;
