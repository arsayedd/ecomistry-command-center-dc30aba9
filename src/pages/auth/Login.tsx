
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'يجب أن يكون بريد إلكتروني صالح' }),
  password: z.string().min(6, { message: 'يجب أن تكون كلمة المرور على الأقل 6 أحرف' }),
});

export default function Login() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setAuthError(null);
      const result = await signIn(values.email, values.password);
      
      if (!result.success) {
        setAuthError(result.error || 'فشل تسجيل الدخول');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      setAuthError(error.message || 'حدث خطأ أثناء محاولة تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
            <CardDescription className="mt-2">أدخل بياناتك لتسجيل الدخول إلى حسابك</CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {authError}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="أدخل بريدك الإلكتروني" 
                          {...field} 
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">كلمة المرور</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="أدخل كلمة المرور" 
                          {...field} 
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      جاري تسجيل الدخول...
                    </div>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            <Button variant="link" onClick={() => navigate('/auth/register')} className="w-full sm:w-auto">
              إنشاء حساب جديد
            </Button>
            <Button variant="link" onClick={() => navigate('/auth/forgot-password')} className="w-full sm:w-auto">
              نسيت كلمة المرور؟
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
