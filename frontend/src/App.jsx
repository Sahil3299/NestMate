import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import MatchesPage from "./pages/MatchesPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/matches" replace />} />
          <Route path="/profile" element={<ProfileSetupPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/chat/:withUid" element={<ChatPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/matches" replace />} />
      </Routes>
    </AuthProvider>
  );
}

