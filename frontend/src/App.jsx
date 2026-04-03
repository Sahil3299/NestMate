import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import MatchesPage from "./pages/MatchesPage";
import ChatPage from "./pages/ChatPage";
import ProfileViewPage from "./pages/ProfileViewPage";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Navigate to="/matches" replace />
                  </main>
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Header />
                  <main className="flex-1">
                    <ProfileSetupPage />
                  </main>
                </>
              }
            />
            <Route
              path="/matches"
              element={
                <>
                  <Header />
                  <main className="flex-1">
                    <MatchesPage />
                  </main>
                </>
              }
            />
            <Route
              path="/profile/:uid"
              element={
                <>
                  <Header />
                  <main className="flex-1">
                    <ProfileViewPage />
                  </main>
                </>
              }
            />
            <Route
              path="/chat/:uid"
              element={
                <>
                  <Header />
                  <main className="flex-1">
                    <ChatPage />
                  </main>
                </>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

