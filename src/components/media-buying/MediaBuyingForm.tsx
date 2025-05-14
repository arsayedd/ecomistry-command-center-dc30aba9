
import React from "react";
import { MediaBuying } from "@/types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaBuyingForm } from "@/hooks/useMediaBuyingForm";
import { MediaBuyingBasicFields } from "./MediaBuyingBasicFields";
import { MediaBuyingMetricsFields } from "./MediaBuyingMetricsFields";
import { MediaBuyingAdditionalFields } from "./MediaBuyingAdditionalFields";

interface MediaBuyingFormProps {
  initialData?: MediaBuying;
  onSubmit: (data: MediaBuying) => void;
}

export default function MediaBuyingForm({ initialData, onSubmit }: MediaBuyingFormProps) {
  const { form, brands, employees, loading, handleSubmit } = useMediaBuyingForm(initialData, onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <MediaBuyingBasicFields 
              form={form}
              brands={brands} 
              employees={employees}
            />
            <MediaBuyingMetricsFields form={form} />
            <MediaBuyingAdditionalFields form={form} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ الحملة"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
