import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin.jsx";
import Platform from "./pages/Platform";
import Home from "./pages/Home.jsx";

import './App.css';
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import ApiDetails from "./pages/ApiDetails.js";
import EditApiPage from "./pages/EditApiPage.js";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform"
              element={
                <ProtectedRoute>
                  <Platform />
                </ProtectedRoute>
              }
            />
            <Route
              path="/api-details/:apiName"
              element={
                <ProtectedRoute>
                  <ApiDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/update/:id"
              element={
                <ProtectedRoute>
                  <EditApiPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
