// Auth Flow Steps Component - Shows step-by-step authentication flow
import React from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const AuthFlowSteps = () => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = React.useContext(UserContext);

  const steps = [
    {
      id: 1,
      title: "🚀 Getting Started",
      description: "App loads and initializes",
      status: "completed",
      route: "any"
    },
    {
      id: 2,
      title: "🔐 Authentication Check",
      description: "Check if user is logged in",
      status: isLoading ? "loading" : (isAuthenticated ? "completed" : "current"),
      route: "any"
    },
    {
      id: 3,
      title: "📝 Login/Signup Page",
      description: "Show authentication form",
      status: location.pathname === "/" && !isAuthenticated ? "current" : 
              location.pathname === "/" ? "completed" : "pending",
      route: "/"
    },
    {
      id: 4,
      title: "✅ Login Success",
      description: "User successfully authenticated",
      status: isAuthenticated ? "completed" : "pending",
      route: "any"
    },
    {
      id: 5,
      title: "🏠 Home Page",
      description: "Redirect to protected home page",
      status: location.pathname === "/home" && isAuthenticated ? "current" : 
              location.pathname === "/home" ? "completed" : "pending",
      route: "/home"
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

  return (
    <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-600">
      <h3 className="text-xl font-bold text-white mb-4">🛤️ Authentication Flow Steps</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="bg-slate-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getStatusIcon(step.status)}</span>
                <div>
                  <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                  <p className="text-sm text-slate-300">{step.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${getStatusColor(step.status)}`}>
                  {step.status.toUpperCase()}
                </span>
                <p className="text-xs text-slate-400">Route: {step.route}</p>
              </div>
            </div>
            
            {step.status === "current" && (
              <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>Currently here:</strong> {step.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-700 rounded-lg">
        <h4 className="text-sm font-semibold text-cyan-300 mb-2">Current Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
        </div>
      </div>
    </div>
  );
};

export default AuthFlowSteps;
