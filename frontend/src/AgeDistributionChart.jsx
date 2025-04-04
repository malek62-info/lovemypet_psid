// frontend/src/AgeDistributionChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useEffect, useState } from "react";
import dataRaw from "./data/data_clean.json"; // format JSON du CSV

export default function AgeDistributionChart() {
  const [ageData, setAgeData] = useState([]);

  useEffect(() => {
    // Grouper les âges pour l'affichage
    const ageBins = Array.from({ length: 12 }, (_, i) => ({
      age: `${i * 3}-${(i + 1) * 3 - 1} mois`,
      count: 0,
    }));

    dataRaw.forEach((item) => {
      const age = item.Age;
      const index = Math.min(Math.floor(age / 3), 11); // max bin = 33+ mois
      ageBins[index].count += 1;
    });

    setAgeData(ageBins);
  }, []);

  return (
    <div className="my-10">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Distribution de l’âge des animaux 🐾
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ageData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <XAxis dataKey="age" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#6EE7B7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
