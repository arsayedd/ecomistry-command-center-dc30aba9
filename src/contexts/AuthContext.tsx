import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the User type
export type User = {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  permission_level: number;
  created_at?: string;
  updated_at?: string;
};

// Create the AuthContext
export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  signOut: () => Promise<void>;
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
          setUser(userData as User);
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
          setUser(userData as User);
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

  // Auth state value
  const value = {
    user,
    setUser,
    isLoading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// Hook to use Auth context
export const useAuth = () => useContext(AuthContext);
