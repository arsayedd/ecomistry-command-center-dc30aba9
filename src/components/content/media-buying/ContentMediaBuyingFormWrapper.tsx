
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ContentMediaBuyingBasicFields } from "@/components/content/ContentMediaBuyingBasicFields";
import { ContentMediaBuyingMetricsFields } from "@/components/content/ContentMediaBuyingMetricsFields";
import { ContentMediaBuyingAdditionalFields } from "@/components/content/ContentMediaBuyingAdditionalFields";

// Form schema definition
export const contentMediaBuyingFormSchema = z.object({
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
  task_type: z.string().min(1, { message: "يجب تحديد نوع المهمة" }),
  expected_delivery_date: z.date({
    required_error: "يجب اختيار تاريخ التسليم المتوقع",
  }),
});

export type ContentMediaBuyingFormValues = z.infer<typeof contentMediaBuyingFormSchema>;

export default function ContentMediaBuyingFormWrapper({ initialData }: { initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [brands, setBrands] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    fetchBrands();
    fetchEmployees();
  }, []);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching brands in form:", error);
        throw error;
      }

      setBrands(data || []);
    } catch (error) {
      console.error("Error fetching brands in form:", error);
      toast({
        description: "حدث خطأ أثناء محاولة جلب البراندات",
        variant: "destructive",
      });
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name")
        .order("full_name", { ascending: true });

      if (error) {
        console.error("Error fetching employees in form:", error);
        throw error;
      }

      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees in form:", error);
      toast({
        description: "حدث خطأ أثناء محاولة جلب بيانات الموظفين",
        variant: "destructive",
      });
    }
  };

  // Initialize form with default values
  const form = useForm<ContentMediaBuyingFormValues>({
    resolver: zodResolver(contentMediaBuyingFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      campaign_date: initialData.campaign_date ? new Date(initialData.campaign_date) : new Date(),
      expected_delivery_date: initialData.expected_delivery_date ? new Date(initialData.expected_delivery_date) : new Date(),
      ad_spend: initialData.ad_spend || initialData.spend || 0,
      orders_count: initialData.orders_count || 0,
      cpp: initialData.cpp || initialData.order_cost || 0,
      roas: initialData.roas || 0,
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
      task_type: "post",
      expected_delivery_date: new Date(),
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
  const onSubmit = async (values: ContentMediaBuyingFormValues) => {
    setLoading(true);
    try {
      console.log("Submitting form with values:", values);
      
      // First save the media buying data
      const mediaBuyingData = {
        platform: values.platform,
        date: values.campaign_date instanceof Date ? 
          format(values.campaign_date, "yyyy-MM-dd") : values.campaign_date,
        brand_id: values.brand_id,
        employee_id: values.employee_id,
        spend: values.ad_spend,
        orders_count: values.orders_count,
        order_cost: values.cpp,
        roas: values.roas,
        notes: values.notes,
        campaign_link: values.campaign_link,
      };
      
      console.log("Media buying data to save:", mediaBuyingData);
      
      let mediaBuyingId = initialData?.id;
      
      if (initialData?.id) {
        // Update existing media buying record
        const { error } = await supabase
          .from("media_buying")
          .update(mediaBuyingData)
          .eq("id", initialData.id);
          
        if (error) {
          console.error("Error updating media buying:", error);
          throw error;
        }
        
        console.log("Updated media buying record with ID:", initialData.id);
      } else {
        // Create new media buying record
        const { data, error } = await supabase
          .from("media_buying")
          .insert([mediaBuyingData])
          .select("id");
          
        if (error) {
          console.error("Error creating media buying:", error);
          throw error;
        }
        
        mediaBuyingId = data?.[0]?.id;
        console.log("Created new media buying record with ID:", mediaBuyingId);
      }
      
      // Now create or update the content task linking to the media buying record
      const contentTaskData = {
        brand_id: values.brand_id,
        employee_id: values.employee_id,
        task_type: values.task_type,
        expected_delivery_date: values.expected_delivery_date instanceof Date ?
          format(values.expected_delivery_date, "yyyy-MM-dd") : values.expected_delivery_date,
        media_campaign_id: mediaBuyingId,
        media_platform: values.platform,
        campaign_budget: values.ad_spend,
        status: "inProgress",
        notes: values.notes,
      };
      
      console.log("Content task data to save:", contentTaskData);
      
      if (initialData?.content_task_id) {
        // Update existing content task
        const { error } = await supabase
          .from("content_tasks")
          .update(contentTaskData)
          .eq("id", initialData.content_task_id);
          
        if (error) {
          console.error("Error updating content task:", error);
          throw error;
        }
        
        console.log("Updated content task with ID:", initialData.content_task_id);
        toast.success("تم تحديث حملة الميديا والمحتوى بنجاح");
      } else {
        // Create new content task
        const { error } = await supabase
          .from("content_tasks")
          .insert([contentTaskData]);
          
        if (error) {
          console.error("Error creating content task:", error);
          throw error;
        }
        
        console.log("Created new content task");
        toast.success("تم إضافة حملة الميديا والمحتوى بنجاح");
      }
      
      navigate("/content/media-buying");
    } catch (error: any) {
      console.error("Error saving content media buying data:", error);
      toast.error("حدث خطأ أثناء محاولة حفظ بيانات الحملة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>بيانات الحملة الإعلانية والمحتوى</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
