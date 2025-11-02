import { supabase } from '@/integrations/supabase/client';
import type { 
  AuthError, 
  AuthResponse, 
  OAuthResponse, 
  User,
  Session
} from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

class AuthService {
  /**
   * Sign up a new user with email and password
   */
  async signUp({ email, password, fullName, phone }: SignUpData): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { user: null, session: null, error };
      }

      return { 
        user: data.user, 
        session: data.session, 
        error: null 
      };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { 
        user: null, 
        session: null, 
        error: error as AuthError 
      };
    }
  }

  /**
   * Sign in an existing user with email and password
   */
  async signIn({ email, password }: SignInData): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { user: null, session: null, error };
      }

      return { 
        user: data.user, 
        session: data.session, 
        error: null 
      };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { 
        user: null, 
        session: null, 
        error: error as AuthError 
      };
    }
  }

  /**
   * Sign in with OTP (One-Time Password) sent to email or phone
   */
  async signInWithOTP(emailOrPhone: string): Promise<{ error: AuthError | null }> {
    try {
      // Check if input is email or phone
      const isEmail = emailOrPhone.includes('@');
      
      if (isEmail) {
        const { error } = await supabase.auth.signInWithOtp({
          email: emailOrPhone,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        return { error };
      } else {
        // For phone, ensure it's properly formatted
        const { error } = await supabase.auth.signInWithOtp({
          phone: emailOrPhone,
        });
        return { error };
      }
    } catch (error) {
      console.error('OTP sign in error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(emailOrPhone: string, token: string): Promise<AuthResult> {
    try {
      const isEmail = emailOrPhone.includes('@');
      
      let data, error;
      
      if (isEmail) {
        const result = await supabase.auth.verifyOtp({
          email: emailOrPhone,
          token,
          type: 'email',
        });
        data = result.data;
        error = result.error;
      } else {
        const result = await supabase.auth.verifyOtp({
          phone: emailOrPhone,
          token,
          type: 'sms',
        });
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('OTP verification error:', error);
        return { user: null, session: null, error };
      }

      return { 
        user: data.user, 
        session: data.session, 
        error: null 
      };
    } catch (error) {
      console.error('Unexpected OTP verification error:', error);
      return { 
        user: null, 
        session: null, 
        error: error as AuthError 
      };
    }
  }

  /**
   * Sign in with OAuth provider (Google, etc.)
   */
  async signInWithOAuth(provider: 'google' | 'facebook' | 'github'): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error(`${provider} OAuth error:`, error);
      }

      return { error };
    } catch (error) {
      console.error(`Unexpected ${provider} OAuth error:`, error);
      return { error: error as AuthError };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Get the current user session
   */
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Get session error:', error);
        return { session: null, error };
      }

      return { session: data.session, error: null };
    } catch (error) {
      console.error('Unexpected get session error:', error);
      return { session: null, error: error as AuthError };
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Get user error:', error);
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Unexpected get user error:', error);
      return { user: null, error: error as AuthError };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Update password error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Unexpected update password error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Update user profile metadata
   */
  async updateProfile(data: { full_name?: string; phone?: string; avatar_url?: string }): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      });

      if (error) {
        console.error('Update profile error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Unexpected update profile error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

// Export a singleton instance
export const authService = new AuthService();
