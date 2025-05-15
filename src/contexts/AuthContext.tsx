
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

// Define the AuthContext type
export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signUp?: (email: string, password: string, userData: Partial<User>) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  signOut: async () => {}
});

// Create the Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          // Convert the userData to match our User type
          setUser(userData as unknown as User);
        }
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for changes on auth state
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          // Convert the userData to match our User type
          setUser(userData as unknown as User);
        }
      } else {
        setUser(null);
      }
    });
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  };

  // Mock signUp for development
  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
          }
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  // Auth state value
  const value = {
    user,
    setUser,
    isLoading,
    signOut,
    signUp
  }

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// Hook to use Auth context
export const useAuth = () => useContext(AuthContext);
