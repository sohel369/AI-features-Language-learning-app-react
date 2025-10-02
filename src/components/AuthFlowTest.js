// Auth Flow Test Component - Step by step authentication testing
import React from 'react';
import { UserContext } from '../context/userContext';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthFlowTest = () => {
  const { user, userData, isAuthenticated, isLoading } = React.useContext(UserContext);
  const [firebaseUser, setFirebaseUser] = React.useState(null);
  const [firebaseLoading, setFirebaseLoading] = React.useState(true);
  const [testResults, setTestResults] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setFirebaseLoading(false);
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const results = [];
    
    // Test 1: Firebase Auth
    results.push({
      test: 'Firebase Auth Available',
      status: !!auth,
      message: auth ? 'Firebase auth object is available' : 'Firebase auth object is missing'
    });

    // Test 2: Firebase User
    results.push({
      test: 'Firebase User',
      status: !!firebaseUser,
      message: firebaseUser ? `User authenticated: ${firebaseUser.email}` : 'No Firebase user'
    });

    // Test 3: UserContext User
    results.push({
      test: 'UserContext User',
      status: !!user,
      message: user ? `UserContext user: ${user.email}` : 'No UserContext user'
    });

    // Test 4: Authentication State
    results.push({
      test: 'Authentication State',
      status: isAuthenticated,
      message: isAuthenticated ? 'User is authenticated' : 'User is not authenticated'
    });

    // Test 5: Loading State
    results.push({
      test: 'Loading State',
      status: !isLoading,
      message: isLoading ? 'Still loading...' : 'Loading complete'
    });

    // Test 6: User Match
    results.push({
      test: 'User Match',
      status: user?.uid === firebaseUser?.uid,
      message: user?.uid === firebaseUser?.uid ? 'Users match' : 'Users do not match'
    });

    // Test 7: Can Access Home
    results.push({
      test: 'Can Access Home',
      status: !!user && !isLoading,
      message: (!!user && !isLoading) ? 'Can access home page' : 'Cannot access home page'
    });

    setTestResults(results);
  }, [user, firebaseUser, isAuthenticated, isLoading]);

  const getStatusIcon = (status) => status ? '✅' : '❌';
  const getStatusColor = (status) => status ? 'text-green-300' : 'text-red-300';

  return (
    <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-600">
      <h3 className="text-xl font-bold text-white mb-4">🧪 Authentication Flow Test</h3>
      
      <div className="space-y-3">
        {testResults.map((result, index) => (
          <div key={index} className="bg-slate-700 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">{result.test}</span>
              <span className={getStatusColor(result.status)}>
                {getStatusIcon(result.status)}
              </span>
            </div>
            <p className="text-sm text-slate-400">{result.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-slate-700 rounded-lg">
        <h4 className="text-sm font-semibold text-cyan-300 mb-2">Summary</h4>
        <p className="text-sm text-slate-300">
          {testResults.filter(r => r.status).length} of {testResults.length} tests passing
        </p>
        <p className="text-sm text-slate-300">
          {testResults.every(r => r.status) ? '🎉 All tests passing!' : '⚠️ Some tests failing'}
        </p>
      </div>
    </div>
  );
};

export default AuthFlowTest;
