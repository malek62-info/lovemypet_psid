import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/index";
import Dashboard from "./pages/Dashboard"; 
import Ml from "./pages/Ml"; 
import './App.css';

function App() {
  return (
    <div>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ml" element={<Ml />} />
      </Routes>
    </div>
  );
}
export default App;
