import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppSettingsProvider } from "./context/AppSettingsContext";
import SettingsDemo from "./components/SettingsDemo";
import AuthForm from "./components/AuthForm";
import authService from "./services/AuthService";

// Simple ProtectedRoute component
function ProtectedRoute({ children }) {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Language Learning App
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
            <p className="text-slate-300 mb-4">
              This is your language learning dashboard. Test the settings functionality.
            </p>
            <a 
              href="/settings-demo" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
            >
              Test Settings Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppSettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings-demo" element={<SettingsDemo />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppSettingsProvider>
  );
}

export default App;
