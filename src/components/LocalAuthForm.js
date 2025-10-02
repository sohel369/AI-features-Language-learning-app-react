// Local Authentication Form Component (No Firebase)
import React, { useState, useEffect } from 'react';
import localAuthService from '../services/LocalAuthService.js';

const LocalAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = localAuthService.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setMessage(`Welcome, ${user.email}!`);
      } else {
        setMessage('');
      }
    });

    return () => unsubscribe();
  }, []);

  const checkServerStatus = async () => {
    const isHealthy = await localAuthService.checkServerHealth();
    setServerStatus(isHealthy ? 'online' : 'offline');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let result;
      if (isSignUp) {
        console.log('Attempting registration...');
        result = await localAuthService.register(email, password);
      } else {
        console.log('Attempting sign in...');
        result = await localAuthService.signIn(email, password);
      }

      if (result.success) {
        setMessage(result.message);
        setEmail('');
        setPassword('');
      } else {
        console.error('Authentication failed:', result);
        setMessage(localAuthService.getErrorMessage(result.code));
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    const result = await localAuthService.signOut();
    if (result.success) {
      setMessage('Signed out successfully!');
    } else {
      setMessage('Error signing out.');
    }
    setLoading(false);
  };

  const getServerStatusColor = () => {
    switch (serverStatus) {
      case 'online': return '#28a745';
      case 'offline': return '#dc3545';
      default: return '#ffc107';
    }
  };

  const getServerStatusText = () => {
    switch (serverStatus) {
      case 'online': return '🟢 Server Online';
      case 'offline': return '🔴 Server Offline';
      default: return '🟡 Checking...';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>🔐 Local Authentication Demo</h1>
        <p style={styles.subtitle}>No Firebase, No Paid APIs - Just Local Backend</p>
        
        {/* Server Status */}
        <div style={styles.serverStatus}>
          <span style={{ color: getServerStatusColor(), fontWeight: 'bold' }}>
            {getServerStatusText()}
          </span>
          {serverStatus === 'offline' && (
            <p style={styles.serverHelp}>
              Make sure to start the backend server: <code>cd server && npm start</code>
            </p>
          )}
        </div>
        
        {user ? (
          <div style={styles.userInfo}>
            <h2 style={styles.welcome}>✅ Authenticated!</h2>
            <p style={styles.userEmail}>Email: {user.email}</p>
            <p style={styles.userId}>User ID: {user.id}</p>
            <button 
              onClick={handleSignOut} 
              disabled={loading}
              style={styles.signOutButton}
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
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
                disabled={loading || serverStatus === 'offline'}
                style={styles.submitButton}
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </div>

            <div style={styles.toggleGroup}>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                style={styles.toggleButton}
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        )}

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}

        <div style={styles.info}>
          <h3>🚀 How to Test:</h3>
          <ol>
            <li>Start the backend server: <code>cd server && npm start</code></li>
            <li>Enter a test email and password (min 6 chars)</li>
            <li>Click "Sign Up" to create a new account</li>
            <li>Click "Sign In" to sign in with existing credentials</li>
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
  serverStatus: {
    textAlign: 'center',
    marginBottom: '1rem',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  },
  serverHelp: {
    fontSize: '0.8rem',
    color: '#dc3545',
    marginTop: '5px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
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
  submitButton: {
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
  toggleGroup: {
    marginTop: '1rem',
    textAlign: 'center'
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '0.9rem'
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
    backgroundColor: '#e7f3ff',
    borderRadius: '8px',
    fontSize: '0.9rem'
  }
};

export default LocalAuthForm;


