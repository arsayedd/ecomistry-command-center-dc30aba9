
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ContentMediaBuyingBasicFields } from "@/components/content/ContentMediaBuyingBasicFields";
import { ContentMediaBuyingMetricsFields } from "@/components/content/ContentMediaBuyingMetricsFields";
import { ContentMediaBuyingAdditionalFields } from "@/components/content/ContentMediaBuyingAdditionalFields";
import { ContentMediaBuyingFormActions } from "@/components/content/media-buying/ContentMediaBuyingFormActions";
import { useContentMediaBuyingForm } from "@/hooks/useContentMediaBuyingForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ContentMediaBuyingFormWrapper = ({ initialData }: { initialData?: any }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, brands, employees, loading, handleSubmit } = useContentMediaBuyingForm(
    initialData,
    (data) => {
      // Handle successful submission
      setIsSubmitting(false);
      
      // Show success message
      toast.success(initialData ? "تم تحديث الحملة بنجاح" : "تم إضافة الحملة بنجاح");
      
      // Navigate back to media buying page
      setTimeout(() => {
        navigate("/content/media-buying");
      }, 500);
    }
  );

  // Handle form submission
  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await handleSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleCancel = () => {
    navigate("/content/media-buying");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>جاري التحميل...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "تعديل حملة ميديا باينج" : "إضافة حملة ميديا باينج جديدة"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h3 className="text-lg font-medium">البيانات الأساسية</h3>
            <ContentMediaBuyingBasicFields 
              form={form} 
              brands={brands} 
              employees={employees} 
            />

            <h3 className="text-lg font-medium">مؤشرات الأداء</h3>
            <ContentMediaBuyingMetricsFields form={form} />

            <h3 className="text-lg font-medium">بيانات إضافية</h3>
            <ContentMediaBuyingAdditionalFields form={form} />

            <ContentMediaBuyingFormActions 
              isSubmitting={isSubmitting} 
              onCancel={handleCancel} 
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContentMediaBuyingFormWrapper;
