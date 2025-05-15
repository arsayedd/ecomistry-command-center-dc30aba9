
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MediaBuying } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useMediaBuyingApi } from "./useMediaBuyingFormApi";

// Form schema definition
export const mediaBuyingFormSchema = z.object({
  platform: z.string().min(1, { message: "يجب تحديد المنصة" }),
  campaign_date: z.date({
    required_error: "يجب اختيار تاريخ الحملة",
  }),
  brand_id: z.string().min(1, { message: "يجب اختيار البراند" }),
  employee_id: z.string().min(1, { message: "يجب اختيار الموظف المسؤول" }),
  ad_spend: z.number().min(0, { message: "يجب إدخال مبلغ الإنفاق الإعلاني" }),
  orders_count: z.number().int().min(0, { message: "يجب إدخال عدد الأوردرات" }),
  cpp: z.number().min(0).optional(),
  roas: z.number().min(0).optional(),
  campaign_link: z.string().optional(),
  notes: z.string().optional(),
});

export type MediaBuyingFormValues = z.infer<typeof mediaBuyingFormSchema>;

export const useMediaBuyingForm = (initialData?: MediaBuying, onSubmit?: (data: MediaBuying) => void) => {
  const { brands, employees, loading, saveMediaBuying } = useMediaBuyingApi();
  const { toast } = useToast();

  // Initialize form with default values or existing data
  const form = useForm<MediaBuyingFormValues>({
    resolver: zodResolver(mediaBuyingFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      campaign_date: initialData.campaign_date ? new Date(initialData.campaign_date) : new Date(),
      ad_spend: initialData.ad_spend,
      orders_count: initialData.orders_count,
      cpp: initialData.cpp,
      roas: initialData.roas,
    } : {
      platform: "",
      campaign_date: new Date(),
      brand_id: "",
      employee_id: "",
      ad_spend: 0,
      orders_count: 0,
      cpp: 0,
      roas: 0,
      campaign_link: "",
      notes: "",
    },
  });

  // Calculate CPP when ad_spend or orders_count changes
  const adSpend = form.watch("ad_spend");
  const ordersCount = form.watch("orders_count");

  useEffect(() => {
    if (ordersCount > 0) {
      const cpp = adSpend / ordersCount;
      form.setValue("cpp", parseFloat(cpp.toFixed(2)));
    } else {
      form.setValue("cpp", 0);
    }
  }, [adSpend, ordersCount, form]);

  // Form submission handler
  const handleSubmit = async (values: MediaBuyingFormValues) => {
    try {
      const result = await saveMediaBuying(values as MediaBuying, initialData);
      
      if (result.success) {
        toast({
          title: result.message,
          variant: "default",
        });
        
        // Call the onSubmit callback with the form data if provided
        if (onSubmit) {
          onSubmit({
            ...values,
            id: initialData?.id
          } as MediaBuying);
        }
      } else {
        toast({
          title: "خطأ في حفظ البيانات",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ غير متوقع أثناء محاولة حفظ البيانات.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    brands,
    employees,
    loading,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
