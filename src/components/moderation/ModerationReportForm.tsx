
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Moderation, User } from "@/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  employee_id: z.string().min(1, { message: "يجب اختيار الموظف" }),
  daily_responses: z.number().int().min(0, { message: "يجب أن يكون عدد الردود أكبر من أو يساوي 0" }),
  open_messages: z.number().int().min(0, { message: "يجب أن يكون عدد الرسائل المفتوحة أكبر من أو يساوي 0" }),
  average_response_time: z.number().min(0, { message: "يجب أن يكون متوسط وقت الرد أكبر من أو يساوي 0" }),
  platform: z.enum(["facebook", "instagram", "whatsapp"], { 
    required_error: "يجب اختيار المنصة" 
  }),
  performance_rating: z.number().int().min(1).max(10, { message: "يجب أن يكون التقييم بين 1 و 10" }),
  supervisor_notes: z.string().optional(),
  date: z.date({
    required_error: "التاريخ مطلوب",
  }),
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
      date: initialData.date ? new Date(initialData.date) : undefined,
    } : {
      employee_id: "",
      daily_responses: 0,
      open_messages: 0,
      average_response_time: 0,
      platform: "facebook",
      performance_rating: 5,
      supervisor_notes: "",
      date: new Date(),
    },
  });

  // Fetch employees from the database
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
          // Cast the data to match the User type
          const typedEmployees = data.map(emp => ({
            ...emp,
            employment_type: (emp.employment_type || "full_time") as "full_time" | "part_time" | "freelancer" | "per_piece",
            salary_type: (emp.salary_type || "monthly") as "monthly" | "hourly" | "per_task",
            status: (emp.status || "active") as "active" | "inactive" | "trial",
            access_rights: (emp.access_rights || "view") as "view" | "add" | "edit" | "full_manage"
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const formData = {
        ...values,
        date: format(values.date, "yyyy-MM-dd"),
        supervisor_notes: values.supervisor_notes || null,
      };

      // Try to insert or update in the database
      if (initialData?.id) {
        // Update existing record
        const { error } = await supabase
          .from("moderation")
          .update(formData)
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("moderation")
          .insert([formData]);

        if (error) throw error;
      }

      // Call the onSave callback
      onSave(formData);

      toast({
        title: "تم حفظ تقرير المودريشن بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving moderation report:", error);
      toast({
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء محاولة حفظ تقرير المودريشن.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>التاريخ</FormLabel>
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

              {/* Daily Responses */}
              <FormField
                control={form.control}
                name="daily_responses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الردود اليومية</FormLabel>
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

              {/* Open Messages */}
              <FormField
                control={form.control}
                name="open_messages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الرسائل المفتوحة</FormLabel>
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
                name="average_response_time"
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
                    <FormLabel>تقييم الأداء (1-10)</FormLabel>
                    <div className="flex items-center space-x-4">
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
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

              {/* Supervisor Notes */}
              <FormField
                control={form.control}
                name="supervisor_notes"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>ملاحظات المشرف</FormLabel>
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
