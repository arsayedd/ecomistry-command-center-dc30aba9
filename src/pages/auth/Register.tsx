
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // إنشاء حساب جديد مع دور "admin" افتراضياً
      await signUp(email, password, fullName, 'admin');
    } finally {
      setIsLoading(false);
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
            <CardTitle className="text-2xl font-bold">تسجيل حساب جديد</CardTitle>
            <CardDescription>أدخل بياناتك لإنشاء حساب في نظام Ecomistry</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم بالكامل</Label>
                <Input 
                  id="fullName" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="text-right"
                />
              </div>
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
                <Label htmlFor="password">كلمة المرور</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-right"
                />
              </div>
              <p className="text-sm text-gray-500 mt-4 text-right">
                * سيتم تسجيلك كمدير للنظام. يمكنك إضافة المستخدمين الآخرين لاحقاً من لوحة التحكم.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-6">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 gap-2" 
                disabled={isLoading}
              >
                {isLoading ? 'جاري التسجيل...' : 'تسجيل'}
                <UserPlus size={18} />
              </Button>
              <div className="text-center text-sm">
                لديك حساب بالفعل؟{' '}
                <Link to="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
                  تسجيل الدخول
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
