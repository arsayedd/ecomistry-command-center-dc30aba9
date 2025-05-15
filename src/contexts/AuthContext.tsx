
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Fixed import
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Define the AuthContext type
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// Create the Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("AuthContext: Session check result:", session ? "Session found" : "No session");

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
            console.log("AuthContext: User data loaded:", userData);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("AuthContext: Error checking session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("AuthContext: Auth state changed:", _event, session ? "Session exists" : "No session");
      
      if (session) {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          } else {
            // Convert the userData to match our User type
            setUser(userData as unknown as User);
            console.log("AuthContext: User data updated:", userData);
          }
        } catch (error) {
          console.error("AuthContext: Error updating user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ // Fixed method name
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("AuthContext: Sign in successful");
    } catch (error) {
      console.error("AuthContext: Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      
      // Sign up the user using Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "سيتم مراجعة الحساب من قبل الإدارة وتفعيله قريبًا.",
      });

      // We don't navigate here, as the user needs to verify email first
    } catch (error: any) {
      console.error("Error in signUp:", error.message);
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth/login');
      console.log("AuthContext: Sign out successful, redirecting to login");
    } catch (error) {
      console.error("AuthContext: Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auth state value
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use Auth context
export const useAuth = () => useContext(AuthContext);
