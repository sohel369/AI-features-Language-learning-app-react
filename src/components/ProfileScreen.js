import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Settings, 
  Trophy, 
  Zap, 
  Flame, 
  Award, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  Volume2, 
  Check,
  Crown,
  Target,
  BookMarked,
  Users,
  BarChart3,
  Clock,
  Calendar,
  MessageCircle,
  Send,
  Bot,
  Sparkles,
  Lightbulb,
  GraduationCap,
  Languages,
  Flag,
  MapPin,
  Heart,
  Gift,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Edit3,
  Save,
  X,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Menu,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  MoreVertical,
  ExternalLink,
  Copy,
  Share2,
  Mail,
  Phone,
  Map,
  Navigation,
  Compass,
  MapPin as Location,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Timer,
  Stopwatch,
  Hourglass,
  Activity,
  Pulse,
  Heart as HeartIcon,
  Battery,
  Wifi,
  Signal,
  WifiOff,
  SignalZero,
  SignalLow,
  SignalMedium,
  SignalHigh,
  SignalMax
} from 'lucide-react';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import firestoreUserService from '../services/FirestoreUserService';

const ProfileScreen = ({ globalLanguage, onGlobalLanguageChange }) => {
  const { user, userData, isAuthenticated, isLoading: authLoading, updateProfile, updateSettings, updateLearningLanguages, updateBaseLanguage } = useContext(UserContext);
  
  const [activeTab, setActiveTab] = useState('stats');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [learningLanguages, setLearningLanguages] = useState([]);
  const [userSettings, setUserSettings] = useState({
    darkMode: true,
    notifications: true,
    sound: true,
    fontSize: 'medium'
  });
  const [fontSize, setFontSize] = useState('text-base');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    fullName: '',
    username: '',
    country: '',
    preferredLanguage: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const INTERFACE_LANGUAGES = {
    en: { name: 'English', flag: '🇬🇧', rtl: false },
    ar: { name: 'العربية', flag: '🇸🇦', rtl: true },
    nl: { name: 'Nederlands', flag: '🇳🇱', rtl: false },
    th: { name: 'ไทย', flag: '🇹🇭', rtl: false },
    km: { name: 'ខ្មែរ', flag: '🇰🇭', rtl: false },
    id: { name: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
    ms: { name: 'Bahasa Melayu', flag: '🇲🇾', rtl: false }
  };

  const LEARNING_LANGUAGES = {
    es: { name: 'Arabic', flag: '🇸🇦' },
    fr: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
    de: { name: 'Dutch', flag: '🇳🇱' },
    it: { name: 'Malay', flag: '🇲🇾' },
    pt: { name: 'Thai', flag: '🇹🇭' },
    ja: { name: 'Khmer', flag: '🇰🇭' },
    ko: { name: 'English', flag: '🇬🇧' },
  };

  const ACHIEVEMENTS = [
    { id: 'quick-learner', name: 'Quick Learner', description: 'Complete 10 lessons in one day', icon: Zap, color: 'text-yellow-400' },
    { id: 'streak-master', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: Flame, color: 'text-orange-400' },
    { id: 'vocabulary-champion', name: 'Vocabulary Champion', description: 'Learn 300+ words', icon: Crown, color: 'text-purple-400' },
    { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% in 5 lessons', icon: Star, color: 'text-blue-400' },
    { id: 'social-butterfly', name: 'Social Butterfly', description: 'Join the leaderboard', icon: Users, color: 'text-pink-400' }
  ];

  // Load user data from Firebase
  useEffect(() => {
    if (userData) {
      // Set user settings from Firestore
      if (userData.settings) {
        setUserSettings(userData.settings);
        const sizeMap = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
        setFontSize(sizeMap[userData.settings.fontSize] || 'text-base');
      }
      
      // Set learning languages from Firestore
      if (userData.learningLanguages) {
        setLearningLanguages(userData.learningLanguages);
      }
      
      // Set base language
      if (userData.baseLanguage) {
        setSelectedLanguage(userData.baseLanguage);
      }
      
      // Initialize edit form data
      setEditFormData({
        displayName: userData.displayName || '',
        fullName: userData.fullName || '',
        username: userData.username || '',
        country: userData.country || '',
        preferredLanguage: userData.preferredLanguage || ''
      });
    }
  }, [userData]);

  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoadingLeaderboard(true);
      try {
        const result = await firestoreUserService.getLeaderboard(10);
        if (result.success) {
          setLeaderboard(result.data);
        } else {
          console.error('Failed to load leaderboard:', result.error);
          // Fallback to empty leaderboard
          setLeaderboard([]);
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        setLeaderboard([]);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };
    
    if (isAuthenticated) {
    loadLeaderboard();
    }
  }, [isAuthenticated]);

  const handleLanguageChange = async (type, language) => {
    if (type === 'base') {
      setSelectedLanguage(language);
      const sizeMap = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
      setFontSize(sizeMap[userSettings.fontSize]);
      
      // Update in Firebase
      try {
        await updateBaseLanguage(language);
      } catch (error) {
        console.error('Failed to update base language:', error);
      }
    } else {
      const newLearningLanguages = learningLanguages.includes(language)
        ? learningLanguages.filter(l => l !== language)
        : [...learningLanguages, language];
      
      setLearningLanguages(newLearningLanguages);
      
      // Update in Firebase
      try {
        await updateLearningLanguages(newLearningLanguages);
      } catch (error) {
        console.error('Failed to update learning languages:', error);
      }
    }
  };

  const handleSettingChange = async (setting, value) => {
    const newSettings = { ...userSettings, [setting]: value };
    setUserSettings(newSettings);
    
    if (setting === 'fontSize') {
      const sizeMap = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
      setFontSize(sizeMap[value]);
    }
    
    // Update in Firebase
    try {
      await updateSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const currentLanguage = INTERFACE_LANGUAGES[selectedLanguage];

  // Profile editing handlers
  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    // Reset form data to original values
    setEditFormData({
      displayName: userData.displayName || '',
      fullName: userData.fullName || '',
      username: userData.username || '',
      country: userData.country || '',
      preferredLanguage: userData.preferredLanguage || ''
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const result = await updateProfile(editFormData);
      if (result.success) {
        setIsEditingProfile(false);
      } else {
        console.error('Failed to update profile:', result.error);
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-xl mb-4">Authentication required</p>
          <p className="text-slate-400">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-2xl' : fontSize === 'text-base' ? 'text-3xl' : 'text-4xl'}`}>
              Profile
            </h1>
            <p className="text-slate-400 mt-1">Track your progress and customize your experience</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Profile</span>
            </button>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {userData.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-slate-700/50">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'stats', label: 'Stats', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl">
                    {userData.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className={`font-bold mb-2 ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-base' ? 'text-2xl' : 'text-3xl'}`}>
                      {userData.displayName || 'Language Learner'}
                    </h2>
                    <p className="text-blue-200 text-lg">{user?.email}</p>
                    <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                      {learningLanguages.map((lang) => (
                        <span key={lang} className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                          {LEARNING_LANGUAGES[lang]?.flag} {LEARNING_LANGUAGES[lang]?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-5 bg-white/10 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                    <Zap className="text-yellow-400 mx-auto mb-3" size={28} />
                    <div className="text-3xl font-bold mb-1">{userData.xp || 0}</div>
                    <div className="text-sm text-blue-200">Total XP</div>
                  </div>
                  <div className="text-center p-5 bg-white/10 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                    <Flame className="text-orange-400 mx-auto mb-3" size={28} />
                    <div className="text-3xl font-bold mb-1">{userData.streak || 0}</div>
                    <div className="text-sm text-blue-200">Day Streak</div>
                  </div>
                  <div className="text-center p-5 bg-white/10 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                    <Trophy className="text-yellow-400 mx-auto mb-3" size={28} />
                    <div className="text-3xl font-bold mb-1">{userData.level || 1}</div>
                    <div className="text-sm text-blue-200">Level</div>
                  </div>
                  <div className="text-center p-5 bg-white/10 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                    <Award className="text-purple-400 mx-auto mb-3" size={28} />
                    <div className="text-3xl font-bold mb-1">{userData.badges?.length || 0}</div>
                    <div className="text-sm text-blue-200">Badges</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Edit Section */}
            {isEditingProfile && (
              <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <Edit3 className="text-green-400" size={28} />
                  <h3 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-base' ? 'text-2xl' : 'text-3xl'}`}>
                    Edit Profile
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Display Name */}
                  <div>
                    <label className="block text-white font-medium mb-2">Display Name</label>
                    <input
                      type="text"
                      value={editFormData.displayName}
                      onChange={(e) => handleEditFormChange('displayName', e.target.value)}
                      className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter display name"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-white font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) => handleEditFormChange('fullName', e.target.value)}
                      className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-white font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={editFormData.username}
                      onChange={(e) => handleEditFormChange('username', e.target.value)}
                      className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter username"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-white font-medium mb-2">Country</label>
                    <input
                      type="text"
                      value={editFormData.country}
                      onChange={(e) => handleEditFormChange('country', e.target.value)}
                      className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter country"
                    />
                  </div>

                  {/* Preferred Language */}
                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">Preferred Language</label>
                    <select
                      value={editFormData.preferredLanguage}
                      onChange={(e) => handleEditFormChange('preferredLanguage', e.target.value)}
                      className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="italian">Italian</option>
                      <option value="portuguese">Portuguese</option>
                      <option value="japanese">Japanese</option>
                      <option value="korean">Korean</option>
                      <option value="chinese">Chinese</option>
                      <option value="arabic">Arabic</option>
                      <option value="dutch">Dutch</option>
                      <option value="thai">Thai</option>
                      <option value="khmer">Khmer</option>
                      <option value="indonesian">Indonesian</option>
                      <option value="malay">Malay</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingProfile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSavingProfile}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Learning Stats */}
            <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-blue-400" size={28} />
                <h3 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-base' ? 'text-2xl' : 'text-3xl'}`}>
                  Learning Stats
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{userData.xp || 0}</div>
                  <div className="text-slate-400">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{userData.streak || 0}</div>
                  <div className="text-slate-400">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{userData.wordsLearned || 0}</div>
                  <div className="text-slate-400">Words Learned</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{userData.level || 1}</div>
                  <div className="text-slate-400">Level</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <Award className="text-yellow-400" size={28} />
                <h3 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-base' ? 'text-2xl' : 'text-3xl'}`}>
                  Achievements
                </h3>
              </div>
              <div className="grid gap-4">
                {ACHIEVEMENTS.map((achievement) => {
                  const isUnlocked = userData.badges?.includes(achievement.id) || false;
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-slate-700/50 to-slate-600/30 border-blue-500/50 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-700/30 border-slate-600/30 opacity-60'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-slate-600'}`}>
                        <Icon className={isUnlocked ? achievement.color : 'text-slate-400'} size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg">{achievement.name}</div>
                        <div className="text-slate-400 text-sm">{achievement.description}</div>
                      </div>
                      {isUnlocked && (
                        <Check className="text-green-400" size={24} />
                      )}
                    </div>
                  );
                })}
              </div>
              {(!userData.badges || userData.badges.length === 0) && (
                <p className="text-slate-400 text-center py-8">No achievements yet. Keep learning to unlock them!</p>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Language Settings */}
            <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="text-blue-400" size={28} />
                <h3 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-base' ? 'text-2xl' : 'text-3xl'}`}>
                  Interface Language
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(INTERFACE_LANGUAGES).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageChange('base', key)}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                      selectedLanguage === key
                        ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/20'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{lang.flag}</div>
                    <div className={`font-semibold ${selectedLanguage === key ? 'text-blue-300' : 'text-slate-300'}`}>
                      {lang.name}
                    </div>
                    {selectedLanguage === key && (
                      <Check className="text-blue-400 mx-auto mt-2" size={20} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Languages */}
            <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="text-purple-400" size={28} />
                <h3 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-base' ? 'text-2xl' : 'text-3xl'}`}>
                  Learning Languages
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(LEARNING_LANGUAGES).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageChange('learning', key)}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                      learningLanguages.includes(key)
                        ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/20'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{lang.flag}</div>
                    <div className={`font-semibold ${learningLanguages.includes(key) ? 'text-purple-300' : 'text-slate-300'}`}>
                      {lang.name}
                    </div>
                    {learningLanguages.includes(key) && (
                      <Check className="text-purple-400 mx-auto mt-2" size={20} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* App Settings */}
            <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="text-green-400" size={28} />
                <h3 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-base' ? 'text-2xl' : 'text-3xl'}`}>
                  App Settings
                </h3>
              </div>
              <div className="space-y-5">
                {/* Dark Mode */}
                <div className="flex items-center justify-between p-5 bg-slate-700/30 rounded-2xl hover:bg-slate-700/50 transition-all">
                  <div className="flex items-center gap-4">
                    {userSettings.darkMode ? <Moon size={24} className="text-blue-400" /> : <Sun size={24} className="text-yellow-400" />}
                    <div>
                      <div className="font-semibold text-white text-lg">Dark Mode</div>
                      <div className="text-sm text-slate-400">Toggle dark/light theme</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('darkMode', !userSettings.darkMode)}
                    className={`w-16 h-8 rounded-full transition-all duration-300 relative ${
                      userSettings.darkMode ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 absolute top-1 ${
                        userSettings.darkMode ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-5 bg-slate-700/30 rounded-2xl hover:bg-slate-700/50 transition-all">
                  <div className="flex items-center gap-4">
                    <Bell size={24} className="text-orange-400" />
                    <div>
                      <div className="font-semibold text-white text-lg">Notifications</div>
                      <div className="text-sm text-slate-400">Enable push notifications</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', !userSettings.notifications)}
                    className={`w-16 h-8 rounded-full transition-all duration-300 relative ${
                      userSettings.notifications ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 absolute top-1 ${
                        userSettings.notifications ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Sound */}
                <div className="flex items-center justify-between p-5 bg-slate-700/30 rounded-2xl hover:bg-slate-700/50 transition-all">
                  <div className="flex items-center gap-4">
                    <Volume2 size={24} className="text-purple-400" />
                    <div>
                      <div className="font-semibold text-white text-lg">Sound</div>
                      <div className="text-sm text-slate-400">Enable audio feedback</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('sound', !userSettings.sound)}
                    className={`w-16 h-8 rounded-full transition-all duration-300 relative ${
                      userSettings.sound ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 absolute top-1 ${
                        userSettings.sound ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Font Size */}
                <div className="p-5 bg-slate-700/30 rounded-2xl">
                  <div className="font-semibold text-white text-lg mb-4">Font Size</div>
                  <div className="flex gap-3">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSettingChange('fontSize', size)}
                        className={`flex-1 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          userSettings.fontSize === size
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="text-yellow-400" size={28} />
                <h3 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-base' ? 'text-2xl' : 'text-3xl'}`}>
                  Leaderboard
                </h3>
              </div>
              {isLoadingLeaderboard ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading leaderboard...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaderboard.map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl ${
                        player.uid === user?.uid
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50'
                          : 'bg-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-500 text-black' :
                          'bg-slate-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{player.displayName || 'Anonymous'}</div>
                          <div className="text-sm text-slate-400">Level {player.level || 1}</div>
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <div className="text-2xl font-bold text-white">{player.xp || 0}</div>
                        <div className="text-sm text-slate-400">XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;

