
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CommissionFormValues } from "@/hooks/useCommissionForm";

interface CommissionValueFieldsProps {
  form: UseFormReturn<CommissionFormValues>;
}

export const CommissionValueFields = ({ form }: CommissionValueFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};
