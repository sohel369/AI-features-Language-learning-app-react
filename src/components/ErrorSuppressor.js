import { useEffect } from 'react';

// Component to suppress Firebase console errors in development
export default function ErrorSuppressor() {
  useEffect(() => {
    // Suppress Firebase connection errors in development
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.error = (...args) => {
        const message = args[0]?.toString() || '';
        
        // Suppress Firebase/Firestore connection errors
        if (
          message.includes('WebChannelConnection') ||
          message.includes('Firestore') ||
          message.includes('firestore.googleapis.com') ||
          message.includes('400 (Bad Request)') ||
          message.includes('transport errored')
        ) {
          return; // Suppress these errors
        }
        
        // Show other errors normally
        originalError.apply(console, args);
      };
      
      console.warn = (...args) => {
        const message = args[0]?.toString() || '';
        
        // Suppress Firebase warnings
        if (
          message.includes('WebChannelConnection') ||
          message.includes('Firestore') ||
          message.includes('firestore.googleapis.com')
        ) {
          return; // Suppress these warnings
        }
        
        // Show other warnings normally
        originalWarn.apply(console, args);
      };
      
      // Cleanup function
      return () => {
        console.error = originalError;
        console.warn = originalWarn;
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
