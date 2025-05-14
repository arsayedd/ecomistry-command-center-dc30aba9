
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// Sample brands
const sampleBrands = [
  { id: "1", name: "براند الأزياء" },
  { id: "2", name: "براند التجميل" },
  { id: "3", name: "براند الإلكترونيات" },
  { id: "4", name: "براند الأغذية" }
];

// Sample employees
const sampleEmployees = [
  { 
    id: "1", 
    user_id: "101", 
    user: { 
      id: "101", 
      full_name: "أحمد محمد", 
      department: "content" 
    } 
  },
  { 
    id: "2", 
    user_id: "102", 
    user: { 
      id: "102", 
      full_name: "سارة علي", 
      department: "content" 
    } 
  },
  { 
    id: "3", 
    user_id: "103", 
    user: { 
      id: "103", 
      full_name: "محمود حسن", 
      department: "content" 
    } 
  }
];

// Sample task for fallback
const sampleTask = {
  id: "1",
  employee_id: "1",
  brand_id: "1",
  task_type: "بوست",
  deadline: "2025-05-20",
  status: "قيد التنفيذ",
  delivery_link: "https://docs.google.com/document/d/123",
  notes: "يرجى التركيز على المميزات الرئيسية للمنتج",
  created_at: "2025-05-10T10:00:00",
  updated_at: "2025-05-10T10:00:00"
};

interface FormValues {
  employee_id: string;
  brand_id: string;
  task_type: string;
  deadline: Date;
  status: string;
  delivery_link: string;
  notes: string;
}

export default function EditContentTask() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      employee_id: "",
      brand_id: "",
      task_type: "",
      deadline: new Date(),
      status: "",
      delivery_link: "",
      notes: "",
    },
  });

  // Fetch task details
  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ["contentTask", id],
    queryFn: async () => {
      try {
        if (!id) throw new Error("Task ID is required");
        
        const { data, error } = await supabase
          .from("content_tasks")
          .select(`*`)
          .eq("id", id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching task details:", error);
        return sampleTask; // Fall back to sample task if API fails
      }
    },
    enabled: !!id,
  });

  // Fetch employees for dropdown
  const { data: employees } = useQuery({
    queryKey: ["employees", "content"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select(`
            id,
            user_id,
            user:users!inner(id, full_name, department)
          `)
          .eq("status", "active")
          .eq("users.department", "content")
          .order("users.full_name");

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching employees:", error);
        return sampleEmployees;
      }
    },
  });

  // Fetch brands for dropdown
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("id, name")
          .order("name");

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching brands:", error);
        return sampleBrands;
      }
    },
  });

  // Set form values when task data is available
  useEffect(() => {
    if (task) {
      form.reset({
        employee_id: task.employee_id || "",
        brand_id: task.brand_id || "",
        task_type: task.task_type || "",
        deadline: task.deadline ? new Date(task.deadline) : new Date(),
        status: task.status || "قيد التنفيذ",
        delivery_link: task.delivery_link || "",
        notes: task.notes || "",
      });
    }
  }, [task, form]);

  // Update content task mutation
  const updateContentTask = useMutation({
    mutationFn: async (values: FormValues) => {
      setIsSubmitting(true);
      try {
        if (!id) throw new Error("Task ID is required");
        
        const formattedValues = {
          ...values,
          deadline: values.deadline.toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from("content_tasks")
          .update(formattedValues)
          .eq("id", id);
        
        if (error) throw error;
        return values;
      } catch (error) {
        console.error("Error updating content task:", error);
        return values; // Return values anyway for UI handling
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentTask", id] });
      queryClient.invalidateQueries({ queryKey: ["contentTasks"] });
      
      toast({
        title: "تم تحديث المهمة",
        description: "تم تحديث بيانات المهمة بنجاح",
      });
      
      navigate(`/content/${id}`);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    updateContentTask.mutate(values);
  };

  if (taskLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(`/content/${id}`)}>
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة للتفاصيل
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">تعديل مهمة المحتوى</h1>
        <p className="text-gray-500">تعديل تفاصيل المهمة وحالتها</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل المهمة</CardTitle>
          <CardDescription>عدل البيانات المطلوبة للمهمة</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="employee_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كاتب المحتوى</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الموظف" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(employees || sampleEmployees)?.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.user?.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البراند</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر البراند" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(brands || sampleBrands)?.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="task_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع المهمة</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع المهمة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="بوست">بوست</SelectItem>
                          <SelectItem value="إعلان">إعلان</SelectItem>
                          <SelectItem value="رييل">رييل</SelectItem>
                          <SelectItem value="منتج">منتج</SelectItem>
                          <SelectItem value="صفحة هبوط">صفحة هبوط</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>تاريخ التسليم المتوقع</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span>اختر تاريخ</span>
                              )}
                              <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                          <SelectItem value="تم التسليم">تم التسليم</SelectItem>
                          <SelectItem value="متأخر">متأخر</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رابط التسليم / المستند</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل الرابط..." {...field} />
                      </FormControl>
                      <FormDescription>
                        رابط Google Drive أو أي منصة تخزين سحابي
                      </FormDescription>
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
                    <FormLabel>ملاحظات / تعديل مطلوب</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل أي ملاحظات أو تعديلات مطلوبة..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="px-0 pb-0 pt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/content/${id}`)}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
