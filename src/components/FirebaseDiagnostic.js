// Firebase Diagnostic Component
import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const FirebaseDiagnostic = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date() }]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Firebase Config
    try {
      addResult('Firebase Config', 'info', 'Checking Firebase configuration...');
      console.log('Auth object:', auth);
      console.log('DB object:', db);
      addResult('Firebase Config', 'success', 'Firebase objects initialized');
    } catch (error) {
      addResult('Firebase Config', 'error', `Config error: ${error.message}`);
    }

    // Test 2: Auth Object
    try {
      addResult('Auth Object', 'info', 'Testing auth object...');
      if (auth && auth.app) {
        addResult('Auth Object', 'success', 'Auth object is valid');
      } else {
        addResult('Auth Object', 'error', 'Auth object is invalid');
      }
    } catch (error) {
      addResult('Auth Object', 'error', `Auth error: ${error.message}`);
    }

    // Test 3: Firestore Object
    try {
      addResult('Firestore Object', 'info', 'Testing Firestore object...');
      if (db && db.app) {
        addResult('Firestore Object', 'success', 'Firestore object is valid');
      } else {
        addResult('Firestore Object', 'error', 'Firestore object is invalid');
      }
    } catch (error) {
      addResult('Firestore Object', 'error', `Firestore error: ${error.message}`);
    }

    // Test 4: Check Authentication Configuration
    try {
      addResult('Auth Configuration', 'info', 'Checking authentication configuration...');
      
      if (error.code === 'auth/configuration-not-found') {
        addResult('Auth Configuration', 'error', '❌ Authentication not enabled in Firebase Console');
        addResult('Auth Configuration', 'info', '🔧 SOLUTION: Go to Firebase Console → Authentication → Sign-in method → Enable Email/Password');
        return;
      }
    } catch (error) {
      // Continue with registration test
    }

    // Test 5: Test Registration
    try {
      addResult('Test Registration', 'info', 'Testing user registration...');
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      addResult('Test Registration', 'success', `Registration successful: ${userCredential.user.uid}`);
      
      // Test Firestore write
      try {
        await setDoc(doc(db, 'test', 'test-doc'), {
          message: 'Firebase connection working!',
          timestamp: new Date(),
          userId: userCredential.user.uid
        });
        addResult('Firestore Write', 'success', 'Firestore write successful');
      } catch (firestoreError) {
        addResult('Firestore Write', 'error', `Firestore write failed: ${firestoreError.message}`);
      }
      
    } catch (error) {
      addResult('Test Registration', 'error', `Registration failed: ${error.code} - ${error.message}`);
      
      if (error.code === 'auth/configuration-not-found') {
        addResult('Auth Setup Required', 'error', '❌ Authentication not enabled in Firebase Console');
        addResult('Auth Setup Required', 'info', '🔧 Go to: https://console.firebase.google.com');
        addResult('Auth Setup Required', 'info', '🔧 Select project: reactlanguageapp');
        addResult('Auth Setup Required', 'info', '🔧 Go to Authentication → Sign-in method');
        addResult('Auth Setup Required', 'info', '🔧 Enable Email/Password provider');
        addResult('Auth Setup Required', 'info', '🔧 Click Save');
      }
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Diagnostic</h1>
        
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50"
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Firebase Diagnostics'}
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
            Click "Run Firebase Diagnostics" to test your Firebase connection
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseDiagnostic;
