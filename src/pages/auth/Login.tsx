
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, MailCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);
  const { signIn, sendEmailConfirmation } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailConfirmationNeeded(false);
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      // تحقق مما إذا كانت رسالة الخطأ تتعلق بالبريد الإلكتروني غير المؤكد
      if (error.message && (
          error.message.includes('البريد الإلكتروني غير مؤكد') || 
          error.message.includes('Email not confirmed')
        )) {
        setEmailConfirmationNeeded(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) return;
    
    setIsResendingEmail(true);
    try {
      await sendEmailConfirmation(email);
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">Ecomistry</h1>
          <p className="text-gray-600 mt-2">نظام الإدارة الداخلي</p>
        </div>
        
        <Card className="w-full shadow-lg border-green-100">
          <CardHeader className="space-y-1 text-center border-b pb-6">
            <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
            <CardDescription>أدخل بيانات حسابك للوصول إلى النظام</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {emailConfirmationNeeded && (
                <Alert className="bg-amber-50 border-amber-200">
                  <MailCheck className="h-5 w-5 text-amber-600" />
                  <AlertTitle className="text-amber-800 mr-2">البريد الإلكتروني غير مؤكد</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك
                    <Button 
                      variant="link" 
                      onClick={handleResendConfirmation}
                      disabled={isResendingEmail}
                      className="p-0 mr-2 h-auto text-green-600 hover:text-green-700"
                    >
                      {isResendingEmail ? 'جاري إرسال رسالة التأكيد...' : 'إعادة إرسال رسالة التأكيد'}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@ecomistry.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link to="/auth/reset-password" className="text-sm text-green-600 hover:text-green-700">
                    نسيت كلمة المرور؟
                  </Link>
                  <Label htmlFor="password">كلمة المرور</Label>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-right"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-6">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 gap-2" 
                disabled={isLoading}
              >
                {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول'}
                <LogIn size={18} />
              </Button>
              <div className="text-center text-sm">
                ليس لديك حساب؟{' '}
                <Link to="/auth/register" className="text-green-600 hover:text-green-700 font-medium">
                  تواصل مع الإدارة
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
