import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import TextToSpeech from "./TextToSpeech";
import Quiz from "./quiz.js";
import QuizScreenEnhanced from "./components/QuizScreenEnhanced";
import AuthForm from "./components/AuthForm";
import LanguageSelection from "./components/LanguageSelection";
import authService from "./services/AuthService";
import databaseService from "./services/DatabaseService";
import ProtectedRoute from "./components/protectroute";
import { getAuth } from "firebase/auth";


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
  ChevronLeft,
  Globe,
  User,
  Flame   // use Flame instead of Fire
} from 'lucide-react';

// Move static data outside component to prevent recreation on renders
const LEARNING_LANGUAGES = {
  english: { name: 'English', flag: '🇺🇸', rtl: false },
  arabic: { name: 'العربية', flag: '🇸🇦', rtl: true }
};

const INTERFACE_LANGUAGES = {
  english: { name: 'English', flag: '🇺🇸', rtl: false },
  arabic: { name: 'العربية', flag: '🇸🇦', rtl: true },
  french: { name: 'Français', flag: '🇫🇷', rtl: false },
  spanish: { name: 'Español', flag: '🇪🇸', rtl: false },
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
  },
  french: {
    welcomeBack: 'Bon retour ! 👋',
    readyToContinue: 'Prêt à continuer à apprendre ?',
    dayStreak: 'Série de jours',
    totalXP: 'XP total',
    level: 'Niveau',
    selectLanguage: 'Sélectionner la langue',
    continueLesson: 'Continuer la leçon',
    aiCoach: 'Coach IA',
    lessons: 'Leçons',
    courseProgress: 'Progrès du cours',
    beginnerLevel: 'Niveau débutant',
    intermediateLevel: 'Niveau intermédiaire',
    advancedLevel: 'Niveau avancé',
    quizChallenge: 'Défi quiz',
    nextQuestion: 'Question suivante',
    finishQuiz: 'Terminer le quiz',
    aiLanguageCoach: 'Coach linguistique IA',
    pronunciationCoach: 'Coach de prononciation',
    say: 'Dites : ',
    analyzingPronunciation: 'L\'IA analyse votre prononciation...',
    chatWithAiTutor: 'Chatter avec le tuteur IA',
    askAboutLearning: 'Demandez-moi n\'importe quoi sur l\'apprentissage des langues...',
    send: 'Envoyer',
    profile: 'Profil',
    achievements: 'Réalisations',
    weeklyLeaderboard: 'Classement hebdomadaire',
    settings: 'Paramètres',
    accessibility: 'Accessibilité',
    fontSize: 'Taille de police',
    highContrast: 'Contraste élevé',
    captions: 'Sous-titres',
    languagePreferences: 'Préférences linguistiques',
    interfaceLanguage: 'Langue de l\'interface',
    autoPlayAudio: 'Lecture automatique audio',
    notifications: 'Notifications',
    dailyReminders: 'Rappels quotidiens',
    achievementAlerts: 'Alertes de réussite',
    streakWarnings: 'Avertissements de série',
    account: 'Compte',
    privacyPolicy: 'Politique de confidentialité',
    termsOfService: 'Conditions d\'utilisation',
    exportData: 'Exporter les données',
    deleteAccount: 'Supprimer le compte',
    small: 'Petit',
    medium: 'Moyen',
    large: 'Grand',
    placementTest: 'Test de placement',
    findLevel: 'Trouvons votre niveau de départ parfait',
    question: 'Question',
    startLearning: 'Commencer à apprendre !',
    placementComplete: 'Test de placement terminé !',
    yourLevel: 'Votre niveau :',
    score: 'Score :',
    liveTeacherSupport: 'Support enseignant en direct',
    live: 'En direct',
    offline: 'Hors ligne',
    recentCorrections: 'Corrections récentes',
    schedulePrivateLesson: 'Programmer une leçon privée',
    home: 'Accueil',
    lessonsNav: 'Leçons',
    quizNav: 'Quiz',
    aiCoachNav: 'Coach IA',
    profileNav: 'Profil',
    typeMessage: 'Tapez votre message...',
    fillBlank: 'Remplissez le vide :',
    matchPairs: 'Associez les paires :',
    trueFalse: 'Vrai ou Faux :',
    ttsInput: 'Entrée TTS',
    typeTextToSpeak: 'Tapez le texte à prononcer',
    playAudio: 'Lire l\'audio',
    selectLanguage: 'Sélectionner la langue'
  },
  spanish: {
    welcomeBack: '¡Bienvenido de vuelta! 👋',
    readyToContinue: '¿Listo para continuar aprendiendo?',
    dayStreak: 'Racha de días',
    totalXP: 'XP total',
    level: 'Nivel',
    selectLanguage: 'Seleccionar idioma',
    continueLesson: 'Continuar lección',
    aiCoach: 'Entrenador IA',
    lessons: 'Lecciones',
    courseProgress: 'Progreso del curso',
    beginnerLevel: 'Nivel principiante',
    intermediateLevel: 'Nivel intermedio',
    advancedLevel: 'Nivel avanzado',
    quizChallenge: 'Desafío de quiz',
    nextQuestion: 'Siguiente pregunta',
    finishQuiz: 'Terminar quiz',
    aiLanguageCoach: 'Entrenador de idiomas IA',
    pronunciationCoach: 'Entrenador de pronunciación',
    say: 'Di: ',
    analyzingPronunciation: 'La IA está analizando tu pronunciación...',
    chatWithAiTutor: 'Chatear con tutor IA',
    askAboutLearning: 'Pregúntame cualquier cosa sobre el aprendizaje de idiomas...',
    send: 'Enviar',
    profile: 'Perfil',
    achievements: 'Logros',
    weeklyLeaderboard: 'Tabla de clasificación semanal',
    settings: 'Configuración',
    accessibility: 'Accesibilidad',
    fontSize: 'Tamaño de fuente',
    highContrast: 'Alto contraste',
    captions: 'Subtítulos',
    languagePreferences: 'Preferencias de idioma',
    interfaceLanguage: 'Idioma de la interfaz',
    autoPlayAudio: 'Reproducción automática de audio',
    notifications: 'Notificaciones',
    dailyReminders: 'Recordatorios diarios',
    achievementAlerts: 'Alertas de logros',
    streakWarnings: 'Advertencias de racha',
    account: 'Cuenta',
    privacyPolicy: 'Política de privacidad',
    termsOfService: 'Términos de servicio',
    exportData: 'Exportar datos',
    deleteAccount: 'Eliminar cuenta',
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
    placementTest: 'Prueba de ubicación',
    findLevel: 'Encontremos tu nivel de inicio perfecto',
    question: 'Pregunta',
    startLearning: '¡Comenzar a aprender!',
    placementComplete: '¡Prueba de ubicación completada!',
    yourLevel: 'Tu nivel:',
    score: 'Puntuación:',
    liveTeacherSupport: 'Soporte de profesor en vivo',
    live: 'En vivo',
    offline: 'Sin conexión',
    recentCorrections: 'Correcciones recientes',
    schedulePrivateLesson: 'Programar lección privada',
    home: 'Inicio',
    lessonsNav: 'Lecciones',
    quizNav: 'Quiz',
    aiCoachNav: 'Entrenador IA',
    profileNav: 'Perfil',
    typeMessage: 'Escribe tu mensaje...',
    fillBlank: 'Completa el espacio en blanco:',
    matchPairs: 'Empareja las parejas:',
    trueFalse: 'Verdadero o Falso:',
    ttsInput: 'Entrada TTS',
    typeTextToSpeak: 'Escribe el texto para pronunciar',
    playAudio: 'Reproducir audio',
    selectLanguage: 'Seleccionar idioma'
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
    { id: 'tts-input', icon: Volume2, labelKey: 'ttsInput' },
    { id: 'ai-coach', icon: Brain, labelKey: 'aiCoachNav' },
    { id: 'profile', icon: User, labelKey: 'profileNav' }
  ], [t]);


  // Enhanced TTS function using Google TTS service with fallback
  const speakText = useCallback(async (text, lang = 'english', options = {}) => {
    try {
      // Import enhanced TTS function (your custom module)
      const { default: enhancedSpeakText } = await import('./TextToSpeech');
      return await enhancedSpeakText(text, lang, options);
    } catch (error) {
      console.error('TTS Error:', error);

      // Fallback to basic Web Speech API
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        const langMap = {
          arabic: 'الاصطناعي',     // you can also try 'ar-XA'
          french: 'fr-FR',
          spanish: 'es-ES',
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
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 p-4 z-50">
      <div className="flex justify-around items-center mx-auto">
        {navItems.map(({ id, icon: Icon, labelKey }) => (
          <button
            key={id}
            onClick={() => setCurrentScreen(id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${currentScreen === id
              ? 'text-blue-400 bg-slate-700/50'
              : 'text-slate-400 hover:text-white'
              }`}
            aria-label={`Navigate to ${t(labelKey)}`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{t(labelKey)}</span>
          </button>
        ))}
      </div>
    </nav>
  ));

  const HomeScreen = () => (
    <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
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

    // Get vocabulary for the active learning language
    const vocab = VOCABULARY.beginner[activeTab] || VOCABULARY.beginner.english;

    return (
      <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            {t('lessons')}
          </h1>
          <div className="text-blue-400 font-medium">{t('level')} {userProgress.level}</div>
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
          return (
            <div key={level} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold text-white ${fontSize}`}>{t(levelKey)}</h3>
                <span className="text-xs text-slate-400">{levelVocab?.length || 0} words</span>
              </div>

              <div className="space-y-2">
                {levelVocab?.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => speakText(item.word, activeTab)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && speakText(item.word, activeTab)}
                  >
                    <div>
                      <div className={`font-medium text-white ${fontSize}`}>{item.word}</div>
                      <div className={`text-sm text-slate-400 ${currentLanguage.rtl ? 'text-right' : 'text-left'}`}>
                        {item.translation}
                      </div>
                    </div>
                    <button
                      onClick={() => speakText(item.word, activeTab)}
                      className="text-blue-400 hover:text-blue-300"
                      aria-label={`Play pronunciation for ${item.word}`}
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
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
    french: 'fr-FR',
    spanish: 'es-ES',
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
    const [pronunciationScore, setPronunciationScore] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [chatMessages, setChatMessages] = useState([
      { type: 'ai', message: 'Hello! I\'m your AI language coach. How can I help you today?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [expectedText, setExpectedText] = useState('Hello, how are you?');
    const [liveTranscript, setLiveTranscript] = useState('');
    const [grammarCorrections, setGrammarCorrections] = useState([]);
    const [pronunciationFeedback, setPronunciationFeedback] = useState('');
    const recognitionRef = useRef(null);

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
          french: 'fr-FR',
          spanish: 'es-ES',
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
      setIsRecording(true);
      setIsAnalyzing(true);
      setPronunciationScore(null);
      setGrammarCorrections([]);
      setPronunciationFeedback('');
      setLiveTranscript('');

      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        // Fallback simulation
        setTimeout(() => {
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
        recognitionRef.current.stop();
      }
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

      let corrected = inputMessage;
      const grammar = checkGrammar(inputMessage);
      if (grammar.length > 0) {
        corrected = grammar.reduce((text, corr) => text.replace(corr.error, corr.correction), inputMessage);
      }

      setChatMessages(prev => [
        ...prev,
        { type: 'user', message: inputMessage },
        {
          type: 'ai',
          message: `You said: "${inputMessage}". ${grammar.length > 0 ? `Corrected: "${corrected}".` : ''} Great job! What would you like to practice next?`
        }
      ]);
      setInputMessage('');
    }, [inputMessage, selectedLanguage]);

    // Determine RTL based on selected language key
    const rtlLanguages = new Set(['arabic', 'hebrew', 'urdu', 'farsi']);
    const isRTL = rtlLanguages.has(String(selectedLanguage).toLowerCase());
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

    // Load leaderboard data
    useEffect(() => {
      const loadLeaderboard = async () => {
        setIsLoadingLeaderboard(true);
        const result = await databaseService.getLeaderboard(10);
        if (result.success) {
          setLeaderboard(result.data);
        }
        setIsLoadingLeaderboard(false);
      };
      loadLeaderboard();
    }, []);

    const handleSettingChange = async (setting, value) => {
      const newSettings = { ...userSettings, [setting]: value };
      setUserSettings(newSettings);
      await authService.updateSettings({ [setting]: value });
    };

    const LessonsTab = () => {
      const { user } = useUser();
      const [lessons, setLessons] = useState([]);
      const [activeLang, setActiveLang] = useState(user?.learningLanguages[0] || "English");

      useEffect(() => {
        const fetchLessons = async () => {
          if (!user) return;
          const q = query(collection(db, "lessons"), where("language", "==", activeLang));
          const snapshot = await getDocs(q);
          setLessons(snapshot.docs.map(doc => doc.data()));
        };
        fetchLessons();
      }, [activeLang, user]);

      if (!user) return null;

      return (
        <div>
          {/* Language Tabs */}
          {user.learningLanguages.map(lang => (
            <button key={lang} onClick={() => setActiveLang(lang)}>{lang}</button>
          ))}

          {/* Lessons List */}
          <ul>
            {lessons.map((lesson) => (
              <li key={lesson.lessonId}>
                <h3>{lesson.title}</h3>
                <p>{lesson.content}</p>
                <audio controls src={lesson.audioUrl}></audio>
              </li>
            ))}
          </ul>
        </div>
      );
    };
    const LanguageSettings = () => {

      const handleLanguageChange = async (newLanguage) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          alert("দয়া করে লগ ইন করুন যাতে ভাষা পরিবর্তন করা যায়।");
          return;
        }

        try {
          await AuthService.updateBaseLanguage(user.uid, newLanguage);
          console.log("ভাষা সফলভাবে আপডেট হয়েছে:", newLanguage);
          alert(`ভাষা ${newLanguage} এ পরিবর্তিত হয়েছে।`);
        } catch (error) {
          console.error("ভাষা আপডেট করতে সমস্যা হয়েছে:", error);
          alert("ভাষা আপডেট করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
        }
      };

      return (
        <div>
          <h2>Language Settings</h2>
          <button onClick={() => handleLanguageChange("English")}>
            English
          </button>
          <button onClick={() => handleLanguageChange("Arabic")}>
            Arabic
          </button>
          <button onClick={() => handleLanguageChange("Bangla")}>
            Bangla
          </button>
        </div>
      );
    };
    const handleLanguageChange = async (newLanguage) => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        // ব্যবহারকারী লগইন নেই
        alert("Please login to change setting.");
        return;
      }

      try {
        // লগইন থাকলে ভাষা আপডেট করুন
        await AuthService.updateBaseLanguage(user.uid, newLanguage);
        console.log("Language updated:", newLanguage);
      } catch (error) {
        console.error("Language update error:", error);
        alert("Language update failed. Please try again.");
      }
    };
    return (
      <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            {t('profile')}
          </h1>
        </div>

        {/* Profile Tabs */}
        <div className="bg-slate-800/50 rounded-xl p-1">
          <div className="flex space-x-1">
            {[
              { id: 'stats', label: 'Stats' },
              { id: 'settings', label: 'Settings' },
              { id: 'leaderboard', label: 'Leaderboard' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <>
            {/* User Stats */}
            <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 text-white">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                  {authService.getCurrentUser()?.displayName?.charAt(0) || 'U'}
                </div>
                <h2 className={`font-bold mb-1 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
                  {authService.getCurrentUser()?.displayName || 'User'}
                </h2>
                <p className="text-blue-200">Language Explorer</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <Zap className="text-yellow-400 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold">{userProgress.xp}</div>
                  <div className="text-sm text-blue-200">Total XP</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <Flame className="text-orange-400 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold">{userProgress.streak}</div>
                  <div className="text-sm text-blue-200">Day Streak</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <Trophy className="text-yellow-400 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold">{userProgress.level}</div>
                  <div className="text-sm text-blue-200">Level</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <Award className="text-purple-400 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold">{userProgress.badges.length}</div>
                  <div className="text-sm text-blue-200">Badges</div>
                </div>
              </div>
            </div>

            {/* Learning Languages */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className={`font-bold text-white mb-4 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
                Learning Languages
              </h3>
              <div className="flex flex-wrap gap-3">
                {learningLanguages.map((lang) => (
                  <div key={lang} className="flex items-center space-x-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-lg">
                    <span className="text-lg">{LEARNING_LANGUAGES[lang]?.flag}</span>
                    <span className="font-medium">{LEARNING_LANGUAGES[lang]?.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className={`font-bold text-white mb-4 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
                {t('achievements')}
              </h3>
              <div className="space-y-3">
                {userProgress.badges.length > 0 ? (
                  userProgress.badges.map((badge, index) => (
                    <div key={index} className="flex items-center p-3 bg-slate-700/50 rounded-lg">
                      <Award className="text-yellow-400 mr-3" size={20} />
                      <div>
                        <div className="font-medium text-white">{badge.replace('-', ' ').toUpperCase()}</div>
                        <div className="text-sm text-slate-400">Achievement unlocked!</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">No achievements yet. Keep learning!</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Interface Language */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className={`font-bold text-white mb-4 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
                Interface Language
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(INTERFACE_LANGUAGES).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageChange('base', key)}
                    className={`p-4 rounded-xl border-2 transition-all ${selectedLanguage === key
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                      }`}
                  >
                    <div className="text-2xl mb-2">{lang.flag}</div>
                    <div className="font-medium">{lang.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Languages */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className={`font-bold text-white mb-4 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
                Learning Languages
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(LEARNING_LANGUAGES).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageChange('learning', key)}
                    className={`p-4 rounded-xl border-2 transition-all ${learningLanguages.includes(key)
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                      }`}
                  >
                    <div className="text-2xl mb-2">{lang.flag}</div>
                    <div className="font-medium">{lang.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* App Settings */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className={`font-bold text-white mb-4 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
                App Settings
              </h3>
              <div className="space-y-4">
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Dark Mode</div>
                    <div className="text-sm text-slate-400">Toggle dark/light theme</div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('darkMode', !userSettings.darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${userSettings.darkMode ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${userSettings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Notifications</div>
                    <div className="text-sm text-slate-400">Enable push notifications</div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', !userSettings.notifications)}
                    className={`w-12 h-6 rounded-full transition-colors ${userSettings.notifications ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${userSettings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                {/* Sound */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Sound</div>
                    <div className="text-sm text-slate-400">Enable audio feedback</div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('sound', !userSettings.sound)}
                    className={`w-12 h-6 rounded-full transition-colors ${userSettings.sound ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${userSettings.sound ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                {/* Font Size */}
                <div>
                  <div className="font-medium text-white mb-2">Font Size</div>
                  <div className="flex space-x-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSettingChange('fontSize', size)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${userSettings.fontSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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


        {activeTab === 'leaderboard' && (
          <div className="bg-slate-800 rounded-2xl p-6">
            <h3
              className={`font-bold text-white mb-4 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'
                }`}
            >
              {t('weeklyLeaderboard')}
            </h3>
            {isLoadingLeaderboard ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div key={user.id} className="flex items-center p-3 bg-slate-700/50 rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${index === 0
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
                      <div className="font-medium text-white">{user.displayName || 'Anonymous'}</div>
                      <div className="text-sm text-slate-400">Level {user.level || 1}</div>
                    </div>
                    <div className="text-yellow-400 font-bold">{user.xp || 0} XP</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No data available yet.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const SettingsScreen = () => (
    <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
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
      <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
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
      <div className={`space-y-6 p-4 sm:p-6 w-full mx-auto ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
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
  const TTSInputScreen = () => {
    const [inputText, setInputText] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedTTSLanguage, setSelectedTTSLanguage] = useState(selectedLanguage);

    const handleSpeak = async () => {
      if (!inputText.trim()) return;

      setIsPlaying(true);
      try {
        await speakText(inputText, selectedTTSLanguage);
      } catch (error) {
        console.error('TTS Error:', error);
      } finally {
        // Reset playing state after a delay
        setTimeout(() => setIsPlaying(false), 2000);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSpeak();
      }
    };

    return (
      <div className={`space-y-6 p-4 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="text-center">
          <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            {t('ttsInput')}
          </h1>
          <p className="text-slate-400 mt-2">{t('typeTextToSpeak')}</p>
        </div>

        {/* Language Selector */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            {t('selectLanguage')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(INTERFACE_LANGUAGES).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => setSelectedTTSLanguage(key)}
                className={`p-3 rounded-lg border-2 transition-all ${selectedTTSLanguage === key
                  ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                  }`}
                aria-pressed={selectedTTSLanguage === key}
              >
                <div className="text-2xl mb-1">{lang.flag}</div>
                <div className="text-xs font-medium">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <label htmlFor="tts-input" className="block text-white font-medium mb-3">
            {t('typeTextToSpeak')}
          </label>
          <div className="space-y-4">
            <textarea
              id="tts-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('typeTextToSpeak')}
              className={`w-full p-4 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${currentLanguage.rtl ? 'text-right' : 'text-left'
                } ${fontSize}`}
              rows={4}
              dir={INTERFACE_LANGUAGES[selectedTTSLanguage]?.rtl ? 'rtl' : 'ltr'}
            />

            {/* Play Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSpeak}
                disabled={!inputText.trim() || isPlaying}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${!inputText.trim() || isPlaying
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                  }`}
              >
                {isPlaying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Playing...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>{t('playAudio')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-white font-medium mb-3">Quick Examples</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(() => {
              const examples = {
                english: ['Hello, how are you?', 'Good morning!', 'Thank you very much.'],
                arabic: ['مرحبا، كيف حالك؟', 'صباح الخير!', 'شكرا جزيلا.'],
                french: ['Bonjour, comment allez-vous?', 'Bonjour!', 'Merci beaucoup.'],
                spanish: ['Hola, ¿cómo estás?', '¡Buenos días!', 'Muchas gracias.']
              };
              return examples[selectedTTSLanguage]?.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(example)}
                  className="p-3 text-left bg-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-600/50 transition-colors"
                >
                  {example}
                </button>
              ));
            })()}
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen />;
      case 'lessons': return <LessonsScreen />;
      case 'quiz': return <QuizScreenEnhanced selectedLanguage={selectedLanguage} onFinish={(score, total) => setQuizScore(score)} />;
      case 'tts-input': return <TTSInputScreen />;
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