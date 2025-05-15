
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ContentMediaBuyingBasicFields } from "./ContentMediaBuyingBasicFields";
import { ContentMediaBuyingMetricsFields } from "./ContentMediaBuyingMetricsFields";
import { ContentMediaBuyingAdditionalFields } from "./ContentMediaBuyingAdditionalFields";

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

export default function ContentMediaBuyingForm({ initialData }: { initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [brands, setBrands] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  React.useEffect(() => {
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
        throw error;
      }

      setBrands(data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name")
        .order("full_name", { ascending: true });

      if (error) {
        throw error;
      }

      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Initialize form with default values
  const form = useForm<ContentMediaBuyingFormValues>({
    resolver: zodResolver(contentMediaBuyingFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      campaign_date: initialData.campaign_date ? new Date(initialData.campaign_date) : new Date(),
      expected_delivery_date: initialData.expected_delivery_date ? new Date(initialData.expected_delivery_date) : new Date(),
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
      task_type: "post",
      expected_delivery_date: new Date(),
    },
  });

  // Calculate CPP when ad_spend or orders_count changes
  const adSpend = form.watch("ad_spend");
  const ordersCount = form.watch("orders_count");

  React.useEffect(() => {
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
      
      let mediaBuyingId = initialData?.id;
      
      if (initialData?.id) {
        // Update existing media buying record
        const { error } = await supabase
          .from("media_buying")
          .update(mediaBuyingData)
          .eq("id", initialData.id);
          
        if (error) throw error;
      } else {
        // Create new media buying record
        const { data, error } = await supabase
          .from("media_buying")
          .insert([mediaBuyingData])
          .select("id");
          
        if (error) throw error;
        
        mediaBuyingId = data[0].id;
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
      
      if (initialData?.content_task_id) {
        // Update existing content task
        const { error } = await supabase
          .from("content_tasks")
          .update(contentTaskData)
          .eq("id", initialData.content_task_id);
          
        if (error) throw error;
        
        toast.success("تم تحديث حملة الميديا والمحتوى بنجاح");
      } else {
        // Create new content task
        const { error } = await supabase
          .from("content_tasks")
          .insert([contentTaskData]);
          
        if (error) throw error;
        
        toast.success("تم إضافة حملة الميديا والمحتوى بنجاح");
      }
      
      navigate("/content");
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
              <Button variant="outline" type="button" onClick={() => navigate("/content")}>
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
