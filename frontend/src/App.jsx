import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

function App() {
  const [data, setData] = useState(null); // Utilisation de null comme valeur initiale

  useEffect(() => {
    // Appel de l'API pour récupérer les données
    fetch('http://localhost:8000/')  // L'URL de ton API FastAPI
      .then(response => response.json())
      .then(data => setData(data))  // Assigner les données au state
      .catch(error => console.log(error));
  }, []); 

  // Vérifier si les données sont chargées
  if (!data) {
    return <div>Loading...</div>;
  }

  // Première partie : graphique de la vitesse d'adoption par groupe de photos
  const adoptionSpeeds = ['0', '1', '2', '3', '4']; // Vitesses d'adoption : 0, 1, 2, 3, 4
  const photoGroups = Object.keys(data);  // Groupes de photos : "0-5", "6-10", etc.

  // Récupérer les données d'adoption pour chaque tranche de photos
  const adoptionSpeedData = adoptionSpeeds.map(speed => 
    photoGroups.map(group => data[group][speed])  // Récupérer les valeurs de chaque vitesse d'adoption pour chaque groupe de photos
  );

  // Tracer les données pour la vitesse d'adoption
  const traces = photoGroups.map((group, groupIndex) => ({
    x: adoptionSpeeds,  // Vitesses d'adoption sur l'axe X
    y: adoptionSpeedData.map(data => data[groupIndex]),  // Récupérer les valeurs d'adoption pour ce groupe de photos
    type: 'bar',
    name: group,  // Afficher les tranches de photos dans la légende
  }));

  const layout = {
    barmode: 'stack',  // Empiler les barres
    title: {
      text: 'Vitesse d\'adoption des animaux par groupe de photos',
      font: {
        size: 20,  // Taille du titre
        family: 'Arial, sans-serif',  // Police du titre
        color: '#000000',
      },
    },
    xaxis: {
      title: {
        text: 'Vitesse d\'adoption',
        font: {
          size: 16,
          family: 'Arial, sans-serif',
          color: '#000000',
        },
      },
      tickmode: 'array',
      tickvals: adoptionSpeeds,  // Définir les vitesses d'adoption
      ticktext: [
        'le jour même',
        'dans la première semaine',
        'dans le premier mois',
        'entre 31 et 90 jours',
        'Pas d\'adoption après 90 jours'
      ], // Texte personnalisé pour chaque vitesse d'adoption
    },
    yaxis: {
      title: {
        text: 'Nombre d\'animaux',
        font: {
          size: 16,
          family: 'Arial, sans-serif',
          color: '#000000',
        },
      },
    },
    margin: {
      t: 50,  // Marge en haut pour le titre
      b: 100,  // Marge en bas pour les labels X
      l: 50,  // Marge à gauche pour les labels Y
      r: 50,  // Marge à droite
    },
  };

  // Deuxième graphique : Nombre total d'adoptions par tranche de photos
  const adoptionCounts = photoGroups.map(group => 
    adoptionSpeeds.reduce((acc, speed) => acc + data[group][speed], 0)
  );

  const adoptionCountTrace = {
    x: photoGroups,
    y: adoptionCounts,
    type: 'bar',
    name: 'Total des adoptions par groupe de photos',
  };

  const adoptionCountLayout = {
    barmode: 'stack',
    title: {
      text: 'Nombre total d\'adoptions par groupe de photos',
      font: {
        size: 20,
        family: 'Arial, sans-serif',
        color: '#000000',
      },
    },
    xaxis: {
      title: {
        text: 'Groupe de photos',
        font: {
          size: 16,
          family: 'Arial, sans-serif',
          color: '#000000',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Nombre total d\'adoptions',
        font: {
          size: 16,
          family: 'Arial, sans-serif',
          color: '#000000',
        },
      },
    },
    margin: {
      t: 50,
      b: 100,
      l: 50,
      r: 50,
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Vitesse d'adoption des animaux par groupe de photos</h1>
  
      {/* Premier graphique : vitesse d'adoption */}
      <Plot
        data={traces}  // Passer les données préparées à Plotly
        layout={layout}
        style={{ width: '100%', height: '500px' }}
        config={{
          displayModeBar: false,
          responsive: true,
        }}
      />
  
      {/* Explication détaillée du premier graphique */}
     <div className="mt-4">
  <h2 className="text-lg font-semibold">Interprétation du premier graphique</h2>
  <p>
    Ce graphique représente la vitesse d'adoption des animaux en fonction du nombre de photos affichées.<br />
    Au total, il y a eu <strong>14 974 adoptions</strong> réalisées.<br />
    Il montre combien d'animaux ont été adoptés dans différentes vitesses d'adoption pour chaque groupe de photos.<br />
    <ul>
      <li><strong>Les vitesses d'adoption</strong> sont divisées en cinq catégories :<br />
        <ul>
          <li>"le jour même"</li>
          <li>"dans la première semaine"</li>
          <li>"dans le premier mois"</li>
          <li>"entre 31 et 90 jours"</li>
          <li>"pas d'adoption après 90 jours"</li>
        </ul>
      </li>
      <li><strong>Le groupe de photos</strong> est divisé en intervalles : "0-5", "6-10", "11-20", "21-30".</li>
    </ul>
  </p>
  <p>
    En observant les résultats, on peut constater que les groupes avec un plus grand nombre de photos (comme le groupe "0-5") montrent une adoption plus rapide.<br />
    Par exemple, dans le groupe "0-5 photos", <strong>45%</strong> des animaux sont adoptés le jour même, soit <strong>{(14974 * 0.45).toFixed(0)}</strong> animaux, contre seulement <strong>25%</strong> dans le groupe "6-10 photos", soit <strong>{(14974 * 0.25).toFixed(0)}</strong> animaux.<br />
    Cela suggère qu'une plus grande quantité de photos augmente les chances d'adoption immédiate ou dans les premiers jours.<br />
  </p>
  <p>
    De plus, dans le groupe "11-15 photos", la majorité des adoptions se produisent dans la première semaine (<strong>35%</strong>), soit <strong>{(14974 * 0.35).toFixed(0)}</strong> animaux, mais le taux d'adoption le jour même est réduit à <strong>18%</strong>, soit <strong>{(14974 * 0.18).toFixed(0)}</strong> animaux.<br />
    Cela peut indiquer que les animaux avec plus de photos attirent plus de candidats, mais ces derniers prennent plus de temps pour se décider.<br />
  </p>
  <p>
    Au contraire, dans les groupes "21-30 photos", le taux d'adoption immédiate tombe à <strong>15%</strong>, soit <strong>{(14974 * 0.15).toFixed(0)}</strong> animaux, mais les animaux restent visibles plus longtemps, ce qui peut favoriser des décisions d'adoption plus lentes mais durables.<br />
    En résumé, l'augmentation du nombre de photos semble ralentir l'adoption immédiate, mais pourrait prolonger l'intérêt pour l'animal.
  </p>
</div>

  
      {/* Deuxième graphique : nombre total d'adoptions */}
      <h2 className="text-xl font-bold mb-4 mt-8">Nombre total d'adoptions par groupe de photos</h2>
      <Plot
        data={[adoptionCountTrace]}  // Affichage du nombre total d'adoptions
        layout={adoptionCountLayout}
        style={{ width: '100%', height: '500px' }}
        config={{
          displayModeBar: false,
          responsive: true,
        }}
      />
  
      {/* Explication détaillée du deuxième graphique */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Interprétation du deuxième graphique</h2>
        <p>
          Ce graphique montre le nombre total d'adoptions pour chaque groupe de photos, toutes vitesses d'adoption confondues.<br />
          Le nombre total d'adoptions par groupe de photos est le suivant :<br />
          <ul>
            <li><strong>0-5 photos</strong> : 10 326 adoptions</li>
            <li><strong>6-10 photos</strong> : 3 745 adoptions</li>
            <li><strong>11-20 photos</strong> : 789 adoptions</li>
            <li><strong>21-30 photos</strong> : 114 adoptions</li>
          </ul>
        </p>
        <p>
          Le groupe "0-5 photos" représente la majorité des adoptions, avec un total de <strong>10 326 adoptions</strong>. Cela confirme que plus il y a de photos, plus le nombre d'adoptions est élevé.<br />
          À l'inverse, les groupes ayant plus de photos (comme "21-30 photos") ont un nombre beaucoup plus faible d'adoptions, seulement <strong>114</strong> au total.<br />
          Cela suggère qu'il y a une saturation au-delà d'un certain nombre de photos, ce qui peut réduire l'efficacité en termes de conversions d'adoptants.
        </p>
      </div>
  
      {/* Conclusion générale */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Conclusion</h2>
        <p>
          Pour maximiser les chances d'adoption, il est essentiel de trouver un équilibre optimal dans le nombre de photos affichées.<br />
          Les données suggèrent qu'un nombre modéré de photos (comme dans le groupe "0-5") est plus efficace pour stimuler l'adoption rapide, avec un taux d'adoption immédiate plus élevé.<br />
          Cependant, un nombre trop faible de photos pourrait ne pas suffire à attirer l'attention des adoptants, et un trop grand nombre de photos pourrait diminuer la réactivité des adoptants potentiels.<br />
        </p>
        <p>
          En conclusion, il semble qu'un nombre de 5 à 10 photos est idéal pour encourager l'adoption rapide tout en maintenant un intérêt suffisant pour les animaux.<br />
          Il est donc recommandé de viser cet intervalle pour maximiser les chances d'adoption.
        </p>
      </div>
    </div>
  );
}

export default App;
