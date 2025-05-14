
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  department: z.string({ required_error: "يرجى اختيار القسم" }),
  role: z.string({ required_error: "يرجى تحديد الوظيفة" }),
  contractType: z.string({ required_error: "يرجى اختيار نوع التعاقد" }),
  salaryType: z.string({ required_error: "يرجى اختيار نوع المرتب" }),
  salaryValue: z.string().min(1, { message: "يرجى إدخال قيمة المرتب" }),
  hours: z.string().optional(),
  commissionType: z.string(),
  commissionValue: z.string().optional(),
  status: z.string({ required_error: "يرجى اختيار الحالة" }),
  accessLevel: z.string({ required_error: "يرجى تحديد مستوى الصلاحيات" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddEmployeePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      department: "",
      role: "",
      contractType: "",
      salaryType: "",
      salaryValue: "",
      hours: "",
      commissionType: "none",
      commissionValue: "",
      status: "نشط",
      accessLevel: "view",
      notes: "",
    },
  });

  const watchDepartment = form.watch("department");
  const watchSalaryType = form.watch("salaryType");
  const watchCommissionType = form.watch("commissionType");

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      // 1. Create user record
      const { data: userData, error: userError } = await supabase.from("users").insert({
        full_name: data.fullName,
        email: data.email,
        department: data.department,
        role: data.role,
        permission_level: data.accessLevel,
      }).select("id").single();

      if (userError) throw userError;

      // 2. Create employee record
      const { error: employeeError } = await supabase.from("employees").insert({
        user_id: userData.id,
        salary: parseFloat(data.salaryValue),
        commission_type: data.commissionType !== "none" ? data.commissionType : null,
        commission_value: data.commissionValue ? parseFloat(data.commissionValue) : null,
        working_hours: data.hours ? parseInt(data.hours) : null,
        status: data.status,
        // Additional fields like contract_type could be added to the database
      });

      if (employeeError) throw employeeError;

      toast({
        title: "تم إضافة الموظف بنجاح",
        description: "تم إضافة الموظف وإنشاء حساب له بنجاح",
      });

      navigate("/employees");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "لم نتمكن من إضافة الموظف، يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold">إضافة موظف جديد</h1>
        <p className="text-gray-500">أدخل بيانات الموظف الجديد وصلاحياته</p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Users className="ml-2" size={20} />
            بيانات الموظف
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم بالكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم الموظف الكامل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>القسم</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر القسم" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ميديا">ميديا بايينج</SelectItem>
                          <SelectItem value="كول سنتر">كول سنتر</SelectItem>
                          <SelectItem value="مودريشن">مودريشن</SelectItem>
                          <SelectItem value="ديزاين">تصميم</SelectItem>
                          <SelectItem value="كونتنت">كتابة المحتوى</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوظيفة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: Media Buyer, Content Writer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع التعاقد</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع التعاقد" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">دوام كامل</SelectItem>
                          <SelectItem value="part-time">دوام جزئي</SelectItem>
                          <SelectItem value="freelancer">فريلانسر</SelectItem>
                          <SelectItem value="per-task">بالقطعة</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع المرتب</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع المرتب" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">شهري</SelectItem>
                          <SelectItem value="hourly">بالساعة</SelectItem>
                          <SelectItem value="per-task">لكل مهمة</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>قيمة المرتب</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="أدخل قيمة المرتب" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(watchSalaryType === "hourly" || watchSalaryType === "per-task") && (
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {watchSalaryType === "hourly" ? "عدد الساعات المطلوبة" : "عدد المهام المطلوبة"}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="أدخل العدد" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="commissionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع العمولة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع العمولة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">لا يوجد</SelectItem>
                          <SelectItem value="percentage">نسبة مئوية</SelectItem>
                          <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchCommissionType !== "none" && (
                  <FormField
                    control={form.control}
                    name="commissionValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>قيمة العمولة</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder={
                              watchCommissionType === "percentage" 
                                ? "أدخل النسبة المئوية" 
                                : "أدخل المبلغ الثابت"
                            } 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الحالة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر حالة الموظف" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="نشط">نشط</SelectItem>
                          <SelectItem value="موقوف">موقوف</SelectItem>
                          <SelectItem value="تحت التجربة">تحت التجربة</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل البريد الإلكتروني" {...field} />
                      </FormControl>
                      <FormDescription>سيستخدم لتسجيل الدخول للنظام</FormDescription>
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
                        <Input type="password" placeholder="أدخل كلمة المرور" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>صلاحيات الوصول</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر مستوى الصلاحيات" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="view">مشاهدة فقط</SelectItem>
                          <SelectItem value="add">إضافة فقط</SelectItem>
                          <SelectItem value="edit">إضافة وتعديل</SelectItem>
                          <SelectItem value="admin">تحكم كامل</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ملاحظات إضافية</FormLabel>
                    <FormControl>
                      <Textarea placeholder="أي ملاحظات إضافية عن الموظف..." rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/employees")}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الإضافة..." : "إضافة الموظف"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
