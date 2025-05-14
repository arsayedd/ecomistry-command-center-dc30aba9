
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MediaBuyingFormValues } from "@/hooks/useMediaBuyingForm";

interface MediaBuyingMetricsFieldsProps {
  form: UseFormReturn<MediaBuyingFormValues>;
}

export const MediaBuyingMetricsFields = ({ form }: MediaBuyingMetricsFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Ad Spend */}
      <FormField
        control={form.control}
        name="ad_spend"
        render={({ field }) => (
          <FormItem>
            <FormLabel>مبلغ الإنفاق الإعلاني</FormLabel>
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

      {/* CPP (Calculated) */}
      <FormField
        control={form.control}
        name="cpp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPP (تكلفة الأوردر)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                readOnly
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ROAS */}
      <FormField
        control={form.control}
        name="roas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ROAS (عائد الإنفاق الإعلاني)</FormLabel>
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
    </div>
  );
};
