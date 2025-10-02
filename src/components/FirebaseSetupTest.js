// Firebase Setup Test Component
import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const FirebaseSetupTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date() }]);
  };

  const runSetupTest = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Check if Authentication is enabled
    addResult('Setup Check', 'info', 'Testing Firebase Authentication setup...');
    
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      
      addResult('Registration Test', 'info', 'Attempting test registration...');
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      addResult('Registration Test', 'success', '✅ Registration successful! Authentication is enabled.');
      
      // Test Firestore
      try {
        await setDoc(doc(db, 'test', 'setup-test'), {
          message: 'Firebase setup is working!',
          timestamp: new Date(),
          userId: userCredential.user.uid
        });
        addResult('Firestore Test', 'success', '✅ Firestore write successful!');
      } catch (firestoreError) {
        addResult('Firestore Test', 'error', `❌ Firestore error: ${firestoreError.message}`);
      }
      
    } catch (error) {
      if (error.code === 'auth/configuration-not-found') {
        addResult('Setup Check', 'error', '❌ Authentication not enabled in Firebase Console');
        addResult('Setup Instructions', 'info', '🔧 Go to: https://console.firebase.google.com');
        addResult('Setup Instructions', 'info', '🔧 Select project: reactlanguageapp');
        addResult('Setup Instructions', 'info', '🔧 Go to Authentication → Sign-in method');
        addResult('Setup Instructions', 'info', '🔧 Enable Email/Password provider');
        addResult('Setup Instructions', 'info', '🔧 Click Save');
        addResult('Setup Instructions', 'info', '🔧 Wait 1-2 minutes for changes to propagate');
      } else {
        addResult('Setup Check', 'error', `❌ Error: ${error.code} - ${error.message}`);
      }
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Setup Test</h1>
        
        <div className="bg-yellow-900/20 border border-yellow-500 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">⚠️ Authentication Not Enabled</h2>
          <p className="mb-4">The error "auth/configuration-not-found" means Firebase Authentication is not enabled in your project.</p>
          <div className="space-y-2 text-sm">
            <p><strong>Quick Fix:</strong></p>
            <p>1. Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Firebase Console</a></p>
            <p>2. Select project: <code className="bg-slate-700 px-2 py-1 rounded">reactlanguageapp</code></p>
            <p>3. Go to <strong>Authentication</strong> → <strong>Sign-in method</strong></p>
            <p>4. Enable <strong>Email/Password</strong> provider</p>
            <p>5. Click <strong>Save</strong></p>
          </div>
        </div>
        
        <button
          onClick={runSetupTest}
          disabled={isRunning}
          className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50"
        >
          {isRunning ? 'Testing Setup...' : 'Test Firebase Setup'}
        </button>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                result.status === 'success' 
                  ? 'bg-green-900/20 border-green-500 text-green-300'
                  : result.status === 'error'
                  ? 'bg-red-900/20 border-red-500 text-red-300'
                  : 'bg-blue-900/20 border-blue-500 text-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  result.status === 'success' 
                    ? 'bg-green-500'
                    : result.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`} />
                <span className="font-semibold">{result.test}</span>
                <span className="text-sm text-slate-400">
                  {result.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-2 text-sm">{result.message}</p>
            </div>
          ))}
        </div>

        {testResults.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            Click "Test Firebase Setup" to verify your Firebase configuration
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseSetupTest;
