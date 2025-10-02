// useAuth Hook for Authentication State
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth - Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('useAuth - Auth state changed:', user);
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log('useAuth - Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  return { user, loading };
};

export default useAuth;
