import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken");

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;
