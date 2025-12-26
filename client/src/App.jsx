import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import ProblemAnalyserPage from "./pages/ProblemAnalyserPage";
import CodeAnalyserPage from "./pages/CodeAnalyserPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// NEW
import LandingPage from "./pages/LandingPage/LandingPage";
import AuthSuccess from "./pages/Auth/AuthSuccess";

import NotFoundPage from "./pages/NotFoundPage";



const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public landing – first page user sees */}
        <Route path="/" element={<LandingPage />} />

        {/* Public auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> */}

        {/* Protected app area */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/success"
          element={
            <ProtectedRoute>
              <AuthSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/problem-analyser"
          element={
            <ProtectedRoute>
              <ProblemAnalyserPage />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

        <Route
          path="/code-analyser"
          element={
            <ProtectedRoute>
              <CodeAnalyserPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
