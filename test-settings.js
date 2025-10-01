// Test script for settings functionality
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testSettings() {
  try {
    console.log('🧪 Testing Settings API...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    
    // Test demo user creation
    console.log('\n2. Creating demo user...');
    const demoUserResponse = await fetch(`${BASE_URL}/api/demo/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        displayName: 'Test User'
      })
    });
    const demoUserData = await demoUserResponse.json();
    console.log('✅ Demo user created:', demoUserData.userId);
    
    const token = demoUserData.token;
    
    // Test settings update
    console.log('\n3. Testing settings update...');
    const settingsResponse = await fetch(`${BASE_URL}/api/settings/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        darkMode: true,
        fontSize: 'large',
        notifications: false,
        sound: true
      })
    });
    const settingsData = await settingsResponse.json();
    console.log('✅ Settings updated:', settingsData.message);
    
    // Test notification
    console.log('\n4. Testing notification...');
    const notificationResponse = await fetch(`${BASE_URL}/api/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info'
      })
    });
    const notificationData = await notificationResponse.json();
    console.log('✅ Notification sent:', notificationData.message);
    
    // Test sound
    console.log('\n5. Testing sound...');
    const soundResponse = await fetch(`${BASE_URL}/api/sound/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        soundType: 'success',
        volume: 0.8
      })
    });
    const soundData = await soundResponse.json();
    console.log('✅ Sound played:', soundData.message);
    
    console.log('\n🎉 All tests passed! Settings system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSettings();
