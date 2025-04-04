import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

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

    if (!data) return <p className="text-center">Chargement des données...</p>;

    const filtered = data.filter((d) => d.Type === animalType);
    const topBreeds = [...filtered]
        .sort((a, b) => b.Count - a.Count)
        .slice(0, 10);

    const plotData = topBreeds.map((breed, i) => ({
        x: [breed.BreedName],
        y: [breed.Count],
        type: "bar",
        name: breed.BreedName,
        marker: { color: COLORS[i % COLORS.length] },
        hovertemplate: "%{y} animaux stérilisés<br>Race : %{x}<extra></extra>",
    }));

    return (
        <div className="flex flex-col items-center my-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Top 10 races les plus stérilisées ({animalType === 1 ? "Chiens 🐶" : "Chats 🐱"})
            </h2>

            <div className="mb-6">
                <button
                    onClick={() => setAnimalType(1)}
                    className={`px-4 py-2 mr-2 rounded ${animalType === 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                    Chiens
                </button>
                <button
                    onClick={() => setAnimalType(2)}
                    className={`px-4 py-2 rounded ${animalType === 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                    Chats
                </button>
            </div>

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
                    plot_bgcolor: "#f9fafb",
                    paper_bgcolor: "#f9fafb",
                }}
                config={{ responsive: true }}
                style={{ width: "100%", maxWidth: "900px" }}
            />

            {/* Interprétation */}
            <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl text-justify leading-relaxed text-gray-800 mt-10">
                <p className="mb-4">
                    Ce graphique présente les <strong>10 races les plus fréquemment stérilisées</strong>, en fonction du type d’animal sélectionné : chien 🐶 ou chat 🐱.
                    Il permet d’identifier les races ciblées par les politiques de stérilisation, souvent en lien avec leur fréquence d’apparition en refuge ou chez les adoptants.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600">Chez les chiens 🐶</h4>
                <p>
                    Les races comme le <strong>Labrador Retriever (121)</strong>, le <strong>Golden Retriever (80)</strong>, ou encore le <strong>Poodle (73)</strong> sont les plus stérilisées.
                    Ces races sont très populaires, ce qui reflète leur fréquence en refuge, mais aussi la volonté de limiter leur reproduction non contrôlée.
                    Les <strong>races croisées (Mixed Breed)</strong> sont massivement représentées (plus de 4000 cas), illustrant une priorité donnée à la régulation
                    des populations non standardisées.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600">Chez les chats 🐱</h4>
                <p>
                    Les chats stérilisés sont principalement issus de races non pures comme les <strong>Domestic Short Hair (2658)</strong>,
                    les <strong>Medium Hair (925)</strong> ou les <strong>Long Hair (210)</strong>. Cela correspond à la réalité du terrain : la majorité des chats
                    en refuge sont des chats dits « de gouttière », et la stérilisation est l’un des outils les plus efficaces pour prévenir
                    la surpopulation féline.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600">Conclusion</h4>
                <p>
                    Ce graphique permet de mettre en lumière les races sur lesquelles se concentrent les efforts de stérilisation. Que ce soit
                    pour <strong>contrôler la reproduction des races les plus présentes</strong> ou <strong>réduire la surpopulation</strong>,
                    la stérilisation joue un rôle clé dans la gestion des adoptions et du bien-être animal.
                </p>
            </div>
        </div>
    );
}
