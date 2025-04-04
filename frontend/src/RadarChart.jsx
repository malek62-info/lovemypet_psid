import Plot from "react-plotly.js";
import { useEffect, useState } from "react";

export default function RadarInteractive() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/non_adoption_factors")
            .then((res) => res.json())
            .then(setData);
    }, []);

    if (!data) return <p className="text-center text-gray-500">Chargement du graphe...</p>;

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
        <div className="my-10 flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                Analyse interactive des facteurs de non-adoption
            </h2>

            {/* === Graphe === */}
            <Plot
                data={traces}
                layout={{
                    polar: {
                        radialaxis: {
                            visible: true,
                            range: [0, Math.max(...values) + 2],
                        },
                    },
                    showlegend: true,
                    legend: { orientation: "h", y: -0.3 },
                    height: 500,
                    margin: { t: 50 },
                }}
                config={{
                    responsive: true,
                }}
                style={{ width: "100%", maxWidth: "700px" }}
            />

            {/* === Interprétation === */}
            <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl text-justify leading-relaxed text-gray-800 mt-10">
                <p className="mb-4">
                    Ce graphique met en évidence les caractéristiques moyennes des animaux qui ne sont <strong>pas adoptés après 100 jours</strong>.
                    Il permet de dégager un profil type à partir de différentes variables comportementales, physiques et logistiques,
                    et d’identifier les éléments qui freinent l’adoption rapide.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600">Un profil marqué par l'âge et les frais</h4>
                <p>
                    Le facteur le plus significatif est l’âge : les animaux concernés ont en moyenne <strong>plus de 13 mois</strong>,
                    ce qui les classe dans une tranche d’âge moins attractive pour les adoptants. Cette préférence généralisée pour les jeunes animaux
                    rend leur adoption plus lente, voire improbable sans campagne de valorisation. De plus, ces animaux sont associés à des <strong>frais d’adoption non négligeables</strong> (21.32 en moyenne), ce qui peut constituer un obstacle financier ou symbolique.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600">Des critères neutres ou peu différenciants</h4>
                <p>
                    Les autres caractéristiques comme la <strong>taille à maturité</strong> (1.88) et la <strong>longueur du pelage</strong> (1.41)
                    montrent que ces animaux sont souvent de taille moyenne avec un pelage court, ce qui en soi n’est pas un facteur repoussoir.
                    Leurs <strong>états de santé sont généralement bons</strong> (1.05), ce qui indique que les freins à l’adoption
                    sont davantage liés à des perceptions qu’à des problèmes médicaux.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600">L'importance de la visibilité</h4>
                <p>
                    Le nombre moyen de photos par profil reste faible (3.32), ce qui peut limiter la capacité à générer un attachement chez
                    l’adoptant. Les photos sont pourtant un levier essentiel dans le processus d’adoption, en particulier en ligne.
                    Un effort sur la <strong>valorisation visuelle des profils</strong> est donc un axe d’amélioration majeur.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-2 text-indigo-600">Conclusion</h4>
                <p>
                    Le profil des animaux non adoptés après 100 jours est souvent celui d’un animal adulte, peu mis en avant visuellement,
                    et parfois soumis à des frais d’adoption. Bien que leur état de santé soit bon, ces éléments contribuent à ralentir le processus.
                    Pour améliorer le taux d’adoption, il est recommandé de <strong>mettre en avant les animaux plus âgés</strong> à travers
                    des campagnes dédiées, de <strong>réduire les frais</strong> ou les justifier, et de <strong>soigner la présentation des profils</strong> via des photos engageantes et des descriptions valorisantes.
                </p>
            </div>
        </div>
    );

}

