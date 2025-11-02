import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName?: string, phone?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithOTP: (emailOrPhone: string) => Promise<{ error: any }>;
  verifyOTP: (emailOrPhone: string, token: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { session, error } = await authService.getSession();
        if (!error && session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: authListener } = authService.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string, phone?: string) => {
    setIsLoading(true);
    try {
      const { user, session, error } = await authService.signUp({
        email,
        password,
        fullName,
        phone,
      });

      if (!error) {
        setUser(user);
        setSession(session);
      }

      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, session, error } = await authService.signIn({
        email,
        password,
      });

      if (!error) {
        setUser(user);
        setSession(session);
      }

      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithOTP = async (emailOrPhone: string) => {
    setIsLoading(true);
    try {
      const { error } = await authService.signInWithOTP(emailOrPhone);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (emailOrPhone: string, token: string) => {
    setIsLoading(true);
    try {
      const { user, session, error } = await authService.verifyOTP(emailOrPhone, token);

      if (!error) {
        setUser(user);
        setSession(session);
      }

      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await authService.signInWithOAuth('google');
      return { error };
    } finally {
      // OAuth redirects, so loading state will be reset on return
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await authService.signOut();
      
      if (!error) {
        setUser(null);
        setSession(null);
      }

      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await authService.resetPassword(email);
    return { error };
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInWithOTP,
    verifyOTP,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
