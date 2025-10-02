// Local Authentication Service (No Firebase, No Paid APIs)
class LocalAuthService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api/auth';
    this.token = localStorage.getItem('authToken');
    this.user = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get authentication headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  // Register a new user
  async register(email, password) {
    try {
      console.log('Attempting to register user with email:', email);
      
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Registration successful for user:', data.user.email);
        this.setToken(data.token);
        this.user = data.user;
        return {
          success: true,
          user: data.user,
          message: data.message
        };
      } else {
        console.error('Registration failed:', data.error);
        return {
          success: false,
          error: data.error,
          code: 'registration-failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error. Please check if the server is running.',
        code: 'network-error'
      };
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      console.log('Attempting to sign in user with email:', email);
      
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Sign in successful for user:', data.user.email);
        this.setToken(data.token);
        this.user = data.user;
        return {
          success: true,
          user: data.user,
          message: data.message
        };
      } else {
        console.error('Sign in failed:', data.error);
        return {
          success: false,
          error: data.error,
          code: 'signin-failed'
        };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'Network error. Please check if the server is running.',
        code: 'network-error'
      };
    }
  }

  // Sign out user
  async signOut() {
    try {
      console.log('Signing out user');
      
      // Call logout endpoint (optional)
      if (this.token) {
        try {
          await fetch(`${this.baseURL}/logout`, {
            method: 'POST',
            headers: this.getAuthHeaders()
          });
        } catch (error) {
          console.warn('Logout endpoint error:', error);
        }
      }

      // Clear local data
      this.setToken(null);
      this.user = null;
      
      console.log('Sign out successful');
      return {
        success: true,
        message: 'Sign out successful!'
      };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: 'Sign out failed'
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get current user from server
  async getCurrentUserFromServer() {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        this.user = data.user;
        return data.user;
      } else {
        // Token is invalid, clear it
        this.setToken(null);
        this.user = null;
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Listen to authentication state changes (simplified for local auth)
  onAuthStateChanged(callback) {
    // For local auth, we'll check the current state
    const checkAuthState = () => {
      const isAuth = this.isAuthenticated();
      callback(isAuth ? this.user : null);
    };

    // Check immediately
    checkAuthState();

    // Return a cleanup function
    return () => {
      // No cleanup needed for local auth
    };
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      'registration-failed': 'Registration failed. Please try again.',
      'signin-failed': 'Sign in failed. Please check your credentials.',
      'network-error': 'Cannot connect to server. Please make sure the backend is running.',
      'user-exists': 'User with this email already exists.',
      'invalid-credentials': 'Invalid email or password.',
      'server-error': 'Server error. Please try again later.'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }

  // Check server health
  async checkServerHealth() {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const localAuthService = new LocalAuthService();
export default localAuthService;

