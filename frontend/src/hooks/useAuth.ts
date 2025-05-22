import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to initialize auth'),
        }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isLoading: false,
        error: null,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsAuthenticating(true);
      setState(prev => ({ ...prev, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign in';
      setState(prev => ({ ...prev, error: new Error(message) }));
      toast.error('Sign in failed', { description: message });
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: Record<string, unknown>) => {
    try {
      setIsAuthenticating(true);
      setState(prev => ({ ...prev, error: null }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign up';
      setState(prev => ({ ...prev, error: new Error(message) }));
      toast.error('Sign up failed', { description: message });
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = async () => {
    try {
      setIsAuthenticating(true);
      setState(prev => ({ ...prev, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign out';
      setState(prev => ({ ...prev, error: new Error(message) }));
      toast.error('Sign out failed', { description: message });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsAuthenticating(true);
      setState(prev => ({ ...prev, error: null }));
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during password reset';
      setState(prev => ({ ...prev, error: new Error(message) }));
      toast.error('Password reset failed', { description: message });
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    ...state,
    isAuthenticating,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
} 