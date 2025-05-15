
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Commission } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Form schema definition
const commissionFormSchema = z.object({
  employee_id: z.string().min(1, { message: "يجب تحديد الموظف" }),
  commission_type: z.enum(["confirmation", "delivery"], {
    required_error: "يجب اختيار نوع العمولة"
  }),
  value_type: z.enum(["fixed", "percentage"], {
    required_error: "يجب اختيار نوع القيمة"
  }),
  value_amount: z.number().min(0, { message: "يجب إدخال قيمة موجبة" }),
  orders_count: z.number().int().min(0, { message: "يجب إدخال عدد صحيح موجب" }),
  due_date: z.date({
    required_error: "يجب تحديد تاريخ الاستحقاق",
  }),
  total_commission: z.number().optional(),
});

export type CommissionFormValues = z.infer<typeof commissionFormSchema>;

export const useCommissionForm = (initialData?: Commission, onSubmit?: (data: Commission) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<{ id: string; full_name: string }[]>([]);
  const { toast } = useToast();

  // Load employees data
  useState(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name")
          .eq("role", "employee");
          
        if (error) throw error;
        if (data) setEmployees(data);
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: `فشل في جلب بيانات الموظفين: ${error.message}`,
          variant: "destructive",
        });
      }
    };
    
    fetchEmployees();
  }, [toast]);

  // Initialize form
  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      due_date: initialData.due_date ? new Date(initialData.due_date) : new Date(),
    } : {
      employee_id: "",
      commission_type: "confirmation",
      value_type: "fixed",
      value_amount: 0,
      orders_count: 0,
      due_date: new Date(),
      total_commission: 0,
    }
  });

  // Calculate total commission when values change
  const valueAmount = form.watch("value_amount");
  const valueType = form.watch("value_type");
  const ordersCount = form.watch("orders_count");
  
  // Update total commission when relevant values change
  useState(() => {
    let total = 0;
    
    if (valueType === "fixed") {
      total = valueAmount * ordersCount;
    } else if (valueType === "percentage") {
      // Assuming average order value of 1000 for percentage calculations
      const averageOrderValue = 1000;
      total = (valueAmount / 100) * averageOrderValue * ordersCount;
    }
    
    form.setValue("total_commission", total);
  }, [valueAmount, valueType, ordersCount, form]);

  // Form submission handler
  const handleSubmit = async (values: CommissionFormValues) => {
    setIsSubmitting(true);
    try {
      const commissionData = {
        ...values,
        due_date: values.due_date instanceof Date ? values.due_date.toISOString().split('T')[0] : values.due_date,
      };
      
      if (initialData?.id) {
        // Update existing commission
        const { error } = await supabase
          .from("commissions")
          .update(commissionData)
          .eq("id", initialData.id);
          
        if (error) throw error;
        
        toast({
          title: "تم تحديث العمولة بنجاح",
          variant: "default",
        });
      } else {
        // Insert new commission
        const { error } = await supabase
          .from("commissions")
          .insert([commissionData]);
          
        if (error) throw error;
        
        toast({
          title: "تم إضافة العمولة بنجاح",
          variant: "default",
        });
      }
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit({
          ...values,
          id: initialData?.id
        } as Commission);
      }
    } catch (error: any) {
      console.error("Error saving commission:", error);
      toast({
        title: "خطأ في حفظ العمولة",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    employees,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
