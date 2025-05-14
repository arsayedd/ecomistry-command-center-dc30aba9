
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Users, Edit, Trash } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
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

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: employee, isLoading, error, refetch } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select(`
          *,
          users:user_id (
            full_name,
            email,
            department,
            role,
            permission_level
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      department: "",
      role: "",
      contractType: "full-time", // Assuming this field exists in the database
      salaryType: "monthly", // Assuming this field exists in the database
      salaryValue: "",
      hours: "",
      commissionType: "none",
      commissionValue: "",
      status: "",
      accessLevel: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        fullName: employee.users.full_name,
        email: employee.users.email,
        department: employee.users.department || "",
        role: employee.users.role || "",
        contractType: "full-time", // Placeholder - add real field to database
        salaryType: "monthly", // Placeholder - add real field to database
        salaryValue: employee.salary ? employee.salary.toString() : "",
        hours: employee.working_hours ? employee.working_hours.toString() : "",
        commissionType: employee.commission_type || "none",
        commissionValue: employee.commission_value ? employee.commission_value.toString() : "",
        status: employee.status || "",
        accessLevel: employee.users.permission_level || "",
        notes: "", // Placeholder - add real field to database
      });
    }
  }, [employee, form]);

  const watchSalaryType = form.watch("salaryType");
  const watchCommissionType = form.watch("commissionType");

  const onSubmit = async (data: FormValues) => {
    if (!employee) return;

    try {
      setIsSubmitting(true);

      // 1. Update user record
      const { error: userError } = await supabase
        .from("users")
        .update({
          full_name: data.fullName,
          email: data.email,
          department: data.department,
          role: data.role,
          permission_level: data.accessLevel,
        })
        .eq("id", employee.user_id);

      if (userError) throw userError;

      // 2. Update employee record
      const { error: employeeError } = await supabase
        .from("employees")
        .update({
          salary: parseFloat(data.salaryValue),
          commission_type: data.commissionType !== "none" ? data.commissionType : null,
          commission_value: data.commissionValue ? parseFloat(data.commissionValue) : null,
          working_hours: data.hours ? parseInt(data.hours) : null,
          status: data.status,
          // Additional fields could be updated here
        })
        .eq("id", id);

      if (employeeError) throw employeeError;

      toast({
        title: "تم تحديث بيانات الموظف",
        description: "تم تحديث بيانات الموظف بنجاح",
      });

      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث بيانات الموظف، يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEmployeeStatus = async () => {
    if (!employee) return;

    const newStatus = employee.status === "نشط" ? "موقوف" : "نشط";

    try {
      const { error } = await supabase
        .from("employees")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم تحديث حالة الموظف",
        description: `تم تغيير حالة الموظف إلى ${newStatus}`,
      });

      refetch();
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث حالة الموظف، يرجى المحاولة مرة أخرى.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">خطأ في تحميل بيانات الموظف</h2>
        <p className="text-gray-500 mt-2">لم نتمكن من العثور على بيانات الموظف المطلوب</p>
        <Button className="mt-4" onClick={() => navigate("/employees")}>
          العودة إلى قائمة الموظفين
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{employee.users.full_name}</h1>
          <p className="text-gray-500">{employee.users.role || "لا توجد وظيفة محددة"}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button
                variant={employee.status === "نشط" ? "destructive" : "default"}
                onClick={toggleEmployeeStatus}
              >
                {employee.status === "نشط" ? "تعطيل الموظف" : "تنشيط الموظف"}
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="ml-2 h-4 w-4" /> تعديل البيانات
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-6 w-full md:w-auto">
          <TabsTrigger value="details">البيانات الشخصية</TabsTrigger>
          <TabsTrigger value="financial">البيانات المالية</TabsTrigger>
          <TabsTrigger value="performance">الأداء والتقييم</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          {isEditing ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Users className="ml-2" size={20} />
                  تعديل بيانات الموظف
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
                            <Select onValueChange={field.onChange} value={field.value}>
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
                            <Select onValueChange={field.onChange} value={field.value}>
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
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل البريد الإلكتروني" {...field} />
                            </FormControl>
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
                            <Select onValueChange={field.onChange} value={field.value}>
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

                      <FormField
                        control={form.control}
                        name="accessLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>صلاحيات الوصول</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
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

                    <Separator className="my-6" />

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
                        onClick={() => setIsEditing(false)}
                      >
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>البيانات الشخصية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">الاسم بالكامل</p>
                    <p className="font-medium">{employee.users.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium">{employee.users.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">القسم</p>
                    <p className="font-medium">{employee.users.department || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الوظيفة</p>
                    <p className="font-medium">{employee.users.role || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الحالة</p>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === "نشط"
                            ? "bg-green-100 text-green-700"
                            : employee.status === "موقوف"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {employee.status || "غير محدد"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>صلاحيات النظام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">مستوى الصلاحيات</p>
                    <p className="font-medium">
                      {employee.users.permission_level === "view" && "مشاهدة فقط"}
                      {employee.users.permission_level === "add" && "إضافة فقط"}
                      {employee.users.permission_level === "edit" && "إضافة وتعديل"}
                      {employee.users.permission_level === "admin" && "تحكم كامل"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تاريخ الإضافة للنظام</p>
                    <p className="font-medium">
                      {employee.created_at ? new Date(employee.created_at).toLocaleDateString('ar-EG') : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">آخر تحديث للبيانات</p>
                    <p className="font-medium">
                      {employee.updated_at ? new Date(employee.updated_at).toLocaleDateString('ar-EG') : "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="financial">
          {isEditing ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">تعديل البيانات المالية</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="salaryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نوع المرتب</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
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
                            <Select onValueChange={field.onChange} value={field.value}>
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
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>بيانات المرتب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">نوع المرتب</p>
                    <p className="font-medium">شهري</p> {/* Placeholder - add real field to database */}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">قيمة المرتب</p>
                    <p className="font-medium">{employee.salary ? `${employee.salary} ج.م` : "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">عدد ساعات العمل</p>
                    <p className="font-medium">{employee.working_hours || "-"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>بيانات العمولة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">نوع العمولة</p>
                    <p className="font-medium">
                      {employee.commission_type === "percentage" && "نسبة مئوية"}
                      {employee.commission_type === "fixed" && "مبلغ ثابت"}
                      {!employee.commission_type && "لا يوجد"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">قيمة العمولة</p>
                    <p className="font-medium">
                      {employee.commission_value
                        ? `${employee.commission_value} ${
                            employee.commission_type === "percentage" ? "%" : "ج.م"
                          }`
                        : "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>بيانات الأداء</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-10">لم يتم إضافة بيانات أداء لهذا الموظف بعد</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
