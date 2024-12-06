import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin.jsx";
import Platform from "./pages/Platform";
import Home from "./pages/Home.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/platform" element={<Platform />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

