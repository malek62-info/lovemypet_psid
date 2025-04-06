import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Title from "./components/Title";
import Contexte from "./components/Contexte";
import Explication from "./components/Explications";
import Conclusions from "./components/Conclusions";

const COLORS = [
    "#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA",
    "#F472B6", "#4ADE80", "#FCD34D", "#38BDF8", "#FCA5A5"
];

export default function TopSterilizedBreedsChart() {
    const [data, setData] = useState(null);
    const [animalType, setAnimalType] = useState(1); // 1 = chien, 2 = chat

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/top_sterilized_breeds")
            .then((res) => res.json())
            .then(setData);
    }, []);

    if (!data) return <p className="text-center text-gray-500">Chargement des données...</p>;

    const filtered = data.filter((d) => d.Type === animalType);
    const topBreeds = [...filtered].sort((a, b) => b.Count - a.Count).slice(0, 10);

    const plotData = topBreeds.map((breed, i) => ({
        x: [breed.BreedName],
        y: [breed.Count],
        type: "bar",
        name: breed.BreedName,
        marker: { color: COLORS[i % COLORS.length] },
        hovertemplate: "%{y} animaux stérilisés<br>Race : %{x}<extra></extra>",
    }));

    return (
        <div className="w-full">
            <Title
                text={`Top 10 Races les Plus Stérilisées (${animalType === 1 ? "Chiens 🐶" : "Chats 🐱"})`}
                number={7}
            />

            <div className="flex justify-end mb-4">
                <button
                    className={`btn ${animalType === 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setAnimalType(1)}
                >
                    🐶 Chiens
                </button>
                <button
                    className={`btn ml-2 ${animalType === 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setAnimalType(2)}
                >
                    🐱 Chats
                </button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
                <Plot
                    data={plotData}
                    layout={{
                        barmode: "group",
                        xaxis: {
                            title: "Race",
                            tickangle: -45,
                            tickfont: { size: 12 },
                        },
                        yaxis: {
                            title: "Nombre d'animaux stérilisés",
                            tickfont: { size: 12 },
                        },
                        legend: { orientation: "h", y: -0.3 },
                        height: 500,
                        margin: { t: 40, b: 100, l: 60, r: 30 },
                        font: { family: "Inter, sans-serif" },
                        plot_bgcolor: "#ffffff",
                        paper_bgcolor: "#ffffff",
                    }}
                    config={{ responsive: true, displayModeBar: true, displaylogo: false }}
                    style={{ width: "100%" }}
                />
            </div>

            <Contexte texte="Ce graphique présente les races les plus fréquemment stérilisées parmi les chiens et les chats. Il met en évidence les tendances de stérilisation selon les races les plus présentes en refuge." />
            <Explication
                title="Tendances de stérilisation chez les chiens et les chats"
                points={[
                    "Chez les chiens, les races les plus stérilisées sont majoritairement populaires et répandues dans les refuges, comme le Labrador Retriever (121), le Golden Retriever (80), le Poodle (73), et le Shih Tzu (78).",
                    "Le Mixed Breed, catégorie qui regroupe les chiens de race mixte, est largement dominant avec plus de 4000 animaux stérilisés, ce qui reflète l’abondance de ces profils dans les structures d’accueil.",
                    "Du côté des chats, la tendance est similaire. Les trois races de gouttière — Domestic Short Hair (2658), Domestic Medium Hair (925), et Domestic Long Hair (210) — forment l’écrasante majorité des individus stérilisés.",
                    "Les races de chats plus spécifiques comme le Siamese (184), le Persian (151) ou le Tabby (234) figurent aussi parmi les plus stérilisées, montrant une prise en charge proactive même pour les races reconnaissables.",
                    "La stérilisation est pratiquée sur des volumes très élevés, ce qui confirme qu’elle est une stratégie prioritaire des refuges pour limiter les naissances non contrôlées."
                ]}
            />


            <Conclusions
                conclusions={[
                    "La stérilisation concerne en majorité les races les plus représentées dans les refuges, qu’il s’agisse de chiens ou de chats. Cela inclut à la fois des races très populaires (Labrador, Shih Tzu, Siamese…) et surtout des animaux de races mixtes.",
                    "Les chiffres révèlent une priorité claire donnée à la stérilisation des animaux de gouttière, qu’il s’agisse de chiens croisés ou de chats de type 'domestic'.",
                    "Ces pratiques permettent de limiter efficacement la surpopulation, en ciblant les profils les plus nombreux et potentiellement les plus reproducteurs.",
                    "L’analyse montre que la stérilisation est un levier opérationnel stratégique dans les politiques de gestion des refuges, notamment en anticipation des adoptions ou pour réduire les abandons futurs."
                ]}
            />

        </div>
    );
}
