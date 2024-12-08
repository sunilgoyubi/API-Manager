import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin.jsx";
import Platform from "./pages/Platform";
import Home from "./pages/Home.jsx";

import './App.css';
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import ApiDetails from "./pages/ApiDetails.js";

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

          
         <Route path="/api-details/:apiName" element={<ApiDetails />} />
         <Route path="/home" element={<Home />} />
      
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
