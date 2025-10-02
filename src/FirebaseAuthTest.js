// Firebase Authentication Test Component
import React, { useState, useEffect } from 'react';
import firebaseAuthService from './FirebaseAuthService.js';

const FirebaseAuthTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setMessage(`Welcome, ${user.email}!`);
      } else {
        setMessage('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Testing registration...');
      const result = await firebaseAuthService.register(email, password);
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        setEmail('');
        setPassword('');
      } else {
        setMessage(`❌ Registration failed: ${firebaseAuthService.getErrorMessage(result.code)}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(`❌ Registration error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Testing sign in...');
      const result = await firebaseAuthService.signIn(email, password);
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        setEmail('');
        setPassword('');
      } else {
        setMessage(`❌ Sign in failed: ${firebaseAuthService.getErrorMessage(result.code)}`);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setMessage(`❌ Sign in error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    const result = await firebaseAuthService.signOut();
    if (result.success) {
      setMessage('✅ Signed out successfully!');
    } else {
      setMessage('❌ Error signing out.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>🔥 Firebase Auth Test</h1>
        <p style={styles.subtitle}>Testing Email/Password Authentication</p>
        
        {user ? (
          <div style={styles.userInfo}>
            <h2 style={styles.welcome}>✅ Authenticated!</h2>
            <p style={styles.userEmail}>Email: {user.email}</p>
            <p style={styles.userId}>UID: {user.uid}</p>
            <button 
              onClick={handleSignOut} 
              disabled={loading}
              style={styles.signOutButton}
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="test@example.com"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="password123"
                  minLength="6"
                />
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  disabled={loading}
                  style={styles.registerButton}
                >
                  {loading ? 'Processing...' : 'Test Registration'}
                </button>
              </div>
            </form>

            <form onSubmit={handleSignIn} style={styles.form}>
              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  disabled={loading}
                  style={styles.signInButton}
                >
                  {loading ? 'Processing...' : 'Test Sign In'}
                </button>
              </div>
            </form>
          </div>
        )}

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}

        <div style={styles.info}>
          <h3>Test Instructions:</h3>
          <ol>
            <li>Enter a test email and password (min 6 chars)</li>
            <li>Click "Test Registration" to create a new account</li>
            <li>Click "Test Sign In" to sign in with existing credentials</li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
    padding: '20px'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: '#333',
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#666',
    fontSize: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '0.9rem'
  },
  input: {
    padding: '0.75rem',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  buttonGroup: {
    marginTop: '1rem'
  },
  registerButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: 'bold'
  },
  signInButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: 'bold'
  },
  message: {
    marginTop: '1rem',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  userInfo: {
    textAlign: 'center'
  },
  welcome: {
    color: '#28a745',
    marginBottom: '1rem',
    fontSize: '1.5rem'
  },
  userEmail: {
    color: '#333',
    marginBottom: '0.5rem',
    fontWeight: 'bold'
  },
  userId: {
    color: '#666',
    fontSize: '0.8rem',
    marginBottom: '1rem',
    wordBreak: 'break-all'
  },
  signOutButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  info: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '0.9rem'
  }
};

export default FirebaseAuthTest;

