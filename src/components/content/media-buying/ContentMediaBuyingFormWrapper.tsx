
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ContentMediaBuyingBasicFields } from "@/components/content/ContentMediaBuyingBasicFields";
import { ContentMediaBuyingMetricsFields } from "@/components/content/ContentMediaBuyingMetricsFields";
import { ContentMediaBuyingAdditionalFields } from "@/components/content/ContentMediaBuyingAdditionalFields";
import { useContentMediaBuyingForm } from "@/hooks/useContentMediaBuyingForm";

export { contentMediaBuyingFormSchema, type ContentMediaBuyingFormValues } from "@/hooks/useContentMediaBuyingForm";

export default function ContentMediaBuyingFormWrapper({ initialData }: { initialData?: any }) {
  const navigate = useNavigate();
  const { form, brands, employees, loading, handleSubmit } = useContentMediaBuyingForm(initialData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>بيانات الحملة الإعلانية والمحتوى</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <ContentMediaBuyingBasicFields form={form} brands={brands} employees={employees} />
            <ContentMediaBuyingMetricsFields form={form} />
            <ContentMediaBuyingAdditionalFields form={form} />

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => navigate("/content/media-buying")}>
                إلغاء
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
