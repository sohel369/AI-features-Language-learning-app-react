// Web Speech API TTS Service (no paid APIs)
// Singleton class exposing speak and stop with multi-language support

const LANGUAGE_TO_BCP47 = {
	english: 'en-US',
	arabic: 'ar-SA',
	french: 'fr-FR',
	spanish: 'es-ES',
	dutch: 'nl-NL',
	indonesian: 'id-ID',
	malay: 'ms-MY',
	thai: 'th-TH',
	khmer: 'km-KH'
};

class TTSService {
	constructor() {
		this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
		this.voices = [];
		this.initialized = false;
		this.currentUtterance = null;
		if (this.isSupported) {
			this.#initialize();
		} else {
			console.warn('Web Speech API is not supported in this browser.');
		}
	}

	#initialize() {
		// Load voices (may be async)
		const load = () => {
			this.voices = window.speechSynthesis.getVoices() || [];
			if (!this.initialized && this.voices.length > 0) {
				this.initialized = true;
				console.log('[TTSService] Loaded voices:', this.voices.map(v => `${v.name} (${v.lang})`));
			}
		};

		window.speechSynthesis.addEventListener('voiceschanged', load);
		load();
	}

	#getVoiceForLanguage(targetLangCode) {
		if (!this.voices || this.voices.length === 0) return null;
		// Exact match first
		const exact = this.voices.find(v => v.lang.toLowerCase() === targetLangCode.toLowerCase());
		if (exact) return exact;
		// Match by language prefix (e.g., en-*)
		const langPrefix = targetLangCode.split('-')[0].toLowerCase();
		const pref = this.voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
		return pref || null;
	}

	stop() {
		if (!this.isSupported) return;
		try {
			window.speechSynthesis.cancel();
			this.currentUtterance = null;
		} catch (e) {
			console.warn('TTS stop error:', e);
		}
	}

	async speak(text, language = 'english', options = {}) {
		if (!this.isSupported) {
			console.warn('Web Speech API not supported');
			return;
		}
		if (!text || !String(text).trim()) return;

		// Cancel any ongoing speech
		this.stop();

		const utterance = new window.SpeechSynthesisUtterance(String(text));
		const langCode = LANGUAGE_TO_BCP47[language] || language || 'en-US';
		utterance.lang = langCode;
		utterance.rate = typeof options.rate === 'number' ? options.rate : 1.0;
		utterance.pitch = typeof options.pitch === 'number' ? options.pitch : 1.0;
		utterance.volume = typeof options.volume === 'number' ? options.volume : 1.0;

		// Assign a matching voice if available
		const voice = this.#getVoiceForLanguage(langCode);
		if (voice) utterance.voice = voice;

		return new Promise((resolve, reject) => {
			utterance.onend = () => {
				this.currentUtterance = null;
				resolve();
			};
			utterance.onerror = (e) => {
				this.currentUtterance = null;
				reject(e.error || e);
			};
			this.currentUtterance = utterance;
			window.speechSynthesis.speak(utterance);
		});
	}
}

const ttsService = new TTSService();
export default ttsService;


