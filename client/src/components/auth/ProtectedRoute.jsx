// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "../../utils/auth";

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  console.log("ProtectedRoute auth:", auth);

  if (!auth || !auth.token) {
    console.log("Redirecting to /login because no auth");
    return <Navigate to="/login" replace />;
  }

  console.log("Auth OK → rendering dashboard");
  return children;
}
