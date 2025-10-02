// RouteInfo Component - Shows current route information
import React from 'react';
import useCurrentRoute from '../hooks/useCurrentRoute';

const RouteInfo = () => {
  const route = useCurrentRoute();

  return (
    <div className="bg-slate-800 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">Current Route Info</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-300">Pathname:</span>
          <span className="text-blue-300">{route.pathname}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Route Name:</span>
          <span className="text-green-300">{route.getRouteName()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Is Protected:</span>
          <span className={route.isProtected() ? 'text-red-300' : 'text-green-300'}>
            {route.isProtected() ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Is Home:</span>
          <span className={route.isHome ? 'text-green-300' : 'text-slate-400'}>
            {route.isHome ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Is Login:</span>
          <span className={route.isLogin ? 'text-green-300' : 'text-slate-400'}>
            {route.isLogin ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RouteInfo;
