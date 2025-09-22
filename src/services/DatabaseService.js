// Database Service for managing user data
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  orderBy, 
  limit,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

class DatabaseService {
  constructor() {
    this.db = db;
  }

  // User data methods
  async getUserData(userId) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Get user data error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserData(userId, data) {
    try {
      await updateDoc(doc(this.db, 'users', userId), data);
      return { success: true };
    } catch (error) {
      console.error('Update user data error:', error);
      return { success: false, error: error.message };
    }
  }

  // Quiz methods
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

  // Leaderboard methods
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

  // XP and progress methods
  async addXP(userId, amount) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const newXP = (currentData.xp || 0) + amount;
        const newLevel = Math.floor(newXP / 1000) + 1; // 1000 XP per level
        
        await updateDoc(doc(this.db, 'users', userId), {
          xp: newXP,
          level: newLevel
        });
        
        return { success: true, newXP, newLevel };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Add XP error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateStreak(userId, newStreak) {
    try {
      await updateDoc(doc(this.db, 'users', userId), {
        streak: newStreak,
        lastActivity: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Update streak error:', error);
      return { success: false, error: error.message };
    }
  }

  // Lesson progress methods
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
          lessonProgress: lessonProgress
        });
        
        return { success: true };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Update lesson progress error:', error);
      return { success: false, error: error.message };
    }
  }

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

  // Badge methods
  async addBadge(userId, badgeId) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const badges = currentData.badges || [];
        
        if (!badges.includes(badgeId)) {
          badges.push(badgeId);
          await updateDoc(doc(this.db, 'users', userId), {
            badges: badges
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
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService;
