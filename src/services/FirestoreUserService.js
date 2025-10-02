// Firestore User Data Service
import { db } from '../firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit,
  where,
  getDocs
} from 'firebase/firestore';

class FirestoreUserService {
  constructor() {
    this.db = db;
  }

  // Get user profile data
  async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      }
      return { success: false, error: 'User profile not found' };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const updateData = {
        ...profileData,
        updatedAt: new Date()
      };

      await updateDoc(doc(this.db, 'users', userId), updateData);
      return { success: true };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user settings
  async updateUserSettings(userId, settings) {
    try {
      await updateDoc(doc(this.db, 'users', userId), {
        settings: settings,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Update user settings error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update learning languages
  async updateLearningLanguages(userId, languages) {
    try {
      await updateDoc(doc(this.db, 'users', userId), {
        learningLanguages: languages,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Update learning languages error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update base language
  async updateBaseLanguage(userId, language) {
    try {
      await updateDoc(doc(this.db, 'users', userId), {
        baseLanguage: language,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Update base language error:', error);
      return { success: false, error: error.message };
    }
  }

  // Save quiz score
  async saveQuizScore(userId, quizData) {
    try {
      const quizScore = {
        userId: userId,
        language: quizData.language,
        score: quizData.score,
        totalQuestions: quizData.totalQuestions,
        correctAnswers: quizData.correctAnswers,
        timeSpent: quizData.timeSpent,
        completedAt: new Date(),
        level: quizData.level || 'beginner'
      };

      await addDoc(collection(this.db, 'quizScores'), quizScore);
      
      // Update user's total XP
      const xpGained = Math.floor((quizData.score / quizData.totalQuestions) * 100);
      await this.addXP(userId, xpGained);
      
      return { success: true, xpGained };
    } catch (error) {
      console.error('Save quiz score error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get quiz scores
  async getQuizScores(userId, language = null) {
    try {
      let q = query(collection(this.db, 'quizScores'), orderBy('completedAt', 'desc'));
      if (language) {
        q = query(collection(this.db, 'quizScores'), where('language', '==', language), orderBy('completedAt', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const scores = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, data: scores };
    } catch (error) {
      console.error('Get quiz scores error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get leaderboard
  async getLeaderboard(limitCount = 10) {
    try {
      const q = query(
        collection(this.db, 'users'), 
        orderBy('xp', 'desc'), 
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const leaderboard = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, data: leaderboard };
    } catch (error) {
      console.error('Get leaderboard error:', error);
      return { success: false, error: error.message };
    }
  }

  // Add XP to user
  async addXP(userId, amount) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const newXP = (currentData.xp || 0) + amount;
        const newLevel = Math.floor(newXP / 1000) + 1; // 1000 XP per level
        
        await updateDoc(doc(this.db, 'users', userId), {
          xp: newXP,
          level: newLevel,
          updatedAt: new Date()
        });
        
        return { success: true, newXP, newLevel };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Add XP error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update streak
  async updateStreak(userId, newStreak) {
    try {
      await updateDoc(doc(this.db, 'users', userId), {
        streak: newStreak,
        lastActivity: new Date(),
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Update streak error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update lesson progress
  async updateLessonProgress(userId, language, lessonId, progress) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const lessonProgress = currentData.lessonProgress || {};
        
        if (!lessonProgress[language]) {
          lessonProgress[language] = {};
        }
        
        lessonProgress[language][lessonId] = {
          ...lessonProgress[language][lessonId],
          ...progress,
          lastUpdated: new Date()
        };
        
        await updateDoc(doc(this.db, 'users', userId), {
          lessonProgress: lessonProgress,
          updatedAt: new Date()
        });
        
        return { success: true };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Update lesson progress error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get lesson progress
  async getLessonProgress(userId, language) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const lessonProgress = currentData.lessonProgress || {};
        return { success: true, data: lessonProgress[language] || {} };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Get lesson progress error:', error);
      return { success: false, error: error.message };
    }
  }

  // Add badge
  async addBadge(userId, badgeId) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const badges = currentData.badges || [];
        
        if (!badges.includes(badgeId)) {
          badges.push(badgeId);
          await updateDoc(doc(this.db, 'users', userId), {
            badges: badges,
            updatedAt: new Date()
          });
        }
        
        return { success: true };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Add badge error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user statistics
  async getUserStats(userId) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const quizScores = await this.getQuizScores(userId);
        
        return {
          success: true,
          data: {
            xp: userData.xp || 0,
            level: userData.level || 1,
            streak: userData.streak || 0,
            badges: userData.badges || [],
            totalQuizzes: quizScores.success ? quizScores.data.length : 0,
            averageScore: quizScores.success && quizScores.data.length > 0 
              ? Math.round(quizScores.data.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) / quizScores.data.length)
              : 0
          }
        };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Get user stats error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create initial user profile
  async createUserProfile(userId, userData) {
    try {
      const profileData = {
        uid: userId,
        email: userData.email,
        displayName: userData.displayName,
        fullName: userData.fullName || '',
        username: userData.username || userData.email.split('@')[0],
        country: userData.country || '',
        preferredLanguage: userData.preferredLanguage || 'english',
        baseLanguage: userData.baseLanguage || 'english',
        learningLanguages: userData.learningLanguages || [],
        settings: {
          darkMode: false,
          notifications: true,
          sound: true,
          fontSize: 'medium'
        },
        xp: 0,
        level: 1,
        streak: 0,
        badges: [],
        lessonProgress: {},
        createdAt: new Date(),
        lastLogin: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(this.db, 'users', userId), profileData);
      return { success: true, data: profileData };
    } catch (error) {
      console.error('Create user profile error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const firestoreUserService = new FirestoreUserService();
export default firestoreUserService;
