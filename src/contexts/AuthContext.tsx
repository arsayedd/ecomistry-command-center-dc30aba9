
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
  sendEmailConfirmation: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // أولاً: قم بإعداد مستمع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // ثانياً: تحقق من وجود جلسة حالية
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Current session:', currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // معالجة خطأ البريد الإلكتروني غير المؤكد بشكل خاص
        if (error.message.includes('Email not confirmed') || error.message.includes('email not confirmed')) {
          toast({ 
            title: "البريد الإلكتروني غير مؤكد", 
            description: "يرجى التحقق من بريدك الإلكتروني وتأكيد الحساب أو إعادة إرسال رسالة التأكيد",
            variant: "destructive" 
          });
          throw new Error("البريد الإلكتروني غير مؤكد");
        } else {
          toast({ 
            title: "فشل تسجيل الدخول", 
            description: error.message === 'Invalid login credentials' 
              ? "بيانات الدخول غير صحيحة" 
              : error.message || "حدث خطأ أثناء تسجيل الدخول",
            variant: "destructive" 
          });
          throw error;
        }
      }
      
      console.log('Login successful, navigating to /dashboard');
      toast({ title: "تم تسجيل الدخول بنجاح", description: "مرحبًا بك في نظام Ecomistry" });

      // تأخير قليل للسماح بتحديث حالة المصادقة قبل التوجيه
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (error: any) {
      console.error("Login error:", error);
      // الخطأ تم التعامل معه في المحاولة/الخطأ السابق
    }
  };

  const sendEmailConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        if (error.message.includes('For security purposes')) {
          toast({ 
            title: "تم تقييد عملية إعادة الإرسال", 
            description: "لأسباب أمنية، لا يمكنك طلب إعادة إرسال رسالة التأكيد الآن. يرجى المحاولة بعد دقيقة.",
            variant: "destructive" 
          });
        } else {
          toast({ 
            title: "فشل إعادة إرسال رسالة التأكيد", 
            description: error.message || "حدث خطأ أثناء إعادة إرسال رسالة التأكيد",
            variant: "destructive" 
          });
        }
        throw error;
      }
      
      toast({ 
        title: "تم إرسال رسالة التأكيد", 
        description: "يرجى التحقق من بريدك الإلكتروني" 
      });
    } catch (error: any) {
      console.error("Email confirmation error:", error);
      // الخطأ تم التعامل معه في المحاولة/الخطأ السابق
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string, department?: string) => {
    try {
      console.log('Attempting to sign up:', email);
      // التحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("البريد الإلكتروني غير صحيح");
      }

      // التحقق من كلمة المرور
      if (password.length < 6) {
        throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      }

      // إنشاء حساب المستخدم
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
      
      console.log('User created:', data.user?.id);
      
      // إنشاء سجل ملف المستخدم إذا تم إنشاء المستخدم
      if (data.user) {
        try {
          // إدراج في جدول المستخدمين بعملية إدراج واحدة
          const { error: profileError } = await supabase.from('users').insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
            department: department || null,
            permission_level: role === 'admin' ? 'full' : 'read'
          });
          
          if (profileError) {
            console.error("خطأ إنشاء الملف:", profileError);
            
            // التعامل مع أنواع مختلفة من الأخطاء برسائل أكثر تحديدًا
            if (profileError.message && profileError.message.includes('infinite recursion')) {
              throw new Error("تم إنشاء الحساب ولكن هناك مشكلة في إعدادات قاعدة البيانات. يرجى تسجيل الدخول لاحقًا");
            } else if (profileError.code === '23505') {
              // انتهاك قيد فريد
              throw new Error("البريد الإلكتروني مستخدم بالفعل");
            } else {
              throw new Error("فشل إنشاء ملف المستخدم: " + profileError.message);
            }
          }
        } catch (profileError: any) {
          console.error("استثناء إنشاء الملف:", profileError);
          throw profileError;
        }
      }
      
      // عرض رسالة مناسبة بناءً على ما إذا كان التأكيد عبر البريد الإلكتروني مطلوبًا
      if (data?.user && !data?.session) {
        toast({ 
          title: "تم إنشاء الحساب بنجاح", 
          description: "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك وتأكيد حسابك" 
        });
      } else {
        toast({ 
          title: "تم إنشاء الحساب بنجاح", 
          description: "يمكنك الآن تسجيل الدخول" 
        });
      }
      
      navigate('/auth/login');
    } catch (error: any) {
      console.error("خطأ التسجيل:", error);
      
      // رسائل خطأ أكثر تفصيلاً
      let errorMessage = error.message || "حدث خطأ أثناء إنشاء الحساب";
      
      // التعامل مع رموز خطأ Supabase المحددة
      if (error.code === '23505') {
        errorMessage = "البريد الإلكتروني مستخدم بالفعل";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "البريد الإلكتروني مستخدم بالفعل";
      } else if (error.message && error.message.includes('email')) {
        errorMessage = "البريد الإلكتروني غير صحيح أو مستخدم بالفعل";
      }
      
      toast({ 
        title: "فشل إنشاء الحساب", 
        description: errorMessage,
        variant: "destructive" 
      });
      
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
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
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, sendEmailConfirmation }}>
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
