// frontend/src/Dashboard.jsx
import RadarChart from "./RadarChart";

import SterilizationImpactChart from "./SterilizationImpactChart";


import TopSterilizedBreedsChart from "./TopSterilizedBreedsChart";

export default function Annalyse4() {
  return (
    <div className="p-6">
      <p className="mb-4">
      </p>
      <RadarChart />
      <TopSterilizedBreedsChart />
      <SterilizationImpactChart />
    </div>
  );
}
