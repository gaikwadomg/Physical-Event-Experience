// ═══════════════════════════════════════════════════════
//  AuthContext — Firebase Google Auth + Guest Mode
// ═══════════════════════════════════════════════════════
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(
    () => sessionStorage.getItem('stadium-guest') === 'true'
  );

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      // If user signs in, clear guest state
      if (firebaseUser) {
        setIsGuest(false);
        sessionStorage.removeItem('stadium-guest');
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsGuest(false);
      sessionStorage.removeItem('stadium-guest');
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
    sessionStorage.setItem('stadium-guest', 'true');
  }, []);

  // User is "authenticated" if they have a Firebase user OR are a guest
  const isAuthenticated = !!user || isGuest;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        isAuthenticated,
        loginWithGoogle,
        logout,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
