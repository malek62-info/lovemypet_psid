import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";

export default function App() {
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
