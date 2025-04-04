import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Ml from "./pages/ml";
import Dashboard from "./pages/dashboard";
import Home from "./pages";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";

function App() {
  return (
    <div>
      {/* Barre de navigation simple */}
      <nav className="bg-gray-100 p-4">
        <Link className="mr-4 text-blue-600 font-semibold" to="/">Accueil</Link>
      </nav>

      {/* Contenu de la page selon l’URL */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
