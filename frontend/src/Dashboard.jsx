// frontend/src/Dashboard.jsx
import RadarChart from "./RadarChart";



export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      <p className="mb-4">
        Ce tableau de bord présente une analyse des profils des animaux non adoptés après 100 jours.
      </p>

      <RadarChart />
      

    </div>
  );
}
