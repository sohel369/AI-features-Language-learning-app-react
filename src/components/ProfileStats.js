import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Star, Award, Target, Zap, Crown, Medal, Globe, Book, TrendingUp, Clock, Users } from 'lucide-react';
import authService from '../services/AuthService';

const ACHIEVEMENTS = [
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: Star, unlocked: true, xp: 50 },
  { id: 'week_streak', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: Flame, unlocked: true, xp: 100 },
  { id: 'quiz_master', name: 'Quiz Master', description: 'Score 100% on 5 quizzes', icon: Target, unlocked: false, xp: 200 },
  { id: 'language_explorer', name: 'Language Explorer', description: 'Learn 3 different languages', icon: Globe, unlocked: false, xp: 300 },
  { id: 'xp_collector', name: 'XP Collector', description: 'Earn 1000 total XP', icon: Zap, unlocked: false, xp: 500 },
  { id: 'level_up', name: 'Level Up', description: 'Reach level 5', icon: Crown, unlocked: false, xp: 250 },
  { id: 'perfect_week', name: 'Perfect Week', description: 'Complete lessons 7 days in a row', icon: Medal, unlocked: false, xp: 400 },
  { id: 'polyglot', name: 'Polyglot', description: 'Master 5 languages', icon: Trophy, unlocked: false, xp: 1000 }
];

const BADGES = [
  { id: 'beginner', name: 'Beginner', description: 'Started learning journey', icon: Star, earned: true },
  { id: 'dedicated', name: 'Dedicated', description: '7-day streak', icon: Flame, earned: true },
  { id: 'smart', name: 'Smart', description: 'High quiz scores', icon: Target, earned: false },
  { id: 'explorer', name: 'Explorer', description: 'Multiple languages', icon: Globe, earned: false }
];

const LEARNING_LANGUAGES = {
  english: { name: 'English', flag: '🇺🇸', progress: 75, level: 'B2', wordsLearned: 1250 },
  arabic: { name: 'العربية', flag: '🇸🇦', progress: 45, level: 'A2', wordsLearned: 680 },
  dutch: { name: 'Nederlands', flag: '🇳🇱', progress: 30, level: 'A1', wordsLearned: 320 },
  indonesian: { name: 'Bahasa Indonesia', flag: '🇮🇩', progress: 60, level: 'B1', wordsLearned: 890 }
};

export default function ProfileStats() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user, data) => {
      setUserData(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-200">Loading...</div>;
  }

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center text-slate-200">No user data</div>;
  }

  const { xp = 0, level = 1, streak = 0, badges = [] } = userData;
  const nextLevelXP = level * 1000;
  const currentLevelXP = (level - 1) * 1000;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">
              {userData?.displayName?.charAt(0) || 'U'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your learning preferences</p>
        </div>

        {/* Learning Languages Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Book className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Learning Languages</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(LEARNING_LANGUAGES).map(([code, lang]) => (
              <div key={code} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{lang.name}</h4>
                      <p className="text-sm text-gray-600">Level {lang.level} • {lang.wordsLearned} words learned</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{lang.progress}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${lang.progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{xp.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total XP</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="p-2 bg-orange-100 rounded-lg w-fit mx-auto mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
              <Crown className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{level}</div>
            <div className="text-sm text-gray-600">Level</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{badges.length}</div>
            <div className="text-sm text-gray-600">Badges</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Level Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Level {level}</span>
              <span>{xp.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {nextLevelXP - xp} XP until Level {level + 1}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Book className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Completed English lesson</p>
                <p className="text-xs text-gray-500">2 hours ago • +50 XP</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Quiz completed</p>
                <p className="text-xs text-gray-500">Yesterday • +25 XP</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">7-day streak achieved</p>
                <p className="text-xs text-gray-500">3 days ago • +100 XP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
