
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Form schema definition
export const contentMediaBuyingFormSchema = z.object({
  platform: z.string({
    required_error: "يجب اختيار المنصة"
  }),
  campaign_date: z.date({
    required_error: "يجب اختيار تاريخ الحملة"
  }),
  task_type: z.string({
    required_error: "يجب اختيار نوع المهمة"
  }),
  expected_delivery_date: z.date({
    required_error: "يجب اختيار تاريخ التسليم المتوقع"
  }),
  brand_id: z.string({
    required_error: "يجب اختيار البراند"
  }),
  employee_id: z.string({
    required_error: "يجب اختيار الموظف المسؤول"
  }),
  ad_spend: z.number().min(0),
  orders_count: z.number().int().min(0),
  cpp: z.number().min(0).optional(),
  roas: z.number().min(0).optional(),
  campaign_link: z.string().optional(),
  notes: z.string().optional(),
  content_task_id: z.string().optional()
});

export type ContentMediaBuyingFormValues = z.infer<typeof contentMediaBuyingFormSchema>;

export function useContentMediaBuyingForm(initialData?: any) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  // Fetch brands and employees
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("id, name")
          .order("name");

        if (brandsError) throw brandsError;
        setBrands(brandsData || []);

        const { data: employeesData, error: employeesError } = await supabase
          .from("users")
          .select("id, full_name")
          .order("full_name");

        if (employeesError) throw employeesError;
        setEmployees(employeesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("فشل في جلب البيانات الأساسية");
      }
    }

    fetchData();
  }, []);

  // Initialize form with default values or existing data
  const form = useForm<ContentMediaBuyingFormValues>({
    resolver: zodResolver(contentMediaBuyingFormSchema),
    defaultValues: initialData 
      ? {
          ...initialData,
          campaign_date: initialData.campaign_date ? new Date(initialData.campaign_date) : new Date(),
          expected_delivery_date: initialData.expected_delivery_date ? new Date(initialData.expected_delivery_date) : new Date(),
          ad_spend: initialData.ad_spend || 0,
          orders_count: initialData.orders_count || 0,
          cpp: initialData.cpp || 0,
          roas: initialData.roas || 0,
        }
      : {
          platform: "",
          campaign_date: new Date(),
          task_type: "post",
          expected_delivery_date: new Date(),
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
  const handleSubmit = async (values: ContentMediaBuyingFormValues) => {
    setLoading(true);
    try {
      console.log("Submitting form with values:", values);

      // First, save the media buying record
      const mediaBuyingData = {
        platform: values.platform,
        date: values.campaign_date instanceof Date 
          ? values.campaign_date.toISOString().split('T')[0] 
          : values.campaign_date,
        brand_id: values.brand_id,
        employee_id: values.employee_id,
        spend: values.ad_spend,
        orders_count: values.orders_count,
        order_cost: values.cpp,
        roas: values.roas,
        campaign_link: values.campaign_link,
        notes: values.notes
      };

      let mediaBuyingId;
      
      if (initialData?.id) {
        // Update existing media buying record
        const { error: updateError } = await supabase
          .from("media_buying")
          .update(mediaBuyingData)
          .eq("id", initialData.id);
          
        if (updateError) throw updateError;
        mediaBuyingId = initialData.id;
        
        console.log("Updated media buying record:", initialData.id);
      } else {
        // Create new media buying record
        const { data: newMediaBuying, error: insertError } = await supabase
          .from("media_buying")
          .insert([mediaBuyingData])
          .select();
          
        if (insertError) throw insertError;
        mediaBuyingId = newMediaBuying?.[0]?.id;
        
        console.log("Created new media buying record:", mediaBuyingId);
      }

      // Then, save or update the related content task
      const contentTaskData = {
        task_type: values.task_type,
        expected_delivery_date: values.expected_delivery_date instanceof Date
          ? values.expected_delivery_date.toISOString().split('T')[0]
          : values.expected_delivery_date,
        brand_id: values.brand_id,
        employee_id: values.employee_id,
        status: "pending",
        media_platform: values.platform,
        media_campaign_id: mediaBuyingId
      };
      
      if (values.content_task_id) {
        // Update existing content task
        const { error: taskUpdateError } = await supabase
          .from("content_tasks")
          .update(contentTaskData)
          .eq("id", values.content_task_id);
          
        if (taskUpdateError) throw taskUpdateError;
        console.log("Updated content task:", values.content_task_id);
      } else {
        // Create new content task
        const { data: newTask, error: taskInsertError } = await supabase
          .from("content_tasks")
          .insert([contentTaskData])
          .select();
          
        if (taskInsertError) throw taskInsertError;
        console.log("Created new content task:", newTask?.[0]?.id);
      }

      toast.success(initialData ? "تم تحديث الحملة بنجاح" : "تم إضافة الحملة بنجاح");
      navigate("/content/media-buying");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    brands,
    employees,
    loading,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
}
