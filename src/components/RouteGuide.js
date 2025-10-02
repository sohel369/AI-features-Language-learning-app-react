// Route Guide Component - Step by step route explanation
import React from 'react';
import useCurrentRoute from '../hooks/useCurrentRoute';
import useAuth from '../hooks/useAuth';

const RouteGuide = () => {
  const route = useCurrentRoute();
  const { user, loading } = useAuth();

  const getRouteSteps = () => {
    const steps = [];
    
    // Step 1: URL Access
    steps.push({
      step: 1,
      title: "🌐 URL Access",
      description: `User navigates to: ${route.pathname}`,
      status: "completed",
      details: `Current pathname: ${route.pathname}`
    });

    // Step 2: Route Matching
    steps.push({
      step: 2,
      title: "🎯 Route Matching",
      description: `React Router matches route to component`,
      status: "completed",
      details: `Matched to: ${route.getRouteName()} component`
    });

    // Step 3: Component Loading
    steps.push({
      step: 3,
      title: "⚡ Component Loading",
      description: route.isHome ? "ProtectedHome component loads" : "Component loads",
      status: "completed",
      details: route.isHome ? "ProtectedHome → HomePage" : "Direct component"
    });

    // Step 4: Authentication Check
    if (route.isProtected()) {
      steps.push({
        step: 4,
        title: "🔐 Authentication Check",
        description: "Checking if user is authenticated",
        status: loading ? "loading" : user ? "completed" : "failed",
        details: loading ? "Loading authentication state..." : 
                 user ? "User is authenticated ✅" : 
                 "User not authenticated ❌"
      });

      // Step 5: Access Decision
      steps.push({
        step: 5,
        title: "🚪 Access Decision",
        description: user ? "Access granted" : "Access denied",
        status: user ? "completed" : "failed",
        details: user ? "User can access protected route" : "Redirected to login page"
      });
    }

    // Step 6: Component Render
    steps.push({
      step: steps.length + 1,
      title: "🎨 Component Render",
      description: "Component renders with data",
      status: "completed",
      details: "HomePage component displays with user data"
    });

    return steps;
  };

  const steps = getRouteSteps();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'loading': return '⏳';
      case 'failed': return '❌';
      default: return '⭕';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-300';
      case 'loading': return 'text-yellow-300';
      case 'failed': return 'text-red-300';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-600">
      <h3 className="text-xl font-bold text-white mb-4">📋 Route Flow Guide</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.step} className="bg-slate-700 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getStatusIcon(step.status)}</span>
                  <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                  <span className={`text-sm px-2 py-1 rounded ${getStatusColor(step.status)} bg-slate-600`}>
                    {step.status}
                  </span>
                </div>
                <p className="text-slate-300 mb-2">{step.description}</p>
                <p className="text-sm text-slate-400">{step.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Route Summary */}
      <div className="mt-6 bg-slate-700 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-cyan-300 mb-3">📊 Current Route Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-300">Route:</span>
              <span className="text-blue-300">{route.pathname}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-300">Component:</span>
              <span className="text-green-300">{route.getRouteName()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-300">Protected:</span>
              <span className={route.isProtected() ? 'text-red-300' : 'text-green-300'}>
                {route.isProtected() ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-300">User:</span>
              <span className={user ? 'text-green-300' : 'text-red-300'}>
                {user ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-300">Loading:</span>
              <span className={loading ? 'text-yellow-300' : 'text-green-300'}>
                {loading ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-300">Access:</span>
              <span className={
                route.isProtected() && !user ? 'text-red-300' : 
                route.isProtected() && user ? 'text-green-300' : 
                'text-blue-300'
              }>
                {route.isProtected() && !user ? 'Denied' : 
                 route.isProtected() && user ? 'Allowed' : 
                 'Public'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteGuide;
