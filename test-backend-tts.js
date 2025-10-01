// Test script for Backend TTS Service
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testBackendTTS() {
  console.log('🧪 Testing Backend TTS Service...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Checking server health...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.message);

    // Test 2: Get supported languages
    console.log('\n2. Getting supported languages...');
    const languagesResponse = await axios.get(`${BASE_URL}/api/tts/languages`);
    console.log('✅ Supported languages:', languagesResponse.data.languages);

    // Test 3: Test Arabic TTS
    console.log('\n3. Testing Arabic TTS...');
    const arabicText = 'مَرْحَبًا، كَيْفَ حَالُكَ الْيَوْمَ؟';
    console.log('Arabic text:', arabicText);
    
    const ttsResponse = await axios.post(`${BASE_URL}/api/tts/generate`, {
      text: arabicText,
      language: 'arabic',
      options: {
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0
      }
    }, {
      responseType: 'arraybuffer'
    });

    console.log('✅ Arabic TTS generated successfully!');
    console.log('Audio size:', ttsResponse.data.length, 'bytes');

    // Test 4: Test English TTS
    console.log('\n4. Testing English TTS...');
    const englishText = 'Hello, how are you today?';
    console.log('English text:', englishText);
    
    const englishTtsResponse = await axios.post(`${BASE_URL}/api/tts/generate`, {
      text: englishText,
      language: 'english',
      options: {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0
      }
    }, {
      responseType: 'arraybuffer'
    });

    console.log('✅ English TTS generated successfully!');
    console.log('Audio size:', englishTtsResponse.data.length, 'bytes');

    console.log('\n🎉 All tests passed! Backend TTS is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testBackendTTS();
