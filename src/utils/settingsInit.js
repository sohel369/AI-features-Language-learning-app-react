// Settings initialization utility
export const initializeSettings = () => {
  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  // Load font size from localStorage
  const savedFontSize = localStorage.getItem('fontSize');
  if (savedFontSize) {
    applyFontSize(savedFontSize);
  }

  // Load sound settings
  const savedSound = localStorage.getItem('soundEnabled');
  if (savedSound !== null) {
    document.documentElement.setAttribute('data-sound', savedSound);
  }

  // Load notification settings
  const savedNotifications = localStorage.getItem('notificationsEnabled');
  if (savedNotifications !== null) {
    document.documentElement.setAttribute('data-notifications', savedNotifications);
  }
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  } else {
    // System preference
    root.removeAttribute('data-theme');
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
};

export const applyFontSize = (size) => {
  const root = document.documentElement;
  const sizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px'
  };
  const fontSize = sizeMap[size] || '16px';
  root.style.fontSize = fontSize;
  root.setAttribute('data-font-size', size);
};

export const getDefaultSettings = () => {
  return {
    darkMode: 'system',
    soundEffects: true,
    fontSize: 'medium',
    dailyReminders: true,
    ttsVoice: 'google'
  };
};

export const saveSettings = (settings) => {
  // Save to localStorage
  localStorage.setItem('theme', settings.darkMode);
  localStorage.setItem('fontSize', settings.fontSize);
  localStorage.setItem('soundEnabled', settings.soundEffects.toString());
  localStorage.setItem('notificationsEnabled', settings.dailyReminders.toString());
  
  // Apply settings
  applyTheme(settings.darkMode);
  applyFontSize(settings.fontSize);
};

export const loadSettings = () => {
  return {
    darkMode: localStorage.getItem('theme') || 'system',
    fontSize: localStorage.getItem('fontSize') || 'medium',
    soundEffects: localStorage.getItem('soundEnabled') !== 'false',
    dailyReminders: localStorage.getItem('notificationsEnabled') !== 'false',
    ttsVoice: 'google'
  };
};
