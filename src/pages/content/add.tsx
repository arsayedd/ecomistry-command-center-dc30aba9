
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
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

interface FormValues {
  employee_id: string;
  brand_id: string;
  task_type: string;
  deadline: Date;
  status: string;
  delivery_link: string;
  notes: string;
}

export default function AddContentTask() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      employee_id: "",
      brand_id: "",
      task_type: "",
      deadline: new Date(),
      status: "قيد التنفيذ",
      delivery_link: "",
      notes: "",
    },
  });

  // Fetch employees for dropdown
  const { data: employees } = useQuery({
    queryKey: ["employees", "content"],
    queryFn: async () => {
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
    },
  });

  // Fetch brands for dropdown
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });

  // Create content task mutation
  const createContentTask = useMutation({
    mutationFn: async (values: FormValues) => {
      // Convert Date object to ISO string for the database
      const formattedValues = {
        ...values,
        deadline: values.deadline.toISOString(),
      };
      
      const { error } = await supabase
        .from("content_tasks")
        .insert(formattedValues);
      
      if (error) throw error;
      return values;
    },
    onSuccess: () => {
      toast({
        title: "تم إضافة المهمة",
        description: "تم إضافة مهمة المحتوى بنجاح",
      });
      navigate("/content");
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
    createContentTask.mutate(values);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إضافة مهمة محتوى جديدة</h1>
        <p className="text-gray-500">قم بإضافة مهمة محتوى جديدة وتحديد تفاصيلها</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل المهمة</CardTitle>
          <CardDescription>أدخل البيانات المطلوبة لإنشاء مهمة جديدة</CardDescription>
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
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الموظف" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees?.map((employee) => (
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
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر البراند" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands?.map((brand) => (
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
                        defaultValue={field.value}
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
                        defaultValue={field.value}
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
                  onClick={() => navigate("/content")}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={createContentTask.isPending}>
                  {createContentTask.isPending ? "جاري الحفظ..." : "حفظ المهمة"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
