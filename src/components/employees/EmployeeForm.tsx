
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

// Form schema for validation
const formSchema = z.object({
  fullName: z.string().min(2, { message: 'الاسم يجب أن يكون أكثر من حرفين' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون أكثر من 6 أحرف' }),
  department: z.string().min(1, { message: 'يرجى اختيار القسم' }),
  jobTitle: z.string().min(1, { message: 'يرجى إدخال المسمى الوظيفي' }),
  employmentType: z.enum(['full_time', 'part_time', 'freelancer', 'per_piece'], { 
    required_error: 'يرجى اختيار نوع التعاقد' 
  }),
  salaryType: z.enum(['monthly', 'hourly', 'per_task'], { 
    required_error: 'يرجى اختيار نوع المرتب' 
  }),
  salaryAmount: z.number().positive({ message: 'يجب أن تكون القيمة أكبر من صفر' }),
  commissionType: z.enum(['percentage', 'fixed', 'none'], { 
    required_error: 'يرجى اختيار نوع العمولة' 
  }),
  commissionValue: z.number().optional(),
  status: z.enum(['active', 'inactive', 'trial'], { 
    required_error: 'يرجى اختيار الحالة' 
  }),
  accessRights: z.enum(['view', 'add', 'edit', 'full_manage'], { 
    required_error: 'يرجى اختيار صلاحيات الوصول' 
  }),
  role: z.enum(['user', 'admin', 'manager'], { 
    required_error: 'يرجى اختيار دور المستخدم' 
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function EmployeeForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      department: '',
      jobTitle: '',
      employmentType: 'full_time',
      salaryType: 'monthly',
      salaryAmount: 0,
      commissionType: 'none',
      commissionValue: 0,
      status: 'active',
      accessRights: 'view',
      role: 'user',
    },
  });
  
  // Watch commission type to conditionally show commission value field
  const commissionType = form.watch('commissionType');
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // First, create the user auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (authError) throw authError;
      
      if (!authData.user?.id) {
        throw new Error('لم يتم إنشاء المستخدم بشكل صحيح');
      }
      
      // Then, insert the user profile with additional information
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          full_name: data.fullName,
          email: data.email,
          department: data.department,
          job_title: data.jobTitle,
          employment_type: data.employmentType,
          salary_type: data.salaryType,
          salary_amount: data.salaryAmount,
          commission_type: data.commissionType,
          commission_value: data.commissionType !== 'none' ? data.commissionValue : null,
          status: data.status,
          access_rights: data.accessRights,
          role: data.role,
          permission_level: data.role === 'admin' ? 'admin' : (data.role === 'manager' ? 'manager' : 'user'),
        });
      
      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }
      
      toast.success('تم إضافة الموظف بنجاح');
      navigate('/employees');
      
    } catch (error: any) {
      console.error('Error adding employee:', error);
      toast.error(error.message || 'حدث خطأ أثناء إضافة الموظف');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* بيانات الحساب */}
        <div>
          <h2 className="text-lg font-semibold mb-4">بيانات الحساب</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم بالكامل</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-right" placeholder="محمد أحمد" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="text-right" placeholder="example@ecomistry.com" />
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
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="text-right" placeholder="كلمة المرور" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>دور المستخدم</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر دور المستخدم" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">مستخدم عادي</SelectItem>
                      <SelectItem value="manager">مدير</SelectItem>
                      <SelectItem value="admin">مسؤول النظام</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    يحدد هذا مستوى وصول المستخدم للنظام
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        {/* بيانات الوظيفة */}
        <div>
          <h2 className="text-lg font-semibold mb-4">بيانات الوظيفة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>القسم</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر القسم" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="media_buying">ميديا بايينج</SelectItem>
                      <SelectItem value="call_center">كول سنتر</SelectItem>
                      <SelectItem value="moderation">مودريشن</SelectItem>
                      <SelectItem value="content">كتابة المحتوى</SelectItem>
                      <SelectItem value="finance">القسم المالي</SelectItem>
                      <SelectItem value="design">التصميم</SelectItem>
                      <SelectItem value="management">إدارة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المسمى الوظيفي</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-right" placeholder="مثال: مصمم جرافيك" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع التعاقد</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر نوع التعاقد" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full_time">دوام كامل</SelectItem>
                      <SelectItem value="part_time">دوام جزئي</SelectItem>
                      <SelectItem value="freelancer">فريلانسر</SelectItem>
                      <SelectItem value="per_piece">بالقطعة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الحالة</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                      <SelectItem value="trial">تحت التجربة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        {/* بيانات المرتب والعمولة */}
        <div>
          <h2 className="text-lg font-semibold mb-4">بيانات المرتب والعمولة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="salaryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع المرتب</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر نوع المرتب" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">شهري</SelectItem>
                      <SelectItem value="hourly">بالساعة</SelectItem>
                      <SelectItem value="per_task">لكل مهمة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="salaryAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>قيمة المرتب</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      className="text-right" 
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="commissionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع العمولة</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر نوع العمولة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">نسبة</SelectItem>
                      <SelectItem value="fixed">ثابت</SelectItem>
                      <SelectItem value="none">لا يوجد</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {commissionType !== 'none' && (
              <FormField
                control={form.control}
                name="commissionValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قيمة العمولة {commissionType === 'percentage' ? '(%)' : ''}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        className="text-right" 
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* صلاحيات النظام */}
        <div>
          <h2 className="text-lg font-semibold mb-4">صلاحيات النظام</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="accessRights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>صلاحيات الوصول</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر صلاحيات الوصول" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="view">مشاهدة</SelectItem>
                      <SelectItem value="add">إضافة</SelectItem>
                      <SelectItem value="edit">تعديل</SelectItem>
                      <SelectItem value="full_manage">إدارة كاملة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    يحدد مستوى صلاحيات المستخدم داخل النظام
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/employees')}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ الموظف الجديد'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
