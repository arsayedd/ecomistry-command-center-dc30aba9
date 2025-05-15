
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ContentMediaBuyingFormValues } from "./ContentMediaBuyingForm";

interface ContentMediaBuyingAdditionalFieldsProps {
  form: UseFormReturn<ContentMediaBuyingFormValues>;
}

export function ContentMediaBuyingAdditionalFields({ form }: ContentMediaBuyingAdditionalFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Campaign Link */}
      <FormField
        control={form.control}
        name="campaign_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>رابط الحملة</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="https://"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Notes */}
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ملاحظات</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none"
                placeholder="أدخل ملاحظات أو تعديلات مطلوبة"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
