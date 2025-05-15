
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Commission, User } from "@/types";
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
  const [employees, setEmployees] = useState<User[]>([]);
  const { toast } = useToast();

  // Load employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("role", "employee");
          
        if (error) throw error;
        if (data) {
          // Convert data to match the User type with proper type casting
          const typedEmployees: User[] = data.map(emp => ({
            id: emp.id,
            email: emp.email || "",
            full_name: emp.full_name || "",
            department: emp.department || "",
            role: emp.role || "",
            permission_level: emp.permission_level || "",
            employment_type: (emp.employment_type as "full_time" | "part_time" | "contract") || "full_time",
            salary_type: (emp.salary_type as "monthly" | "hourly" | "commission") || "monthly",
            status: (emp.status as "active" | "inactive" | "pending") || "active",
            access_rights: (emp.access_rights as "admin" | "edit" | "view") || "view",
            commission_type: (emp.commission_type as "percentage" | "fixed") || "percentage",
            commission_value: emp.commission_value || 0,
            job_title: emp.job_title || "",
            created_at: emp.created_at || "",
            updated_at: emp.updated_at || ""
          }));
          setEmployees(typedEmployees);
        }
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
      employee_id: initialData.employee_id,
      commission_type: initialData.commission_type as "confirmation" | "delivery",
      value_type: initialData.value_type as "fixed" | "percentage",
      value_amount: initialData.value_amount,
      orders_count: initialData.orders_count,
      due_date: initialData.due_date ? new Date(initialData.due_date) : new Date(),
      total_commission: initialData.total_commission,
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
  useEffect(() => {
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
        employee_id: values.employee_id,
        commission_type: values.commission_type,
        value_type: values.value_type,
        value_amount: values.value_amount,
        orders_count: values.orders_count,
        due_date: values.due_date instanceof Date ? values.due_date.toISOString().split('T')[0] : values.due_date,
        total_commission: values.total_commission || 0,
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
          .insert(commissionData);
          
        if (error) throw error;
        
        toast({
          title: "تم إضافة العمولة بنجاح",
          variant: "default",
        });
      }
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit({
          ...commissionData,
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
