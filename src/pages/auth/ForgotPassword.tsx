
import React, { useState } from 'react';
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
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { sendEmailConfirmation } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await sendEmailConfirmation(values.email);
      setSuccess(true);
      
      // Reset the form
      form.reset();
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء محاولة إرسال رابط إعادة تعيين كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">نسيت كلمة المرور</CardTitle>
            <CardDescription>أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من البريد الوارد.
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل بريدك الإلكتروني" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري إرسال الرابط...
                    </div>
                  ) : (
                    'إرسال رابط إعادة تعيين كلمة المرور'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="w-full" onClick={() => navigate('/auth/login')}>
              العودة إلى صفحة تسجيل الدخول
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
