import { useEffect, useState } from 'react';
import Wrapper from './components/Wrapper';

const App = () => {
  const [stats, setStats] = useState(null);

  var trace1 = {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [20, 14, 23],
    name: 'SF Zoo',
    type: 'bar'
  };
  
  var trace2 = {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [12, 18, 29],
    name: 'LA Zoo',
    type: 'bar'
  };
  
  useEffect(() => {
    fetch('http://localhost:8000/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Statistiques reçues:', data);
        console.log(data)
        setStats(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données:', error);
      });
  }, []);

  const getColumnNames = () => {
    return stats ? Object.keys(stats) : [];
  };

  const getAdoptionSpeeds = (photoAmt) => {
    return stats ? Object.keys(stats[photoAmt]) : [];
  };

  return (
    <Wrapper>
      <div className="flex flex-col p-4">
        <h1 className="text-xl font-bold mb-4">Statistiques de l'impact des photos sur l'adoption</h1>

        {/* Vérifier si les données sont chargées */}
        {stats ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                {/* Affiche les colonnes d'AdoptionSpeed pour chaque valeur de PhotoAmt */}
                {getAdoptionSpeeds(Object.keys(stats)[0]).map((speed, index) => (
                  <th key={index} className="px-4 py-2 border-b">AdoptionSpeed {speed}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Affiche les lignes pour chaque PhotoAmt */}
              {getColumnNames().map((photoAmt, rowIndex) => (
                <tr key={rowIndex}>
                  {/* Affiche les données pour chaque AdoptionSpeed associé à la PhotoAmt */}
                  {getAdoptionSpeeds(photoAmt).map((speed, colIndex) => (
                    <td key={colIndex} className="px-4 py-2 border-b">
                      {(stats[photoAmt] && stats[photoAmt][speed]) || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chargement des statistiques...</p>
        )}
      </div>
    </Wrapper>
  );
};

export default App;
