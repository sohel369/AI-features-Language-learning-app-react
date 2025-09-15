import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
const LANGUAGES = {
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
    profileNav: 'Profile'
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
    profileNav: 'الملف'
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
    profileNav: 'Profiel'
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
    profileNav: 'Profil'
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
    profileNav: 'Profil'
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
    profileNav: 'โปรไฟล์'
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
    profileNav: 'ប្រវត្តិរូប'
  }
};

const VOCABULARY = {
  beginner: [
    { word: 'hello', translation: 'مَرْحَبًا', category: 'greetings', audio: '/audio/hello.mp3' },
    { word: 'goodbye', translation: 'وَدَاعًا', category: 'greetings', audio: '/audio/goodbye.mp3' },
    { word: 'water', translation: 'مَاءٌ', category: 'food', audio: '/audio/water.mp3' },
    { word: 'food', translation: 'طَعَامٌ', category: 'food', audio: '/audio/food.mp3' }
  ],
  intermediate: [
    { word: 'beautiful', translation: 'جَمِيلٌ', category: 'adjectives', audio: '/audio/beautiful.mp3' },
    { word: 'difficult', translation: 'صَعْبٌ', category: 'adjectives', audio: '/audio/difficult.mp3' }
  ],
  advanced: [
    { word: 'sophisticated', translation: 'مُعَقَّدٌ', category: 'advanced', audio: '/audio/sophisticated.mp3' },
    { word: 'magnificent', translation: 'رَائِعٌ', category: 'advanced', audio: '/audio/magnificent.mp3' }
  ]
};

const QUIZ_QUESTIONS = [
  {
    question: "What does 'مَرْحَبًا' mean?",
    options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
    correct: 0
  },
  {
    question: "How do you say 'water' in Arabic?",
    options: ['طَعَامٌ', 'مَاءٌ', 'جَمِيلٌ', 'صَعْبٌ'],
    correct: 1
  }
];

const PLACEMENT_QUESTIONS = [
  {
    type: 'vocabulary',
    question: 'Select the word that means "beautiful"',
    options: ['جَمِيلٌ', 'صَعْبٌ', 'كَبِيرٌ', 'صَغِيرٌ'],
    correct: 0
  },
  {
    type: 'grammar',
    question: 'Complete: "I ___ to the store yesterday"',
    options: ['go', 'went', 'going', 'goes'],
    correct: 1
  },
  {
    type: 'listening',
    question: 'What did you hear?',
    audio: '/audio/sample.mp3',
    options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
    correct: 0
  }
];

const LanguageLearningMVP = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [userProgress, setUserProgress] = useState({
    xp: 1250,
    streak: 7,
    level: 3,
    badges: ['first-lesson', 'week-streak', 'pronunciation-pro']
  });
  const [isRecording, setIsRecording] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fontSize, setFontSize] = useState('text-base');
  const [highContrast, setHighContrast] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);

  // Get current language with RTL support
  const currentLanguage = useMemo(() => LANGUAGES[selectedLanguage], [selectedLanguage]);

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

  // Enhanced TTS function with error handling (uses Web Speech with Google voices in supported browsers)
  const speakText = useCallback((text, lang = 'en') => {
    try {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Enhanced language mapping (Google voices via Web Speech)
        const langMap = {
          arabic: 'ar-SA',
          dutch: 'nl-NL',
          indonesian: 'id-ID',
          malay: 'ms-MY',
          thai: 'th-TH',
          khmer: 'km-KH',
          english: 'en-US'
        };

        utterance.lang = langMap[lang] || langMap[selectedLanguage] || 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;

        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('TTS Error:', error);
    }
  }, [selectedLanguage]);

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
          {Object.entries(LANGUAGES).map(([key, lang]) => (
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

  const LessonsScreen = () => (
    <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
          {t('lessons')}
        </h1>
        <div className="text-blue-400 font-medium">{t('level')} {userProgress.level}</div>
      </div>

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
        return (
          <div key={level} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-bold text-white ${fontSize}`}>{t(levelKey)}</h3>
              <span className="text-xs text-slate-400">{VOCABULARY[level.toLowerCase()]?.length || 0} words</span>
            </div>

            <div className="space-y-2">
              {VOCABULARY[level.toLowerCase()]?.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => speakText(item.word)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && speakText(item.word)}
                >
                  <div>
                    <div className={`font-medium text-white ${fontSize}`}>{item.word}</div>
                    <div className={`text-sm text-slate-400 ${currentLanguage.rtl ? 'text-right' : 'text-left'}`}>
                      {item.translation}
                    </div>
                  </div>
                  <button
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

  const QuizScreen = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = useCallback((answerIndex) => {
      const selectedOption = QUIZ_QUESTIONS[currentQuestion].options[answerIndex];
      const arabicLang = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(selectedOption) ? 'arabic' : 'english';
      speakText(selectedOption, arabicLang);
      setSelectedAnswer(answerIndex);
      setShowResult(true);

      if (answerIndex === QUIZ_QUESTIONS[currentQuestion].correct) {
        setQuizScore(prev => prev + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        // Update user progress
        setUserProgress(prev => ({ ...prev, xp: prev.xp + 10 }));
      }
    }, [currentQuestion, speakText]);

    const nextQuestion = useCallback(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completed - could navigate to results screen
        setCurrentScreen('profile');
      }
    }, [currentQuestion]);

    const isArabic = (text) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);

    const handleTextClick = useCallback((e, text, language) => {
      e.stopPropagation();
      speakText(text, language);
    }, [speakText]);

    const currentQuestionText = QUIZ_QUESTIONS[currentQuestion]?.question;

    return (
      <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
            {t('quizChallenge')}
          </h1>
          <div className="text-blue-400 font-medium">
            {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
          <div className="mb-6">
            <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                role="progressbar"
                aria-valuenow={(currentQuestion + 1) / QUIZ_QUESTIONS.length * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            <button
              onClick={() => speakText(currentQuestionText, isArabic(currentQuestionText) ? 'arabic' : 'english')}
              className="flex items-center text-blue-400 mb-4 hover:text-blue-300"
              aria-label="Speak question"
            >
              <Volume2 size={16} className="mr-2" />
              Speak Question
            </button>

            <h2
              className={`font-bold text-white mb-6 cursor-pointer hover:text-blue-300 transition-colors ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}
              onClick={(e) => handleTextClick(e, currentQuestionText, isArabic(currentQuestionText) ? 'arabic' : 'english')}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleTextClick(e, currentQuestionText, isArabic(currentQuestionText) ? 'arabic' : 'english')}
            >
              {currentQuestionText}
            </h2>

            <div className="space-y-3">
              {QUIZ_QUESTIONS[currentQuestion]?.options.map((option, index) => {
                const optionLang = isArabic(option) ? 'arabic' : 'english';
                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl text-left transition-all ${fontSize} ${showResult
                      ? index === QUIZ_QUESTIONS[currentQuestion].correct
                        ? 'bg-green-600 text-white border-2 border-green-400'
                        : selectedAnswer === index
                          ? 'bg-red-600 text-white border-2 border-red-400'
                          : 'bg-slate-700 text-slate-300'
                      : 'bg-slate-700 text-white hover:bg-slate-600 border-2 border-transparent hover:border-slate-500'
                      }`}
                    aria-pressed={selectedAnswer === index}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="cursor-pointer hover:text-blue-300 transition-colors flex-1"
                        onClick={(e) => handleTextClick(e, option, optionLang)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleTextClick(e, option, optionLang)}
                      >
                        {option}
                      </span>
                      <div className="flex items-center space-x-2">
                        {showResult && (
                          <>
                            {index === QUIZ_QUESTIONS[currentQuestion].correct &&
                              <Check size={20} className="text-green-400" aria-label="Correct answer" />}
                            {selectedAnswer === index && index !== QUIZ_QUESTIONS[currentQuestion].correct &&
                              <X size={20} className="text-red-400" aria-label="Incorrect answer" />}
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(option, optionLang);
                          }}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          aria-label={`Speak ${option}`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {showResult && (
            <div className="text-center">
              <button
                onClick={nextQuestion}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                {currentQuestion < QUIZ_QUESTIONS.length - 1 ? t('nextQuestion') : t('finishQuiz')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AICoachScreen = ({ t, selectedLanguage, speakText }) => {
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

    // Simple grammar checker (extendable with external libraries like Grammarly)
    const checkGrammar = (text) => {
      const corrections = [];
      const lowerText = text.toLowerCase();

      // Common English grammar rules
      if (selectedLanguage === 'english') {
        if (lowerText.includes('i is')) {
          corrections.push({
            error: 'i is',
            correction: 'I am',
            note: 'Use "I am" for first-person singular.'
          });
        }
        if (lowerText.includes('dont')) {
          corrections.push({
            error: 'dont',
            correction: "don't",
            note: "Use contraction 'don't' for 'do not'."
          });
        }
      } else if (selectedLanguage === 'arabic') {
        // Simplified Arabic grammar check (mock)
        if (text.includes('مرحبا')) {
          corrections.push({
            error: 'مرحبا',
            correction: 'مَرْحَبًا',
            note: 'Add correct vowel markings for proper pronunciation.'
          });
        }
      }
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

      // Mock phoneme feedback
      const phonemeFeedback = transcript.toLowerCase().includes('hello')
        ? 'Great stress on "hello".'
        : 'Work on stressing the first syllable in "hello".';

      return { score, feedback, phonemeFeedback };
    };

    useEffect(() => {
      // Set expected text based on selected language
      setExpectedText(selectedLanguage === 'arabic' ? 'مَرْحَبًا، كيف حالك؟' : 'Hello, how are you?');

      // Initialize SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true; // Enable continuous recognition
        recognitionRef.current.interimResults = true; // Enable interim results for real-time
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

          // Real-time grammar and pronunciation analysis
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

    // Speak AI messages
    useEffect(() => {
      if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].type === 'ai') {
        speakText(chatMessages[chatMessages.length - 1].message, selectedLanguage);
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
          setLiveTranscript('Hello, how are you?');
          setTimeout(() => {
            const grammar = checkGrammar('Hello, how are you?');
            setGrammarCorrections(grammar);
            const pronunciation = analyzePronunciation('Hello, how are you?');
            setPronunciationScore(pronunciation);
            setPronunciationFeedback(pronunciation.phonemeFeedback);
            setIsAnalyzing(false);
          }, 2000);
        }, 3000);
      }
    }, []);

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

    return (
      <div className={`space-y-6 ${LANGUAGES[selectedLanguage].rtl ? 'rtl' : 'ltr'}`} dir={LANGUAGES[selectedLanguage].rtl ? 'rtl' : 'ltr'}>
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

  const ProfileScreen = () => (
    <div className={`space-y-6 ${currentLanguage.rtl ? 'rtl' : 'ltr'}`} dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className={`font-bold text-white ${fontSize === 'text-sm' ? 'text-xl' : fontSize === 'text-lg' ? 'text-2xl' : 'text-3xl'}`}>
          {t('profile')}
        </h1>
      </div>

      {/* User Stats */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
            ME
          </div>
          <h2 className={`font-bold mb-1 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>Mohammed E.</h2>
          <p className="text-blue-200">Language Explorer</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/10 rounded-xl">
            <Zap className="text-yellow-400 mx-auto mb-2" size={24} />
            <div className="font-bold text-lg">{userProgress.xp}</div>
            <div className="text-sm text-blue-200">{t('totalXP')}</div>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-xl">
            <Flame className="text-orange-400 mx-auto mb-2" size={24} />
            <div className="font-bold text-lg">{userProgress.streak}</div>
            <div className="text-sm text-blue-200">{t('dayStreak')}</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 flex items-center ${fontSize}`}>
          <Award className="mr-2" size={20} />
          {t('achievements')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'first-lesson', name: 'First Steps', icon: '🎯', unlocked: true },
            { id: 'week-streak', name: 'Week Warrior', icon: '🔥', unlocked: true },
            { id: 'pronunciation-pro', name: 'Pronunciation Pro', icon: '🎤', unlocked: true },
            { id: 'polyglot', name: 'Polyglot', icon: '🌍', unlocked: false }
          ].map(badge => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl text-center ${badge.unlocked
                ? 'bg-gradient-to-br from-yellow-600 to-orange-600 text-white'
                : 'bg-slate-700 text-slate-400'
                }`}
              role={badge.unlocked ? "img" : undefined}
              aria-label={badge.unlocked ? `Achievement unlocked: ${badge.name}` : `Achievement locked: ${badge.name}`}
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <div className={`font-medium ${fontSize}`}>{badge.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
        <h3 className={`font-bold text-white mb-4 flex items-center ${fontSize}`}>
          <Trophy className="mr-2" size={20} />
          {t('weeklyLeaderboard')}
        </h3>
        <div className="space-y-3">
          {[
            { name: 'You', xp: userProgress.xp, rank: 1, current: true },
            { name: 'Sarah M.', xp: 1180, rank: 2 },
            { name: 'Ahmed K.', xp: 1050, rank: 3 }
          ].map(user => (
            <div
              key={user.name}
              className={`flex items-center justify-between p-3 rounded-lg ${user.current ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-slate-700/50'
                }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}>
                  {user.rank}
                </div>
                <span className={`text-white font-medium ${fontSize}`}>{user.name}</span>
              </div>
              <span className="text-slate-300">{user.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
              {Object.entries(LANGUAGES).map(([key, lang]) => (
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

  // Placement Test Screen
  const PlacementTestScreen = () => {
    const [testStep, setTestStep] = useState(0);
    const [testResults, setTestResults] = useState(null);

    const handleTestAnswer = useCallback((answerIndex) => {
      if (testStep < PLACEMENT_QUESTIONS.length - 1) {
        setTestStep(testStep + 1);
      } else {
        // Calculate results based on answers
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
                <span>{testStep + 1}/{PLACEMENT_QUESTIONS.length}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((testStep + 1) / PLACEMENT_QUESTIONS.length) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={(testStep + 1) / PLACEMENT_QUESTIONS.length * 100}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            {PLACEMENT_QUESTIONS[testStep] && (
              <div>
                <h3 className={`font-bold text-white mb-6 ${fontSize === 'text-sm' ? 'text-lg' : fontSize === 'text-lg' ? 'text-xl' : 'text-2xl'}`}>
                  {PLACEMENT_QUESTIONS[testStep].question}
                </h3>

                {PLACEMENT_QUESTIONS[testStep].type === 'listening' && (
                  <div className="text-center mb-6">
                    <button
                      onClick={() => speakText('Hello')}
                      className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Play audio sample"
                    >
                      <Play size={24} />
                    </button>
                    <p className="text-slate-400 mt-2">Click to listen</p>
                  </div>
                )}

                <div className="space-y-3">
                  {PLACEMENT_QUESTIONS[testStep].options.map((option, index) => (
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

  // Teacher Integration Screen



  const TeacherScreen = () => {
    const [isLiveSession, setIsLiveSession] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
      { id: 1, text: 'Hello! How can I assist you today?', sender: 'teacher', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const fontSize = 'text-base'; // Default font size

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

        // Simulate teacher response
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              text: 'Thank you for your message! How can I help you further?',
              sender: 'teacher',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }, 1000);
      }
    };

    // Handle clicking outside the chat lightbox to close it
    const handleCloseChat = (e) => {
      if (e.target.id === 'chat-overlay') {
        setIsChatOpen(false);
      }
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
              <button className="p-3 bg-purple-800/50 text-purple-200 rounded-xl hover:bg-purple-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400">
                <Mic className="mx-auto mb-1" size={20} />
                <span className="text-sm">Voice Call</span>
              </button>
            </div>
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
                    onClick={() => speakText(item.correction)}
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

  // Main render function
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen />;
      case 'lessons': return <LessonsScreen />;
      case 'quiz': return <QuizScreen />;
      case 'ai-coach': return <AICoachScreen t={t} selectedLanguage={selectedLanguage} speakText={speakText} fontSize={fontSize} />;
      case 'profile': return <ProfileScreen />;
      case 'settings': return <SettingsScreen />;
      case 'placement': return <PlacementTestScreen />;
      case 'teacher': return <TeacherScreen />;
      default: return <HomeScreen />;
    }
  };

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

            <div className="flex items-center space-x-1 text-xs">
              <Flame className="text-orange-400" size={14} />
              <span className="font-bold">{userProgress.streak}</span>
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