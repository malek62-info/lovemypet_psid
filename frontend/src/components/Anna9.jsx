import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Conclusions from "./Conclusions";
import Title from "./Title";
import Explication from "./Explications";
import Contexte from "./Contexte";


const Anna9 = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/non_adoption_factors")
            .then((res) => res.json())
            .then(setData);
    }, []);

    if (!data)
        return <p className="text-center text-gray-500">Chargement du graphe...</p>;

    const labels = Object.keys(data);
    const values = Object.values(data);

    const traces = labels.map((label, i) => ({
        type: "scatterpolar",
        r: [values[i]],
        theta: [label],
        name: label,
        mode: "markers+lines",
        marker: { size: 8 },
        line: { shape: "spline", width: 3 },
        fill: "none",
    }));

    return (
        <div className="w-full">
            <Title
                text="Analyse interactive des facteurs de non-adoption"
                number={6}
            />

            <Plot
                data={traces}
                layout={{
                    polar: {
                        radialaxis: {
                            visible: true,
                            range: [0, Math.max(...values) + 2],
                            tickfont: { size: 14 },
                        },
                    },
                    showlegend: true,
                    legend: { orientation: "h", y: -0.3, font: { size: 14 } },
                    height: 500,
                    margin: { t: 50 },
                    hovermode: "closest",
                }}
                config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                }}
                style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}
            />

            <Contexte texte="Ce graphique met en lumière les caractéristiques typiques des animaux qui restent sans adoption après plus de 100 jours. Il permet d’identifier les variables clés qui influencent négativement l’adoption." />

            <Explication
                title="Profil type des animaux non adoptés"
                points={[
                    "Âgés en moyenne de 13,7 mois, ces animaux ne sont plus perçus comme des bébés, ce qui réduit leur attractivité face aux jeunes chiots ou chatons.",
                    "Des frais d’adoption supérieurs à 21€ peuvent freiner les potentiels adoptants, notamment lorsqu’ils comparent avec d'autres animaux gratuits ou moins coûteux.",
                    "Malgré un bon état de santé (note moyenne de 1.05 sur 2), la santé ne semble pas être un critère différenciateur majeur dans l’adoption rapide.",
                ]}
            />

            <Explication
                title="Facteurs liés à la visibilité et à la perception"
                points={[
                    "Un pelage plutôt court (1.41) et une taille moyenne (1.88) suggèrent un physique jugé neutre ou banal, sans élément particulièrement attractif pour les visiteurs.",
                    "Le nombre moyen de photos est faible (3.32), ce qui réduit l’engagement émotionnel des visiteurs en ligne. La présentation visuelle est un levier clé encore sous-exploité.",
                    "L’aspect affectif et l’attrait esthétique sont essentiels : les données suggèrent que ces animaux manquent d’éléments différenciateurs ou de 'coup de cœur' visuel.",
                ]}
            />

            <Conclusions
                conclusions={[
                    "Les animaux non adoptés ne souffrent pas nécessairement de problèmes de santé ou de comportement, mais plutôt d’un manque de visibilité et d’attraits perçus.",
                    "Agir sur la communication visuelle (photos qualitatives, vidéos), ainsi que sur les frais d’adoption ou les campagnes ciblées pour les animaux plus âgés, peut considérablement améliorer leur taux d’adoption.",
                    "Ce type de profil met en lumière la nécessité d'une stratégie proactive en refuge, où l'expérience utilisateur en ligne joue un rôle central dans la prise de décision."
                ]}
            />

        </div>
    );
};

export default Anna9;
