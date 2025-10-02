// Route Test Component - Test route navigation
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RouteTest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const testNavigation = () => {
    console.log('Testing navigation to /home');
    navigate('/home');
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg mb-4 border border-slate-600">
      <h3 className="text-lg font-bold text-white mb-3">🧪 Route Test</h3>
      
      <div className="space-y-4">
        <div className="bg-slate-700 p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-300 mb-2">Current Route</h4>
          <p className="text-slate-300 text-sm">Pathname: <span className="text-blue-300 font-mono">{location.pathname}</span></p>
        </div>

        <div className="bg-slate-700 p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-green-300 mb-2">Navigation Test</h4>
          <button
            onClick={testNavigation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Test Navigate to /home
          </button>
        </div>

        <div className="bg-slate-700 p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-300 mb-2">Direct Links</h4>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/home')}
              className="block w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-500 transition-colors"
            >
              Go to /home
            </button>
            <button
              onClick={() => navigate('/')}
              className="block w-full px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors"
            >
              Go to / (login)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteTest;
