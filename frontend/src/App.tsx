import { useEffect, useState } from 'react'
import Wrapper from './components/Wrapper'

// Définition des types pour les données récupérées
interface DataRow {
  Type: number;
  Age: number;
  Breed1: number;
  Breed2: number;
  Gender: number;
  Fee: string;
  VideoAmt: string;
  PetID: string;
  PhotoAmt: string;
  AdoptionSpeed: number;
}

const App = () => {
  const [data, setData] = useState<DataRow[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();

      })
      .then((data) => {
        console.log('Données reçues:', data);
        setData(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données:', error);
      });
  }, []);

  // Récupère les noms des colonnes de données
  const getColumnNames = () => {
    return data.length > 0 ? Object.keys(data[0]) : []
  }

  return (
    <Wrapper>
      <div className="flex flex-col p-4">
        <h1 className="text-xl font-bold mb-4">Données reçues du backend</h1>
        
        {/* Affiche les données sous forme de tableau */}
        {data.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                {getColumnNames().map((col, index) => (
                  <th key={index} className="px-4 py-2 border-b">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {getColumnNames().map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-2 border-b">
                      {row[col as keyof DataRow]} {/* Utilise keyof pour accéder aux données correctement */}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chargement des données...</p>
        )}
      </div>
    </Wrapper>
  )
}

export default App
