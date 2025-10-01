import React, { useState } from 'react';
import SettingsService from '../services/SettingsService';
import { User, Mail, LogIn, AlertCircle, CheckCircle } from 'lucide-react';

export default function DemoAuth() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(SettingsService.isAuthenticated());

  const handleCreateDemoUser = async (e) => {
    e.preventDefault();
    if (!email || !displayName) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await SettingsService.createDemoUser(email, displayName);
      if (result.success) {
        setMessage('Demo user created successfully! You can now use the settings.');
        setIsAuthenticated(true);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    SettingsService.logout();
    setIsAuthenticated(false);
    setMessage('Logged out successfully');
  };

  const testConnection = async () => {
    setLoading(true);
    const isConnected = await SettingsService.testConnection();
    setMessage(isConnected ? 'Server connection successful!' : 'Server connection failed');
    setLoading(false);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Demo User Authenticated
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              You can now access the settings page with backend integration.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>Test Server Connection</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
              message.includes('successful') || message.includes('Server connection')
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {message.includes('successful') || message.includes('Server connection') ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Demo Authentication
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Create a demo user to test backend integration with settings.
          </p>
        </div>

        <form onSubmit={handleCreateDemoUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your display name"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span>{loading ? 'Creating...' : 'Create Demo User'}</span>
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
            message.includes('successfully')
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {message.includes('successfully') ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{message}</span>
          </div>
        )}

        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Backend Setup Required:</h3>
          <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>1. Install MongoDB</li>
            <li>2. Run: <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">cd server && npm install</code></li>
            <li>3. Run: <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">npm start</code></li>
            <li>4. Server will run on http://localhost:5000</li>
          </ol>
        </div>
      </div>
    </div>
  );
}