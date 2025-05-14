
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Revenue } from "@/types";
import { RevenueBasicFields } from "./RevenueBasicFields";
import { RevenueCalculationFields } from "./RevenueCalculationFields";
import { useRevenueForm } from "@/hooks/useRevenueForm";

interface RevenueFormProps {
  initialData?: Revenue;
  onSave?: (data: any) => void;
}

export default function RevenueForm({ initialData, onSave }: RevenueFormProps) {
  const { form, brands, isSubmitting, handleSubmit } = useRevenueForm(initialData);

  const onSubmitSuccess = async (values: any) => {
    const success = await handleSubmit(values);
    if (success && onSave) {
      onSave(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitSuccess)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Fields (Date and Brand) */}
              <RevenueBasicFields form={form} brands={brands} />
              
              {/* Revenue Calculation Fields */}
              <RevenueCalculationFields form={form} />

              {/* Notes */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label htmlFor="notes" className="block text-sm font-medium">
                        ملاحظات
                      </label>
                      <Textarea
                        placeholder="أدخل ملاحظاتك هنا..."
                        className="resize-none"
                        {...field}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ الإيراد"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// For backward compatibility
export { default as RevenueForm } from "./RevenueForm";
