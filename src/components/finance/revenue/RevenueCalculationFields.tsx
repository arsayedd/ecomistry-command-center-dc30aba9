
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RevenueFormValues } from "@/hooks/useRevenueForm";

interface RevenueCalculationFieldsProps {
  form: UseFormReturn<RevenueFormValues>;
}

export function RevenueCalculationFields({ form }: RevenueCalculationFieldsProps) {
  return (
    <>
      {/* Units Sold */}
      <FormField
        control={form.control}
        name="units_sold"
        render={({ field }) => (
          <FormItem>
            <FormLabel>عدد القطع المباعة</FormLabel>
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

      {/* Unit Price */}
      <FormField
        control={form.control}
        name="unit_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>سعر القطعة</FormLabel>
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

      {/* Total Revenue */}
      <FormField
        control={form.control}
        name="total_revenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>إجمالي الإيراد</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                readOnly
                className="bg-muted"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
