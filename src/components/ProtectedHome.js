// Protected Home Component
import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import HomePage from './HomePage';

const ProtectedHome = () => {
  const { user, isLoading } = React.useContext(UserContext);
  
  console.log('ProtectedHome - User:', user);
  console.log('ProtectedHome - Loading:', isLoading);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log('ProtectedHome - No user, redirecting to login');
    return <Navigate to="/" replace />;
  }
  
  console.log('ProtectedHome - User authenticated, showing HomePage');
  return <HomePage />;
};

export default ProtectedHome;
