// HomePage Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import firebaseAuthService from '../services/FirebaseAuthService';
import RouteInfo from './RouteInfo';
import RouteDebugger from './RouteDebugger';
import RouteGuide from './RouteGuide';
import AuthTest from './AuthTest';
import AuthStatus from './AuthStatus';

const HomePage = () => {
  const { user, userData, isAuthenticated, isLoading, logout } = React.useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await firebaseAuthService.signOut();
      await logout();
      navigate('/'); // back to login
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Access Denied</h1>
          <p className="mb-4">Please log in to access this page.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome, {userData?.displayName || user?.displayName || 'User'} 🎉
        </h1>
        <p className="text-slate-300 mb-6">
          You have successfully logged in to your language learning app!
        </p>
      </div>

      {/* Route Information */}
      <div className="w-full max-w-4xl mb-8">
        <AuthStatus />
        <AuthTest />
        <RouteDebugger />
        <RouteGuide />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => navigate('/profile')} 
          className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center"
        >
          👤 View Profile
        </button>
        <button 
          onClick={() => navigate('/diagnostic')} 
          className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-500 transition-colors flex items-center justify-center"
        >
          🔧 Firebase Diagnostic
        </button>
        <button 
          onClick={handleLogout} 
          className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-500 transition-colors flex items-center justify-center"
        >
          🚪 Logout
        </button>
      </div>

      <div className="mt-8 text-center text-slate-400">
        <p className="text-sm">
          User ID: {user?.uid || 'N/A'}
        </p>
        <p className="text-sm">
          Email: {user?.email || 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
