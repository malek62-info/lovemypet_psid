import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useEffect, useState } from "react";
import dataRaw from "./data/data_clean.json"; // Assure-toi que le fichier est bien là

export default function AnimalTypeChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // 1 = Chien, 2 = Chat
    const counts = { 1: 0, 2: 0 };

    dataRaw.forEach((item) => {
      if (item.Type === 1 || item.Type === 2) {
        counts[item.Type]++;
      }
    });

    const formatted = [
      { type: "🐶 Chien", count: counts[1] },
      { type: "🐱 Chat", count: counts[2] },
    ];

    setChartData(formatted);
  }, []);

  const colors = ["#60A5FA", "#FBBF24"];

  return (
    <div className="my-10">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Répartition des types d’animaux
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" />
          <YAxis dataKey="type" type="category" />
          <Tooltip />
          <Bar dataKey="count" radius={[10, 10, 10, 10]}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
