// Route Debugger Component - Shows detailed route information
import React from 'react';
import useCurrentRoute from '../hooks/useCurrentRoute';
import useAuth from '../hooks/useAuth';

const RouteDebugger = () => {
  const route = useCurrentRoute();
  const { user, loading } = useAuth();

  return (
    <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-600">
      <h3 className="text-xl font-bold text-white mb-4">🔍 Route Debugger</h3>
      
      {/* Current Route Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-300 mb-3">📍 Current Route</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Pathname:</span>
              <span className="text-blue-300 font-mono">{route.pathname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Route Name:</span>
              <span className="text-green-300 font-semibold">{route.getRouteName()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Search Params:</span>
              <span className="text-yellow-300 font-mono">{route.search || 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Hash:</span>
              <span className="text-purple-300 font-mono">{route.hash || 'None'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-green-300 mb-3">🔐 Authentication</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">User:</span>
              <span className={user ? 'text-green-300' : 'text-red-300'}>
                {user ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Loading:</span>
              <span className={loading ? 'text-yellow-300' : 'text-green-300'}>
                {loading ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">User ID:</span>
              <span className="text-blue-300 font-mono text-xs">
                {user?.uid ? user.uid.substring(0, 8) + '...' : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Email:</span>
              <span className="text-blue-300 font-mono text-xs">
                {user?.email || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className={`p-3 rounded-lg text-center ${route.isHome ? 'bg-green-900 border-green-500' : 'bg-slate-700'}`}>
          <div className="text-sm font-semibold">Home</div>
          <div className={`text-xs ${route.isHome ? 'text-green-300' : 'text-slate-400'}`}>
            {route.isHome ? '✅ Active' : '❌'}
          </div>
        </div>
        
        <div className={`p-3 rounded-lg text-center ${route.isLogin ? 'bg-blue-900 border-blue-500' : 'bg-slate-700'}`}>
          <div className="text-sm font-semibold">Login</div>
          <div className={`text-xs ${route.isLogin ? 'text-blue-300' : 'text-slate-400'}`}>
            {route.isLogin ? '✅ Active' : '❌'}
          </div>
        </div>
        
        <div className={`p-3 rounded-lg text-center ${route.isProfile ? 'bg-purple-900 border-purple-500' : 'bg-slate-700'}`}>
          <div className="text-sm font-semibold">Profile</div>
          <div className={`text-xs ${route.isProfile ? 'text-purple-300' : 'text-slate-400'}`}>
            {route.isProfile ? '✅ Active' : '❌'}
          </div>
        </div>
        
        <div className={`p-3 rounded-lg text-center ${route.isDiagnostic ? 'bg-orange-900 border-orange-500' : 'bg-slate-700'}`}>
          <div className="text-sm font-semibold">Diagnostic</div>
          <div className={`text-xs ${route.isDiagnostic ? 'text-orange-300' : 'text-slate-400'}`}>
            {route.isDiagnostic ? '✅ Active' : '❌'}
          </div>
        </div>
      </div>

      {/* Protection Status */}
      <div className="bg-slate-700 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-yellow-300 mb-3">🛡️ Route Protection</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-300">Is Protected:</span>
            <span className={route.isProtected() ? 'text-red-300' : 'text-green-300'}>
              {route.isProtected() ? '🔒 Yes' : '🔓 No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Access Status:</span>
            <span className={
              route.isProtected() && !user ? 'text-red-300' : 
              route.isProtected() && user ? 'text-green-300' : 
              'text-blue-300'
            }>
              {route.isProtected() && !user ? '🚫 Denied' : 
               route.isProtected() && user ? '✅ Allowed' : 
               '🌐 Public'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Steps */}
      <div className="bg-slate-700 p-4 rounded-lg mt-4">
        <h4 className="text-lg font-semibold text-cyan-300 mb-3">🚀 Navigation Flow</h4>
        <div className="text-sm space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-300">1.</span>
            <span className="text-slate-300">User visits URL</span>
            <span className="text-blue-300 font-mono">{route.pathname}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-cyan-300">2.</span>
            <span className="text-slate-300">Route component loads</span>
            <span className="text-green-300">{route.getRouteName()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-cyan-300">3.</span>
            <span className="text-slate-300">Authentication check</span>
            <span className={user ? 'text-green-300' : 'text-red-300'}>
              {user ? '✅ Passed' : '❌ Failed'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-cyan-300">4.</span>
            <span className="text-slate-300">Access granted</span>
            <span className={
              route.isProtected() && !user ? 'text-red-300' : 
              route.isProtected() && user ? 'text-green-300' : 
              'text-blue-300'
            }>
              {route.isProtected() && !user ? '❌ Redirected to login' : 
               route.isProtected() && user ? '✅ Home page shown' : 
               '✅ Public page shown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDebugger;
