// Complete Authentication Flow - Shows all routes and steps
import React from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const CompleteAuthFlow = () => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = React.useContext(UserContext);

  const allSteps = [
    {
      id: 1,
      title: "🚀 Getting Started",
      description: "App loads and initializes",
      route: "any",
      status: "completed",
      icon: "🚀",
      details: "React app starts, components load"
    },
    {
      id: 2,
      title: "🔐 Authentication Check",
      description: "Check if user is logged in",
      route: "any",
      status: isLoading ? "loading" : (isAuthenticated ? "completed" : "current"),
      icon: "🔐",
      details: "UserContext checks Firebase auth state"
    },
    {
      id: 3,
      title: "📝 Login Page",
      description: "Show login/signup form",
      route: "/",
      status: !isAuthenticated && !isLoading ? "current" : 
              isAuthenticated ? "completed" : "pending",
      icon: "📝",
      details: "User sees 'Welcome to LinguaAI' with login form"
    },
    {
      id: 4,
      title: "✅ Login Success",
      description: "User successfully authenticated",
      route: "any",
      status: isAuthenticated ? "completed" : "pending",
      icon: "✅",
      details: "Firebase confirms user authentication"
    },
    {
      id: 5,
      title: "🏠 Home Page",
      description: "Main language learning app",
      route: "/home",
      status: isAuthenticated ? "current" : "pending",
      icon: "🏠",
      details: "User sees language learning interface"
    },
    {
      id: 6,
      title: "🌍 Language Selection",
      description: "Choose languages to learn",
      route: "modal",
      status: "pending",
      icon: "🌍",
      details: "User selects English/Arabic to learn"
    },
    {
      id: 7,
      title: "📚 Start Learning",
      description: "Begin language lessons",
      route: "/home",
      status: "pending",
      icon: "📚",
      details: "User can access lessons, quiz, AI coach"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "✅";
      case "current": return "🔄";
      case "loading": return "⏳";
      case "pending": return "⏸️";
      default: return "❓";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-300";
      case "current": return "text-blue-300";
      case "loading": return "text-yellow-300";
      case "pending": return "text-slate-400";
      default: return "text-slate-500";
    }
  };

  const getCurrentStep = () => {
    if (isLoading) return "Loading authentication...";
    if (!isAuthenticated) return "Login Page";
    if (isAuthenticated) return "Home Page";
    return "Unknown";
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-600">
      <h3 className="text-xl font-bold text-white mb-4">🛤️ Complete Authentication Flow</h3>
      
      {/* Current Status */}
      <div className="bg-slate-700 p-4 rounded-lg mb-4">
        <h4 className="text-lg font-semibold text-cyan-300 mb-2">📍 Current Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-300">Current Route:</span>
            <p className="text-blue-300 font-mono">{location.pathname}</p>
          </div>
          <div>
            <span className="text-slate-300">Authentication:</span>
            <p className={isAuthenticated ? "text-green-300" : "text-red-300"}>
              {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
            </p>
          </div>
          <div>
            <span className="text-slate-300">Loading:</span>
            <p className={isLoading ? "text-yellow-300" : "text-green-300"}>
              {isLoading ? "⏳ Loading..." : "✅ Complete"}
            </p>
          </div>
          <div>
            <span className="text-slate-300">Current Step:</span>
            <p className="text-yellow-300">{getCurrentStep()}</p>
          </div>
        </div>
      </div>

      {/* All Steps */}
      <div className="space-y-3">
        {allSteps.map((step, index) => (
          <div key={step.id} className={`bg-slate-700 p-4 rounded-lg ${
            step.status === "current" ? "ring-2 ring-blue-500" : ""
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{step.icon}</span>
                <div>
                  <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                  <p className="text-sm text-slate-300">{step.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${getStatusColor(step.status)}`}>
                  {getStatusIcon(step.status)} {step.status.toUpperCase()}
                </span>
                <p className="text-xs text-slate-400">Route: {step.route}</p>
              </div>
            </div>
            
            <div className="mt-2 p-2 bg-slate-600 rounded text-xs text-slate-300">
              <strong>Details:</strong> {step.details}
            </div>
            
            {step.status === "current" && (
              <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>📍 You are here:</strong> {step.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Instructions */}
      <div className="mt-6 p-4 bg-slate-700 rounded-lg">
        <h4 className="text-sm font-semibold text-purple-300 mb-2">🧭 What to Do Next</h4>
        <div className="text-sm text-slate-300 space-y-2">
          {!isAuthenticated && !isLoading && (
            <>
              <p>• You're on the <strong>Login Page</strong> - Click "Get Started" to login</p>
              <p>• Fill in your email and password to create an account</p>
              <p>• Or click "Sign In" if you already have an account</p>
            </>
          )}
          {isAuthenticated && (
            <>
              <p>• You're on the <strong>Home Page</strong> - Explore the language learning features</p>
              <p>• Click the 🌍 button in the header to select languages</p>
              <p>• Try the Lessons, Quiz, or AI Coach sections</p>
            </>
          )}
          {isLoading && (
            <p>• <strong>Loading...</strong> - Please wait while we check your authentication</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteAuthFlow;
