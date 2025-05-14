
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Commission, User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Form schema definition
export const commissionFormSchema = z.object({
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

export type CommissionFormValues = z.infer<typeof commissionFormSchema>;

export const useCommissionForm = (initialData?: Commission, onSave?: (data: any) => void) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form with default values or existing data
  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionFormSchema),
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
          // Convert raw data to User type with proper type assertions
          const typedEmployees: User[] = data.map(emp => ({
            id: emp.id,
            email: emp.email || '',
            full_name: emp.full_name || '',
            department: emp.department || '',
            role: emp.role || '',
            permission_level: emp.permission_level || '',
            employment_type: (emp.employment_type || 'full_time') as User['employment_type'],
            salary_type: (emp.salary_type || 'monthly') as User['salary_type'],
            status: (emp.status || 'active') as User['status'],
            access_rights: (emp.access_rights || 'view') as User['access_rights'],
            commission_type: (emp.commission_type || 'percentage') as User['commission_type'],
            commission_value: emp.commission_value || 0,
            job_title: emp.job_title || '',
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

  // Form submission handler
  const handleSubmit = async (values: CommissionFormValues) => {
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
      if (onSave) {
        onSave(formData);
      }

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
  };

  return {
    form,
    employees,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
