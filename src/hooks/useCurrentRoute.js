// useCurrentRoute Hook - Get current route information
import { useLocation } from 'react-router-dom';

const useCurrentRoute = () => {
  const location = useLocation();
  
  return {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    state: location.state,
    // Helper methods
    isHome: location.pathname === '/home',
    isLogin: location.pathname === '/',
    isProfile: location.pathname === '/profile',
    isDiagnostic: location.pathname === '/diagnostic',
    isSetupTest: location.pathname === '/setup-test',
    // Get route name
    getRouteName: () => {
      switch (location.pathname) {
        case '/':
          return 'Login';
        case '/home':
          return 'Home';
        case '/profile':
          return 'Profile';
        case '/diagnostic':
          return 'Firebase Diagnostic';
        case '/setup-test':
          return 'Setup Test';
        default:
          return 'Unknown';
      }
    },
    // Check if route is protected
    isProtected: () => {
      const protectedRoutes = ['/home', '/profile'];
      return protectedRoutes.includes(location.pathname);
    }
  };
};

export default useCurrentRoute;
