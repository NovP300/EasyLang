import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuth = Boolean(localStorage.getItem("refresh_token"));
  return isAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
