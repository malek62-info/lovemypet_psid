import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const Graphe7 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Appeler l'API et récupérer les données
  useEffect(() => {
    fetch('http://127.0.0.1:8000/age-vaccination-data') // Assurez-vous que l'URL est correcte
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching the data:', error);
        setLoading(false);
      });
  }, []);

  // Préparer les données pour le graphique
  const processDataForChart = () => {
    const ageGroups = data.map(item => item.AgeGroup);
    const noVaccinated = data.map(item => item.NoNumberVaccinated);

    return {
      x: ageGroups,
      y: noVaccinated,
      type: 'bar',
      marker: {
        color: '#69b3a2', // Vous pouvez personnaliser la couleur
      },
    };
  };

  // Affichage en attendant que les données arrivent
  if (loading) {
    return <div>Loading...</div>;
  }

  // Créer le graphique
  return (
    <div>
      <h2>Vaccination Status by Age Group</h2>
      <Plot
        data={[processDataForChart()]}
        layout={{
          title: 'Non-Vaccinated Individuals by Age Group',
          xaxis: {
            title: 'Age Group',
          },
          yaxis: {
            title: 'Number of Non-Vaccinated Individuals',
          },
        }}
      />
    </div>
  );
};

export default Graphe7;
