import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !fullName || !role) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return false;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('البريد الإلكتروني غير صحيح');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      console.log("Attempting to register with:", { email, fullName });
      // Update the signUp call to use only the required parameters
      await signUp(email, password, fullName);
      console.log("Registration successful");
      setSuccess(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      // The error is handled in AuthContext
      setError(error.message || 'حدث خطأ أثناء إنشاء الحساب');
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
            <CardTitle className="text-2xl font-bold">إنشاء حساب جديد</CardTitle>
            <CardDescription>أدخل بياناتك لإنشاء حساب جديد</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>خطأ</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertTitle className="text-green-800">تم إنشاء الحساب بنجاح</AlertTitle>
                  <AlertDescription className="text-green-700">
                    يمكنك الآن تسجيل الدخول باستخدام بيانات حسابك.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input 
                  id="fullName" 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد أحمد"
                  required
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@ecomistry.com"
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">الدور الوظيفي</Label>
                <Select 
                  value={role} 
                  onValueChange={setRole}
                  required
                >
                  <SelectTrigger id="role" className="text-right">
                    <SelectValue placeholder="اختر الدور الوظيفي" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم</SelectItem>
                    <SelectItem value="admin">مسؤول</SelectItem>
                    <SelectItem value="manager">مدير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">القسم (اختياري)</Label>
                <Input 
                  id="department" 
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="قسم المبيعات"
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
                {isLoading ? 'جاري التسجيل...' : 'إنشاء حساب'}
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
