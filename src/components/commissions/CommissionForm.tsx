
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Commission, User } from "@/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  employee_id: z.string().min(1, { message: "يجب اختيار الموظف" }),
  commission_type: z.enum(["confirmation", "delivery"], { 
    required_error: "يجب اختيار نوع العمولة" 
  }),
  value_type: z.enum(["percentage", "fixed"], { 
    required_error: "يجب اختيار نوع القيمة" 
  }),
  value_amount: z.number().min(0, { message: "يجب أن تكون القيمة أكبر من أو تساوي 0" }),
  orders_count: z.number().int().min(1, { message: "يجب أن يكون عدد الطلبات أكبر من 0" }),
  total_commission: z.number().min(0, { message: "يجب أن تكون العمولة الإجمالية أكبر من أو تساوي 0" }),
  due_date: z.date({
    required_error: "يجب اختيار تاريخ الاستحقاق",
  }),
});

interface CommissionFormProps {
  onSave: (data: any) => void;
  initialData?: Commission;
}

export default function CommissionForm({ onSave, initialData }: CommissionFormProps) {
  const [employees, setEmployees] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      due_date: initialData.due_date ? new Date(initialData.due_date) : undefined,
      value_amount: initialData.value_amount,
      orders_count: initialData.orders_count,
      total_commission: initialData.total_commission,
    } : {
      employee_id: "",
      commission_type: "confirmation",
      value_type: "percentage",
      value_amount: 0,
      orders_count: 0,
      total_commission: 0,
      due_date: new Date(),
    },
  });

  // Calculate total commission when value amount or orders count changes
  const valueAmount = form.watch("value_amount");
  const ordersCount = form.watch("orders_count");

  useEffect(() => {
    const totalCommission = valueAmount * ordersCount;
    form.setValue("total_commission", totalCommission);
  }, [valueAmount, ordersCount, form]);

  // Fetch employees from the database
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*");

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
            access_rights: (emp.access_rights || "view") as "view" | "add" | "edit" | "full_manage",
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
      // Format the data for submission
      const formData = {
        employee_id: values.employee_id,
        commission_type: values.commission_type,
        value_type: values.value_type,
        value_amount: values.value_amount,
        orders_count: values.orders_count,
        total_commission: values.total_commission,
        due_date: format(values.due_date, "yyyy-MM-dd"),
      };
      
      // Insert into Supabase
      const { error } = await supabase
        .from("commissions")
        .insert([formData]);
        
      if (error) throw error;
      
      // Call the onSave callback with the form data
      onSave(formData);

      toast({
        title: "تم حفظ العمولة بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving commission:", error);
      toast({
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء محاولة حفظ بيانات العمولة.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              {/* Commission Type */}
              <FormField
                control={form.control}
                name="commission_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع العمولة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع العمولة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="confirmation">تأكيد</SelectItem>
                        <SelectItem value="delivery">تسليم</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Value Type */}
              <FormField
                control={form.control}
                name="value_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع القيمة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع القيمة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">نسبة مئوية</SelectItem>
                        <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Value Amount */}
              <FormField
                control={form.control}
                name="value_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قيمة العمولة (لكل أوردر)</FormLabel>
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

              {/* Orders Count */}
              <FormField
                control={form.control}
                name="orders_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الأوردرات</FormLabel>
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

              {/* Total Commission */}
              <FormField
                control={form.control}
                name="total_commission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>إجمالي العمولة</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ الاستحقاق</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>اختر التاريخ</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ العمولة"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
