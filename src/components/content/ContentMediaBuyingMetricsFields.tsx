
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ContentMediaBuyingFormValues } from "./ContentMediaBuyingForm";

interface ContentMediaBuyingMetricsFieldsProps {
  form: UseFormReturn<ContentMediaBuyingFormValues>;
}

export function ContentMediaBuyingMetricsFields({ form }: ContentMediaBuyingMetricsFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Ad Spend */}
      <FormField
        control={form.control}
        name="ad_spend"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الإنفاق الإعلاني</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
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
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CPP (Cost Per Purchase) */}
      <FormField
        control={form.control}
        name="cpp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>تكلفة الأوردر</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value || 0}
                readOnly
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ROAS (Return on Ad Spend) */}
      <FormField
        control={form.control}
        name="roas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>العائد على الإنفاق الإعلاني</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
