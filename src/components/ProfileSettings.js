import React, { useEffect, useState } from 'react';
import authService from '../services/AuthService';

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

export default function ProfileSettings() {
  const [settings, setSettings] = useState({ darkMode: false, notifications: true, fontSize: 'medium' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user, userData) => {
      if (user && userData?.settings) {
        setSettings({
          darkMode: !!userData.settings.darkMode,
          notifications: userData.settings.notifications !== false,
          fontSize: userData.settings.fontSize || 'medium',
        });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const applyTheme = (s) => {
    const root = document.documentElement;
    if (s.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-font-size', s.fontSize || 'medium');
  };

  const updateSetting = async (partial) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    applyTheme(next);
    setSaving(true);
    try {
      await authService.updateSettings(next);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-200">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <div className="space-y-6 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Dark Mode</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
            </div>
            <button
              onClick={() => updateSetting({ darkMode: !settings.darkMode })}
              className={`${settings.darkMode ? 'bg-blue-600' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span className={`${settings.darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Notifications</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive in-app notifications</p>
            </div>
            <button
              onClick={() => updateSetting({ notifications: !settings.notifications })}
              className={`${settings.notifications ? 'bg-blue-600' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span className={`${settings.notifications ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Font Size</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Adjust interface text size</p>
            </div>
            <select
              className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2"
              value={settings.fontSize}
              onChange={(e) => updateSetting({ fontSize: e.target.value })}
            >
              {fontSizeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {saving && <div className="text-sm text-slate-500">Saving...</div>}
        </div>
      </div>
    </div>
  );
}
