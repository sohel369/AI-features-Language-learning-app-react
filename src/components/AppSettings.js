import React from 'react';
import { useAppSettings } from '../context/AppSettingsContext';
import { 
  Moon, 
  Sun, 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Settings as SettingsIcon,
  Check
} from 'lucide-react';

const AppSettings = () => {
  const {
    settings,
    isDarkMode,
    fontSizeClass,
    toggleDarkMode,
    toggleNotifications,
    toggleSound,
    setFontSize,
    playSound
  } = useAppSettings();

  const handleSettingChange = (setting, value) => {
    if (setting === 'darkMode') {
      toggleDarkMode();
    } else if (setting === 'notifications') {
      toggleNotifications();
    } else if (setting === 'sound') {
      toggleSound();
    } else if (setting === 'fontSize') {
      setFontSize(value);
    }
    
    // Play sound feedback if enabled
    if (settings.sound) {
      playSound('click');
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6">
      <div className="flex items-center mb-6">
        <SettingsIcon className="w-6 h-6 text-blue-400 mr-3" />
        <h3 className={`font-bold text-white ${fontSizeClass === 'text-sm' ? 'text-lg' : fontSizeClass === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
          App Settings
        </h3>
      </div>
      
      <div className="space-y-6">
        {/* Dark Mode */}
        <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center mr-4">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-yellow-400" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </div>
            <div>
              <div className="font-medium text-white">Dark Mode</div>
              <div className="text-sm text-slate-400">Toggle dark/light theme</div>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
            className={`w-14 h-7 rounded-full transition-all duration-300 ${
              settings.darkMode ? 'bg-blue-600' : 'bg-slate-600'
            }`}
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
              settings.darkMode ? 'translate-x-7' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center mr-4">
              {settings.notifications ? (
                <Bell className="w-5 h-5 text-green-400" />
              ) : (
                <BellOff className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <div className="font-medium text-white">Notifications</div>
              <div className="text-sm text-slate-400">Enable push notifications</div>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange('notifications', !settings.notifications)}
            className={`w-14 h-7 rounded-full transition-all duration-300 ${
              settings.notifications ? 'bg-blue-600' : 'bg-slate-600'
            }`}
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
              settings.notifications ? 'translate-x-7' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center mr-4">
              {settings.sound ? (
                <Volume2 className="w-5 h-5 text-green-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <div className="font-medium text-white">Sound</div>
              <div className="text-sm text-slate-400">Enable audio feedback</div>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange('sound', !settings.sound)}
            className={`w-14 h-7 rounded-full transition-all duration-300 ${
              settings.sound ? 'bg-blue-600' : 'bg-slate-600'
            }`}
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
              settings.sound ? 'translate-x-7' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* Font Size */}
        <div className="p-4 bg-slate-700/50 rounded-xl">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center mr-4">
              <Type className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-white">Font Size</div>
              <div className="text-sm text-slate-400">Adjust text size for better readability</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'small', label: 'Small', size: 'text-sm' },
              { value: 'medium', label: 'Medium', size: 'text-base' },
              { value: 'large', label: 'Large', size: 'text-lg' }
            ].map((size) => (
              <button
                key={size.value}
                onClick={() => handleSettingChange('fontSize', size.value)}
                className={`flex items-center justify-center p-3 rounded-lg font-medium transition-all duration-300 ${
                  settings.fontSize === size.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                {settings.fontSize === size.value && (
                  <Check className="w-4 h-4 mr-2" />
                )}
                <span className={size.size}>{size.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Preview */}
        <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/20">
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-green-400 font-medium">Settings Active</span>
          </div>
          <div className="text-sm text-slate-300">
            <div className="flex items-center justify-between mb-2">
              <span>Theme:</span>
              <span className="text-blue-400">{isDarkMode ? 'Dark' : 'Light'}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Notifications:</span>
              <span className={settings.notifications ? 'text-green-400' : 'text-red-400'}>
                {settings.notifications ? 'On' : 'Off'}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Sound:</span>
              <span className={settings.sound ? 'text-green-400' : 'text-red-400'}>
                {settings.sound ? 'On' : 'Off'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Font Size:</span>
              <span className="text-blue-400 capitalize">{settings.fontSize}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;