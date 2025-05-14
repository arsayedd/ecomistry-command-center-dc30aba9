import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Moderation, User } from "@/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  employee_id: z.string().min(1, { message: "يجب اختيار الموظف" }),
  report_date: z.date({
    required_error: "يجب اختيار تاريخ التقرير",
  }),
  conversations_count: z.number().int().min(0, { message: "يجب إدخال عدد المحادثات" }),
  remaining_messages: z.number().int().min(0, { message: "يجب إدخال عدد الرسائل المتبقية" }),
  avg_response_time: z.number().min(0, { message: "يجب إدخال متوسط وقت الرد" }),
  platform: z.string().min(1, { message: "يجب اختيار المنصة" }),
  performance_rating: z.number().min(1).max(5, { message: "يجب إدخال تقييم الأداء (1-5)" }),
  notes: z.string().optional(),
});

interface ModerationReportFormProps {
  onSave: (data: any) => void;
  initialData?: Moderation;
}

export default function ModerationReportForm({ onSave, initialData }: ModerationReportFormProps) {
  const [employees, setEmployees] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      report_date: initialData.report_date ? new Date(initialData.report_date) : undefined,
    } : {
      employee_id: "",
      report_date: new Date(),
      conversations_count: 0,
      remaining_messages: 0,
      avg_response_time: 0,
      platform: "facebook",
      performance_rating: 3,
      notes: "",
    },
  });

  // Fetch employees
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("department", "moderation");

        if (error) {
          throw error;
        }

        if (data) {
          // Cast the data to match User type
          const typedEmployees: User[] = data.map(emp => ({
            id: emp.id,
            email: emp.email || '',
            full_name: emp.full_name || '',
            phone: emp.phone || '',
            department: emp.department || '',
            role: emp.role || '',
            employment_type: (emp.employment_type || 'full_time') as User['employment_type'],
            salary_type: (emp.salary_type || 'monthly') as User['salary_type'],
            status: (emp.status || 'active') as User['status'],
            access_rights: (emp.access_rights || 'view') as User['access_rights'],
            commission_type: (emp.commission_type || 'percentage') as User['commission_type'],
            commission_value: emp.commission_value || 0,
            created_at: emp.created_at || '',
            updated_at: emp.updated_at || ''
          }));
          
          setEmployees(typedEmployees);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast({
          title: "خطأ في جلب بيانات الموظفين",
          description: "حدث خطأ أثناء محاولة جلب بيانات الموظفين.",
          variant: "destructive",
        });
      }
    }

    fetchEmployees();
  }, [toast]);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Format the data for submission
      const formData = {
        employee_id: values.employee_id,
        report_date: format(values.report_date, "yyyy-MM-dd"),
        conversations_count: values.conversations_count,
        remaining_messages: values.remaining_messages,
        avg_response_time: values.avg_response_time,
        platform: values.platform,
        performance_rating: values.performance_rating,
        notes: values.notes,
      };
      
      // Insert into Supabase or update
      if (initialData?.id) {
        const { error } = await supabase
          .from("moderation")
          .update(formData)
          .eq("id", initialData.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("moderation")
          .insert([formData]);
          
        if (error) throw error;
      }
      
      // Call the onSave callback with the form data
      onSave(formData);

      toast({
        title: initialData ? "تم تحديث التقرير بنجاح" : "تم إضافة التقرير بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving moderation report:", error);
      toast({
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء محاولة حفظ بيانات التقرير.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" dir="rtl">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Selection */}
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الموظف</FormLabel>
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
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="report_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ التقرير</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-right font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>اختر التاريخ</span>
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Platform */}
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المنصة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المنصة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="facebook">فيسبوك</SelectItem>
                        <SelectItem value="instagram">إنستجرام</SelectItem>
                        <SelectItem value="whatsapp">واتساب</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conversations Count */}
              <FormField
                control={form.control}
                name="conversations_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد المحادثات</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remaining Messages */}
              <FormField
                control={form.control}
                name="remaining_messages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الرسائل المتبقية</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Average Response Time */}
              <FormField
                control={form.control}
                name="avg_response_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>متوسط وقت الرد (بالدقائق)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Performance Rating */}
              <FormField
                control={form.control}
                name="performance_rating"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>تقييم الأداء (1-5)</FormLabel>
                    <div className="flex items-center space-x-4">
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <span className="text-lg font-bold">{field.value}</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>ملاحظات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل ملاحظات إضافية هنا..."
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ التقرير"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
