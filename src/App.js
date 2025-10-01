import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import TextToSpeech from "./TextToSpeech";
import Quiz from "./quiz.js";
import QuizScreenEnhanced from "./components/QuizScreenEnhanced";
import LanguageSelection from "./components/LanguageSelection";
import authService from "./services/AuthService";
import databaseService from "./services/DatabaseService";
import ProtectedRoute from "./components/protectroute";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AuthForm from "./components/AuthForm";



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
  Flame   // use Flame instead of Fire
} from 'lucide-react';

// Move static data outside component to prevent recreation on renders
const LEARNING_LANGUAGES = {
  english: { name: 'English', flag: '🇺🇸', rtl: false },
  arabic: { name: 'العربية', flag: '🇸🇦', rtl: true }
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}


const HomePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/'); // back to login
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-2xl mb-4">Welcome, {user?.displayName || 'User'} 🎉</h1>
      <button onClick={handleLogout} className="px-6 py-3 bg-red-600 rounded-xl">
        Logout
      </button>
    </div>
  );
};

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
    welcomeBack: 'Welcome back! 👋',
    readyToContinue: 'Ready to continue learning?',
    dayStreak: 'Day Streak',
    totalXP: 'Total XP',
    level: 'Level',
    selectLanguage: 'Select Language',
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
    pronunciationCoach: 'Pronunciation Coach',
    say: 'Say: ',
    analyzingPronunciation: 'AI is analyzing your pronunciation...',
    chatWithAiTutor: 'Chat with AI Tutor',
    askAboutLearning: 'Ask me anything about language learning...',
    send: 'Send',
    profile: 'Profile',
    achievements: 'Achievements',
    weeklyLeaderboard: 'Weekly Leaderboard',
    settings: 'Settings',
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
    welcomeBack: 'مرحباً بعودتك! 👋',
    readyToContinue: 'هل أنت جاهز لمواصلة التعلم؟',
    dayStreak: 'سلسلة اليوم',
    totalXP: 'إجمالي الخبرة',
    level: 'المستوى',
    selectLanguage: 'اختر اللغة',
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
    pronunciationCoach: 'مدرب النطق',
    say: 'قل: ',
    analyzingPronunciation: 'الذكاء الاصطناعي يحلل نطقك...',
    chatWithAiTutor: 'الدردشة مع مدرس الذكاء الاصطناعي',
    askAboutLearning: 'اسألني أي شيء عن تعلم اللغة...',
    send: 'إرسال',
    profile: 'الملف الشخصي',
    achievements: 'الإنجازات',
    weeklyLeaderboard: 'لوحة الصدارة الأسبوعية',
    settings: 'الإعدادات',
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
    welcomeBack: 'Welkom terug! 👋',
    readyToContinue: 'Klaar om verder te leren?',
    dayStreak: 'Dag Streak',
    totalXP: 'Totaal XP',
    level: 'Niveau',
    selectLanguage: 'Selecteer Taal',
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
    pronunciationCoach: 'Uitspraak Coach',
    say: 'Zeg: ',
    analyzingPronunciation: 'AI analyseert je uitspraak...',
    chatWithAiTutor: 'Chat met AI Tutor',
    askAboutLearning: 'Vraag me alles over taalleren...',
    send: 'Verzenden',
    profile: 'Profiel',
    achievements: 'Prestaties',
    weeklyLeaderboard: 'Wekelijks Leaderboard',
    settings: 'Instellingen',
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
    welcomeBack: 'Selamat datang kembali! 👋',
    readyToContinue: 'Siap untuk melanjutkan belajar?',
    dayStreak: 'Streak Hari',
    totalXP: 'Total XP',
    level: 'Level',
    selectLanguage: 'Pilih Bahasa',
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
    pronunciationCoach: 'Pelatih Pengucapan',
    say: 'Katakan: ',
    analyzingPronunciation: 'AI sedang menganalisis pengucapan Anda...',
    chatWithAiTutor: 'Obrolan dengan Tutor AI',
    askAboutLearning: 'Tanyakan apa saja tentang pembelajaran bahasa...',
    send: 'Kirim',
    profile: 'Profil',
    achievements: 'Pencapaian',
    weeklyLeaderboard: 'Papan Peringkat Mingguan',
    settings: 'Pengaturan',
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
    welcomeBack: 'Selamat kembali! 👋',
    readyToContinue: 'Sedia untuk meneruskan pembelajaran?',
    dayStreak: 'Streak Hari',
    totalXP: 'Jumlah XP',
    level: 'Tahap',
    selectLanguage: 'Pilih Bahasa',
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
    pronunciationCoach: 'Jurubahasa Sebutan',
    say: 'Katakan: ',
    analyzingPronunciation: 'AI sedang menganalisis sebutan anda...',
    chatWithAiTutor: 'Sembang dengan Tutor AI',
    askAboutLearning: 'Tanya saya apa-apa tentang pembelajaran bahasa...',
    send: 'Hantar',
    profile: 'Profil',
    achievements: 'Pencapaian',
    weeklyLeaderboard: 'Papan Pendahulu Mingguan',
    settings: 'Tetapan',
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
    welcomeBack: 'ยินดีต้อนรับกลับ! 👋',
    readyToContinue: 'พร้อมที่จะเรียนต่อหรือไม่?',
    dayStreak: 'สตรีควัน',
    totalXP: 'XP รวม',
    level: 'ระดับ',
    selectLanguage: 'เลือกภาษา',
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
    pronunciationCoach: 'โค้ชการออกเสียง',
    say: 'พูดว่า: ',
    analyzingPronunciation: 'AI กำลังวิเคราะห์การออกเสียงของคุณ...',
    chatWithAiTutor: 'แชทกับติวเตอร์ AI',
    askAboutLearning: 'ถามฉันอะไรก็ได้เกี่ยวกับการเรียนภาษา...',
    send: 'ส่ง',
    profile: 'โปรไฟล์',
    achievements: 'ความสำเร็จ',
    weeklyLeaderboard: 'กระดานผู้นำรายสัปดาห์',
    settings: 'การตั้งค่า',
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
    welcomeBack: 'សូមស្វាគមន៍ត្រឡប់មកវិញ! 👋',
    readyToContinue: 'ត្រៀមខ្លួនដើម្បីបន្តការរៀនឬទេ?',
    dayStreak: 'ស្ត្រីកថ្ងៃ',
    totalXP: 'XP សរុប',
    level: 'កម្រិត',
    selectLanguage: 'ជ្រើសរើសភាសា',
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
    pronunciationCoach: 'គ្រូការបញ្ចេញសំឡេង',
    say: 'និយាយថា: ',
    analyzingPronunciation: 'AI កំពុងវិភាគការបញ្ចេញសំឡេងរបស់អ្នក...',
    chatWithAiTutor: 'ជជែកជាមួយគ្រូ AI',
    askAboutLearning: 'សួរខ្ញុំអ្វីក៏ដោយអំពីការរៀនភាសា...',
    send: 'ផ្ញើ',
    profile: 'ប្រវត្តិរូប',
    achievements: 'សមិទ្ធិផល',
    weeklyLeaderboard: 'តារាងមេដឹកនាំប្រចាំសប្តាហ៍',
    settings: 'ការកំណត់',
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
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [authError, setAuthError] = useState('');

  // App states
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
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

  // Get current language with RTL support
  const currentLanguage = useMemo(() => INTERFACE_LANGUAGES[selectedLanguage], [selectedLanguage]);

  // Translation function
  const t = useCallback((key) => {
    return TRANSLATIONS[selectedLanguage]?.[key] || TRANSLATIONS.english[key] || key;
  }, [selectedLanguage]);

  // Nav items
  const navItems = useMemo(() => [
    { id: 'home', icon: Home, labelKey: 'home' },
    { id: 'lessons', icon: BookOpen, labelKey: 'lessonsNav' },
    { id: 'quiz', icon: Target, labelKey: 'quizNav' },
    { id: 'ai-coach', icon: Brain, labelKey: 'aiCoachNav' },
    { id: 'profile', icon: User, labelKey: 'profileNav' }
  ], [t]);


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
          arabic: 'الاصطناعي',     // you can also try 'ar-XA'
          dutch: 'nl-NL',
          indonesian: 'id-ID',
          malay: 'ms-MY',
          thai: 'th-TH',
          khmer: 'km-KH',
          english: 'en-US'
        };

        const selectedLangCode = langMap[lang] || langMap[selectedLanguage] || 'en-US';
        utterance.lang = selectedLangCode;

        // 🔑 Pick a voice that supports the selected language
        const voices = speechSynthesis.getVoices();
        const matchedVoice = voices.find(v => v.lang === selectedLangCode);
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        // Options
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1;

        // Speak
        speechSynthesis.speak(utterance);
      }
    }
  }, [selectedLanguage]);


  // Authentication effect
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user, userData) => {
      console.log('Auth state changed:', { user: !!user, userData: !!userData });

      if (user && userData) {
        console.log('User authenticated, setting up user data...');
        setIsAuthenticated(true);
        setUserProgress({
          xp: userData.xp || 0,
          streak: userData.streak || 0,
          level: userData.level || 1,
          badges: userData.badges || []
        });
        setLearningLanguages(userData.learningLanguages || []);
        setSelectedLanguage(userData.baseLanguage || 'english');
        setUserSettings(userData.settings || {
          darkMode: false,
          notifications: true,
          sound: true,
          fontSize: 'medium'
        });

        // Check if user needs language selection
        if (!userData.learningLanguages || userData.learningLanguages.length === 0) {
          setShowLanguageSelection(true);
        } else {
          setShowLanguageSelection(false);
        }

        // Ensure we're not showing auth form when user is authenticated
        setShowAuthForm(false);
        setCurrentScreen('home'); // Ensure we're on the home screen after login
      } else {
        console.log('User not authenticated, resetting state...');
        setIsAuthenticated(false);
        setUserProgress({ xp: 0, streak: 0, level: 1, badges: [] });
        setLearningLanguages([]);
        setShowLanguageSelection(false);
        setShowAuthForm(false);
        setCurrentScreen('home');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };


  // Authentication handlers
  const handleAuthSuccess = async (authData) => {
    setIsLoading(true);
    setAuthError('');

    try {
      // Dev bypass (no login) to allow reaching home if Firebase misconfigured
      if (authData.devBypass) {
        setIsAuthenticated(true);
        setShowAuthForm(false);
        setCurrentScreen('home');
        setIsLoading(false);
        return;
      }

      if (authData.isLogin) {
        const result = await authService.signIn(authData.email, authData.password);
        if (result.success) {
          // The onAuthStateChanged listener will handle setting isAuthenticated
          setShowAuthForm(false);
          // Also navigate immediately
          setIsAuthenticated(true);
          setCurrentScreen('home');
        } else {
          setAuthError(result.error);
        }
      } else {
        const result = await authService.register(
          authData.email,
          authData.password,
          authData.displayName,
          [] // Empty learning languages, will be set in language selection
        );
        if (result.success) {
          // The onAuthStateChanged listener will handle setting isAuthenticated
          setShowAuthForm(false);
          // Also navigate immediately
          setIsAuthenticated(true);
          setCurrentScreen('home');
          // Language selection will be handled by the auth listener
        } else {
          setAuthError(result.error);
        }
      }
    } catch (error) {
      setAuthError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageSelection = async (languageData) => {
    setIsLoading(true);
    try {
      await authService.updateLearningLanguages(languageData.learningLanguages);
      await authService.updateBaseLanguage(languageData.baseLanguage);
      setShowLanguageSelection(false);
    } catch (error) {
      setAuthError('Failed to save language preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    // The onAuthStateChanged listener will handle setting isAuthenticated to false
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
          <button
            onClick={() => setCurrentScreen('settings')}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            aria-label="Open settings"
          >
            <Settings size={20} />
          </button>
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
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h2 className={`font-bold text-white mb-4 flex items-center ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
          <Globe className="mr-2" size={20} />
          {t('selectLanguage')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(INTERFACE_LANGUAGES).map(([key, lang]) => (
            <button
              key={key}
              onClick={() => setSelectedLanguage(key)}
              className={`p-4 rounded-xl border-2 transition-all ${selectedLanguage === key
                ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                }`}
              aria-pressed={selectedLanguage === key}
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

  const LessonsScreen = () => {
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
          <div className="text-blue-400 font-medium">{t('level')} {userProgress.level}</div>
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
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                lessonLanguage === 'english'
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
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                lessonLanguage === 'arabic'
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


  const AICoachScreen = ({ t, selectedLanguage, speakText, fontSize }) => {
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

      const langRules = rules[selectedLanguage] || rules.english;
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
      if (selectedLanguage === 'english') {
        phonemeFeedback = transcript.toLowerCase().includes('hello')
          ? 'Great stress on "hello".'
          : 'Work on stressing the first syllable in "hello".';
      } else if (selectedLanguage === 'arabic') {
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
      setExpectedText(expectedTexts[selectedLanguage] || expectedTexts.english);

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
        recognitionRef.current.lang = langMap[selectedLanguage] || 'en-US';

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
    }, [selectedLanguage, expectedText]);

    // Speak AI messages (auto-detect Arabic and enforce Arabic TTS with diacritics)
    useEffect(() => {
      if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].type === 'ai') {
        const msg = chatMessages[chatMessages.length - 1].message || '';
        const containsArabic = /[\u0600-\u06FF]/.test(msg);
        const lang = containsArabic ? 'arabic' : selectedLanguage;
        speakText(msg, lang, { rate: containsArabic ? 0.9 : 1.0, pitch: 1.0 });
      }
    }, [chatMessages, selectedLanguage, speakText]);

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
      const rec = recognitionRef.current;
      if (rec) {
        rec.onresult = (e) => {
          const text = e.results[0][0].transcript;
          setInputMessage(text);
        };
        rec.onerror = () => { };
        rec.onend = () => { };
        rec.start();
      }
    }, []);

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
    }, [inputMessage, selectedLanguage]);

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

    // Determine RTL based on selected language key
    const rtlLanguages = new Set(['arabic', 'hebrew', 'urdu', 'farsi']);
    const isRTL = rtlLanguages.has(String(selectedLanguage).toLowerCase());
    // Show language selection if not selected yet
    if (learningLanguage === null) {
      return (
        <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
              {t('aiLanguageCoach')}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Online</span>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
            <div className="text-center mb-8">
              <h2 className={`font-bold text-white mb-4 ${fontSize === 'text-sm' ? 'text-2xl' : fontSize === 'text-lg' ? 'text-3xl' : 'text-4xl'}`}>
                Choose Your Learning Language
              </h2>
              <p className="text-slate-400 text-lg">
                What language would you like to learn with your AI coach?
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
                    • Grammar & Vocabulary<br/>
                    • Pronunciation Practice<br/>
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
                    • القواعد والمفردات<br/>
                    • ممارسة النطق<br/>
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
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-colors"
              aria-label="Speak message"
            >
              <Mic size={20} />
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

 const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [learningLanguages, setLearningLanguages] = useState(['es']);
  const [userSettings, setUserSettings] = useState({
    darkMode: true,
    notifications: true,
    sound: true,
    fontSize: 'medium'
  });
  const [fontSize, setFontSize] = useState('text-base');

  // Mock user progress data
  const [userProgress, setUserProgress] = useState({
    xp: 1250,
    streak: 7,
    level: 12,
    badges: ['quick-learner', 'streak-master', 'vocabulary-champion'],
    wordsLearned: 342
  });

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
    es: { name: 'Arabic', flag: 'sa' },
    fr: { name: 'Bahasa Indonesia', flag: 'id' },
    de: { name: 'Dutch', flag: 'nl' },
    it: { name: 'Malay', flag: 'ms' },
    pt: { name: 'Thai', flag: 'th' },
    ja: { name: 'Khmer', flag: 'km' },
    ko: { name: 'English', flag: 'en' },
  };

  const ACHIEVEMENTS = [
    { id: 'quick-learner', name: 'Quick Learner', description: 'Complete 10 lessons in one day', icon: Zap, color: 'text-yellow-400' },
    { id: 'streak-master', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: Flame, color: 'text-orange-400' },
    { id: 'vocabulary-champion', name: 'Vocabulary Champion', description: 'Learn 300+ words', icon: Crown, color: 'text-purple-400' },
    { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% in 5 lessons', icon: Star, color: 'text-blue-400' },
    { id: 'social-butterfly', name: 'Social Butterfly', description: 'Join the leaderboard', icon: Users, color: 'text-pink-400' }
  ];

  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoadingLeaderboard(true);
      // Simulate API call
      setTimeout(() => {
        setLeaderboard([
          { id: 1, displayName: 'Sarah Chen', level: 15, xp: 2340 },
          { id: 2, displayName: 'Alex Rodriguez', level: 14, xp: 2180 },
          { id: 3, displayName: 'You', level: 12, xp: 1250 },
          { id: 4, displayName: 'Emma Wilson', level: 11, xp: 1120 },
          { id: 5, displayName: 'Michael Brown', level: 10, xp: 980 }
        ]);
        setIsLoadingLeaderboard(false);
      }, 1000);
    };
    loadLeaderboard();
  }, []);

  const handleLanguageChange = async (type, language) => {
    if (type === 'base') {
      setSelectedLanguage(language);
      const sizeMap = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
      setFontSize(sizeMap[userSettings.fontSize]);
    } else {
      if (learningLanguages.includes(language)) {
        setLearningLanguages(learningLanguages.filter(l => l !== language));
      } else {
        setLearningLanguages([...learningLanguages, language]);
      }
    }
  };

  const handleSettingChange = (setting, value) => {
    setUserSettings({ ...userSettings, [setting]: value });
    if (setting === 'fontSize') {
      const sizeMap = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
      setFontSize(sizeMap[value]);
    }
  };

  const currentLanguage = INTERFACE_LANGUAGES[selectedLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-2xl' : fontSize === 'text-base' ? 'text-3xl' : 'text-4xl'}`}>
              Profile
            </h1>
            <p className="text-slate-400 mt-1">Track your progress and customize your experience</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            M
          </div>
        </div>

        {/* Premium Tab Navigation */}
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
                    M
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className={`font-bold mb-2 ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-base' ? 'text-2xl' : 'text-3xl'}`}>
                      Mohamed el Morabit
                    </h2>
                    <p className="text-blue-200 text-lg">Language Explorer</p>
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
                    <div className="text-3xl font-bold mb-1">{userProgress.xp}</div>
                    <div className="text-sm text-blue-200">Total XP</div>
                  </div>
                  <div className="text-center p-5 bg-white/10 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                    <Flame className="text-orange-400 mx-auto mb-3" size={28} />
                    <div className="text-3xl font-bold mb-1">{userProgress.streak}</div>
                    <div className="text-sm text-blue-200">Day Streak</div>
                  </div>
                  <div className="text-center p-5 bg-white/10 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                    <Trophy className="text-yellow-400 mx-auto mb-3" size={28} />
                    <div className="text-3xl font-bold mb-1">{userProgress.level}</div>
                    <div className="text-sm text-blue-200">Level</div>
                  </div>
                  <div className="text-center p-5 bg-white/10 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                    <Award className="text-purple-400 mx-auto mb-3" size={28} />
                    <div className="text-3xl font-bold mb-1">{userProgress.badges.length}</div>
                    <div className="text-sm text-blue-200">Badges</div>
                  </div>
                </div>
              </div>
            </div>

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
                  <div className="text-4xl font-bold text-white mb-2">{userProgress.xp}</div>
                  <div className="text-slate-400">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{userProgress.streak}</div>
                  <div className="text-slate-400">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{userProgress.wordsLearned}</div>
                  <div className="text-slate-400">Words Learned</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{userProgress.level}</div>
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
                  const isUnlocked = userProgress.badges.includes(achievement.id);
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
              {userProgress.badges.length === 0 && (
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
          <div className="bg-slate-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="text-yellow-400" size={28} />
              <h3 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-base' ? 'text-2xl' : 'text-3xl'}`}>
                Weekly Leaderboard
              </h3>
            </div>
            {isLoadingLeaderboard ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 p-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center p-4 gap-5 p-6 rounded-2xl transition-all ${
                      user.displayName === 'You'
                        ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20'
                        : 'bg-slate-700/40 hover:bg-slate-700/60'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl p-4 flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        index === 0
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                          : index === 2
                          ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                          : 'bg-slate-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold p-4 text-white text-lg">{user.displayName || 'Anonymous'}</div>
                      <div className="text-slate-400">Level {user.level || 1}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 p-4 font-bold text-xl">{user.xp || 0}</div>
                      <div className="text-slate-400 text-sm">XP</div>
                    </div>
                    {index < 3 && (
                      <Trophy className={index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-orange-400'} size={24} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-12 text-lg">No data available yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

  const SettingsScreen = () => (
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
  const PlacementTestScreen = () => {
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

  const TeacherScreen = () => {
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
              onClick={() => setIsLiveSession(!isLiveSession)}
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
      case 'lessons': return <LessonsScreen />;
      case 'quiz': return <QuizScreenEnhanced selectedLanguage={selectedLanguage} onFinish={(score, total) => setQuizScore(score)} />;
      case 'ai-coach': return <AICoachScreen t={t} selectedLanguage={selectedLanguage} speakText={speakText} fontSize={fontSize} />;
      case 'profile': return <ProfileScreen />;
      case 'settings': return <SettingsScreen />;
      case 'placement': return <PlacementTestScreen />;
      case 'teacher': return <TeacherScreen />;
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
    return (
      <LanguageSelection
        onLanguageSelected={handleLanguageSelection}
        isLoading={isLoading}
      />
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
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

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800'} text-white`}>
      {/* Header */}
      <header className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">
              L
            </div>
            <div>
              <h1 className="font-bold text-lg">LinguaAI</h1>
              <p className="text-xs text-slate-400">Smart Language Learning</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentScreen === 'home' && (
              <>
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
                <User size={16} />
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
      {showInstallPrompt && (
        <div className="fixed bottom-20 left-4 right-4 w-full mx-auto z-40">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Install LinguaAI</p>
              <p className="text-xs text-blue-100">Get offline access & notifications</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-blue-100 hover:text-white transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label="Dismiss install prompt"
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
};

export default LanguageLearningMVP;