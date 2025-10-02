// Auth Status Component - Shows current authentication status
import React from 'react';
import { UserContext } from '../context/userContext';

const AuthStatus = () => {
  const { user, userData, isAuthenticated, isLoading } = React.useContext(UserContext);

  return (
    <div className="bg-slate-800 p-4 rounded-lg mb-4 border border-slate-600">
      <h3 className="text-lg font-bold text-white mb-3">🔐 Authentication Status</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-300">Loading:</span>
            <span className={isLoading ? 'text-yellow-300' : 'text-green-300'}>
              {isLoading ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Authenticated:</span>
            <span className={isAuthenticated ? 'text-green-300' : 'text-red-300'}>
              {isAuthenticated ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">User:</span>
            <span className={user ? 'text-green-300' : 'text-red-300'}>
              {user ? 'Present' : 'None'}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          {user && (
            <>
              <div className="flex justify-between">
                <span className="text-slate-300">User ID:</span>
                <span className="text-blue-300 font-mono text-xs">
                  {user.uid ? user.uid.substring(0, 8) + '...' : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Email:</span>
                <span className="text-blue-300 text-xs">
                  {user.email || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Display Name:</span>
                <span className="text-blue-300 text-xs">
                  {user.displayName || 'N/A'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-slate-700 rounded-lg">
        <h4 className="text-sm font-semibold text-cyan-300 mb-2">Status Summary</h4>
        <p className="text-sm text-slate-300">
          {isLoading ? '🔄 Loading authentication...' :
           isAuthenticated && user ? '✅ User is authenticated and ready!' :
           isAuthenticated && !user ? '⚠️ Authenticated but no user data' :
           '❌ User not authenticated'}
        </p>
      </div>
    </div>
  );
};

export default AuthStatus;
