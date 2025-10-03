import React, { useState, useEffect, useRef, useMemo, useCallback, useContext } from 'react';
import TextToSpeech from "./TextToSpeech";
import Quiz from "./quiz.js";
import QuizScreenEnhanced from "./components/QuizScreenEnhanced";
import LanguageSelection from "./components/LanguageSelection";
import { UserProvider, UserContext } from "./context/userContext";
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AuthForm from "./components/AuthForm";
import ProfileScreen from "./components/ProfileScreen";
import FirebaseDiagnostic from "./components/FirebaseDiagnostic";
import FirebaseSetupTest from "./components/FirebaseSetupTest";
import ProtectedHome from "./components/ProtectedHome";
import firebaseAuthService from "./services/FirebaseAuthService";
import notificationService from "./services/NotificationService";




import {
  Volume2,
  Mic,
  MicOff,
  Star,
  Trophy,
  Target,
  BookOpen,
  Users,
  Settings,
  Home,
  Award,
  Zap,
  Brain,
  MessageCircle,
  Play,
  Check,
  X,
  Crown,
  Moon,
  Sun,
  Bell,
  BellOff,
  ChevronLeft,
  Globe,
  User,
  Type,
  Monitor,
  Save,
  TrendingUp,
  Flame,   // use Flame instead of Fire
  LogOut
} from 'lucide-react';

// Move static data outside component to prevent recreation on renders
const LEARNING_LANGUAGES = {
  english: { name: 'English', flag: '🇺🇸', rtl: false },
  arabic: { name: 'العربية', flag: '🇸🇦', rtl: true }
};

// Global Language Toggle Component - Redesigned
const GlobalLanguageToggle = ({ globalLanguage, onLanguageChange, className = "", compact = false }) => (
  <div className={`bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700/60 ${compact ? 'p-2' : 'p-4'} ${className}`}>
    {!compact && (
      <div className="flex items-center gap-2 mb-3">
        <Globe className="text-blue-400" size={18} />
        <span className="font-semibold text-white text-sm">{globalLanguage === 'arabic' ? 'اللغة' : 'Language'}</span>
      </div>
    )}

    <div className={`flex gap-2 ${compact ? 'gap-1' : 'gap-3'}`}>
      <button
        onClick={() => onLanguageChange('english')}
        className={`flex-1 ${compact ? 'p-2' : 'p-3'} rounded-xl border-2 transition-all duration-300 hover:scale-105 ${globalLanguage === 'english'
            ? 'border-blue-500 bg-gradient-to-br from-blue-500/30 to-blue-600/30 shadow-lg shadow-blue-500/30 text-white'
            : 'border-slate-600 bg-slate-700/40 hover:border-slate-500 hover:bg-slate-700/60 text-slate-300'
          }`}
      >
        <div className="flex flex-col items-center gap-1">
          <span className={`${compact ? 'text-lg' : 'text-xl'}`}>🇺🇸</span>
          <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'} ${globalLanguage === 'english' ? 'text-white' : 'text-slate-300'}`}>
            English
          </span>
        </div>
      </button>

      <button
        onClick={() => onLanguageChange('arabic')}
        className={`flex-1 ${compact ? 'p-2' : 'p-3'} rounded-xl border-2 transition-all duration-300 hover:scale-105 ${globalLanguage === 'arabic'
            ? 'border-green-500 bg-gradient-to-br from-green-500/30 to-green-600/30 shadow-lg shadow-green-500/30 text-white'
            : 'border-slate-600 bg-slate-700/40 hover:border-slate-500 hover:bg-slate-700/60 text-slate-300'
          }`}
      >
        <div className="flex flex-col items-center gap-1">
          <span className={`${compact ? 'text-lg' : 'text-xl'}`}>🇸🇦</span>
          <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'} ${globalLanguage === 'arabic' ? 'text-white' : 'text-slate-300'}`}>
            العربية
          </span>
        </div>
      </button>
    </div>
  </div>
);

const AuthWrapper = () => {
  const { isAuthenticated, isLoading } = React.useContext(UserContext);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <AuthForm />;
};

function App() {
  return (
    <UserProvider>
      <LanguageLearningMVP />
    </UserProvider>
  );
}


// HomePage component moved to src/components/HomePage.js

const INTERFACE_LANGUAGES = {
  english: { name: 'English', flag: '🇺🇸', rtl: false },
  arabic: { name: 'العربية', flag: '🇸🇦', rtl: true },
  dutch: { name: 'Nederlands', flag: '🇳🇱', rtl: false },
  indonesian: { name: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
  malay: { name: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
  thai: { name: 'ไทย', flag: '🇹🇭', rtl: false },
  khmer: { name: 'ខ្មែរ', flag: '🇰🇭', rtl: false }
};

const TRANSLATIONS = {
  english: {
    appName: 'LinguaAI',
    appTagline: 'Smart Language Learning',
    welcomeBack: 'Welcome back! 👋',
    readyToContinue: 'Ready to continue learning?',
    dayStreak: 'Day Streak',
    totalXP: 'Total XP',
    level: 'Level',
    selectLanguage: 'Select Language',
    changeLanguageDescription: 'Choose your preferred language for the app interface',
    continueLesson: 'Continue Lesson',
    aiCoach: 'AI Coach',
    lessons: 'Lessons',
    courseProgress: 'Course Progress',
    beginnerLevel: 'Beginner Level',
    intermediateLevel: 'Intermediate Level',
    advancedLevel: 'Advanced Level',
    quizChallenge: 'Quiz Challenge',
    nextQuestion: 'Next Question',
    finishQuiz: 'Finish Quiz',
    aiLanguageCoach: 'AI Language Coach',
    chooseLearningLanguage: 'Choose Your Learning Language',
    whatLanguageToLearn: 'What language would you like to learn with your AI coach?',
    pronunciationCoach: 'Pronunciation Coach',
    say: 'Say: ',
    analyzingPronunciation: 'AI is analyzing your pronunciation...',
    chatWithAiTutor: 'Chat with AI Tutor',
    askAboutLearning: 'Ask me anything about language learning...',
    send: 'Send',
    profile: 'Profile',
    trackProgress: 'Track your progress and customize your experience',
    logout: 'Logout',
    stats: 'Stats',
    settings: 'Settings',
    leaderboard: 'Leaderboard',
    languageExplorer: 'Language Explorer',
    achievements: 'Achievements',
    weeklyLeaderboard: 'Weekly Leaderboard',
    accessibility: 'Accessibility',
    fontSize: 'Font Size',
    highContrast: 'High Contrast',
    captions: 'Captions',
    languagePreferences: 'Language Preferences',
    interfaceLanguage: 'Interface Language',
    autoPlayAudio: 'Auto-play Audio',
    notifications: 'Notifications',
    dailyReminders: 'Daily Reminders',
    achievementAlerts: 'Achievement Alerts',
    streakWarnings: 'Streak Warnings',
    account: 'Account',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    exportData: 'Export Data',
    deleteAccount: 'Delete Account',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    placementTest: 'Placement Test',
    findLevel: "Let's find your perfect starting level",
    question: 'Question',
    startLearning: 'Start Learning!',
    placementComplete: 'Placement Complete!',
    yourLevel: 'Your level:',
    score: 'Score:',
    liveTeacherSupport: 'Live Teacher Support',
    live: 'Live',
    offline: 'Offline',
    recentCorrections: 'Recent Corrections',
    schedulePrivateLesson: 'Schedule Private Lesson',
    preferredTime: 'Preferred Time',
    focusArea: 'Focus Area',
    bookLesson: 'Book Lesson ($15/hour)',
    pronunciation: 'Pronunciation',
    grammar: 'Grammar',
    conversation: 'Conversation',
    reading: 'Reading',
    home: 'Home',
    lessonsNav: 'Lessons',
    quizNav: 'Quiz',
    aiCoachNav: 'AI Coach',
    profileNav: 'Profile',
    typeMessage: 'Type your message...',
    fillBlank: 'Fill in the blank:',
    matchPairs: 'Match the pairs:',
    trueFalse: 'True or False:'
  },
  arabic: {
    appName: 'لينجوا إيه آي',
    appTagline: 'تعلم اللغة الذكي',
    welcomeBack: 'مرحباً بعودتك! 👋',
    readyToContinue: 'هل أنت جاهز لمواصلة التعلم؟',
    dayStreak: 'سلسلة اليوم',
    totalXP: 'إجمالي الخبرة',
    level: 'المستوى',
    selectLanguage: 'اختر اللغة',
    changeLanguageDescription: 'اختر لغتك المفضلة لواجهة التطبيق',
    continueLesson: 'متابعة الدرس',
    aiCoach: 'مدرب الذكاء الاصطناعي',
    lessons: 'الدروس',
    courseProgress: 'تقدم الدورة',
    beginnerLevel: 'مستوى المبتدئين',
    intermediateLevel: 'مستوى المتوسط',
    advancedLevel: 'مستوى المتقدم',
    quizChallenge: 'تحدي الاختبار',
    nextQuestion: 'السؤال التالي',
    finishQuiz: 'إنهاء الاختبار',
    aiLanguageCoach: 'مدرب اللغة بالذكاء الاصطناعي',
    chooseLearningLanguage: 'اختر لغة التعلم الخاصة بك',
    whatLanguageToLearn: 'ما هي اللغة التي تريد تعلمها مع مدرب الذكاء الاصطناعي؟',
    pronunciationCoach: 'مدرب النطق',
    say: 'قل: ',
    analyzingPronunciation: 'الذكاء الاصطناعي يحلل نطقك...',
    chatWithAiTutor: 'الدردشة مع مدرس الذكاء الاصطناعي',
    askAboutLearning: 'اسألني أي شيء عن تعلم اللغة...',
    send: 'إرسال',
    profile: 'الملف الشخصي',
    trackProgress: 'تتبع تقدمك وخصص تجربتك',
    logout: 'تسجيل الخروج',
    stats: 'الإحصائيات',
    settings: 'الإعدادات',
    leaderboard: 'لوحة الصدارة',
    languageExplorer: 'مستكشف اللغة',
    achievements: 'الإنجازات',
    weeklyLeaderboard: 'لوحة الصدارة الأسبوعية',
    accessibility: 'إمكانية الوصول',
    fontSize: 'حجم الخط',
    highContrast: 'تباين عالي',
    captions: 'التسميات التوضيحية',
    languagePreferences: 'تفضيلات اللغة',
    interfaceLanguage: 'لغة الواجهة',
    autoPlayAudio: 'تشغيل الصوت تلقائياً',
    notifications: 'الإشعارات',
    dailyReminders: 'تذكيرات يومية',
    achievementAlerts: 'تنبيهات الإنجاز',
    streakWarnings: 'تحذيرات السلسلة',
    account: 'الحساب',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    exportData: 'تصدير البيانات',
    deleteAccount: 'حذف الحساب',
    small: 'صغير',
    medium: 'متوسط',
    large: 'كبير',
    placementTest: 'اختبار التصنيف',
    findLevel: 'دعنا نجد مستواك المثالي للبدء',
    question: 'سؤال',
    startLearning: 'ابدأ التعلم!',
    placementComplete: 'اكتمل التصنيف!',
    yourLevel: 'مستواك:',
    score: 'النتيجة:',
    liveTeacherSupport: 'دعم المعلم الحي',
    live: 'حي',
    offline: 'غير متصل',
    recentCorrections: 'التصحيحات الأخيرة',
    schedulePrivateLesson: 'جدولة درس خاص',
    preferredTime: 'الوقت المفضل',
    focusArea: 'مجال التركيز',
    bookLesson: 'حجز الدرس (15$/ساعة)',
    pronunciation: 'النطق',
    grammar: 'النحو',
    conversation: 'المحادثة',
    reading: 'القراءة',
    home: 'الرئيسية',
    lessonsNav: 'الدروس',
    quizNav: 'اختبار',
    aiCoachNav: 'مدرب AI',
    profileNav: 'الملف',
    typeMessage: 'اكتب رسالتك...',
    fillBlank: 'املأ الفراغ:',
    matchPairs: 'ربط الأزواج:',
    trueFalse: 'صح أم خطأ:'
  },
  dutch: {
    appName: 'LinguaAI',
    appTagline: 'Slimme Taalleren',
    welcomeBack: 'Welkom terug! 👋',
    readyToContinue: 'Klaar om verder te leren?',
    dayStreak: 'Dag Streak',
    totalXP: 'Totaal XP',
    level: 'Niveau',
    selectLanguage: 'Selecteer Taal',
    changeLanguageDescription: 'Kies je voorkeurstaal voor de app-interface',
    continueLesson: 'Ga verder met Les',
    aiCoach: 'AI Coach',
    lessons: 'Lessen',
    courseProgress: 'Cursus Voortgang',
    beginnerLevel: 'Beginnersniveau',
    intermediateLevel: 'Gemiddeld Niveau',
    advancedLevel: 'Gevorderd Niveau',
    quizChallenge: 'Quiz Uitdaging',
    nextQuestion: 'Volgende Vraag',
    finishQuiz: 'Voltooi Quiz',
    aiLanguageCoach: 'AI Taal Coach',
    chooseLearningLanguage: 'Kies Je Leertaal',
    whatLanguageToLearn: 'Welke taal wil je leren met je AI coach?',
    pronunciationCoach: 'Uitspraak Coach',
    say: 'Zeg: ',
    analyzingPronunciation: 'AI analyseert je uitspraak...',
    chatWithAiTutor: 'Chat met AI Tutor',
    askAboutLearning: 'Vraag me alles over taalleren...',
    send: 'Verzenden',
    profile: 'Profiel',
    trackProgress: 'Volg je voortgang en pas je ervaring aan',
    logout: 'Uitloggen',
    stats: 'Statistieken',
    settings: 'Instellingen',
    leaderboard: 'Ranglijst',
    languageExplorer: 'Taal Verkenner',
    achievements: 'Prestaties',
    weeklyLeaderboard: 'Wekelijks Leaderboard',
    accessibility: 'Toegankelijkheid',
    fontSize: 'Lettergrootte',
    highContrast: 'Hoog Contrast',
    captions: 'Ondertitels',
    languagePreferences: 'Taalvoorkeuren',
    interfaceLanguage: 'Interface Taal',
    autoPlayAudio: 'Automatisch Audio Afspelen',
    notifications: 'Meldingen',
    dailyReminders: 'Dagelijkse Herinneringen',
    achievementAlerts: 'Prestatie Waarschuwingen',
    streakWarnings: 'Streak Waarschuwingen',
    account: 'Account',
    privacyPolicy: 'Privacybeleid',
    termsOfService: 'Servicevoorwaarden',
    exportData: 'Exporteer Gegevens',
    deleteAccount: 'Account Verwijderen',
    small: 'Klein',
    medium: 'Middel',
    large: 'Groot',
    placementTest: 'Plaatsingstest',
    findLevel: 'Laten we je perfecte startniveau vinden',
    question: 'Vraag',
    startLearning: 'Begin met Leren!',
    placementComplete: 'Plaatsing Voltooid!',
    yourLevel: 'Je niveau:',
    score: 'Score:',
    liveTeacherSupport: 'Live Docent Ondersteuning',
    live: 'Live',
    offline: 'Offline',
    recentCorrections: 'Recente Correcties',
    schedulePrivateLesson: 'Plan Privé Les',
    preferredTime: 'Voorkeur Tijd',
    focusArea: 'Focus Gebied',
    bookLesson: 'Boek Les (€15/uur)',
    pronunciation: 'Uitspraak',
    grammar: 'Grammatica',
    conversation: 'Gesprek',
    reading: 'Lezen',
    home: 'Home',
    lessonsNav: 'Lessen',
    quizNav: 'Quiz',
    aiCoachNav: 'AI Coach',
    profileNav: 'Profiel',
    typeMessage: 'Typ je bericht...',
    fillBlank: 'Vul het gat in:',
    matchPairs: 'Koppel de paren:',
    trueFalse: 'Waar of niet waar:'
  },
  indonesian: {
    appName: 'LinguaAI',
    appTagline: 'Pembelajaran Bahasa Cerdas',
    welcomeBack: 'Selamat datang kembali! 👋',
    readyToContinue: 'Siap untuk melanjutkan belajar?',
    dayStreak: 'Streak Hari',
    totalXP: 'Total XP',
    level: 'Level',
    selectLanguage: 'Pilih Bahasa',
    changeLanguageDescription: 'Pilih bahasa pilihan Anda untuk antarmuka aplikasi',
    continueLesson: 'Lanjutkan Pelajaran',
    aiCoach: 'Pelatih AI',
    lessons: 'Pelajaran',
    courseProgress: 'Kemajuan Kursus',
    beginnerLevel: 'Tingkat Pemula',
    intermediateLevel: 'Tingkat Menengah',
    advancedLevel: 'Tingkat Lanjutan',
    quizChallenge: 'Tantangan Kuis',
    nextQuestion: 'Pertanyaan Selanjutnya',
    finishQuiz: 'Selesai Kuis',
    aiLanguageCoach: 'Pelatih Bahasa AI',
    chooseLearningLanguage: 'Pilih Bahasa Pembelajaran Anda',
    whatLanguageToLearn: 'Bahasa apa yang ingin Anda pelajari dengan pelatih AI?',
    pronunciationCoach: 'Pelatih Pengucapan',
    say: 'Katakan: ',
    analyzingPronunciation: 'AI sedang menganalisis pengucapan Anda...',
    chatWithAiTutor: 'Obrolan dengan Tutor AI',
    askAboutLearning: 'Tanyakan apa saja tentang pembelajaran bahasa...',
    send: 'Kirim',
    profile: 'Profil',
    trackProgress: 'Lacak kemajuan Anda dan sesuaikan pengalaman Anda',
    logout: 'Keluar',
    stats: 'Statistik',
    settings: 'Pengaturan',
    leaderboard: 'Papan Peringkat',
    languageExplorer: 'Penjelajah Bahasa',
    achievements: 'Pencapaian',
    weeklyLeaderboard: 'Papan Peringkat Mingguan',
    accessibility: 'Aksesibilitas',
    fontSize: 'Ukuran Font',
    highContrast: 'Kontras Tinggi',
    captions: 'Keterangan',
    languagePreferences: 'Preferensi Bahasa',
    interfaceLanguage: 'Bahasa Antarmuka',
    autoPlayAudio: 'Putar Audio Otomatis',
    notifications: 'Pemberitahuan',
    dailyReminders: 'Pengingat Harian',
    achievementAlerts: 'Peringatan Pencapaian',
    streakWarnings: 'Peringatan Streak',
    account: 'Akun',
    privacyPolicy: 'Kebijakan Privasi',
    termsOfService: 'Syarat Layanan',
    exportData: 'Ekspor Data',
    deleteAccount: 'Hapus Akun',
    small: 'Kecil',
    medium: 'Sedang',
    large: 'Besar',
    placementTest: 'Tes Penempatan',
    findLevel: 'Mari temukan level mulai yang sempurna untuk Anda',
    question: 'Pertanyaan',
    startLearning: 'Mulai Belajar!',
    placementComplete: 'Penempatan Selesai!',
    yourLevel: 'Level Anda:',
    score: 'Skor:',
    liveTeacherSupport: 'Dukungan Guru Langsung',
    live: 'Langsung',
    offline: 'Offline',
    recentCorrections: 'Koreksi Terbaru',
    schedulePrivateLesson: 'Jadwalkan Pelajaran Pribadi',
    preferredTime: 'Waktu Pilihan',
    focusArea: 'Area Fokus',
    bookLesson: 'Pesan Pelajaran ($15/jam)',
    pronunciation: 'Pengucapan',
    grammar: 'Tata Bahasa',
    conversation: 'Percakapan',
    reading: 'Membaca',
    home: 'Beranda',
    lessonsNav: 'Pelajaran',
    quizNav: 'Kuis',
    aiCoachNav: 'Pelatih AI',
    profileNav: 'Profil',
    typeMessage: 'Ketik pesan Anda...',
    fillBlank: 'Isi kekosongan:',
    matchPairs: 'Cocokkan pasangan:',
    trueFalse: 'Benar atau Salah:'
  },
  malay: {
    appName: 'LinguaAI',
    appTagline: 'Pembelajaran Bahasa Pintar',
    welcomeBack: 'Selamat kembali! 👋',
    readyToContinue: 'Sedia untuk meneruskan pembelajaran?',
    dayStreak: 'Streak Hari',
    totalXP: 'Jumlah XP',
    level: 'Tahap',
    selectLanguage: 'Pilih Bahasa',
    changeLanguageDescription: 'Pilih bahasa pilihan anda untuk antara muka aplikasi',
    continueLesson: 'Teruskan Pelajaran',
    aiCoach: 'Jurubahasa AI',
    lessons: 'Pelajaran',
    courseProgress: 'Kemajuan Kursus',
    beginnerLevel: 'Tahap Pemula',
    intermediateLevel: 'Tahap Sederhana',
    advancedLevel: 'Tahap Mahir',
    quizChallenge: 'Cabaran Kuiz',
    nextQuestion: 'Soalan Seterusnya',
    finishQuiz: 'Selesai Kuiz',
    aiLanguageCoach: 'Jurubahasa Bahasa AI',
    chooseLearningLanguage: 'Pilih Bahasa Pembelajaran Anda',
    whatLanguageToLearn: 'Bahasa apa yang anda mahu pelajari dengan pelatih AI?',
    pronunciationCoach: 'Jurubahasa Sebutan',
    say: 'Katakan: ',
    analyzingPronunciation: 'AI sedang menganalisis sebutan anda...',
    chatWithAiTutor: 'Sembang dengan Tutor AI',
    askAboutLearning: 'Tanya saya apa-apa tentang pembelajaran bahasa...',
    send: 'Hantar',
    profile: 'Profil',
    trackProgress: 'Jejak kemajuan anda dan sesuaikan pengalaman anda',
    logout: 'Log Keluar',
    stats: 'Statistik',
    settings: 'Tetapan',
    leaderboard: 'Papan Pendahulu',
    languageExplorer: 'Penjelajah Bahasa',
    achievements: 'Pencapaian',
    weeklyLeaderboard: 'Papan Pendahulu Mingguan',
    accessibility: 'Aksesibiliti',
    fontSize: 'Saiz Fon',
    highContrast: 'Kontras Tinggi',
    captions: 'Kapsyen',
    languagePreferences: 'Keutamaan Bahasa',
    interfaceLanguage: 'Bahasa Antara Muka',
    autoPlayAudio: 'Main Audio Secara Auto',
    notifications: 'Pemberitahuan',
    dailyReminders: 'Peringatan Harian',
    achievementAlerts: 'Amaran Pencapaian',
    streakWarnings: 'Amaran Streak',
    account: 'Akaun',
    privacyPolicy: 'Dasar Privasi',
    termsOfService: 'Syarat Perkhidmatan',
    exportData: 'Eksport Data',
    deleteAccount: 'Padam Akaun',
    small: 'Kecil',
    medium: 'Sederhana',
    large: 'Besar',
    placementTest: 'Ujian Penempatan',
    findLevel: 'Mari cari tahap permulaan yang sempurna',
    question: 'Soalan',
    startLearning: 'Mula Belajar!',
    placementComplete: 'Penempatan Selesai!',
    yourLevel: 'Tahap anda:',
    score: 'Skor:',
    liveTeacherSupport: 'Sokongan Guru Langsung',
    live: 'Langsung',
    offline: 'Luar Talian',
    recentCorrections: 'Pembetulan Terkini',
    schedulePrivateLesson: 'Jadualkan Pelajaran Persendirian',
    preferredTime: 'Masa Pilihan',
    focusArea: 'Kawasan Fokus',
    bookLesson: 'Tempah Pelajaran ($15/jam)',
    pronunciation: 'Sebutan',
    grammar: 'Tatabahasa',
    conversation: 'Perbualan',
    reading: 'Pembacaan',
    home: 'Rumah',
    lessonsNav: 'Pelajaran',
    quizNav: 'Kuiz',
    aiCoachNav: 'Jurubahasa AI',
    profileNav: 'Profil',
    typeMessage: 'Taip mesej anda...',
    fillBlank: 'Isi kekosongan:',
    matchPairs: 'Padankan pasangan:',
    trueFalse: 'Betul atau salah:'
  },
  thai: {
    appName: 'LinguaAI',
    appTagline: 'การเรียนรู้ภาษาอัจฉริยะ',
    welcomeBack: 'ยินดีต้อนรับกลับ! 👋',
    readyToContinue: 'พร้อมที่จะเรียนต่อหรือไม่?',
    dayStreak: 'สตรีควัน',
    totalXP: 'XP รวม',
    level: 'ระดับ',
    selectLanguage: 'เลือกภาษา',
    changeLanguageDescription: 'เลือกภาษาที่คุณต้องการสำหรับส่วนติดต่อแอป',
    continueLesson: 'ดำเนินการบทเรียนต่อ',
    aiCoach: 'โค้ช AI',
    lessons: 'บทเรียน',
    courseProgress: 'ความคืบหน้าของหลักสูตร',
    beginnerLevel: 'ระดับเริ่มต้น',
    intermediateLevel: 'ระดับกลาง',
    advancedLevel: 'ระดับสูง',
    quizChallenge: 'ความท้าทายแบบทดสอบ',
    nextQuestion: 'คำถามถัดไป',
    finishQuiz: 'จบแบบทดสอบ',
    aiLanguageCoach: 'โค้ชภาษา AI',
    chooseLearningLanguage: 'เลือกภาษาการเรียนรู้ของคุณ',
    whatLanguageToLearn: 'คุณต้องการเรียนภาษาอะไรกับโค้ช AI?',
    pronunciationCoach: 'โค้ชการออกเสียง',
    say: 'พูดว่า: ',
    analyzingPronunciation: 'AI กำลังวิเคราะห์การออกเสียงของคุณ...',
    chatWithAiTutor: 'แชทกับติวเตอร์ AI',
    askAboutLearning: 'ถามฉันอะไรก็ได้เกี่ยวกับการเรียนภาษา...',
    send: 'ส่ง',
    profile: 'โปรไฟล์',
    trackProgress: 'ติดตามความก้าวหน้าและปรับแต่งประสบการณ์ของคุณ',
    logout: 'ออกจากระบบ',
    stats: 'สถิติ',
    settings: 'การตั้งค่า',
    leaderboard: 'กระดานผู้นำ',
    languageExplorer: 'นักสำรวจภาษา',
    achievements: 'ความสำเร็จ',
    weeklyLeaderboard: 'กระดานผู้นำรายสัปดาห์',
    accessibility: 'การเข้าถึง',
    fontSize: 'ขนาดตัวอักษร',
    highContrast: 'คอนทราสต์สูง',
    captions: 'คำบรรยาย',
    languagePreferences: 'การตั้งค่าภาษา',
    interfaceLanguage: 'ภาษาอินเตอร์เฟซ',
    autoPlayAudio: 'เล่นเสียงอัตโนมัติ',
    notifications: 'การแจ้งเตือน',
    dailyReminders: 'การแจ้งเตือนรายวัน',
    achievementAlerts: 'การแจ้งเตือนความสำเร็จ',
    streakWarnings: 'การเตือนสตรีค',
    account: 'บัญชี',
    privacyPolicy: 'นโยบายความเป็นส่วนตัว',
    termsOfService: 'ข้อกำหนดในการให้บริการ',
    exportData: 'ส่งออกข้อมูล',
    deleteAccount: 'ลบบัญชี',
    small: 'เล็ก',
    medium: 'กลาง',
    large: 'ใหญ่',
    placementTest: 'การทดสอบวัดระดับ',
    findLevel: 'มาหาระดับเริ่มต้นที่สมบูรณ์แบบของคุณกันเถอะ',
    question: 'คำถาม',
    startLearning: 'เริ่มเรียน!',
    placementComplete: 'การวัดระดับเสร็จสิ้น!',
    yourLevel: 'ระดับของคุณ:',
    score: 'คะแนน:',
    liveTeacherSupport: 'การสนับสนุนครูสด',
    live: 'สด',
    offline: 'ออฟไลน์',
    recentCorrections: 'การแก้ไขล่าสุด',
    schedulePrivateLesson: 'กำหนดเวลาบทเรียนส่วนตัว',
    preferredTime: 'เวลาที่ต้องการ',
    focusArea: 'พื้นที่โฟกัส',
    bookLesson: 'จองบทเรียน (15$/ชั่วโมง)',
    pronunciation: 'การออกเสียง',
    grammar: 'ไวยากรณ์',
    conversation: 'การสนทนา',
    reading: 'การอ่าน',
    home: 'หน้าแรก',
    lessonsNav: 'บทเรียน',
    quizNav: 'แบบทดสอบ',
    aiCoachNav: 'โค้ช AI',
    profileNav: 'โปรไฟล์',
    typeMessage: 'พิมพ์ข้อความของคุณ...',
    fillBlank: 'เติมช่องว่าง:',
    matchPairs: 'จับคู่:',
    trueFalse: 'จริงหรือเท็จ:'
  },
  khmer: {
    appName: 'LinguaAI',
    appTagline: 'ការរៀនភាសាឆ្លាត',
    welcomeBack: 'សូមស្វាគមន៍ត្រឡប់មកវិញ! 👋',
    readyToContinue: 'ត្រៀមខ្លួនដើម្បីបន្តការរៀនឬទេ?',
    dayStreak: 'ស្ត្រីកថ្ងៃ',
    totalXP: 'XP សរុប',
    level: 'កម្រិត',
    selectLanguage: 'ជ្រើសរើសភាសា',
    changeLanguageDescription: 'ជ្រើសរើសភាសាដែលអ្នកចូលចិត្តសម្រាប់ចំណុចប្រទាក់កម្មវិធី',
    continueLesson: 'បន្តមេរៀន',
    aiCoach: 'គ្រូ AI',
    lessons: 'មេរៀន',
    courseProgress: 'វឌ្ឍនភាពវគ្គសិក្សា',
    beginnerLevel: 'កម្រិតដំបូង',
    intermediateLevel: 'កម្រិតមធ្យម',
    advancedLevel: 'កម្រិតខ្ពស់',
    quizChallenge: 'បញ្ហាសំណួរ',
    nextQuestion: 'សំណួរបន្ទាប់',
    finishQuiz: 'បញ្ចប់សំណួរ',
    aiLanguageCoach: 'គ្រូភាសា AI',
    chooseLearningLanguage: 'ជ្រើសរើសភាសាការរៀនរបស់អ្នក',
    whatLanguageToLearn: 'អ្នកចង់រៀនភាសាអ្វីជាមួយគ្រូ AI?',
    pronunciationCoach: 'គ្រូការបញ្ចេញសំឡេង',
    say: 'និយាយថា: ',
    analyzingPronunciation: 'AI កំពុងវិភាគការបញ្ចេញសំឡេងរបស់អ្នក...',
    chatWithAiTutor: 'ជជែកជាមួយគ្រូ AI',
    askAboutLearning: 'សួរខ្ញុំអ្វីក៏ដោយអំពីការរៀនភាសា...',
    send: 'ផ្ញើ',
    profile: 'ប្រវត្តិរូប',
    trackProgress: 'តាមដានវឌ្ឍនភាពរបស់អ្នក និងប្ដូរប្រែបទពិសោធន៍របស់អ្នក',
    logout: 'ចេញពីប្រព័ន្ធ',
    stats: 'ស្ថិតិ',
    settings: 'ការកំណត់',
    leaderboard: 'តារាងមេដឹកនាំ',
    languageExplorer: 'អ្នកស្រាវជ្រាវភាសា',
    achievements: 'សមិទ្ធិផល',
    weeklyLeaderboard: 'តារាងមេដឹកនាំប្រចាំសប្តាហ៍',
    accessibility: 'ការចូលដំណើរ',
    fontSize: 'ទំហំអក្សរ',
    highContrast: 'កម្រិតផ្ទុយខ្ពស់',
    captions: 'ចំណងជើង',
    languagePreferences: 'ចំណូលចិត្តភាសា',
    interfaceLanguage: 'ភាសាចំណុចប្រទាក់',
    autoPlayAudio: 'លេងសំឡេងដោយស្វ័យប្រវត្តិ',
    notifications: 'ការជូនដំណឹង',
    dailyReminders: 'ការរំលឹងប្រចាំថ្ងៃ',
    achievementAlerts: 'ការជូនដំណឹងសមិទ្ធិផល',
    streakWarnings: 'ការព្រមានស្ត្រីក',
    account: 'គណនី',
    privacyPolicy: 'គោលការណ៍ឯកជនភាព',
    termsOfService: 'លក្ខខណ្ឌនៃសេវាកម្ម',
    exportData: 'នាំចេញទិន្នន័យ',
    deleteAccount: 'លុបគណនី',
    small: 'តូច',
    medium: 'មធ្យម',
    large: 'ធំ',
    placementTest: 'ការសាកល្បងទីតាំង',
    findLevel: 'តោះរកកម្រិតចាប់ផ្តើមដ៏ល្អឥតខ្ចោះរបស់អ្នក',
    question: 'សំណួរ',
    startLearning: 'ចាប់ផ្តើមរៀន!',
    placementComplete: 'ការដាក់ទីតាំងបានបញ្ចប់!',
    yourLevel: 'កម្រិតរបស់អ្នក:',
    score: 'ពិន្ទុ:',
    liveTeacherSupport: 'ការគាំទ្រគ្រូបង្គោលផ្ទាល់',
    live: 'ផ្ទាល់',
    offline: 'ក្រៅបណ្តាញ',
    recentCorrections: 'ការកែតម្រូវថ្មីៗ',
    schedulePrivateLesson: 'កំណត់ពេលមេរៀនឯកជន',
    preferredTime: 'ពេលវេលាដែលពេញចិត្ត',
    focusArea: 'តំបន់ផ្តោតអារម្មណ៍',
    bookLesson: 'កក់មេរៀន ($15/ម៉ោង)',
    pronunciation: 'ការបញ្ចេញសំឡេង',
    grammar: 'វេយ្យាករណ៍',
    conversation: 'ការសន្ទនា',
    reading: 'ការអាន',
    home: 'ផ្ទះ',
    lessonsNav: 'មេរៀន',
    quizNav: 'សំណួរ',
    aiCoachNav: 'គ្រូ AI',
    profileNav: 'ប្រវត្តិរូប',
    typeMessage: 'វាយសាររបស់អ្នក...',
    fillBlank: 'បំពេញទទេ:',
    matchPairs: 'ផ្គូផ្គង:',
    trueFalse: 'ពិត ឬមិនពិត:'
  }
};

const VOCABULARY = {
  beginner: {
    english: [
      { word: 'hello', translation: 'مَرْحَبًا', category: 'greetings', audio: '/audio/hello.mp3' },
      { word: 'goodbye', translation: 'وَدَاعًا', category: 'greetings', audio: '/audio/goodbye.mp3' },
      { word: 'water', translation: 'مَاءٌ', category: 'food', audio: '/audio/water.mp3' },
      { word: 'food', translation: 'طَعَامٌ', category: 'food', audio: '/audio/food.mp3' }
    ],
    dutch: [
      { word: 'hallo', translation: 'مرحبا', category: 'greetings', audio: '/audio/hallo.mp3' },
      { word: 'tot ziens', translation: 'وداعا', category: 'greetings', audio: '/audio/totziens.mp3' },
      { word: 'water', translation: 'ماء', category: 'food', audio: '/audio/water.mp3' },
      { word: 'eten', translation: 'طعام', category: 'food', audio: '/audio/eten.mp3' }
    ],
    indonesian: [
      { word: 'halo', translation: 'مرحبا', category: 'greetings', audio: '/audio/halo.mp3' },
      { word: 'selamat tinggal', translation: 'وداعا', category: 'greetings', audio: '/audio/selamattinggal.mp3' },
      { word: 'air', translation: 'ماء', category: 'food', audio: '/audio/air.mp3' },
      { word: 'makanan', translation: 'طعام', category: 'food', audio: '/audio/makanan.mp3' }
    ],
    malay: [
      { word: 'hello', translation: 'مرحبا', category: 'greetings', audio: '/audio/hello.mp3' },
      { word: 'selamat tinggal', translation: 'وداعا', category: 'greetings', audio: '/audio/selamattinggal.mp3' },
      { word: 'air', translation: 'ماء', category: 'food', audio: '/audio/air.mp3' },
      { word: 'makanan', translation: 'طعام', category: 'food', audio: '/audio/makanan.mp3' }
    ],
    thai: [
      { word: 'สวัสดี', translation: 'مرحبا', category: 'greetings', audio: '/audio/sawasdee.mp3' },
      { word: 'ลาก่อน', translation: 'وداعا', category: 'greetings', audio: '/audio/lagorn.mp3' },
      { word: 'น้ำ', translation: 'ماء', category: 'food', audio: '/audio/nam.mp3' },
      { word: 'อาหาร', translation: 'طعام', category: 'food', audio: '/audio/aharn.mp3' }
    ],
    khmer: [
      { word: 'សួស្តី', translation: 'مرحبا', category: 'greetings', audio: '/audio/suostei.mp3' },
      { word: 'លាហើយ', translation: 'وداعا', category: 'greetings', audio: '/audio/laheuy.mp3' },
      { word: 'ទឹក', translation: 'ماء', category: 'food', audio: '/audio/tuk.mp3' },
      { word: 'អាហារ', translation: 'طعام', category: 'food', audio: '/audio/ahor.mp3' }
    ]
  },
  intermediate: {
    english: [
      { word: 'beautiful', translation: 'جَمِيلٌ', category: 'adjectives', audio: '/audio/beautiful.mp3' },
      { word: 'difficult', translation: 'صَعْبٌ', category: 'adjectives', audio: '/audio/difficult.mp3' }
    ],
    dutch: [
      { word: 'mooi', translation: 'جميل', category: 'adjectives', audio: '/audio/mooi.mp3' },
      { word: 'moeilijk', translation: 'صعب', category: 'adjectives', audio: '/audio/moeilijk.mp3' }
    ],
    indonesian: [
      { word: 'cantik', translation: 'جميل', category: 'adjectives', audio: '/audio/cantik.mp3' },
      { word: 'sulit', translation: 'صعب', category: 'adjectives', audio: '/audio/sulit.mp3' }
    ],
    malay: [
      { word: 'cantik', translation: 'جميل', category: 'adjectives', audio: '/audio/cantik.mp3' },
      { word: 'sukar', translation: 'صعب', category: 'adjectives', audio: '/audio/sukar.mp3' }
    ],
    thai: [
      { word: 'สวย', translation: 'جميل', category: 'adjectives', audio: '/audio/suay.mp3' },
      { word: 'ยาก', translation: 'صعب', category: 'adjectives', audio: '/audio/yak.mp3' }
    ],
    khmer: [
      { word: 'ស្អាត', translation: 'جميل', category: 'adjectives', audio: '/audio/sat.mp3' },
      { word: 'ពិបាក', translation: 'صعب', category: 'adjectives', audio: '/audio/pibak.mp3' }
    ]
  },
  advanced: {
    english: [
      { word: 'sophisticated', translation: 'مُعَقَّدٌ', category: 'advanced', audio: '/audio/sophisticated.mp3' },
      { word: 'magnificent', translation: 'رَائِعٌ', category: 'advanced', audio: '/audio/magnificent.mp3' }
    ],
    dutch: [
      { word: 'geavanceerd', translation: 'معقد', category: 'advanced', audio: '/audio/geavanceerd.mp3' },
      { word: 'prachtig', translation: 'رائع', category: 'advanced', audio: '/audio/prachtig.mp3' }
    ],
    indonesian: [
      { word: 'sofistikasi', translation: 'معقد', category: 'advanced', audio: '/audio/sofistikasi.mp3' },
      { word: 'megah', translation: 'رائع', category: 'advanced', audio: '/audio/megah.mp3' }
    ],
    malay: [
      { word: 'sofistikated', translation: 'معقد', category: 'advanced', audio: '/audio/sofistikated.mp3' },
      { word: 'hebat', translation: 'رائع', category: 'advanced', audio: '/audio/hebat.mp3' }
    ],
    thai: [
      { word: 'ซับซ้อน', translation: 'معقد', category: 'advanced', audio: '/audio/subsorn.mp3' },
      { word: 'ยิ่งใหญ่', translation: 'رائع', category: 'advanced', audio: '/audio/yingyai.mp3' }
    ],
    khmer: [
      { word: 'ស្មុគស្មាញ', translation: 'معقد', category: 'advanced', audio: '/audio/smoogsmoan.mp3' },
      { word: 'រុងរឿង', translation: 'رائع', category: 'advanced', audio: '/audio/rungrueang.mp3' }
    ]
  }
};


const PLACEMENT_QUESTIONS = {
  english: [
    {
      type: 'vocabulary',
      question: 'Select the word that means "beautiful"',
      options: ['جَمِيلٌ', 'صَعْبٌ', 'كَبِيرٌ', 'صَغِيرٌ'],
      correct: 0
    },
    // ... more
  ],
  // Similar for other languages
};

const LanguageLearningMVP = () => {
  // Get authentication state from UserContext
  const { user, userData, isAuthenticated, isLoading } = React.useContext(UserContext);
  
  // Local states
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [authError, setAuthError] = useState('');

  // App states
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [globalLanguage, setGlobalLanguage] = useState(() => {
    // Load from localStorage or default to English
    const saved = localStorage.getItem('globalLanguage');
    return saved || 'english';
  });
  const [learningLanguages, setLearningLanguages] = useState([]);
  const [userProgress, setUserProgress] = useState({
    xp: 0,
    streak: 0,
    level: 1,
    badges: []
  });
  const [isRecording, setIsRecording] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fontSize, setFontSize] = useState('text-base');
  const [highContrast, setHighContrast] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [userSettings, setUserSettings] = useState({
    darkMode: false,
    notifications: true,
    sound: true,
    fontSize: 'medium'
  });

  // PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationStats, setNotificationStats] = useState({
    total: 0,
    learningReminders: 0,
    liveSessions: 0,
    achievements: 0,
    progress: 0
  });

  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingData, setOnboardingData] = useState({
    selectedLanguage: null,
    learningLanguages: []
  });

  // Get current language with RTL support - use globalLanguage for consistency
  const currentLanguage = useMemo(() => INTERFACE_LANGUAGES[globalLanguage], [globalLanguage]);

  // Global language change handler
  const handleGlobalLanguageChange = useCallback((newLanguage) => {
    setGlobalLanguage(newLanguage);
    localStorage.setItem('globalLanguage', newLanguage);

    // Apply RTL/LTR styling to document
    const languageData = INTERFACE_LANGUAGES[newLanguage];
    const isRTL = languageData?.rtl || false;
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLanguage);
  }, []);

  // Translation function - now uses global language
  const t = useCallback((key) => {
    return TRANSLATIONS[globalLanguage]?.[key] || TRANSLATIONS.english[key] || key;
  }, [globalLanguage]);

  // Initialize global language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('globalLanguage');
    if (savedLanguage) {
      setGlobalLanguage(savedLanguage);
      setSelectedLanguage(savedLanguage); // Sync selectedLanguage with globalLanguage
      const languageData = INTERFACE_LANGUAGES[savedLanguage];
      const isRTL = languageData?.rtl || false;
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', savedLanguage);
    }
  }, []);

  // Sync selectedLanguage with globalLanguage when globalLanguage changes
  useEffect(() => {
    if (globalLanguage && globalLanguage !== selectedLanguage) {
      setSelectedLanguage(globalLanguage);
    }
  }, [globalLanguage, selectedLanguage]);

  // Function to track notifications
  const trackNotification = (type) => {
    setNotificationCount(prev => prev + 1);
    setNotificationStats(prev => ({
      ...prev,
      total: prev.total + 1,
      [type]: prev[type] + 1
    }));
    
    // Save to localStorage
    const stats = {
      ...notificationStats,
      total: notificationStats.total + 1,
      [type]: notificationStats[type] + 1
    };
    localStorage.setItem('notificationStats', JSON.stringify(stats));
  };

  // Load notification stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('notificationStats');
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        setNotificationStats(stats);
        setNotificationCount(stats.total);
      } catch (error) {
        console.error('Error loading notification stats:', error);
      }
    }
  }, []);

  // Check if onboarding should be shown
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    const hasSelectedLanguage = localStorage.getItem('selectedLanguage');
    
    if (hasCompletedOnboarding && hasSelectedLanguage) {
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
  }, []);

  // Onboarding functions
  const nextOnboardingStep = () => {
    setOnboardingStep(prev => prev + 1);
  };

  const prevOnboardingStep = () => {
    setOnboardingStep(prev => Math.max(0, prev - 1));
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
    
    // Apply selected language globally
    if (onboardingData.selectedLanguage) {
      setSelectedLanguage(onboardingData.selectedLanguage);
      localStorage.setItem('selectedLanguage', onboardingData.selectedLanguage);
    }
    
    // Save learning languages if available
    if (onboardingData.learningLanguages) {
      localStorage.setItem('learningLanguages', JSON.stringify(onboardingData.learningLanguages));
    }
    
    // Navigate to home page
    setCurrentScreen('home');
  };

  // Onboarding Components
  const AuthenticationStep = () => {
    const [isLogin, setIsLogin] = useState(false);

    // Auto-proceed to language selection after successful authentication
    useEffect(() => {
      if (isAuthenticated && onboardingStep === 1) {
        nextOnboardingStep();
      }
    }, [isAuthenticated, onboardingStep]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-slate-400">
              {isLogin ? 'Sign in to continue your learning journey' : 'Sign up to save your progress and access all features'}
            </p>
          </div>

          {/* Toggle between Login and Signup */}
          <div className="flex bg-slate-700/50 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Auth Form */}
          <div className="bg-slate-700/30 rounded-xl p-6">
            <AuthForm 
              onAuthSuccess={handleAuthSuccess}
              onAuthError={setAuthError}
              showSignUp={!isLogin}
            />
            
            {authError && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{authError}</p>
              </div>
            )}
          </div>

          {/* Skip Option */}
          <div className="mt-6 text-center">
            <button
              onClick={nextOnboardingStep}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LanguageSelectionStep = () => {
    const handleLanguageSelected = (languageData) => {
      // Apply the selected languages and base language
      setOnboardingData(prev => ({
        ...prev,
        selectedLanguage: languageData.baseLanguage,
        learningLanguages: languageData.learningLanguages
      }));
      
      // Complete onboarding and go to home page
      completeOnboarding();
    };

    return (
      <LanguageSelection 
        onLanguageSelected={handleLanguageSelected}
        isLoading={false}
      />
    );
  };

  // PWA Installation and Notification Setup
  useEffect(() => {
    // Check if app is already installed
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator.standalone === true;
      const isInApp = window.matchMedia('(display-mode: fullscreen)').matches;
      
      if (isStandalone || isIOSStandalone || isInApp) {
        setIsInstalled(true);
        setShowInstallPrompt(false);
        console.log('App is already installed');
      } else {
        console.log('App is not installed');
      }
    };

    // Check notification permission
    const checkNotificationPermission = () => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
        console.log('Notification permission:', Notification.permission);
      }
    };

    // Setup PWA install prompt
    const setupInstallPrompt = () => {
      const handleBeforeInstallPrompt = (e) => {
        console.log('beforeinstallprompt event fired');
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
      };

      const handleAppInstalled = () => {
        console.log('PWA was installed');
        setIsInstalled(true);
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      // Return cleanup function
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    };

    // Setup notification service
    const setupNotifications = async () => {
      if (notificationService.isNotificationSupported()) {
        console.log('Notification service is supported');
        setNotificationPermission(notificationService.getPermissionStatus());
      } else {
        console.log('Notification service is not supported');
      }
    };

    // Initialize everything
    checkInstallStatus();
    checkNotificationPermission();
    const cleanup = setupInstallPrompt();
    setupNotifications();

    // Cleanup
    return cleanup;
  }, []);

  // Nav items
  const navItems = useMemo(() => [
    { id: 'home', icon: Home, labelKey: 'home' },
    { id: 'lessons', icon: BookOpen, labelKey: 'lessonsNav' },
    { id: 'quiz', icon: Target, labelKey: 'quizNav' },
    { id: 'ai-coach', icon: Brain, labelKey: 'aiCoachNav' },
    { id: 'profile', icon: User, labelKey: 'profileNav' }
  ], []);


  // Enhanced TTS function using Google TTS service with fallback
  const speakText = useCallback(async (text, lang = 'english', options = {}) => {
    try {
      // Import enhanced TTS function (your custom module)
      const { default: enhancedSpeakText } = await import('../TextToSpeech.js');
      return await enhancedSpeakText(text, lang, options);
    } catch (error) {
      console.error('TTS Error:', error);

      // Fallback to basic Web Speech API
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        const langMap = {
          arabic: 'ar-SA',     // Arabic with vowels support
          dutch: 'nl-NL',
          indonesian: 'id-ID',
          malay: 'ms-MY',
          thai: 'th-TH',
          khmer: 'km-KH',
          english: 'en-US'
        };

        const selectedLangCode = langMap[lang] || langMap[globalLanguage] || 'en-US';
        utterance.lang = selectedLangCode;

        // 🔑 Pick a voice that supports the selected language
        const voices = speechSynthesis.getVoices();
        const matchedVoice = voices.find(v => v.lang === selectedLangCode);
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        } else if (globalLanguage === 'arabic') {
          // For Arabic, try to find any Arabic voice
          const arabicVoice = voices.find(v => v.lang.startsWith('ar-'));
          if (arabicVoice) {
            utterance.voice = arabicVoice;
          }
        }

        // Options - adjust for Arabic with vowels
        if (globalLanguage === 'arabic') {
          utterance.rate = options.rate || 0.8;  // Slower for Arabic with vowels
          utterance.pitch = options.pitch || 1.1;  // Slightly higher pitch for clarity
        } else {
          utterance.rate = options.rate || 0.9;
          utterance.pitch = options.pitch || 1;
        }

        // Speak
        speechSynthesis.speak(utterance);
      }
    }
  }, [globalLanguage]);


  // Handle authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, setting up user data...');
      setUserProgress({
        xp: 0,
        streak: 0,
        level: 1,
        badges: []
      });
      setLearningLanguages([]);
      setSelectedLanguage('english');
      setUserSettings({
        darkMode: false,
        notifications: true,
        sound: true,
        fontSize: 'medium'
      });

      // Show language selection for new users after sign up
      setShowLanguageSelection(true);
      setShowAuthForm(false);
      setCurrentScreen('home');
    } else if (!isAuthenticated && !isLoading) {
      console.log('User not authenticated, resetting state...');
      setUserProgress({ xp: 0, streak: 0, level: 1, badges: [] });
      setLearningLanguages([]);
      setShowLanguageSelection(false);
      setShowAuthForm(false);
      setCurrentScreen('home');
    }
  }, [isAuthenticated, user, isLoading]);

  // Load voices asynchronously
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Voices loaded
      }
    };
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    loadVoices();
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // PWA Install handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        console.log('Showing install prompt...');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        
      if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        setShowInstallPrompt(false);
          setIsInstalled(true);
          
          // Setup notifications after installation
          try {
            const granted = await notificationService.requestPermission();
            setNotificationPermission(notificationService.getPermissionStatus());
            
            if (granted) {
              await notificationService.setupPushNotifications();
              notificationService.scheduleLearningReminders();
              
              // Send welcome notification
              notificationService.sendNotification('Welcome to LinguaAI! 🎉', {
                body: 'Your language learning journey starts now. Let\'s begin!',
                requireInteraction: true,
                actions: [
                  { action: 'start-learning', title: 'Start Learning' },
                  { action: 'explore', title: 'Explore App' }
                ]
              });
            }
          } catch (error) {
            console.error('Error setting up notifications:', error);
          }
        } else {
          console.log('User dismissed the install prompt');
        }
      } catch (error) {
        console.error('Error during installation:', error);
      }
      setDeferredPrompt(null);
    } else {
      console.log('No deferred prompt available');
      // Fallback for browsers that don't support beforeinstallprompt
      alert('To install this app, please use your browser\'s menu:\n\nChrome: Click the three dots menu → "Install LinguaAI"\nFirefox: Click the three dots menu → "Install"\nSafari: Click Share → "Add to Home Screen"');
    }
  };


  // Authentication handlers
  const handleAuthSuccess = async (authData) => {
    setAuthError('');

    try {
      if (authData.isLogin) {
        const result = await firebaseAuthService.signIn(authData.email, authData.password);
        if (result.success) {
          console.log('Login successful, showing language selection');
          setShowAuthForm(false);
          setShowLanguageSelection(true);
          setCurrentScreen('home');
        } else {
          setAuthError(result.error);
        }
      } else {
        const result = await firebaseAuthService.register(
          authData.email,
          authData.password,
          authData.displayName
        );
        if (result.success) {
          console.log('Signup successful, showing language selection');
          setShowAuthForm(false);
          setShowLanguageSelection(true);
          setCurrentScreen('home');
        } else {
          setAuthError(result.error);
        }
      }
    } catch (error) {
      setAuthError('An unexpected error occurred');
    }
  };

  const handleLanguageSelection = async (languageData) => {
    try {
      await firebaseAuthService.updateLearningLanguages(languageData.learningLanguages);
      await firebaseAuthService.updateBaseLanguage(languageData.baseLanguage);
      
      // Update global language state
      setGlobalLanguage(languageData.baseLanguage);
      setSelectedLanguage(languageData.baseLanguage);
      localStorage.setItem('globalLanguage', languageData.baseLanguage);
      
      // Apply RTL/LTR styling to document
      const languageData_obj = INTERFACE_LANGUAGES[languageData.baseLanguage];
      const isRTL = languageData_obj?.rtl || false;
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', languageData.baseLanguage);
      
      setShowLanguageSelection(false);
    } catch (error) {
      setAuthError('Failed to save language preferences');
    }
  };

  const handleSignOut = async () => {
    await firebaseAuthService.signOut();
    setCurrentScreen('home');
  };

  // Memoized Navigation Component
  const NavigationBar = React.memo(({ t }) => (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 p-2 sm:p-4 z-50">
      <div className="flex justify-around items-center mx-auto max-w-md sm:max-w-none">
        {navItems.map(({ id, icon: Icon, labelKey }) => (
          <button
            key={id}
            onClick={() => setCurrentScreen(id)}
            className={`flex flex-col items-center p-1 sm:p-2 rounded-lg transition-all min-w-0 flex-1 ${currentScreen === id
              ? 'text-blue-400 bg-slate-700/50'
              : 'text-slate-400 hover:text-white'
              }`}
            aria-label={`Navigate to ${t(labelKey)}`}
          >
            <Icon size={16} className="sm:w-5 sm:h-5" />
            <span className="text-xs mt-1 hidden sm:block">{t(labelKey)}</span>
          </button>
        ))}
      </div>
    </nav>
  ));

 const HomeScreen = () => (
    <div className={`space-y-6 ${currentLanguage?.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage?.rtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4 ">
          <div>
            <h1 className={`font-bold mb-1 ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
              {t('welcomeBack')}
            </h1>
            <p className="text-blue-200">{t('readyToContinue')}</p>
          </div>
          <div className="flex items-center gap-3">
            <GlobalLanguageToggle 
              className="w-40" 
              globalLanguage={globalLanguage}
              onLanguageChange={handleGlobalLanguageChange}
              compact={true}
            />
            <button
              onClick={() => setCurrentScreen('settings')}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              aria-label="Open settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="text-orange-400 mr-1" size={20} />
              <span className="font-bold text-lg">{userProgress.streak}</span>
            </div>
            <p className="text-sm text-blue-200">{t('dayStreak')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="text-yellow-400 mr-1" size={20} />
              <span className="font-bold text-lg">{userProgress.xp}</span>
            </div>
            <p className="text-sm text-blue-200">{t('totalXP')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="text-purple-400 mr-1" size={20} />
              <span className="font-bold text-lg">{userProgress.level}</span>
            </div>
            <p className="text-sm text-blue-200">{t('level')}</p>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-blue-500/20">
        <h2 className={`font-bold text-white mb-4 flex items-center ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
          <Globe className="mr-2" size={20} />
          {t('selectLanguage')}
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          {t('changeLanguageDescription')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(INTERFACE_LANGUAGES).map(([key, lang]) => (
            <button
              key={key}
              onClick={() => {
                handleGlobalLanguageChange(key);
              }}
              className={`p-4 rounded-xl border-2 transition-all ${globalLanguage === key
                ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                }`}
              aria-pressed={globalLanguage === key}
            >
              <div className="text-2xl mb-2">{lang.flag}</div>
              <div className={`font-medium ${fontSize}`}>{lang.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentScreen('lessons')}
          className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-4 text-white hover:from-green-700 hover:to-green-800 transition-all"
        >
          <BookOpen className="mx-auto mb-2" size={24} />
          <div className={`font-medium ${fontSize}`}>{t('continueLesson')}</div>
        </button>
        <button
          onClick={() => setCurrentScreen('ai-coach')}
          className="bg-gradient-to-br from-purple-800 to-pink-900 rounded-xl p-4 text-white hover:from-purple-700 hover:to-pink-800 transition-all"
        >
          <Brain className="mx-auto mb-2" size={24} />
          <div className={`font-medium ${fontSize}`}>{t('aiCoach')}</div>
        </button>
      </div>
    </div>
  ); 

  const LessonsScreen = ({ t, globalLanguage, onGlobalLanguageChange }) => {
    const [activeTab, setActiveTab] = useState(learningLanguages[0] || 'english');
    const [lessonLanguage, setLessonLanguage] = useState(() => {
      // Load from localStorage or default to english
      const saved = localStorage.getItem('lessonLanguage');
      return saved || 'english';
    });

    // Save lesson language preference
    const handleLessonLanguageChange = (language) => {
      setLessonLanguage(language);
      localStorage.setItem('lessonLanguage', language);
    };

    // Get vocabulary for the active learning language
    const vocab = VOCABULARY.beginner[activeTab] || VOCABULARY.beginner.english;

    return (
      <div className={`space-y-6 ${currentLanguage?.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage?.rtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            {t('lessons')}
          </h1>
          <div className="flex items-center gap-4">
            <GlobalLanguageToggle
              className="w-40"
              globalLanguage={globalLanguage}
              onLanguageChange={handleGlobalLanguageChange}
              compact={true}
            />
            <div className="text-blue-400 font-medium">{t('level')} {userProgress.level}</div>
          </div>
        </div>

        {/* Language Toggle for Easy Learning */}
        <div className="bg-slate-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Globe className="text-blue-400" size={24} />
              <div>
                <h3 className="font-bold text-white text-lg">Learning Language</h3>
                <p className="text-sm text-slate-400">Switch between English and Arabic for easier learning</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleLessonLanguageChange('english')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${lessonLanguage === 'english'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/20'
                  : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">🇺🇸</span>
                <span className="font-semibold text-white">English</span>
                <span className="text-xs text-slate-400">Learn in English</span>
              </div>
            </button>

            <button
              onClick={() => handleLessonLanguageChange('arabic')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${lessonLanguage === 'arabic'
                  ? 'border-green-500 bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-lg shadow-green-500/20'
                  : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">🇸🇦</span>
                <span className="font-semibold text-white">العربية</span>
                <span className="text-xs text-slate-400">تعلم بالعربية</span>
              </div>
            </button>
          </div>
        </div>

        {/* Language Tabs - Only show if user is learning multiple languages */}
        {learningLanguages.length > 1 && (
          <div className="bg-slate-800/50 rounded-xl p-1">
            <div className="flex space-x-1">
              {learningLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === lang
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">{LEARNING_LANGUAGES[lang]?.flag}</span>
                    <span>{LEARNING_LANGUAGES[lang]?.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">{t('courseProgress')}</span>
            <span className="text-blue-400 font-medium">65%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
          </div>
        </div>

        {/* Lesson Categories */}
        {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
          const levelKey = level.toLowerCase() + 'Level';
          const levelVocab = VOCABULARY[level.toLowerCase()][activeTab] || VOCABULARY[level.toLowerCase()].english;

          // Get lesson content based on selected lesson language
          const getLessonContent = (item) => {
            if (lessonLanguage === 'arabic') {
              return {
                primary: item.translation, // Show Arabic translation as primary
                secondary: item.word,     // Show English word as secondary
                isRTL: true
              };
            } else {
              return {
                primary: item.word,       // Show English word as primary
                secondary: item.translation, // Show Arabic translation as secondary
                isRTL: false
              };
            }
          };

          return (
            <div key={level} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-white ${fontSize}`}>
                  {lessonLanguage === 'arabic' ?
                    (level === 'Beginner' ? 'مبتدئ' : level === 'Intermediate' ? 'متوسط' : 'متقدم') :
                    t(levelKey)
                  }
                </h3>
                <span className="text-xs text-slate-400">{levelVocab?.length || 0} words</span>
              </div>

              <div className="space-y-2">
                {levelVocab?.slice(0, 3).map((item, index) => {
                  const content = getLessonContent(item);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                      onClick={() => speakText(content.primary, lessonLanguage)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && speakText(content.primary, lessonLanguage)}
                    >
                      <div className={`flex-1 ${content.isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`font-medium text-white ${fontSize} ${content.isRTL ? 'text-right' : 'text-left'}`}>
                          {content.primary}
                        </div>
                        <div className={`text-sm text-slate-400 ${content.isRTL ? 'text-right' : 'text-left'}`}>
                          {content.secondary}
                        </div>
                      </div>
                      <button
                        onClick={() => speakText(content.primary, lessonLanguage)}
                        className="text-blue-400 hover:text-blue-300 ml-3"
                        aria-label={`Play pronunciation for ${content.primary}`}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const LANG_CODES = {
    english: 'en-US',
    arabic: 'ar-SA',
    dutch: 'nl-NL',
    indonesian: 'id-ID',
    malay: 'ms-MY',
    thai: 'th-TH',
    khmer: 'km-KH',
  };

  const QuizScreen = ({ selectedLanguage = "english", onFinish }) => {
    const [useEnhancedQuiz, setUseEnhancedQuiz] = useState(true);
    const [quizFinished, setQuizFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const [quizStarted, setQuizStarted] = useState(false);

    const handleQuizFinish = (score, total, timeSpent) => {
      setFinalScore({ score, total, timeSpent });
      setQuizFinished(true);
      if (onFinish) {
        onFinish(score, total);
      }
    };

    const handleQuestionComplete = (questionIndex, isCorrect, answer) => {
      console.log(`Question ${questionIndex + 1}: ${isCorrect ? 'Correct' : 'Incorrect'} - ${answer}`);
    };

    const handleAnswer = useCallback(
      (answerIndex) => {
        if (showResult) return; // prevent multiple clicks
        setSelectedAnswer(answerIndex);
        setShowResult(true);

        let isCorrect = false;

        if (currentQuestionObj.type === "true_false") {
          isCorrect = answerIndex === currentQuestionObj.correct;
        } else if (currentQuestionObj.type === "multiple_choice") {
          isCorrect = answerIndex === currentQuestionObj.correct;
        } else if (currentQuestionObj.type === "fill_blank") {
          isCorrect = currentQuestionObj.options[answerIndex] === currentQuestionObj.blank;
        }

        if (isCorrect) {
          setQuizScore((prev) => prev + 1);
        }
        setIsCurrentCorrect(isCorrect);

        // Speak selected answer
        const answerText = currentQuestionObj.options[answerIndex];
        const lang = /[\u0600-\u06FF]/.test(answerText) ? "arabic" : selectedLanguage;
        speakText(answerText, lang);
      },
      [currentQuestionObj, selectedLanguage, showResult]
    );


    const handleShortAnswer = useCallback(() => {
      if (showResult || !userAnswer.trim()) return;
      setShowResult(true);

      const correctAnswer = currentQuestionObj.answer.toLowerCase().trim();
      const userAns = userAnswer.toLowerCase().trim();
      const isCorrectBool = userAns === correctAnswer;

      setSelectedAnswer(userAnswer);
      if (isCorrectBool) {
        setQuizScore((prev) => prev + 1);
      }
      setIsCurrentCorrect(isCorrectBool);

      // Speak user's answer
      const lang = /[\u0600-\u06FF]/.test(userAnswer) ? "arabic" : selectedLanguage;
      speakText(userAnswer, lang);
    }, [userAnswer, currentQuestionObj, selectedLanguage, showResult]);

    const nextQuestion = () => {
      setSelectedAnswer(null);
      setUserAnswer("");
      setShowResult(false);
      setIsCurrentCorrect(false);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // Quiz finished
        if (onFinish) {
          onFinish(quizScore, questions.length);
        }

        // Open another tab (new page)
        window.location.href = '/profilescreen';
      }
    };


    if (!currentQuestionObj) return <div>Loading quiz...</div>;

    return (
      <div className="space-y-6 p-4">
        <h2 className="text-white text-2xl font-bold">
          Question {currentQuestion + 1}/{questions.length}
        </h2>
        <p
          className={`text-white text-lg mb-4 ${isQuestionArabic ? "text-right" : "text-left"}`}
          dir={isQuestionArabic ? "rtl" : "auto"}
        >
          {currentQuestionObj.question}
        </p>

        {currentQuestionObj.type === "short_answer" ? (
          <div className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={
                isQuestionArabic
                  ? "اكْتُبْ إِجَابَتَكَ هُنَا..."
                  : "Enter your answer here..."
              }
              className={`w-full p-4 rounded-xl text-white bg-slate-700 border-2 focus:outline-none focus:border-blue-400 ${showResult
                ? isCurrentCorrect
                  ? "border-green-400 bg-green-600"
                  : "border-red-400 bg-red-600"
                : "border-transparent"
                }`}
              dir={isQuestionArabic ? "rtl" : "auto"}
            />
            {!showResult && (
              <button
                onClick={handleShortAnswer}
                className="w-full px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-500"
              >
                Submit Answer
              </button>
            )}
            {showResult && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  {isCurrentCorrect ? (
                    <Check className="text-green-400" />
                  ) : (
                    <X className="text-red-400" />
                  )}
                  <button
                    onClick={() => {
                      const lang = /[\u0600-\u06FF]/.test(userAnswer)
                        ? "arabic"
                        : selectedLanguage;
                      speakText(userAnswer, lang);
                    }}
                    className="text-blue-400"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                {!isCurrentCorrect && (
                  <div className="space-y-2">
                    <p className="text-green-400 font-medium">
                      الْإِجَابَةُ الصَّحِيحَةُ: {currentQuestionObj.answer}
                    </p>
                    <button
                      onClick={() => speakText(currentQuestionObj.answer, "arabic")}
                      className="text-blue-400 flex items-center"
                    >
                      <Volume2 size={16} className="mr-1" />
                      Hear correct answer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {currentQuestionObj.options.map((option, index) => {
              const isArabic = /[\u0600-\u06FF]/.test(option);
              const lang = isArabic ? "arabic" : selectedLanguage;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-white ${isArabic ? "text-right" : "text-left"
                    } ${showResult
                      ? index === currentQuestionObj.correct
                        ? "bg-green-600 border-2 border-green-400"
                        : selectedAnswer === index
                          ? "bg-red-600 border-2 border-red-400"
                          : "bg-slate-700"
                      : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  dir={isArabic ? "rtl" : "auto"}
                >
                  <div className="flex justify-between items-center">
                    <span dir={isArabic ? "rtl" : "auto"}>{option}</span>
                    {showResult && (
                      <>
                        {index === currentQuestionObj.correct && (
                          <Check className="text-green-400" />
                        )}
                        {selectedAnswer === index &&
                          index !== currentQuestionObj.correct && (
                            <X className="text-red-400" />
                          )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(option, lang);
                          }}
                          className="text-blue-400 ml-2"
                        >
                          <Volume2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {showResult && (
          <button
            onClick={nextQuestion}
            className="mt-4 px-6 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-500"
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        )}
      </div>
    );
  };


  const QUIZ_QUESTIONS = {
    english: [
      {
        type: "multiple_choice",
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin"],
        correct: 1
      },
      {
        type: "true_false",
        question: "The Earth is flat.",
        options: ["True", "False"],
        correct: 1
      },
      {
        type: "fill_blank",
        question: "The ___ is shining brightly.",
        options: ["sun", "moon", "star"],
        blank: "sun",
        correct: 0
      },
      {
        type: "short_answer",
        question: "What is 2 + 2?",
        answer: "4"
      },
      {
        type: "multiple_choice",
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean"],
        correct: 1
      }
    ],
    arabic: [
      {
        type: "multiple_choice",
        question: "مَا هِيْ عَاصِمَةُ فَرْنْسَا؟",
        options: ["لُنْدُنْ", "بَارِيسْ", "بَرْلِينْ"],
        correct: 1
      },
      {
        type: "true_false",
        question: "الْأَرْضُ مُسْطَحَةٌ.",
        options: ["صَحِيْحٌ", "خَطْأٌ"],
        correct: 1
      },
      {
        type: "fill_blank",
        question: "الْـ___ تَلْمَعُ بِشِدَّةٍ.",
        options: ["شَمْسٌ", "قَمَرٌ", "نَجْمٌ"],
        blank: "شَمْسٌ",
        correct: 0
      },
      {
        type: "short_answer",
        question: "مَا هُوَ ٢ + ٢؟",
        answer: "٤"
      },
      {
        type: "multiple_choice",
        question: "مَا هُوَ أَكْبَرُ مُحِيطٍ عَلَى الْأَرْضِ؟",
        options: ["الْمُحِيطُ الْأَطْلَسِيُّ", "الْمُحِيطُ الْهَادِئُ", "الْمُحِيطُ الْهِنْدِيُّ"],
        correct: 1
      }
    ]
  };

  const App = () => {
    const [language, setLanguage] = useState("english");
    const [quizFinished, setQuizFinished] = useState(false);
    const [score, setScore] = useState(0);

    const handleFinish = (s, total) => {
      setScore(`${s}/${total}`);
      setQuizFinished(true);
    };

    return (
      <div className="min-h-screen bg-gray-900 p-4">
        {!quizFinished ? (
          <>
            <div className="mb-4">
              <label className="text-white mr-2">Select Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 rounded"
              >
                <option value="english">English</option>
                <option value="arabic">Arabic</option>
              </select>
            </div>
            <QuizScreen selectedLanguage={language} onFinish={handleFinish} />
          </>
        ) : (
          <div className="text-white text-2xl">
            Quiz Finished! Your score: {score}
          </div>
        )}
      </div>
    );
  };


  const AICoachScreen = ({ t, globalLanguage, speakText, fontSize }) => {
    const [learningLanguage, setLearningLanguage] = useState(null); // null = not selected yet
    const [pronunciationScore, setPronunciationScore] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [expectedText, setExpectedText] = useState('Hello, how are you?');
    const [liveTranscript, setLiveTranscript] = useState('');
    const [grammarCorrections, setGrammarCorrections] = useState([]);
    const [pronunciationFeedback, setPronunciationFeedback] = useState('');
    const [detectedLanguage, setDetectedLanguage] = useState('english');
    const recognitionRef = useRef(null);
    const isRecordingRef = useRef(false);

    // Initialize chat when language is selected
    const initializeChat = (language) => {
      setLearningLanguage(language);
      const welcomeMessages = {
        english: [
          { type: 'ai', message: 'Hello! I\'m your AI language coach. I\'ll help you learn English. What would you like to practice today?' },
          { type: 'ai', message: 'I can help you with:\n• Grammar and vocabulary\n• Pronunciation practice\n• Conversation practice\n• Writing exercises\n\nJust type your message or use voice input!' }
        ],
        arabic: [
          { type: 'ai', message: 'مرحباً! أنا مدربك الذكي للغة. سأساعدك في تعلم العربية. ماذا تريد أن تتدرب عليه اليوم؟' },
          { type: 'ai', message: 'يمكنني مساعدتك في:\n• القواعد والمفردات\n• ممارسة النطق\n• ممارسة المحادثة\n• تمارين الكتابة\n\nاكتب رسالتك أو استخدم الإدخال الصوتي!' }
        ]
      };
      setChatMessages(welcomeMessages[language] || welcomeMessages.english);
      
          // Send notification for AI Coach session start
          if (notificationService.getPermissionStatus() === 'granted') {
            notificationService.sendNotification('AI Coach Session Started! 🤖', {
              body: `Your ${language} learning session with AI Coach is ready. Let's start learning!`,
              requireInteraction: true,
              actions: [
                { action: 'continue-session', title: 'Continue Session' },
                { action: 'dismiss', title: 'Dismiss' }
              ]
            });
            trackNotification('liveSessions');
          }
    };

    // Auto language detection function
    const detectLanguage = (text) => {
      // Check for Arabic characters (including diacritics)
      if (/[\u0600-\u06FF]/.test(text)) {
        return 'arabic';
      }
      // Check for Thai characters
      if (/[\u0E00-\u0E7F]/.test(text)) {
        return 'thai';
      }
      // Check for Khmer characters
      if (/[\u1780-\u17FF]/.test(text)) {
        return 'khmer';
      }
      // Default to English (also covers Dutch, Indonesian, Malay as they use Latin alphabet)
      return 'english';
    };

    // Levenshtein distance for pronunciation similarity
    const levenshteinDistance = (str1, str2) => {
      const matrix = [];
      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
      }
      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
      }
      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[str2.length][str1.length];
    };

    const similarity = (str1, str2) => {
      const distance = levenshteinDistance(str1, str2);
      const maxLen = Math.max(str1.length, str2.length);
      return maxLen === 0 ? 1 : 1 - distance / maxLen;
    };

    // Grammar checker extended for multiple languages
    const checkGrammar = (text) => {
      const corrections = [];
      const lowerText = text.toLowerCase();

      const rules = {
        english: [
          { pattern: /i is/gi, correction: 'I am', note: 'Use "I am" for first-person singular.' },
          { pattern: /dont/gi, correction: "don't", note: "Use contraction 'don't' for 'do not'." }
        ],
        arabic: [
          { pattern: /مرحبا/gi, correction: 'مَرْحَبًا', note: 'Add correct vowel markings for proper pronunciation.' }
        ],
        dutch: [
          { pattern: /ik is/gi, correction: 'ik ben', note: 'Use "ik ben" for first-person singular.' }
        ],
        // Add for other languages...
        indonesian: [
          { pattern: /saya adalah/gi, correction: 'saya', note: 'Simplify to "saya" in casual speech.' }
        ],
        malay: [
          { pattern: /saya adalah/gi, correction: 'saya', note: 'Simplify to "saya" in casual speech.' }
        ],
        thai: [
          { pattern: /ฉันเป็น/gi, correction: 'ฉัน', note: 'Omit "เป็น" in simple statements.' }
        ],
        khmer: [
          { pattern: /ខ្ញុំជា/gi, correction: 'ខ្ញុំ', note: 'Simplify statements.' }
        ]
      };
      const AppContent = () => {
        const { user, setUser, loading } = useUser();
        const [firstLogin, setFirstLogin] = useState(false);

        useEffect(() => {
          if (!loading && user) {
            const localData = JSON.parse(localStorage.getItem("userData")) || {};
            const languages = user.learningLanguages || localData.learningLanguages || [];

            if (languages.length === 0) {
              setFirstLogin(true);
            } else {
              if (!user.learningLanguages) {
                setUser({ ...user, learningLanguages: languages });
              }
              setFirstLogin(false);
            }
          }
        }, [user, loading, setUser]);

        if (loading) return <p>Loading...</p>;

        if (!user) return (
          <AuthForm onAuthSuccess={(authUser) => {
            const fallbackUser = { uid: "local-" + Date.now(), learningLanguages: [], ...authUser };
            localStorage.setItem("userData", JSON.stringify(fallbackUser));
            setUser(fallbackUser);
          }} />
        );

        if (firstLogin) return <Onboarding />;

        return (
          <div>
            <LessonsTab />
            <Profile />
          </div>
        );
      };

      function App() {
        return (
          <UserProvider>
            <AppContent />
          </UserProvider>
        );
      }

      const langRules = rules[globalLanguage] || rules.english;
      langRules.forEach(rule => {
        if (rule.pattern.test(text)) {
          corrections.push({
            error: text.match(rule.pattern)[0],
            correction: text.replace(rule.pattern, rule.correction),
            note: rule.note
          });
        }
      });

      return corrections;
    };

    // Simulated phoneme-level pronunciation analysis
    const analyzePronunciation = (transcript) => {
      const sim = similarity(transcript.toLowerCase(), expectedText.toLowerCase());
      const score = Math.round(sim * 100);
      let feedback = '';
      if (score > 90) feedback = 'Excellent pronunciation!';
      else if (score > 70) feedback = 'Good job, but focus on clearer enunciation.';
      else feedback = 'Needs improvement. Try emphasizing each syllable.';

      // Mock phoneme feedback based on language
      let phonemeFeedback = '';
      if (globalLanguage === 'english') {
        phonemeFeedback = transcript.toLowerCase().includes('hello')
          ? 'Great stress on "hello".'
          : 'Work on stressing the first syllable in "hello".';
      } else if (globalLanguage === 'arabic') {
        phonemeFeedback = transcript.includes('مَرْحَبًا') ? 'Good use of diacritics in pronunciation.' : 'Focus on the harakat (vowels) for clarity.';
      } // Extend for other languages

      return { score, feedback, phonemeFeedback };
    };

    useEffect(() => {
      // Set expected text based on selected language with vowels for Arabic
      const expectedTexts = {
        english: 'Hello, how are you today?',
        arabic: 'مَرْحَبًا، كَيْفَ حَالُكَ الْيَوْمَ؟', // With full diacritics
        dutch: 'Hallo, hoe gaat het vandaag?',
        indonesian: 'Halo, apa kabar hari ini?',
        malay: 'Hello, apa khabar hari ini?',
        thai: 'สวัสดี คุณสบายดีไหมวันนี้?',
        khmer: 'សួស្តី អ្នកសប្បាយជាដើម្បីទេថ្ងៃនេះ?'
      };
      setExpectedText(expectedTexts[globalLanguage] || expectedTexts.english);

      // Initialize SpeechRecognition with language support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        const langMap = {
          arabic: 'ar-SA',
          dutch: 'nl-NL',
          indonesian: 'id-ID',
          malay: 'ms-MY',
          thai: 'th-TH',
          khmer: 'km-KH',
          english: 'en-US'
        };
        recognitionRef.current.lang = langMap[globalLanguage] || 'en-US';

        recognitionRef.current.onresult = (e) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const transcript = e.results[i][0].transcript;
            if (e.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          setLiveTranscript(interimTranscript || finalTranscript);

          if (finalTranscript) {
            const grammar = checkGrammar(finalTranscript);
            setGrammarCorrections(grammar);

            const pronunciation = analyzePronunciation(finalTranscript);
            setPronunciationScore(pronunciation);
            setPronunciationFeedback(pronunciation.phonemeFeedback);
          }
        };

        recognitionRef.current.onerror = (e) => {
          console.error('STT error:', e.error);
          setIsRecording(false);
          setIsAnalyzing(false);
          let errorMessage = '';
          switch (e.error) {
            case 'no-speech':
              errorMessage = 'No speech detected. Please try again.';
              break;
            case 'audio-capture':
              errorMessage = 'Microphone access denied. Please allow microphone access.';
              break;
            case 'not-allowed':
              errorMessage = 'Permission denied. Please enable microphone permissions.';
              break;
            default:
              errorMessage = 'An error occurred during speech recognition.';
          }
          setChatMessages(prev => [...prev, { type: 'ai', message: errorMessage }]);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          setIsAnalyzing(false);
        };
      }

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }, [globalLanguage, expectedText]);

    // Speak AI messages (auto-detect Arabic and enforce Arabic TTS with diacritics)
    useEffect(() => {
      if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].type === 'ai') {
        const msg = chatMessages[chatMessages.length - 1].message || '';
        const containsArabic = /[\u0600-\u06FF]/.test(msg);
        const lang = containsArabic ? 'arabic' : globalLanguage;
        speakText(msg, lang, { rate: containsArabic ? 0.9 : 1.0, pitch: 1.0 });
      }
    }, [chatMessages, globalLanguage, speakText]);

    const startRecording = useCallback(() => {
      // Prevent multiple starts using ref for immediate check
      if (isRecordingRef.current) return;

      // Set ref immediately to prevent race conditions
      isRecordingRef.current = true;
      setIsRecording(true);
      setIsAnalyzing(true);
      setPronunciationScore(null);
      setGrammarCorrections([]);
      setPronunciationFeedback('');
      setLiveTranscript('');

      if (recognitionRef.current) {
        // Check if already started
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.log('SpeechRecognition already started or not available');
          isRecordingRef.current = false;
          setIsRecording(false);
          setIsAnalyzing(false);
        }
      } else {
        // Fallback simulation
        setTimeout(() => {
          isRecordingRef.current = false;
          setIsRecording(false);
          setIsAnalyzing(true);
          setLiveTranscript(expectedText);
          setTimeout(() => {
            const grammar = checkGrammar(expectedText);
            setGrammarCorrections(grammar);
            const pronunciation = analyzePronunciation(expectedText);
            setPronunciationScore(pronunciation);
            setPronunciationFeedback(pronunciation.phonemeFeedback);
            setIsAnalyzing(false);
          }, 2000);
        }, 3000);
      }
    }, [expectedText]);

    const stopRecording = useCallback(() => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('SpeechRecognition stop failed:', error);
        }
      }
      // Reset ref immediately
      isRecordingRef.current = false;
      setIsRecording(false);
      setIsAnalyzing(false);
    }, []);

    const startChatListening = useCallback(() => {
      // Prevent multiple starts
      if (isRecordingRef.current) return;

      isRecordingRef.current = true;
      setIsRecording(true);

      if (recognitionRef.current) {
        // Create a new SpeechRecognition instance for chat to avoid conflicts
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const chatRecognition = new SpeechRecognition();
        chatRecognition.continuous = false;
        chatRecognition.interimResults = false;
        
        // Set language for chat recognition
        const langMap = {
          arabic: 'ar-SA',
          dutch: 'nl-NL',
          indonesian: 'id-ID',
          malay: 'ms-MY',
          thai: 'th-TH',
          khmer: 'km-KH',
          english: 'en-US'
        };
        chatRecognition.lang = langMap[globalLanguage] || 'en-US';

        chatRecognition.onresult = (e) => {
          const text = e.results[0][0].transcript;
          setInputMessage(text);
          isRecordingRef.current = false;
          setIsRecording(false);
        };
        
        chatRecognition.onerror = (e) => {
          console.log('Chat SpeechRecognition error:', e.error);
          isRecordingRef.current = false;
          setIsRecording(false);
        };
        
        chatRecognition.onend = () => {
          isRecordingRef.current = false;
          setIsRecording(false);
        };
        
        try {
          chatRecognition.start();
        } catch (error) {
          console.log('Chat SpeechRecognition start failed:', error);
          isRecordingRef.current = false;
          setIsRecording(false);
        }
      } else {
        // Fallback simulation for chat
        setTimeout(() => {
          setInputMessage('Hello, how are you?');
          isRecordingRef.current = false;
          setIsRecording(false);
        }, 2000);
      }
    }, [globalLanguage]);

    const sendMessage = useCallback(() => {
      if (!inputMessage.trim()) return;

      // Auto-detect language from user input
      const detectedLang = detectLanguage(inputMessage);
      setDetectedLanguage(detectedLang);

      let corrected = inputMessage;
      const grammar = checkGrammar(inputMessage);
      if (grammar.length > 0) {
        corrected = grammar.reduce((text, corr) => text.replace(corr.error, corr.correction), inputMessage);
      }

      // Generate language-specific response
      const getLanguageResponse = (lang) => {
        const responses = {
          english: `Great! I detected you're speaking English. You said: "${inputMessage}". ${grammar.length > 0 ? `Corrected: "${corrected}".` : ''} Excellent pronunciation! What would you like to practice next?`,
          arabic: `ممتاز! لقد اكتشفت أنك تتحدث العربية. قلت: "${inputMessage}". ${grammar.length > 0 ? `المصحح: "${corrected}".` : ''} نطق ممتاز! ماذا تريد أن تتدرب عليه بعد ذلك؟`,
          dutch: `Geweldig! Ik heb gedetecteerd dat je Nederlands spreekt. Je zei: "${inputMessage}". ${grammar.length > 0 ? `Gecorrigeerd: "${corrected}".` : ''} Uitstekende uitspraak! Wat wil je daarna oefenen?`,
          indonesian: `Bagus! Saya mendeteksi Anda berbicara bahasa Indonesia. Anda berkata: "${inputMessage}". ${grammar.length > 0 ? `Dikoreksi: "${corrected}".` : ''} Pengucapan yang bagus! Apa yang ingin Anda latih selanjutnya?`,
          malay: `Bagus! Saya mengesan anda bercakap bahasa Melayu. Anda berkata: "${inputMessage}". ${grammar.length > 0 ? `Dibetulkan: "${corrected}".` : ''} Sebutan yang bagus! Apa yang anda mahu latih seterusnya?`,
          thai: `ยอดเยี่ยม! ฉันตรวจพบว่าคุณพูดภาษาไทย คุณพูดว่า: "${inputMessage}". ${grammar.length > 0 ? `แก้ไขแล้ว: "${corrected}".` : ''} การออกเสียงยอดเยี่ยม! คุณต้องการฝึกอะไรต่อไป?`,
          khmer: `ល្អណាស់! ខ្ញុំបានរកឃើញថាអ្នកនិយាយភាសាខ្មែរ។ អ្នកបាននិយាយថា: "${inputMessage}". ${grammar.length > 0 ? `បានកែតម្រូវ: "${corrected}".` : ''} ការបញ្ចេញសំឡេងល្អណាស់! អ្នកចង់អនុវត្តអ្វីបន្តទៀត?`
        };
        return responses[lang] || responses.english;
      };

      setChatMessages(prev => [
        ...prev,
        { type: 'user', message: inputMessage },
        {
          type: 'ai',
          message: getLanguageResponse(detectedLang)
        }
      ]);
      setInputMessage('');
    }, [inputMessage, globalLanguage]);

    // Cleanup effect to reset recording state
    useEffect(() => {
      return () => {
        isRecordingRef.current = false;
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (error) {
            // Ignore errors during cleanup
          }
        }
      };
    }, []);

    // Determine RTL based on global language key
    const rtlLanguages = new Set(['arabic', 'hebrew', 'urdu', 'farsi']);
    const isRTL = rtlLanguages.has(String(globalLanguage).toLowerCase());
    // Show language selection if not selected yet
    if (learningLanguage === null) {
      return (
        <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
              {t('aiLanguageCoach')}
            </h1>
            <div className="flex items-center gap-4">

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Online</span>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
            <div className="text-center mb-8">
              <h2 className={`font-bold text-white mb-4 ${fontSize === 'text-sm' ? 'text-2xl' : fontSize === 'text-lg' ? 'text-3xl' : 'text-4xl'}`}>
                {t('chooseLearningLanguage')}
              </h2>
              <p className="text-slate-400 text-lg">
                {t('whatLanguageToLearn')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => initializeChat('english')}
                className="p-8 rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 group"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🇺🇸</div>
                  <h3 className="text-2xl font-bold text-white mb-2">English</h3>
                  <p className="text-slate-300 mb-4">Learn English with AI assistance</p>
                  <div className="text-sm text-slate-400">
                    • Grammar & Vocabulary<br />
                    • Pronunciation Practice<br />
                    • Conversation Practice
                  </div>
                </div>
              </button>

              <button
                onClick={() => initializeChat('arabic')}
                className="p-8 rounded-2xl border-2 border-green-500 bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300 group"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🇸🇦</div>
                  <h3 className="text-2xl font-bold text-white mb-2">العربية</h3>
                  <p className="text-slate-300 mb-4">تعلم العربية بمساعدة الذكاء الاصطناعي</p>
                  <div className="text-sm text-slate-400">
                    • القواعد والمفردات<br />
                    • ممارسة النطق<br />
                    • ممارسة المحادثة
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            {t('aiLanguageCoach')} - {learningLanguage === 'arabic' ? 'العربية' : 'English'}
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">Online</span>
          </div>
        </div>

        {/* Pronunciation Coach */}
        <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Mic className="text-purple-300 mr-2" size={20} />
            <h3 className={`font-bold text-white ${fontSize}`}>{t('pronunciationCoach')}</h3>
          </div>

          <div className="text-center">
            <div className="mb-4">
              <p className="text-purple-200 mb-2">{t('say')}<span className="font-bold">"{expectedText}"</span></p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-purple-600 hover:bg-purple-500'}`}
                  aria-label={isRecording ? 'Recording...' : 'Start recording'}
                >
                  {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-600 hover:bg-gray-500 transition-all"
                    aria-label="Stop recording"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            </div>

            {/* Live Transcript */}
            {liveTranscript && (
              <div className="bg-purple-800/50 rounded-xl p-4 mt-4" role="status" aria-live="polite">
                <p className="text-purple-200 font-medium">Live Transcript:</p>
                <p className="text-white">{liveTranscript}</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-purple-200" role="status" aria-live="polite">
                <div className="animate-spin w-6 h-6 border-2 border-purple-300 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>{t('analyzingPronunciation')}</p>
              </div>
            )}

            {/* Real-time Feedback */}
            {(grammarCorrections.length > 0 || pronunciationScore || pronunciationFeedback) && (
              <div className="bg-purple-800/50 rounded-xl p-4 mt-4" role="alert">
                {grammarCorrections.length > 0 && (
                  <div className="mb-4">
                    <p className="text-purple-200 font-medium">Grammar Corrections:</p>
                    {grammarCorrections.map((corr, index) => (
                      <div key={index} className="mt-2">
                        <p className="text-red-400">❌ {corr.error}</p>
                        <p className="text-green-400">✅ {corr.correction}</p>
                        <p className="text-purple-200 text-sm">{corr.note}</p>
                      </div>
                    ))}
                  </div>
                )}
                {pronunciationScore && (
                  <div>
                    <p className="text-purple-200 font-medium">Pronunciation Feedback:</p>
                    <div className="flex items-center justify-center mb-2">
                      <Star className="text-yellow-400 mr-2" size={20} />
                      <span className="text-2xl font-bold text-white">{pronunciationScore.score}%</span>
                    </div>
                    <p className="text-purple-200">{pronunciationScore.feedback}</p>
                    {pronunciationFeedback && (
                      <p className="text-purple-200 text-sm mt-2">{pronunciationFeedback}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI Chat */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <MessageCircle className="text-blue-300 mr-2" size={20} />
            <h3 className={`font-bold text-white ${fontSize}`}>{t('chatWithAiTutor')}</h3>
          </div>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto" role="log" aria-live="polite">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-xl ${fontSize} ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={startChatListening}
              disabled={isRecording}
              className={`text-white p-3 rounded-xl transition-colors ${isRecording ? 'bg-red-500 animate-pulse cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
              aria-label={isRecording ? 'Recording...' : 'Speak message'}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t('askAboutLearning')}
              className={`flex-1 p-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-blue-500 outline-none ${fontSize}`}
              aria-label="Chat message input"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-colors"
              aria-label="Send message"
            >
              {t('send')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProfileScreen = ({ t, globalLanguage, onGlobalLanguageChange }) => {
    const { user, userData, isUpdating, updateProfile, updateSettings, updateLearningLanguages, updateBaseLanguage, logout, leaderboard } = useContext(UserContext);
    
    // Apply global settings
    useEffect(() => {
      if (userData?.settings) {
        // Apply global settings directly
        const { theme, fontSize, language, sound, notifications } = userData.settings;
        
        // Apply theme globally
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
          document.body.classList.add('dark');
          document.body.classList.remove('light');
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          document.body.classList.remove('dark');
          document.body.classList.add('light');
        } else {
          // System theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            document.body.classList.add('dark');
            document.body.classList.remove('light');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            document.body.classList.remove('dark');
            document.body.classList.add('light');
          }
        }
        
        // Apply font size globally
        const fontSizeMap = {
          small: '14px',
          medium: '16px',
          large: '22px'
        };
        const fontSizeValue = fontSizeMap[fontSize] || '16px';
        document.documentElement.style.fontSize = fontSizeValue;
        document.body.style.fontSize = fontSizeValue;
        
        // Apply language direction
        if (language === 'arabic') {
          document.documentElement.setAttribute('dir', 'rtl');
          document.documentElement.setAttribute('lang', 'ar');
          document.body.setAttribute('dir', 'rtl');
          document.body.setAttribute('lang', 'ar');
        } else {
          document.documentElement.setAttribute('dir', 'ltr');
          document.documentElement.setAttribute('lang', 'en');
          document.body.setAttribute('dir', 'ltr');
          document.body.setAttribute('lang', 'en');
        }
        
        // Apply sound settings globally
        window.userSoundEnabled = sound;
        localStorage.setItem('userSoundEnabled', sound.toString());
        
        // Apply notification settings globally
        window.userNotificationsEnabled = notifications;
        localStorage.setItem('userNotificationsEnabled', notifications.toString());
        
        console.log('Global settings applied:', { theme, fontSize, language, sound, notifications });
      }
    }, [userData?.settings]);
    const [activeTab, setActiveTab] = useState('stats');
    const [formData, setFormData] = useState({
      displayName: '',
      email: ''
    });
    const [settings, setSettings] = useState({
      language: 'english',
      fontSize: 'medium',
      sound: true,
      notifications: true,
      theme: 'system'
    });
    const [learningLanguages, setLearningLanguages] = useState(['arabic']);
    const [baseLanguage, setBaseLanguage] = useState('english');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [fontSize, setFontSize] = useState('text-base');

    // Initialize form data when userData changes
    useEffect(() => {
      if (userData) {
        console.log('ProfileScreen - UserData loaded:', userData);
        
        setFormData({
          displayName: userData.displayName || '',
          email: userData.email || ''
        });
        setSettings(userData.settings || {
          language: 'english',
          fontSize: 'medium',
          sound: true,
          notifications: true,
          theme: 'system'
        });
        setLearningLanguages(userData.learningLanguages || ['arabic']);
        setBaseLanguage(userData.baseLanguage || 'english');
        
        // Update font size state for UI
        const sizeMap = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
        const fontSizeClass = sizeMap[userData.settings?.fontSize] || 'text-base';
        setFontSize(fontSizeClass);
      }
    }, [userData]);

    // User progress data from Firestore
    const userProgress = userData ? {
      xp: userData.xp || 0,
      streak: userData.streak || 0,
      level: userData.level || 1,
      badges: userData.badges || [],
      wordsLearned: userData.wordsLearned || 0
    } : {
      xp: 0,
      streak: 0,
      level: 1,
      badges: [],
      wordsLearned: 0
    };

    const showMessage = (type, text) => {
      setMessage({ type, text });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleProfileUpdate = async (e) => {
      e.preventDefault();
      if (!formData.displayName.trim()) {
        showMessage('error', 'Display name is required');
        return;
      }

      setIsSaving(true);
      try {
        const result = await updateProfile(formData);
        if (result.success) {
          showMessage('success', 'Profile updated successfully');
        } else {
          showMessage('error', result.error || 'Failed to update profile');
        }
      } catch (error) {
        showMessage('error', 'An error occurred while updating profile');
      } finally {
        setIsSaving(false);
      }
    };

    const handleSettingsUpdate = async (newSettings) => {
      setIsSaving(true);
      try {
        const result = await updateSettings(newSettings);
        if (result.success) {
          setSettings(newSettings);
          showMessage('success', 'Settings updated successfully');
        } else {
          showMessage('error', result.error || 'Failed to update settings');
        }
      } catch (error) {
        showMessage('error', 'An error occurred while updating settings');
      } finally {
        setIsSaving(false);
      }
    };

    const handleLearningLanguagesUpdate = async (languages) => {
      setIsSaving(true);
      try {
        const result = await updateLearningLanguages(languages);
        if (result.success) {
          setLearningLanguages(languages);
          showMessage('success', 'Learning languages updated successfully');
        } else {
          showMessage('error', result.error || 'Failed to update learning languages');
        }
      } catch (error) {
        showMessage('error', 'An error occurred while updating learning languages');
      } finally {
        setIsSaving(false);
      }
    };

    const handleBaseLanguageUpdate = async (language) => {
      setIsSaving(true);
      try {
        const result = await updateBaseLanguage(language);
        if (result.success) {
          setBaseLanguage(language);
          showMessage('success', 'Base language updated successfully');
        } else {
          showMessage('error', result.error || 'Failed to update base language');
        }
      } catch (error) {
        showMessage('error', 'An error occurred while updating base language');
      } finally {
        setIsSaving(false);
      }
    };

    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        showMessage('error', 'Failed to logout');
      }
    };

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

    // Leaderboard data is now loaded automatically via UserContext

    const handleLanguageChange = async (type, language) => {
      if (type === 'base') {
        await handleBaseLanguageUpdate(language);
        const sizeMap = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
        setFontSize(sizeMap[settings.fontSize]);
      } else {
        const newLanguages = learningLanguages.includes(language)
          ? learningLanguages.filter(l => l !== language)
          : [...learningLanguages, language];
        await handleLearningLanguagesUpdate(newLanguages);
      }
    };

    const handleSettingChange = async (setting, value) => {
      const newSettings = { ...settings, [setting]: value };
      setSettings(newSettings);
      
      // Update font size state for UI
      if (setting === 'fontSize') {
        const sizeMap = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
        const fontSizeClass = sizeMap[value];
        setFontSize(fontSizeClass);
      }
      
      // Update settings in database and apply globally
      await handleSettingsUpdate(newSettings);
    };

    const currentLanguage = INTERFACE_LANGUAGES[selectedLanguage];

    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-900/30 border border-green-500/50 text-green-300' 
                : 'bg-red-900/30 border border-red-500/50 text-red-300'
            }`}>
              {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
              {message.text}
            </div>
          )}

          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile')}</h1>
              <p className="text-gray-600">{t('trackProgress')}</p>
            </div>
           
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut size={18} />
                {t('logout')}
              </button>
               <GlobalLanguageToggle 
              className="w-40" 
              globalLanguage={globalLanguage}
              onLanguageChange={handleGlobalLanguageChange}
              compact={true}
            />
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {userData?.displayName?.charAt(0)?.toUpperCase() || 'You'}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-2">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'stats', label: t('stats'), icon: TrendingUp },
                { id: 'settings', label: t('settings'), icon: Settings },
                { id: 'leaderboard', label: t('leaderboard'), icon: Trophy }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-4 sm:space-y-6">
              {/* User Profile Card */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl">
                      {userData?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-2xl font-bold mb-2">{userData?.displayName || 'User'}</h2>
                      <p className="text-blue-200 text-lg">{t('languageExplorer')}</p>
                      <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                        {learningLanguages.map((lang) => (
                          <span key={lang} className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                            {LEARNING_LANGUAGES[lang]?.flag} {LEARNING_LANGUAGES[lang]?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:bg-white/15 transition-all">
                      <Zap className="text-yellow-400 mx-auto mb-3" size={24} />
                      <div className="text-2xl font-bold mb-1">{userProgress.xp}</div>
                      <div className="text-sm text-blue-200">Total XP</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:bg-white/15 transition-all">
                      <Flame className="text-orange-400 mx-auto mb-3" size={24} />
                      <div className="text-2xl font-bold mb-1">{userProgress.streak}</div>
                      <div className="text-sm text-blue-200">Day Streak</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:bg-white/15 transition-all">
                      <Trophy className="text-yellow-400 mx-auto mb-3" size={24} />
                      <div className="text-2xl font-bold mb-1">{userProgress.level}</div>
                      <div className="text-sm text-blue-200">Level</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:bg-white/15 transition-all">
                      <Award className="text-purple-400 mx-auto mb-3" size={24} />
                      <div className="text-2xl font-bold mb-1">{userProgress.badges.length}</div>
                      <div className="text-sm text-blue-200">Badges</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="text-blue-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Learning Stats</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{userProgress.xp}</div>
                    <div className="text-sm text-gray-600">Total XP</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{userProgress.streak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 mb-2">{userProgress.wordsLearned}</div>
                    <div className="text-sm text-gray-600">Words Learned</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{userProgress.level}</div>
                    <div className="text-sm text-gray-600">Level</div>
                  </div>
                </div>
              </div>

              {/* Learning Progress */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-green-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Learning Progress</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Current Level Progress</span>
                      <span className="text-gray-600 text-sm">{userProgress.xp} / {(userProgress.level + 1) * 100} XP</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((userProgress.xp % 100) / 100 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Weekly Goal</span>
                      <span className="text-gray-600 text-sm">7 / 7 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((userProgress.streak / 7) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="text-yellow-500" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Achievements</h3>
                </div>
                <div className="grid gap-4">
                  {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = userProgress.badges.includes(achievement.id);
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          isUnlocked
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md'
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isUnlocked 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                            : 'bg-gray-300'
                        }`}>
                          <Icon className={isUnlocked ? 'text-white' : 'text-gray-500'} size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-lg truncate ${
                            isUnlocked ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {achievement.name}
                          </div>
                          <div className={`text-sm ${
                            isUnlocked ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {achievement.description}
                          </div>
                        </div>
                        {isUnlocked && (
                          <Check className="text-green-500 flex-shrink-0" size={24} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {userProgress.badges.length === 0 && (
                  <div className="text-center py-8">
                    <Award className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 text-lg">No achievements yet</p>
                    <p className="text-gray-400 text-sm">Keep learning to unlock them!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Account Info Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="text-blue-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your display name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving || isUpdating}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving || isUpdating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {isSaving || isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>

              {/* Language Settings */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Globe className="text-blue-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Language Settings</h3>
                </div>
                  <button className="text-blue-600 font-medium hover:text-blue-700">
                    Edit
                  </button>
                </div>
                
                {/* Profile Information */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Display Name:</span>
                    <span className="text-gray-900 font-medium">{userData?.displayName || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Country/Region:</span>
                    <span className="text-gray-900 font-medium">Not set</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Learning Language:</span>
                    <span className="text-gray-900 font-medium">
                      {learningLanguages.length > 0 
                        ? learningLanguages.map(lang => LEARNING_LANGUAGES[lang]?.name).join(', ')
                        : 'Not set'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">CEFR Level:</span>
                    <span className="text-gray-900 font-medium">Not set</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Native Language:</span>
                    <span className="text-gray-900 font-medium">Not set</span>
                  </div>
                </div>

                {/* Interface Language */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Interface Language</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(INTERFACE_LANGUAGES).map(([key, lang]) => (
                    <button
                      key={key}
                      onClick={() => handleLanguageChange('base', key)}
                        disabled={isSaving || isUpdating}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${
                          baseLanguage === key
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="text-3xl mb-2">{lang.flag}</div>
                        <div className="font-medium text-sm text-center">{lang.name}</div>
                        {baseLanguage === key && (
                          <Check className="text-green-600 mt-1" size={16} />
                      )}
                    </button>
                  ))}
                  </div>
                </div>
              </div>

              {/* Learning Languages */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="text-purple-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Learning Languages</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(LEARNING_LANGUAGES).map(([key, lang]) => (
                    <button
                      key={key}
                      onClick={() => handleLanguageChange('learning', key)}
                      disabled={isSaving || isUpdating}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${
                        learningLanguages.includes(key)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="text-3xl mb-2">{lang.flag}</div>
                      <div className="font-medium text-sm text-center">{lang.name}</div>
                      {learningLanguages.includes(key) && (
                        <Check className="text-purple-600 mt-1" size={16} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* App Settings */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="text-green-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">App Settings</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Theme Settings */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Theme</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor }
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                    <button
                            key={option.value}
                            onClick={() => handleSettingChange('theme', option.value)}
                            disabled={isSaving || isUpdating}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                              settings.theme === option.value
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Icon size={18} />
                            {option.label}
                    </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-orange-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Notifications</div>
                        <div className="text-sm text-gray-600">Enable push notifications</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('notifications', !settings.notifications)}
                      disabled={isSaving || isUpdating}
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                        settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 absolute top-0.5 ${
                          settings.notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Sound */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Volume2 size={20} className="text-purple-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Sound</div>
                        <div className="text-sm text-gray-600">Enable audio feedback</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('sound', !settings.sound)}
                      disabled={isSaving || isUpdating}
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                        settings.sound ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 absolute top-0.5 ${
                          settings.sound ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Font Size */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Font Size</h4>
                    <div className="flex gap-3">
                      {['small', 'medium', 'large'].map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSettingChange('fontSize', size)}
                          disabled={isSaving || isUpdating}
                          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            settings.fontSize === size
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h4>
                    <div className="space-y-4">
                      {/* Learning Reminders */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Bell size={20} className="text-blue-500" />
                          <div>
                            <div className="font-semibold text-gray-900">Learning Reminders</div>
                            <div className="text-sm text-gray-600">Daily learning session reminders</div>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (notificationService.getPermissionStatus() === 'granted') {
                              notificationService.sendLearningReminder();
                              trackNotification('learningReminders');
                            } else {
                              const granted = await notificationService.requestPermission();
                              setNotificationPermission(notificationService.getPermissionStatus());
                              if (granted) {
                                notificationService.sendLearningReminder();
                                trackNotification('learningReminders');
                              }
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Test
                        </button>
                      </div>

                      {/* Live Session Alerts */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Volume2 size={20} className="text-green-500" />
                          <div>
                            <div className="font-semibold text-gray-900">Live Session Alerts</div>
                            <div className="text-sm text-gray-600">Notifications for live learning sessions</div>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (notificationService.getPermissionStatus() === 'granted') {
                              notificationService.sendLiveSessionNotification({
                                teacher: 'Ms. Sarah',
                                language: 'Arabic & English'
                              });
                              trackNotification('liveSessions');
                            } else {
                              const granted = await notificationService.requestPermission();
                              setNotificationPermission(notificationService.getPermissionStatus());
                              if (granted) {
                                notificationService.sendLiveSessionNotification({
                                  teacher: 'Ms. Sarah',
                                  language: 'Arabic & English'
                                });
                                trackNotification('liveSessions');
                              }
                            }
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Test
                        </button>
                      </div>

                      {/* Achievement Notifications */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Award size={20} className="text-yellow-500" />
                          <div>
                            <div className="font-semibold text-gray-900">Achievement Notifications</div>
                            <div className="text-sm text-gray-600">Celebrate your learning milestones</div>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (notificationService.getPermissionStatus() === 'granted') {
                              notificationService.sendAchievementNotification({
                                name: 'First Steps',
                                description: 'Complete your first lesson'
                              });
                              trackNotification('achievements');
                            } else {
                              const granted = await notificationService.requestPermission();
                              setNotificationPermission(notificationService.getPermissionStatus());
                              if (granted) {
                                notificationService.sendAchievementNotification({
                                  name: 'First Steps',
                                  description: 'Complete your first lesson'
                                });
                                trackNotification('achievements');
                              }
                            }
                          }}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                        >
                          Test
                        </button>
                      </div>

                      {/* Notification Statistics */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-semibold text-gray-900">Notification Statistics</h5>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {notificationStats.total} Total
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{notificationStats.learningReminders}</div>
                            <div className="text-xs text-gray-600">Learning Reminders</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{notificationStats.liveSessions}</div>
                            <div className="text-xs text-gray-600">Live Sessions</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{notificationStats.achievements}</div>
                            <div className="text-xs text-gray-600">Achievements</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{notificationStats.progress}</div>
                            <div className="text-xs text-gray-600">Progress Updates</div>
                          </div>
                        </div>
                      </div>

                      {/* Notification Permission Status */}
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">Permission Status</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            notificationPermission === 'granted' 
                              ? 'bg-green-100 text-green-800' 
                              : notificationPermission === 'denied'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {notificationPermission === 'granted' ? 'Enabled' : 
                             notificationPermission === 'denied' ? 'Disabled' : 'Not Set'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {notificationPermission === 'granted' 
                            ? 'Notifications are enabled. You\'ll receive learning reminders and updates.'
                            : notificationPermission === 'denied'
                            ? 'Notifications are disabled. Enable them in your browser settings to get learning reminders.'
                            : 'Click "Enable" above to allow notifications for learning reminders and updates.'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="text-yellow-500" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Live Leaderboard</h3>
              </div>
              {leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        user.id === user?.uid
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                            : index === 1
                              ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                              : index === 2
                                ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                                : 'bg-gray-400'
                          }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-lg truncate">
                          {user.displayName || 'Anonymous'}
                        </div>
                        <div className="text-gray-600 text-sm">Level {user.level || 1}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-yellow-500 font-bold text-xl">{user.xp || 0}</div>
                        <div className="text-gray-600 text-sm">XP</div>
                      </div>
                      {index < 3 && (
                        <Trophy className={`flex-shrink-0 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          'text-orange-500'
                        }`} size={24} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500 text-lg">No data available yet</p>
                  <p className="text-gray-400 text-sm">Start learning to appear on the leaderboard!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  const SettingsScreen = ({ t, globalLanguage, onGlobalLanguageChange }) => (
    <div className={`space-y-6 ${currentLanguage?.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage?.rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Go back to home"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
          {t('settings')}
        </h1>
        <div></div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 ${fontSize}`}>{t('accessibility')}</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="font-size-select" className={`text-slate-300 ${fontSize}`}>{t('fontSize')}</label>
            <select
              id="font-size-select"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
            >
              <option value="text-sm">{t('small')}</option>
              <option value="text-base">{t('medium')}</option>
              <option value="text-lg">{t('large')}</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-slate-300 ${fontSize}`}>{t('highContrast')}</span>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${highContrast ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              role="switch"
              aria-checked={highContrast}
              aria-label="Toggle high contrast mode"
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-slate-300 ${fontSize}`}>{t('captions')}</span>
            <button
              onClick={() => setCaptionsEnabled(!captionsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${captionsEnabled ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              role="switch"
              aria-checked={captionsEnabled}
              aria-label="Toggle captions"
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${captionsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 ${fontSize}`}>{t('languagePreferences')}</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="interface-lang" className={`text-slate-300 block mb-2 ${fontSize}`}>{t('interfaceLanguage')}</label>
            <select
              id="interface-lang"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
            >
              {Object.entries(INTERFACE_LANGUAGES).map(([key, lang]) => (
                <option key={key} value={key}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-slate-300 ${fontSize}`}>{t('autoPlayAudio')}</span>
            <button
              className="w-12 h-6 bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              role="switch"
              aria-checked="true"
              aria-label="Toggle auto-play audio"
            >
              <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 ${fontSize}`}>{t('notifications')}</h3>

        <div className="space-y-4">
          {[
            { labelKey: 'dailyReminders', enabled: true },
            { labelKey: 'achievementAlerts', enabled: true },
            { labelKey: 'streakWarnings', enabled: true }
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className={`text-slate-300 ${fontSize}`}>{t(setting.labelKey)}</span>
              <button
                className="w-12 h-6 bg-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="switch"
                aria-checked={setting.enabled}
                aria-label={`Toggle ${t(setting.labelKey).toLowerCase()}`}
              >
                <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform"></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 ${fontSize}`}>{t('account')}</h3>

        <div className="space-y-3">
          {[
            { labelKey: 'privacyPolicy', color: 'text-slate-300' },
            { labelKey: 'termsOfService', color: 'text-slate-300' },
            { labelKey: 'exportData', color: 'text-slate-300' },
            { labelKey: 'deleteAccount', color: 'text-red-400' }
          ].map((item, index) => (
            <button
              key={index}
              className={`w-full text-left p-3 ${item.color} hover:text-white hover:bg-slate-700 rounded-lg transition-colors ${fontSize} ${item.color === 'text-red-400' ? 'hover:bg-red-900/20' : ''
                }`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Placement Test Screen (updated for multi-lang)
  const PlacementTestScreen = ({ t }) => {
    const [testStep, setTestStep] = useState(0);
    const [testResults, setTestResults] = useState(null);

    const questions = PLACEMENT_QUESTIONS[selectedLanguage] || PLACEMENT_QUESTIONS.english;

    const handleTestAnswer = useCallback((answerIndex) => {
      if (testStep < questions.length - 1) {
        setTestStep(testStep + 1);
      } else {
        const level = ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)];
        const score = Math.floor(Math.random() * 30) + 70;
        setTestResults({ level, score });
      }
    }, [testStep]);

    return (
      <div className={`space-y-6 ${currentLanguage?.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage?.rtl ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <h1 className={`font-bold text-white mb-2 ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            {t('placementTest')}
          </h1>
          <p className="text-slate-400">{t('findLevel')}</p>
        </div>

        {!testResults ? (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>{t('question')} {testStep + 1}</span>
                <span>{testStep + 1}/{questions.length}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((testStep + 1) / questions.length) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={(testStep + 1) / questions.length * 100}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            {questions[testStep] && (
              <div>
                <h3 className={`font-bold text-white mb-6 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
                  {questions[testStep].question}
                </h3>

                {questions[testStep].type === 'listening' && (
                  <div className="text-center mb-6">
                    <button
                      onClick={() => speakText('Hello', selectedLanguage)}
                      className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Play audio sample"
                    >
                      <Play size={24} />
                    </button>
                    <p className="text-slate-400 mt-2">Click to listen</p>
                  </div>
                )}

                <div className="space-y-3">
                  {questions[testStep].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleTestAnswer(index)}
                      className={`w-full p-4 text-left bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all border-2 border-transparent hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${fontSize}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-800 to-blue-800 rounded-2xl p-6 text-center text-white" role="alert">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className={`font-bold mb-2 ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
              {t('placementComplete')}
            </h2>
            <p className="text-green-100 mb-4">{t('yourLevel')} {testResults.level}</p>
            <p className="text-green-100 mb-6">{t('score')} {testResults.score}%</p>
            <button
              onClick={() => setCurrentScreen('lessons')}
              className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {t('startLearning')}
            </button>
          </div>
        )}
      </div>
    );
  };

  const TeacherScreen = ({ t }) => {
    const [isLiveSession, setIsLiveSession] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState([
      { id: 1, text: 'Hello! How can I assist you today?', sender: 'teacher', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('beginner');
    const [isTyping, setIsTyping] = useState(false);

    // AI Teacher responses based on context
    const getAIResponse = (userMessage) => {
      const message = userMessage.toLowerCase();

      // Language learning responses
      if (message.includes('hello') || message.includes('hi')) {
        return `Hello! I'm Ms. Sarah, your AI language teacher. I'm here to help you learn ${selectedLanguage === 'arabic' ? 'Arabic' : selectedLanguage}. What would you like to practice today?`;
      }

      if (message.includes('grammar') || message.includes('grammatical')) {
        return `Great! Let's work on grammar. In ${selectedLanguage === 'arabic' ? 'Arabic' : selectedLanguage}, we can practice verb conjugations, sentence structure, and more. What specific grammar topic interests you?`;
      }

      if (message.includes('pronunciation') || message.includes('pronounce')) {
        return `Pronunciation is crucial! Let's practice together. I can help you with ${selectedLanguage === 'arabic' ? 'Arabic diacritics and sounds' : 'phonetics and accent'}. Try saying a word and I'll give you feedback!`;
      }

      if (message.includes('vocabulary') || message.includes('words')) {
        return `Excellent! Building vocabulary is key to fluency. Let's learn some new ${selectedLanguage === 'arabic' ? 'Arabic' : selectedLanguage} words. What topic would you like to focus on?`;
      }

      if (message.includes('difficult') || message.includes('hard')) {
        return `Don't worry! Learning a new language takes time. Let's break it down into smaller, manageable steps. What specific part is challenging you?`;
      }

      if (message.includes('practice') || message.includes('exercise')) {
        return `Perfect! Practice makes perfect. I can create custom exercises for you. What skill would you like to practice: speaking, listening, reading, or writing?`;
      }

      if (message.includes('test') || message.includes('quiz')) {
        return `Great idea! Testing helps track progress. I can create a personalized quiz for your level. What topics should I include?`;
      }

      // Default responses
      const responses = [
        `That's interesting! Tell me more about what you'd like to learn in ${selectedLanguage === 'arabic' ? 'Arabic' : selectedLanguage}.`,
        `I'm here to help! What specific aspect of ${selectedLanguage === 'arabic' ? 'Arabic' : selectedLanguage} would you like to work on?`,
        `Great question! Let's explore that together. Can you give me more details?`,
        `I understand! Learning ${selectedLanguage === 'arabic' ? 'Arabic' : selectedLanguage} can be challenging. Let's tackle this step by step.`,
        `Excellent! I'm excited to help you improve. What's your main goal today?`
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    };

    // Handle sending a message
    const handleSendMessage = (e) => {
      e.preventDefault();
      if (newMessage.trim()) {
        const newMsg = {
          id: messages.length + 1,
          text: newMessage,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, newMsg]);
        setNewMessage('');

        // Show typing indicator
        setIsTyping(true);

        // Simulate AI teacher response
        setTimeout(() => {
          setIsTyping(false);
          const aiResponse = getAIResponse(newMessage);
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              text: aiResponse,
              sender: 'teacher',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }, 1500);
      }
    };

    // Handle voice call
    const handleVoiceCall = () => {
      setIsVoiceCallActive(!isVoiceCallActive);
      if (!isVoiceCallActive) {
        // Start voice call simulation
        speakText("Hello! I'm ready to help you practice speaking. Please say something in " + selectedLanguage, selectedLanguage);
      }
    };

    // Handle voice recording
    const handleVoiceRecording = () => {
      setIsRecording(!isRecording);
      if (!isRecording) {
        // Start recording simulation
        speakText("I'm listening. Please speak now.", selectedLanguage);
      }
    };

    // Handle clicking outside the chat lightbox to close it
    const handleCloseChat = (e) => {
      if (e.target.id === 'chat-overlay') {
        setIsChatOpen(false);
      }
    };

    // Quick action buttons
    const quickActions = [
      { id: 'grammar', text: 'Grammar Help', icon: '📚' },
      { id: 'pronunciation', text: 'Pronunciation', icon: '🎤' },
      { id: 'vocabulary', text: 'Vocabulary', icon: '📖' },
      { id: 'practice', text: 'Practice', icon: '💪' },
      { id: 'quiz', text: 'Take Quiz', icon: '📝' },
      { id: 'conversation', text: 'Conversation', icon: '💬' }
    ];

    const handleQuickAction = (action) => {
      const actionMessages = {
        grammar: "Let's work on grammar! What specific grammar topic would you like to practice?",
        pronunciation: "Great! Let's practice pronunciation. Try saying some words and I'll help you improve.",
        vocabulary: "Excellent! Let's expand your vocabulary. What topic interests you?",
        practice: "Perfect! Let's practice together. What skill would you like to work on?",
        quiz: "Great idea! I can create a personalized quiz for you. What level are you at?",
        conversation: "Wonderful! Let's have a conversation in " + selectedLanguage + ". What would you like to talk about?"
      };

      const newMsg = {
        id: messages.length + 1,
        text: actionMessages[action],
        sender: 'teacher',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
    };

    return (
      <div className={`space-y-6 p-4 sm:p-6 w-full mx-auto ${currentLanguage?.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage?.rtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1
            className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'
              }`}
          >
            {t('liveTeacherSupport')}
          </h1>
          <div className={`flex items-center space-x-2 ${isLiveSession ? 'text-green-400' : 'text-slate-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isLiveSession ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></div>
            <span className="text-sm">{isLiveSession ? t('live') : t('offline')}</span>
          </div>
        </div>

        {/* Avatar Teacher */}
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6">
          <div className="text-center mb-6">
            <div
              className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
              role="img"
              aria-label="AI Teacher avatar"
            >
              👩‍🏫
            </div>
            <h3 className={`font-bold text-white ${fontSize}`}>Ms. Sarah - AI Teacher</h3>
            <p className="text-purple-200">Specialized in Arabic & English</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                const newSessionState = !isLiveSession;
                setIsLiveSession(newSessionState);
                
            // Send notification for live session status
            if (notificationService.getPermissionStatus() === 'granted') {
              if (newSessionState) {
                notificationService.sendLiveSessionNotification({
                  teacher: 'Ms. Sarah',
                  language: 'Arabic & English'
                });
                trackNotification('liveSessions');
              } else {
                notificationService.sendNotification('Live Session Ended', {
                  body: 'Your live learning session has ended. Great work today!',
                  requireInteraction: false
                });
                trackNotification('progress');
              }
            }
              }}
              className={`w-full p-4 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white ${isLiveSession ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
            >
              {isLiveSession ? 'End Session' : 'Start Live Session'}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsChatOpen(true)}
                className="p-3 bg-purple-800/50 text-purple-200 rounded-xl hover:bg-purple-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <MessageCircle className="mx-auto mb-1" size={20} />
                <span className="text-sm">Chat</span>
              </button>
              <button
                onClick={handleVoiceCall}
                className={`p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${isVoiceCallActive
                  ? 'bg-red-600 text-white'
                  : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
                  }`}
              >
                <Mic className="mx-auto mb-1" size={20} />
                <span className="text-sm">{isVoiceCallActive ? 'End Call' : 'Voice Call'}</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3 text-center">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="p-2 bg-slate-700/50 text-slate-200 rounded-lg hover:bg-slate-600/50 transition-colors text-xs"
                  >
                    <span className="text-lg mb-1 block">{action.icon}</span>
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Recording */}
            {isVoiceCallActive && (
              <div className="mt-4 p-4 bg-slate-700/30 rounded-xl">
                <div className="text-center">
                  <button
                    onClick={handleVoiceRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${isRecording
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-green-500 hover:bg-green-400'
                      }`}
                  >
                    {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                  </button>
                  <p className="text-slate-300 text-sm">
                    {isRecording ? 'Recording... Speak now' : 'Click to start recording'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Lightbox */}
        {isChatOpen && (
          <div
            id="chat-overlay"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseChat}
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl w-full max-w-xl max-h-[88vh] flex flex-col shadow-2xl animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white">Chat with Ms. Sarah</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                        }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-slate-200 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('typeMessage')}
                    className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-purple-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                    aria-label="Send message"
                  >
                    <MessageCircle size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Real-time Corrections */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
          <h3 className={`font-bold text-white mb-4 ${fontSize}`}>{t('recentCorrections')}</h3>
          <div className="space-y-3">
            {[
              { error: 'I go to school yesterday', correction: 'I went to school yesterday', type: 'Grammar' },
              {
                error: 'الكتاب الأحمر',
                correction: 'الْكِتَابُ الْأَحْمَرُ',
                type: 'Pronunciation',
                note: "Focus on the 'ح' sound",
              },
            ].map((item, index) => (
              <div key={index} className="p-4 bg-slate-700/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">{item.type}</span>
                  <button
                    onClick={() => speakText(item.correction, selectedLanguage)}
                    className="text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    aria-label={`Play pronunciation for: ${item.correction}`}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div className={`text-red-400 mb-1 ${fontSize}`}>❌ {item.error}</div>
                <div className={`text-green-400 mb-1 ${fontSize}`}>✅ {item.correction}</div>
                {item.note && <div className="text-slate-400 text-sm">{item.note}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Lesson */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
          <h3 className={`font-bold text-white mb-4 ${fontSize}`}>{t('schedulePrivateLesson')}</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="lesson-time" className="text-slate-300 block mb-2">
                {t('preferredTime')}
              </label>
              <input
                id="lesson-time"
                type="datetime-local"
                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="focus-area" className="text-slate-300 block mb-2">
                {t('focusArea')}
              </label>
              <select
                id="focus-area"
                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
              >
                <option>{t('pronunciation')}</option>
                <option>{t('grammar')}</option>
                <option>{t('conversation')}</option>
                <option>{t('reading')}</option>
              </select>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500">
              {t('bookLesson')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // TTS Input Component


  // Main render function
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen />;
      case 'lessons': return <LessonsScreen t={t} globalLanguage={globalLanguage} onGlobalLanguageChange={handleGlobalLanguageChange} />;
      case 'quiz': return <QuizScreenEnhanced selectedLanguage={selectedLanguage} onFinish={(score, total) => setQuizScore(score)} globalLanguage={globalLanguage} onGlobalLanguageChange={handleGlobalLanguageChange} />;
      case 'ai-coach': return <AICoachScreen t={t} globalLanguage={globalLanguage} speakText={speakText} fontSize={fontSize} />;
      case 'profile': return <ProfileScreen t={t} globalLanguage={globalLanguage} onGlobalLanguageChange={handleGlobalLanguageChange} />;
      case 'settings': return <SettingsScreen t={t} globalLanguage={globalLanguage} onGlobalLanguageChange={handleGlobalLanguageChange} />;
      case 'placement': return <PlacementTestScreen t={t} />;
      case 'teacher': return <TeacherScreen t={t} />;
      default: return <HomeScreen />;
    }
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Loading...</h2>
          <p className="text-slate-400">Setting up your learning experience</p>
        </div>
      </div>
    );
  }

  // Show authentication form
  if (showAuthForm) {
    return (
      <AuthForm
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setShowAuthForm(false)}
        isLoading={isLoading}
      />
    );
  }

  // Show language selection
  if (showLanguageSelection) {
    console.log('Showing LanguageSelection component');
    return (
      <LanguageSelection
        onLanguageSelected={handleLanguageSelection}
        isLoading={isLoading}
      />
    );
  }

  // Debug authentication state
  console.log('LanguageLearningMVP - Auth State:', { isAuthenticated, isLoading, user: !!user });
  
  // Show login prompt if not authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to LinguaAI</h1>
          <p className="text-slate-400 mb-6">Sign in to start your language learning journey</p>
          <button
            onClick={() => setShowAuthForm(true)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            Get Started
          </button>
          {authError && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400 text-sm">
              {authError}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show onboarding flow
  if (showOnboarding) {
    const onboardingSteps = [
      <LanguageSelectionStep key="language-selection" />
    ];

    return (
      <div className="min-h-screen">
        {onboardingSteps[onboardingStep]}
        
        {/* Progress indicator - single step */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex space-x-2">
            <div className="w-8 h-2 bg-blue-600 rounded-full transition-all duration-300" />
          </div>
        </div>
      </div>
    );
  }

  // Show main app
  return (
      <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800'} text-white`}>
      {/* Authentication Flow Tracker Removed - Home page kept clean */}

      {/* Header */}
      <header className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">
              L
            </div>
            <div>
              <h1 className="font-bold text-lg">{t('appName')}</h1>
              <p className="text-xs text-slate-400">{t('appTagline')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentScreen === 'home' && (
              <>
                <button
                  onClick={() => setShowLanguageSelection(true)}
                  className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                  title="Select Languages"
                  aria-label="Select Languages"
                >
                  <Globe size={16} />
                </button>
                <button
                  onClick={() => setCurrentScreen('placement')}
                  className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg hover:from-green-500 hover:to-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                  title="Take Placement Test"
                  aria-label="Take Placement Test"
                >
                  <Target size={16} />
                </button>
                <button
                  onClick={() => setCurrentScreen('teacher')}
                  className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
                  title="Teacher Support"
                  aria-label="Teacher Support"
                >
                  <Users size={16} />
                </button>
              </>
            )}

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs">
                <Flame className="text-orange-400" size={14} />
                <span className="font-bold">{userProgress.streak}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-24">
        <div className="mx-auto">
          {renderScreen()}
        </div>
      </main>

      {/* Navigation */}
      <NavigationBar t={t} />

      {/* PWA Install Prompt */}
      {showInstallPrompt && !isInstalled && (
        <div className="fixed bottom-20 left-4 right-4 w-full mx-auto z-40">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-sm">Install LinguaAI</p>
                <p className="text-xs text-blue-100">
                  Get offline access, live notifications & faster loading
                  {notificationCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                      {notificationCount} notifications sent
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-blue-100 hover:text-white transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label="Dismiss install prompt"
              >
                ✕
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                {deferredPrompt ? 'Install App' : 'Install Guide'}
              </button>
              {!deferredPrompt && (
              <button
                  onClick={() => {
                    const userAgent = navigator.userAgent;
                    let instructions = '';
                    
                    if (userAgent.includes('Chrome')) {
                      instructions = 'Chrome: Click the install icon (⬇️) in the address bar, or go to Menu (⋮) → "Install LinguaAI"';
                    } else if (userAgent.includes('Firefox')) {
                      instructions = 'Firefox: Click the install icon (⬇️) in the address bar, or go to Menu (☰) → "Install"';
                    } else if (userAgent.includes('Safari')) {
                      instructions = 'Safari: Click Share (↗️) → "Add to Home Screen"';
                    } else if (userAgent.includes('Edge')) {
                      instructions = 'Edge: Click the install icon (⬇️) in the address bar, or go to Menu (⋯) → "Apps" → "Install this site as an app"';
                    } else {
                      instructions = 'Look for an install option in your browser menu or address bar';
                    }
                    
                    alert(instructions);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Help
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Permission Prompt */}
      {notificationPermission === 'default' && (
        <div className="fixed bottom-20 left-4 right-4 w-full mx-auto z-40">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Enable Notifications</p>
              <p className="text-xs text-green-100">
                Get learning reminders & live session alerts
                {notificationCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {notificationCount} sent
                  </span>
                )}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={async () => {
                  const granted = await notificationService.requestPermission();
                  setNotificationPermission(notificationService.getPermissionStatus());
                  if (granted) {
                    await notificationService.setupPushNotifications();
                    notificationService.scheduleLearningReminders();
                  }
                }}
                className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                Enable
              </button>
              <button
                onClick={() => setNotificationPermission('denied')}
                className="text-green-100 hover:text-white transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label="Dismiss notification prompt"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Reader Support */}
      {captionsEnabled && (
        <div className="fixed bottom-28 left-4 right-4 bg-black/80 text-white p-2 rounded text-sm text-center z-30" role="status" aria-live="polite">
          Caption: Currently viewing {currentScreen.replace('-', ' ')} screen
        </div>
      )}

      {/* Offline Indicator - Hidden by default, would be shown when offline */}
      <div className="fixed top-20 left-4 right-4 max-w-md mx-auto z-30 hidden">
        <div className="bg-orange-600 text-white p-2 rounded text-sm text-center" role="alert">
          ⚠️ You're offline. Some features may be limited.
        </div>
      </div>
    </div>
  );

  // Fallback - should not reach here if authentication is working properly
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
        <p className="text-slate-400 mb-6">Please refresh the page and try again</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default App;