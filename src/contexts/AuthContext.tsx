
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
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string, department?: string) => {
    try {
      const { error: authError, data } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          department,
          permission_level: role === 'admin' ? 'full' : 'read'
        });
        
        if (profileError) throw profileError;
      }
      
      toast({ title: "تم إنشاء الحساب بنجاح", description: "يمكنك الآن تسجيل الدخول" });
      navigate('/auth/login');
    } catch (error: any) {
      toast({ 
        title: "فشل إنشاء الحساب", 
        description: error.message || "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive" 
      });
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
