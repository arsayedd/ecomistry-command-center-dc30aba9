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
    console.log('Setting up Auth Provider...');
    
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
      if (!email || !password) {
        toast({ 
          title: "بيانات غير كاملة", 
          description: "الرجاء إدخال البريد الإلكتروني وكلمة المرور",
          variant: "destructive" 
        });
        throw new Error("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      }

      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error details:', error);
        // معالجة خطأ البريد الإلكتروني غير المؤكد بشكل خاص
        if (error.message.includes('Email not confirmed') || error.message.includes('email not confirmed')) {
          toast({ 
            title: "البريد الإلكتروني غير مؤكد", 
            description: "يرجى التحقق من بريدك الإلكتروني وتأكيد الحساب أو إعادة إرسال رسالة التأكيد",
            variant: "destructive" 
          });
          throw new Error("البريد الإلكتروني غير مؤكد");
        } else if (error.message.includes('Email logins are disabled')) {
          toast({ 
            title: "تسجيل الدخول بالبريد الإلكتروني معطل", 
            description: "تسجيل الدخول بالبريد الإلكتروني معطل حاليًا. يرجى الاتصال بالمسؤول لتفعيله.",
            variant: "destructive" 
          });
          throw new Error("تسجيل الدخول بالبريد الإلكتروني معطل");
        } else if (error.message.includes('Invalid login credentials')) {
          toast({ 
            title: "بيانات الدخول غير صحيحة", 
            description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
            variant: "destructive" 
          });
          throw new Error("بيانات الدخول غير صحيحة");
        } else {
          toast({ 
            title: "فشل تسجيل الدخول", 
            description: error.message || "حدث خطأ أثناء تسجيل الدخول",
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
      }, 1000);
    } catch (error: any) {
      console.error("Login error:", error);
      throw error; // إعادة رمي الخطأ للتعامل معه في مكون تسجيل الدخول
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
        toast({ 
          title: "البريد الإلكتروني غير صحيح", 
          description: "يرجى إدخال بريد إلكتروني صالح",
          variant: "destructive" 
        });
        throw new Error("البريد الإلكتروني غير صحيح");
      }

      // التحقق من كلمة المرور
      if (password.length < 6) {
        toast({ 
          title: "كلمة المرور قصيرة جدًا", 
          description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
          variant: "destructive" 
        });
        throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      }

      // إنشاء حساب المستخدم
      console.log('Creating auth account with user data:', { email, fullName, role });
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
      
      if (authError) {
        console.error('Sign up auth error details:', authError);
        
        if (authError.message.includes('Email signups are disabled')) {
          toast({ 
            title: "تسجيل الحسابات معطل", 
            description: "تسجيل الحسابات بالبريد الإلكتروني معطل. يرجى الاتصال بالمسؤول لتفعيله.",
            variant: "destructive" 
          });
          throw new Error("تسجيل الحسابات بالبريد الإلكتروني معطل. يرجى الاتصال بالمسؤول لتفعيله.");
        }
        
        toast({ 
          title: "فشل إنشاء الحساب", 
          description: authError.message || "حدث خطأ أثناء إنشاء الحساب",
          variant: "destructive" 
        });
        throw authError;
      }
      
      console.log('User auth created:', data.user?.id);
      
      // إنشاء سجل ملف المستخدم إذا تم إنشاء المستخدم
      if (data.user) {
        try {
          console.log('Creating user profile with data:', { 
            id: data.user.id, 
            email, 
            fullName, 
            role, 
            department 
          });
          
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
            console.error("Profile error details:", JSON.stringify(profileError));
            
            // معالجة أخطاء محددة
            let errorMessage = "فشل إنشاء ملف المستخدم";
            
            if (profileError.code === '23505') {
              errorMessage = "البريد الإلكتروني مستخدم بالفعل";
            } 

            toast({ 
              title: "تنبيه", 
              description: "تم إنشاء الحساب ولكن هناك مشكلة في إنشاء الملف الشخصي. سيتم حل هذه المشكلة قريبًا.",
              variant: "default" 
            });
            
            // تسجيل الخطأ ولكن لا نوقف العملية
            console.warn("تم إنشاء الحساب ولكن هناك مشكلة في إنشاء الملف الشخصي:", errorMessage);
          }
        } catch (profileError: any) {
          console.error("استثناء إنشاء الملف:", profileError);
          
          // تسجيل الخطأ ولكن السماح للمستخدم بالاستمرار
          toast({ 
            title: "تنبيه", 
            description: "تم إنشاء الحساب ولكن هناك مشكلة في إنشاء الملف الشخصي. سيتم حل هذه المشكلة قريبًا.",
            variant: "default" 
          });
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
