// frontend/src/Dashboard.jsx
import RadarChart from "./RadarChart";

import SterilizationImpactChart from "./SterilizationImpactChart";


import TopSterilizedBreedsChart from "./TopSterilizedBreedsChart";

export default function Annalyse4() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      <p className="mb-4">
      </p>
      <RadarChart />
      <TopSterilizedBreedsChart />
      <SterilizationImpactChart />
    </div>
  );
}
