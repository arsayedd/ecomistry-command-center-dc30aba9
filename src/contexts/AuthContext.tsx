
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string, department?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
      toast({ title: "تم تسجيل الدخول بنجاح", description: "مرحبًا بك في نظام Ecomistry" });
    } catch (error: any) {
      toast({ 
        title: "فشل تسجيل الدخول", 
        description: error.message || "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive" 
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string, department?: string) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("البريد الإلكتروني غير صحيح");
      }

      // Validate password
      if (password.length < 6) {
        throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      }

      // Create the user account
      const { error: authError, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      if (authError) throw authError;
      
      // Create user profile record if user was created
      if (data.user) {
        // Insert into users table with a single INSERT operation
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          department: department || null,
          permission_level: role === 'admin' ? 'full' : 'read'
        });
        
        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw new Error("فشل إنشاء ملف المستخدم: " + profileError.message);
        }
      }
      
      toast({ title: "تم إنشاء الحساب بنجاح", description: "يمكنك الآن تسجيل الدخول" });
      navigate('/auth/login');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({ 
        title: "فشل إنشاء الحساب", 
        description: error.message || "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive" 
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
      toast({ title: "تم تسجيل الخروج بنجاح" });
    } catch (error: any) {
      toast({ 
        title: "فشل تسجيل الخروج", 
        description: error.message || "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive" 
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
