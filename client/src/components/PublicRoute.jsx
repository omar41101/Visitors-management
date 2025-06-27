import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  // Check for token in localStorage (or use context/cookie if you prefer)
  const token = localStorage.getItem("token");

  if (token) {
    // If logged in, redirect to dashboard (or any protected page)
    return <Navigate to="/dashboard" replace />;
  }
  // If not logged in, show the public page (login/register)
  return children;
};

export default PublicRoute;
