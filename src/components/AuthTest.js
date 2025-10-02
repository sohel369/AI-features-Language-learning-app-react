// Auth Test Component
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthTest = () => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    console.log('AuthTest - Setting up auth listener');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthTest - Auth state changed:', user);
      setAuthState({
        user,
        loading: false,
        error: null
      });
    }, (error) => {
      console.error('AuthTest - Auth error:', error);
      setAuthState({
        user: null,
        loading: false,
        error: error.message
      });
    });

    return () => {
      console.log('AuthTest - Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-600">
      <h3 className="text-xl font-bold text-white mb-4">🔧 Authentication Test</h3>
      
      <div className="space-y-4">
        <div className="bg-slate-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-300 mb-2">Auth State</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Loading:</span>
              <span className={authState.loading ? 'text-yellow-300' : 'text-green-300'}>
                {authState.loading ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">User:</span>
              <span className={authState.user ? 'text-green-300' : 'text-red-300'}>
                {authState.user ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
            {authState.user && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-300">User ID:</span>
                  <span className="text-blue-300 font-mono text-xs">
                    {authState.user.uid}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Email:</span>
                  <span className="text-blue-300">
                    {authState.user.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Display Name:</span>
                  <span className="text-blue-300">
                    {authState.user.displayName || 'N/A'}
                  </span>
                </div>
              </>
            )}
            {authState.error && (
              <div className="flex justify-between">
                <span className="text-slate-300">Error:</span>
                <span className="text-red-300">
                  {authState.error}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-green-300 mb-2">Firebase Config</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Auth Object:</span>
              <span className={auth ? 'text-green-300' : 'text-red-300'}>
                {auth ? 'Available' : 'Not Available'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Project ID:</span>
              <span className="text-blue-300">
                {auth?.app?.options?.projectId || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
