// Notification Service for LinguaAI
class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.registration = null;
    this.subscription = null;
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      console.log('Notifications are not supported in this browser');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        console.log('Notification permission granted');
        await this.setupServiceWorker();
        return true;
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Setup service worker
  async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        
        // Listen for service worker updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              this.showUpdateNotification();
            }
          });
        });
        
        return this.registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }

  // Show update notification
  showUpdateNotification() {
    if (this.permission === 'granted') {
      new Notification('LinguaAI Update Available', {
        body: 'A new version is available. Click to update.',
        icon: '/icons/icon-192x192.png',
        tag: 'update-notification',
        requireInteraction: true,
        actions: [
          { action: 'update', title: 'Update Now' },
          { action: 'dismiss', title: 'Later' }
        ]
      });
    }
  }

  // Send local notification
  sendNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    const defaultOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'linguaai-notification',
      requireInteraction: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto-close after 5 seconds unless requireInteraction is true
      if (!defaultOptions.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
      
      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  // Send learning reminder
  sendLearningReminder() {
    this.sendNotification('Time to Learn! 🎓', {
      body: 'Your daily learning session is ready. Let\'s continue your language journey!',
      tag: 'learning-reminder',
      requireInteraction: true,
      actions: [
        { action: 'start-learning', title: 'Start Learning' },
        { action: 'snooze', title: 'Remind Later' }
      ]
    });
  }

  // Send achievement notification
  sendAchievementNotification(achievement) {
    this.sendNotification(`Achievement Unlocked! 🏆`, {
      body: `You've earned "${achievement.name}" - ${achievement.description}`,
      icon: '/icons/icon-192x192.png',
      tag: 'achievement-notification',
      requireInteraction: true,
      actions: [
        { action: 'view-achievement', title: 'View Achievement' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    });
  }

  // Send live session notification
  sendLiveSessionNotification(sessionInfo) {
    this.sendNotification('Live Session Available! 🎥', {
      body: `Join ${sessionInfo.teacher} for a live ${sessionInfo.language} session`,
      tag: 'live-session-notification',
      requireInteraction: true,
      actions: [
        { action: 'join-session', title: 'Join Now' },
        { action: 'dismiss', title: 'Not Now' }
      ]
    });
  }

  // Send streak reminder
  sendStreakReminder(streakDays) {
    this.sendNotification(`Keep Your Streak! 🔥`, {
      body: `You're on a ${streakDays}-day learning streak! Don't break it now.`,
      tag: 'streak-reminder',
      requireInteraction: true,
      actions: [
        { action: 'continue-streak', title: 'Continue Learning' },
        { action: 'dismiss', title: 'Maybe Later' }
      ]
    });
  }

  // Send progress notification
  sendProgressNotification(progress) {
    this.sendNotification('Great Progress! 📈', {
      body: `You've completed ${progress.lessonsCompleted} lessons and learned ${progress.wordsLearned} new words!`,
      tag: 'progress-notification',
      requireInteraction: false
    });
  }

  // Setup push notifications (for server-sent notifications)
  async setupPushNotifications() {
    if (!this.registration) {
      await this.setupServiceWorker();
    }

    if (!this.registration) {
      console.log('Service Worker not available for push notifications');
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa40HI8Y8yA9uM5VXx4' // Replace with your VAPID key
        )
      });

      this.subscription = subscription;
      console.log('Push subscription created:', subscription);
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Error setting up push notifications:', error);
      return null;
    }
  }

  // Send subscription to server
  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      if (response.ok) {
        console.log('Subscription sent to server successfully');
      } else {
        console.error('Failed to send subscription to server');
      }
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  }

  // Convert VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Schedule learning reminders
  scheduleLearningReminders() {
    // Schedule daily reminder at 9 AM
    const now = new Date();
    const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.sendLearningReminder();
      // Schedule next reminder
      this.scheduleLearningReminders();
    }, timeUntilReminder);
  }

  // Clear all notifications
  clearAllNotifications() {
    if (this.registration) {
      this.registration.getNotifications().then(notifications => {
        notifications.forEach(notification => {
          notification.close();
        });
      });
    }
  }

  // Get notification permission status
  getPermissionStatus() {
    return this.permission;
  }

  // Check if notifications are supported
  isNotificationSupported() {
    return this.isSupported;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
