import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/')  // Appelle ton API FastAPI
      .then(response => response.json())
      .then(data => {
        console.log("Données reçues :", data); 
        setData(data);
      })
      .catch(error => console.error("Erreur lors de la récupération des données :", error));
  }, []); // Le tableau vide signifie que ça s'exécute au chargement du composant

  return (
    <div className='p-4'>
      <h1 className="text-xl font-bold mb-4">Données reçues</h1>
      
      {data.length > 0 ? (
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key, index) => (
                <th key={index} className="border border-gray-300 p-2">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-2">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Chargement des données...</p>
      )}
    </div>
  );
}

export default App;
