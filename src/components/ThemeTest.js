import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeTest() {
  const { theme, fontSize, setTheme, setFontSize } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Theme Test Component</h1>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Settings</h2>
          <div className="space-y-2">
            <p>Theme: <span className="font-bold text-blue-600 dark:text-blue-400">{theme}</span></p>
            <p>Font Size: <span className="font-bold text-green-600 dark:text-green-400">{fontSize}</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-xl font-semibold mb-4">Theme Controls</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="flex space-x-2">
                {['light', 'dark', 'system'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-2 rounded-lg ${
                      theme === t 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <div className="flex space-x-2">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-4 py-2 rounded-lg ${
                      fontSize === size 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <h3 className="font-semibold mb-2">Sample Content</h3>
              <p className="text-slate-600 dark:text-slate-400">
                This is how your content will look with the current theme and font size settings.
                The background should change between light and dark modes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Blue Card</h4>
                <p className="text-blue-700 dark:text-blue-300">This card has blue styling</p>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100">Green Card</h4>
                <p className="text-green-700 dark:text-green-300">This card has green styling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
