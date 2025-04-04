import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashboard"; 
import './App.css';

function App() {
  return (
    <div>
      {/* Navigation */}
      <nav className="bg-gray-100 p-4">
        <Link className="mr-4 text-blue-600 font-semibold" to="/">Accueil</Link>
        <Link className="text-blue-600 font-semibold" to="/dashboard">Dashboard</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
export default App;
