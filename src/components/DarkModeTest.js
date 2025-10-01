import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Monitor, Home, Settings, User } from 'lucide-react';

export default function DarkModeTest() {
  const { theme, setTheme, applyThemeImmediately } = useTheme();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Apply theme immediately
    applyThemeImmediately(newTheme);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            🌙 Dark Mode Test
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Theme Controls */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Theme Controls</h2>
              <div className="space-y-3">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Monitor }
                ].map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                        theme === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                          : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-102'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Test */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Visual Test</h2>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Card Title
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    This card changes color with the theme
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Blue Card
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    This card also adapts to the theme
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Test */}
          <div className="mt-8 bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Click these buttons to test if dark mode persists across navigation:
            </p>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </div>
          </div>

          {/* Current Status */}
          <div className="mt-8 bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🖥️'}
                </div>
                <div className="font-medium">Theme: {theme}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎨</div>
                <div className="font-medium">Background</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">✨</div>
                <div className="font-medium">Status</div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
