import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Volume2, Type, CheckCircle } from 'lucide-react';

export default function FunctionalityTest() {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    notifications,
    setNotifications,
    soundEffects,
    setSoundEffects
  } = useTheme();

  const testNotification = async () => {
    if (notifications && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('✅ Test Notification', {
          body: 'All settings are working perfectly!',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const testSound = () => {
    if (soundEffects) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🎉 Settings Functionality Test</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test all the settings functionality to ensure everything works properly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dark Mode Test */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" /> : <Sun className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Dark Mode</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Current: {theme}</p>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setTheme('light')}
                className={`w-full p-2 rounded-lg border transition-colors ${
                  theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`w-full p-2 rounded-lg border transition-colors ${
                  theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`w-full p-2 rounded-lg border transition-colors ${
                  theme === 'system' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                System
              </button>
            </div>
          </div>

          {/* Font Size Test */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Type className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Font Size</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Current: {fontSize}</p>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setFontSize('small')}
                className={`w-full p-2 rounded-lg border transition-colors ${
                  fontSize === 'small' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                Small (14px)
              </button>
              <button
                onClick={() => setFontSize('medium')}
                className={`w-full p-2 rounded-lg border transition-colors ${
                  fontSize === 'medium' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                Medium (16px)
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`w-full p-2 rounded-lg border transition-colors ${
                  fontSize === 'large' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                Large (18px)
              </button>
            </div>
          </div>

          {/* Notifications Test */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {notifications ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-full p-2 rounded-lg border transition-colors ${
                  notifications ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                {notifications ? 'Disable' : 'Enable'} Notifications
              </button>
              {notifications && (
                <button
                  onClick={testNotification}
                  className="w-full p-2 rounded-lg border border-orange-200 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  Test Notification
                </button>
              )}
            </div>
          </div>

          {/* Sound Test */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Sound Effects</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {soundEffects ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setSoundEffects(!soundEffects)}
                className={`w-full p-2 rounded-lg border transition-colors ${
                  soundEffects ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                {soundEffects ? 'Disable' : 'Enable'} Sound
              </button>
              {soundEffects && (
                <button
                  onClick={testSound}
                  className="w-full p-2 rounded-lg border border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  Test Sound
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Current Settings Status</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-slate-500 dark:text-slate-400">Theme</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{theme}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-500 dark:text-slate-400">Font Size</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{fontSize}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-500 dark:text-slate-400">Notifications</div>
              <div className={`font-semibold ${notifications ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {notifications ? 'On' : 'Off'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-500 dark:text-slate-400">Sound</div>
              <div className={`font-semibold ${soundEffects ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {soundEffects ? 'On' : 'Off'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
