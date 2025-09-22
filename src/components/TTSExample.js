import React, { useState } from 'react';
import ttsService from '../services/TTSService';

const TTSExample = () => {
  const [text, setText] = useState('Hello, how are you?');
  const [language, setLanguage] = useState('english');

  const speak = async () => {
    try {
      await ttsService.speak(text, language, { rate: 0.95, pitch: 1 });
    } catch (e) {
      console.warn('Speak error:', e);
    }
  };

  const stop = () => {
    ttsService.stop();
  };

  return (
    <div className="space-y-3 bg-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-700 text-white p-2 rounded"
        >
          <option value="english">English</option>
          <option value="arabic">Arabic</option>
          <option value="french">French</option>
          <option value="spanish">Spanish</option>
          <option value="dutch">Dutch</option>
          <option value="indonesian">Indonesian</option>
          <option value="malay">Malay</option>
          <option value="thai">Thai</option>
          <option value="khmer">Khmer</option>
        </select>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-slate-700 text-white p-2 rounded"
          placeholder="Enter text to speak"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={speak} className="bg-blue-600 text-white px-4 py-2 rounded">Speak</button>
        <button onClick={stop} className="bg-slate-600 text-white px-4 py-2 rounded">Stop</button>
      </div>
    </div>
  );
};

export default TTSExample;


