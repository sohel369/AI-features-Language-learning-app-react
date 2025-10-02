// Auth Debugger Component - Comprehensive authentication debugging
import React from 'react';
import { UserContext } from '../context/userContext';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthDebugger = () => {
  const { user, userData, isAuthenticated, isLoading } = React.useContext(UserContext);
  const [firebaseUser, setFirebaseUser] = React.useState(null);
  const [firebaseLoading, setFirebaseLoading] = React.useState(true);

  React.useEffect(() => {
    console.log('AuthDebugger - Setting up Firebase auth listener');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthDebugger - Firebase auth state changed:', user);
      setFirebaseUser(user);
      setFirebaseLoading(false);
    });

    return () => {
      console.log('AuthDebugger - Cleaning up Firebase auth listener');
      unsubscribe();
    };
  }, []);

  const getStatusColor = (condition) => {
    return condition ? 'text-green-300' : 'text-red-300';
  };

  const getStatusIcon = (condition) => {
    return condition ? '✅' : '❌';
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-600">
      <h3 className="text-xl font-bold text-white mb-4">🔧 Authentication Debugger</h3>
      
      {/* UserContext Status */}
      <div className="bg-slate-700 p-4 rounded-lg mb-4">
        <h4 className="text-lg font-semibold text-blue-300 mb-3">📊 UserContext Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Loading:</span>
              <span className={getStatusColor(!isLoading)}>
                {getStatusIcon(!isLoading)} {isLoading ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Authenticated:</span>
              <span className={getStatusColor(isAuthenticated)}>
                {getStatusIcon(isAuthenticated)} {isAuthenticated ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">User:</span>
              <span className={getStatusColor(!!user)}>
                {getStatusIcon(!!user)} {user ? 'Present' : 'None'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">User Data:</span>
              <span className={getStatusColor(!!userData)}>
                {getStatusIcon(!!userData)} {userData ? 'Present' : 'None'}
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
              <span className="text-blue-300 text-xs">
                {user?.email || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Firebase Auth Status */}
      <div className="bg-slate-700 p-4 rounded-lg mb-4">
        <h4 className="text-lg font-semibold text-green-300 mb-3">🔥 Firebase Auth Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Loading:</span>
              <span className={getStatusColor(!firebaseLoading)}>
                {getStatusIcon(!firebaseLoading)} {firebaseLoading ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">User:</span>
              <span className={getStatusColor(!!firebaseUser)}>
                {getStatusIcon(!!firebaseUser)} {firebaseUser ? 'Present' : 'None'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Auth Object:</span>
              <span className={getStatusColor(!!auth)}>
                {getStatusIcon(!!auth)} {auth ? 'Available' : 'None'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">User ID:</span>
              <span className="text-blue-300 font-mono text-xs">
                {firebaseUser?.uid ? firebaseUser.uid.substring(0, 8) + '...' : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Email:</span>
              <span className="text-blue-300 text-xs">
                {firebaseUser?.email || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Display Name:</span>
              <span className="text-blue-300 text-xs">
                {firebaseUser?.displayName || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-slate-700 p-4 rounded-lg mb-4">
        <h4 className="text-lg font-semibold text-yellow-300 mb-3">⚖️ State Comparison</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-300">UserContext User:</span>
            <span className={getStatusColor(!!user)}>
              {user ? 'Present' : 'None'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Firebase User:</span>
            <span className={getStatusColor(!!firebaseUser)}>
              {firebaseUser ? 'Present' : 'None'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Users Match:</span>
            <span className={getStatusColor(user?.uid === firebaseUser?.uid)}>
              {getStatusIcon(user?.uid === firebaseUser?.uid)} {user?.uid === firebaseUser?.uid ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Can Access Home:</span>
            <span className={getStatusColor(!!user && !isLoading)}>
              {getStatusIcon(!!user && !isLoading)} {!!user && !isLoading ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Debug Actions */}
      <div className="bg-slate-700 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-purple-300 mb-3">🛠️ Debug Actions</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-300">Current URL:</span>
            <span className="text-blue-300 font-mono">
              {window.location.pathname}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Should Redirect:</span>
            <span className={getStatusColor(!user && !isLoading)}>
              {getStatusIcon(!user && !isLoading)} {!user && !isLoading ? 'Yes (to login)' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Should Show Home:</span>
            <span className={getStatusColor(!!user && !isLoading)}>
              {getStatusIcon(!!user && !isLoading)} {!!user && !isLoading ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugger;
