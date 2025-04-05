import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/index";
import Dashboard from "./pages/Dashboard"; 
import './App.css';

function App() {
  return (
    <div>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
export default App;
