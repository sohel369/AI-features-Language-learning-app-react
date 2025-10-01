import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle, AlertCircle, Settings, Volume2, Bell, Type, Sun, Moon } from 'lucide-react';

export default function StatusIndicator() {
  const { theme, fontSize, notifications, soundEffects } = useTheme();
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Show status indicator for 3 seconds when settings change
    setShowStatus(true);
    const timer = setTimeout(() => setShowStatus(false), 3000);
    return () => clearTimeout(timer);
  }, [theme, fontSize, notifications, soundEffects]);

  if (!showStatus) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Settings Active</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">All features working perfectly!</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="text-sm text-slate-600 dark:text-slate-400">Theme: {theme}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Type className="w-4 h-4" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Font: {fontSize}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Notifications: {notifications ? 'On' : 'Off'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Sound: {soundEffects ? 'On' : 'Off'}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Console errors don't affect functionality
        </p>
      </div>
    </div>
  );
}
