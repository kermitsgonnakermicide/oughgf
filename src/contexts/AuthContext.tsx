import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Safety timeout in case the session request hangs due to network/env issues
    const loadingSafetyTimeout = setTimeout(() => setIsLoading(false), 5000);

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          // eslint-disable-next-line no-console
          console.error('Error fetching session:', error);
        }

        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Unexpected error during session initialization:', err);
      } finally {
        setIsLoading(false);
        clearTimeout(loadingSafetyTimeout);
      }
    };

    void getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error handling auth state change:', err);
      }
    });

    return () => {
      clearTimeout(loadingSafetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Handle the case where no profile is found (PGRST116 error)
        if (error.code === 'PGRST116') {
          setUser(null);
          return;
        }
        throw error;
      }

      if (profile) {
        setUser({
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar || undefined
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading user profile:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user.id);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Check if username already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingProfile) {
        setIsLoading(false);
        return false;
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            avatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`
          });

        if (profileError) throw profileError;

        await loadUserProfile(data.user.id);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};