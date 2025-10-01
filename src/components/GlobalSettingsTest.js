import React from 'react';
import { useGlobalSettings } from '../context/GlobalSettingsContext';

export default function GlobalSettingsTest() {
  const { settings, updateSettings, testNotification, testSound } = useGlobalSettings();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Global Settings Test</h1>
        
        {/* Current Settings Display */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Current Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Dark Mode:</strong> {settings.darkMode}
            </div>
            <div>
              <strong>Font Size:</strong> {settings.fontSize}
            </div>
            <div>
              <strong>Sound Effects:</strong> {settings.soundEffects ? 'Enabled' : 'Disabled'}
            </div>
            <div>
              <strong>Notifications:</strong> {settings.dailyReminders ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          {/* Dark Mode Test */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Dark Mode Test</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => updateSettings({ darkMode: 'light' })}
                className={`px-4 py-2 rounded ${settings.darkMode === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Light
              </button>
              <button
                onClick={() => updateSettings({ darkMode: 'dark' })}
                className={`px-4 py-2 rounded ${settings.darkMode === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Dark
              </button>
              <button
                onClick={() => updateSettings({ darkMode: 'system' })}
                className={`px-4 py-2 rounded ${settings.darkMode === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                System
              </button>
            </div>
          </div>

          {/* Font Size Test */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Font Size Test</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => updateSettings({ fontSize: 'small' })}
                className={`px-4 py-2 rounded ${settings.fontSize === 'small' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Small
              </button>
              <button
                onClick={() => updateSettings({ fontSize: 'medium' })}
                className={`px-4 py-2 rounded ${settings.fontSize === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Medium
              </button>
              <button
                onClick={() => updateSettings({ fontSize: 'large' })}
                className={`px-4 py-2 rounded ${settings.fontSize === 'large' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Large
              </button>
            </div>
          </div>

          {/* Sound Test */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Sound Test</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
                className={`px-4 py-2 rounded ${settings.soundEffects ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
              >
                {settings.soundEffects ? 'Disable Sound' : 'Enable Sound'}
              </button>
              <button
                onClick={testSound}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Test Sound
              </button>
            </div>
          </div>

          {/* Notification Test */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Notification Test</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => updateSettings({ dailyReminders: !settings.dailyReminders })}
                className={`px-4 py-2 rounded ${settings.dailyReminders ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
              >
                {settings.dailyReminders ? 'Disable Notifications' : 'Enable Notifications'}
              </button>
              <button
                onClick={testNotification}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Test Notification
              </button>
            </div>
          </div>
        </div>

        {/* Sample Content to Test Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sample Content</h2>
          <p className="mb-4">
            This is a sample paragraph to test the font size settings. 
            When you change the font size, this text should change accordingly.
          </p>
          <p className="mb-4">
            This is another paragraph to demonstrate the dark mode functionality.
            The background and text colors should change when you toggle between light and dark modes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded">
              <h3 className="font-semibold mb-2">Card 1</h3>
              <p>This card should adapt to the current theme and font size.</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded">
              <h3 className="font-semibold mb-2">Card 2</h3>
              <p>This card should also adapt to the current theme and font size.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
