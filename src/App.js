import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin.jsx";
import Platform from "./pages/Platform";
import Home from "./pages/Home.jsx";

import './App.css';
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App">
          <Routes>
            {/* Home Route */}
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Login />} />

            <Route path="/signup" element={<SignUp />} />

           
            <Route path="/admin" element={<Admin />} />

            {/* Platform Route */}
            <Route path="/platform" element={<Platform />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
