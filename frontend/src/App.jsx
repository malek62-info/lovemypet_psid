import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Ml from "./pages/ml";
import Dashboard from "./pages/dashboard";
import Home from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ml" element={<Ml />} />
      </Routes>
    </Router>
  );
}
export default App;

