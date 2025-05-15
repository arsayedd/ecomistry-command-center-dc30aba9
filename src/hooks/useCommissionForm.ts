
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Commission } from "@/types";

// Define the form schema
const commissionFormSchema = z.object({
  employee_id: z.string().min(1, { message: "يجب اختيار الموظف" }),
  commission_type: z.enum(["confirmation", "delivery"], {
    required_error: "يجب تحديد نوع العمولة"
  }),
  value_type: z.enum(["percentage", "fixed"], {
    required_error: "يجب تحديد نوع القيمة"
  }),
  value_amount: z.number().min(0, { message: "يجب أن تكون القيمة أكبر من صفر" }),
  orders_count: z.number().int().min(0, { message: "يجب أن يكون عدد الأوردرات صحيح وأكبر من صفر" }),
  total_commission: z.number().min(0),
  due_date: z.date({
    required_error: "يجب تحديد تاريخ الاستحقاق",
  }),
});

export type CommissionFormValues = z.infer<typeof commissionFormSchema>;

export const useCommissionForm = (initialData?: Commission) => {
  // Initialize form with default values or existing data
  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionFormSchema),
    defaultValues: initialData
      ? {
          employee_id: initialData.employee_id,
          commission_type: initialData.commission_type as "confirmation" | "delivery",
          value_type: initialData.value_type as "percentage" | "fixed",
          value_amount: initialData.value_amount,
          orders_count: initialData.orders_count,
          total_commission: initialData.total_commission,
          due_date: initialData.due_date instanceof Date
            ? initialData.due_date
            : new Date(initialData.due_date),
        }
      : {
          employee_id: "",
          commission_type: "confirmation",
          value_type: "percentage",
          value_amount: 0,
          orders_count: 0,
          total_commission: 0,
          due_date: new Date(),
        },
  });

  // Watch fields to calculate total
  const valueAmount = form.watch("value_amount");
  const ordersCount = form.watch("orders_count");
  const valueType = form.watch("value_type");

  // Update total commission based on value type and amount
  React.useEffect(() => {
    let total = 0;
    
    if (valueType === "percentage") {
      total = (valueAmount / 100) * ordersCount;
    } else {
      total = valueAmount * ordersCount;
    }
    
    form.setValue("total_commission", parseFloat(total.toFixed(2)));
  }, [valueAmount, ordersCount, valueType, form]);

  return form;
};
