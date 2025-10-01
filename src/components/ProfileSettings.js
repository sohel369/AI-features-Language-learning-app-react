import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Bell, Volume2, Type, Settings, Save, Check } from 'lucide-react';
import StatusIndicator from './StatusIndicator';

const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
];

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
];

export default function ProfileSettings() {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    notifications,
    setNotifications,
    soundEffects,
    setSoundEffects,
    applyGlobalFontSize
  } = useTheme();

  const [message, setMessage] = useState('');

  // Test notification function
  const testNotification = async () => {
    if (notifications) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('🎉 Test Notification', {
            body: 'This is a test notification from your language learning app! Your settings are working perfectly.',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'language-app-test',
            requireInteraction: false,
            silent: false
          });
          setMessage('✅ Test notification sent successfully!');
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage('❌ Please allow notifications in your browser settings.');
          setTimeout(() => setMessage(''), 3000);
        }
      } else {
        setMessage('❌ Notifications are not supported in this browser.');
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      setMessage('ℹ️ Enable notifications first to test them.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Request notification permission when enabled
  const handleNotificationToggle = async (enabled) => {
    if (enabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifications(true);
        setMessage('✅ Notifications enabled successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Notification permission denied. Please enable in browser settings.');
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      setNotifications(false);
      setMessage('🔕 Notifications disabled');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Test sound function
  const testSound = () => {
    if (soundEffects) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a more pleasant test sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a pleasant chord-like sound
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);
        
        setMessage('🔊 Test sound played successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error playing test sound:', error);
        setMessage('❌ Error playing test sound. Check browser audio permissions.');
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      setMessage('ℹ️ Enable sound effects first to test them.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Enhanced sound effects for interactions
  const playInteractionSound = (type = 'click') => {
    if (!soundEffects) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different sounds for different interactions
      const frequencies = {
        click: 800,
        success: 1000,
        error: 400,
        notification: 600
      };
      
      oscillator.frequency.setValueAtTime(frequencies[type] || 800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing interaction sound:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">App Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Customize your learning experience</p>
        </div>

        {/* Status Message */}
        {message && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Theme Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Sun className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Theme</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred theme</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {THEME_OPTIONS.map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value);
                      playInteractionSound('click');
                      setMessage(`🌙 Theme changed to ${option.label}`);
                      setTimeout(() => setMessage(''), 2000);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                      theme === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                        : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-102'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {option.value === 'system' ? 'Follow system preference' : 
                         option.value === 'light' ? 'Always use light theme' : 
                         'Always use dark theme'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Type className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Font Size</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Adjust text size for better readability</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {FONT_SIZE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFontSize(option.value);
                    applyGlobalFontSize(option.value);
                    playInteractionSound('click');
                    setMessage(`📝 Font size changed to ${option.label}`);
                    setTimeout(() => setMessage(''), 2000);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    fontSize === option.value
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {option.value === 'small' ? '14px' : 
                       option.value === 'large' ? '18px' : '16px'}
                    </div>
                  </div>
                  <div 
                    className="text-slate-600 dark:text-slate-400"
                    style={{ 
                      fontSize: option.value === 'small' ? '14px' : 
                               option.value === 'large' ? '18px' : '16px'
                    }}
                  >
                    Aa
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about your progress</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {notifications ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    handleNotificationToggle(!notifications);
                    playInteractionSound('click');
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                {notifications && (
                  <button
                    onClick={testNotification}
                    className="p-1 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded transition-colors"
                    title="Test notification"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sound Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Sound Effects</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Play sounds for interactions</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Audio Feedback</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {soundEffects ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSoundEffects(!soundEffects);
                    playInteractionSound('click');
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    soundEffects ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundEffects ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                {soundEffects && (
                  <button
                    onClick={testSound}
                    className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors"
                    title="Test sound"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <h4 className="font-medium mb-2">Sample Content</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  This is how your content will look with the current theme and font size settings.
                  The background should change between light and dark modes.
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Small text (12px)</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Medium text (14px)</p>
                  <p className="text-base text-slate-900 dark:text-slate-100">Base text (16px) - Current setting</p>
                  <p className="text-lg text-slate-900 dark:text-slate-100">Large text (18px)</p>
                </div>
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
      
      <StatusIndicator />
    </div>
  );
}

