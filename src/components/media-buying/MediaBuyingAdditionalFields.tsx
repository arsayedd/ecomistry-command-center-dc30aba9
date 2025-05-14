
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MediaBuyingFormValues } from "@/hooks/useMediaBuyingForm";

interface MediaBuyingAdditionalFieldsProps {
  form: UseFormReturn<MediaBuyingFormValues>;
}

export const MediaBuyingAdditionalFields = ({ form }: MediaBuyingAdditionalFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                {...field}
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
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
