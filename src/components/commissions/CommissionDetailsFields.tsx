
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CommissionFormValues } from "@/hooks/useCommissionForm";
import { User } from "@/types";

interface CommissionDetailsFieldsProps {
  form: UseFormReturn<CommissionFormValues>;
  employees: User[];
}

export const CommissionDetailsFields = ({ form, employees }: CommissionDetailsFieldsProps) => {
  return (
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
    </div>
  );
};
