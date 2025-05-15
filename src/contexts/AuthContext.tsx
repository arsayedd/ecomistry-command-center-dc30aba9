
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signUp: (email: string, password: string, fullName: string, role: string, department?: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendEmailConfirmation: (email: string) => Promise<void>;
  setUser: (user: User | null) => void; // Add the setUser method to the interface
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Only log sensitive actions
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          console.log('Auth event:', event, 'User:', currentSession?.user?.email);
        }
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: `مرحباً بك ${currentSession?.user?.email}`,
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "تم تسجيل الخروج",
            description: "نتمنى عودتك قريباً",
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession ? 'Session found' : 'No session found');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        });
        return { 
          success: false, 
          error: error.message 
        };
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      toast({
        title: "خطأ غير متوقع",
        description: error.message || "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
      return { 
        success: false, 
        error: error.message || "حدث خطأ غير متوقع" 
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: string, 
    department?: string
  ) => {
    try {
      setLoading(true);
      
      // Register the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            department
          },
        },
      });

      if (authError) {
        throw authError;
      }

      // If auth signup was successful, create a user record in the public.users table
      if (authData.user) {
        // Create entry in users table
        const { error: dbError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            email,
            full_name: fullName,
            role,
            department,
            permission_level: 'basic',
          },
        ]);

        if (dbError) {
          console.error('Error creating user record:', dbError);
          throw new Error('تم إنشاء الحساب ولكن فشل إنشاء بيانات المستخدم');
        }

        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "تم إنشاء حسابك بنجاح، يمكنك الآن تسجيل الدخول",
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
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
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendEmailConfirmation = async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
      });
    } catch (error: any) {
      console.error('Email confirmation error:', error);
      toast({
        title: "خطأ في إرسال رابط إعادة تعيين كلمة المرور",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, sendEmailConfirmation, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
