// Simple Authentication Form Component
import React, { useState, useEffect } from 'react';
import firebaseAuthService from './FirebaseAuthService.js';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let result;
      if (isSignUp) {
        console.log('Attempting registration...');
        result = await firebaseAuthService.register(email, password);
      } else {
        console.log('Attempting sign in...');
        result = await firebaseAuthService.signIn(email, password);
      }

      if (result.success) {
        setMessage(result.message);
        setEmail('');
        setPassword('');
      } else {
        console.error('Authentication failed:', result);
        setMessage(firebaseAuthService.getErrorMessage(result.code));
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
    const result = await firebaseAuthService.signOut();
    if (result.success) {
      setMessage('Signed out successfully!');
    } else {
      setMessage('Error signing out.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Firebase Authentication Demo</h1>
        
        {user ? (
          <div style={styles.userInfo}>
            <h2 style={styles.welcome}>Welcome!</h2>
            <p style={styles.userEmail}>Email: {user.email}</p>
            <p style={styles.userId}>User ID: {user.uid}</p>
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
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                minLength="6"
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={loading}
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
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '1.5rem'
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
    border: '1px solid #ddd',
    borderRadius: '4px',
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
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
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
    padding: '0.75rem',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '0.9rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  userInfo: {
    textAlign: 'center'
  },
  welcome: {
    color: '#333',
    marginBottom: '1rem'
  },
  userEmail: {
    color: '#666',
    marginBottom: '0.5rem'
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
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};

export default AuthForm;
