// src/TextToSpeech.js
const speakText = (text, language = "en") => {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "arabic" ? "ar-SA" : "en-US";
  window.speechSynthesis.speak(utterance);
};

export default speakText;
