
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MediaBuying, User, Brand } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Fetch brands and employees data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("*")
          .eq("status", "active");

        if (brandsError) throw brandsError;
        
        if (brandsData) {
          // Cast the data to match the Brand type
          const typedBrands: Brand[] = brandsData.map(brand => ({
            id: brand.id,
            name: brand.name,
            status: (brand.status || "active") as Brand['status'],
            product_type: brand.product_type || "",
            social_links: brand.social_links ? {
              instagram: brand.social_links.instagram as string,
              facebook: brand.social_links.facebook as string,
              tiktok: brand.social_links.tiktok as string,
              youtube: brand.social_links.youtube as string,
              linkedin: brand.social_links.linkedin as string,
              website: brand.social_links.website as string,
            } : {},
            created_at: brand.created_at || '',
            updated_at: brand.updated_at || ''
          }));
          
          setBrands(typedBrands);
        }

        // Fetch employees from media_buying department
        const { data: employeesData, error: employeesError } = await supabase
          .from("users")
          .select("*")
          .eq("department", "media_buying");

        if (employeesError) throw employeesError;
        
        if (employeesData) {
          // Cast the data to match User type
          const typedEmployees: User[] = employeesData.map(emp => ({
            id: emp.id,
            email: emp.email || '',
            full_name: emp.full_name || '',
            department: emp.department || '',
            role: emp.role || '',
            permission_level: emp.permission_level || '',
            employment_type: (emp.employment_type || 'full_time') as User['employment_type'],
            salary_type: (emp.salary_type || 'monthly') as User['salary_type'],
            status: (emp.status || 'active') as User['status'],
            access_rights: (emp.access_rights || 'view') as User['access_rights'],
            commission_type: (emp.commission_type || 'percentage') as User['commission_type'],
            commission_value: emp.commission_value || 0,
            job_title: emp.job_title || '',
            created_at: emp.created_at || '',
            updated_at: emp.updated_at || ''
          }));
          
          setEmployees(typedEmployees);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء محاولة جلب البراندات والموظفين.",
          variant: "destructive",
        });
      }
    }

    fetchData();
  }, [toast]);

  // Form submission handler
  const handleSubmit = async (values: MediaBuyingFormValues) => {
    setLoading(true);
    try {
      // Format the data for submission
      const formData = {
        platform: values.platform,
        date: format(values.campaign_date, "yyyy-MM-dd"),
        brand_id: values.brand_id,
        employee_id: values.employee_id,
        spend: values.ad_spend,
        orders_count: values.orders_count,
        order_cost: values.cpp,
        notes: values.notes,
        campaign_link: values.campaign_link,
        created_at: new Date().toISOString(),
      };
      
      // If editing, update the record, otherwise insert
      if (initialData?.id) {
        const { error } = await supabase
          .from("media_buying")
          .update(formData)
          .eq("id", initialData.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("media_buying")
          .insert([formData]);
          
        if (error) throw error;
      }
      
      // Call the onSubmit callback with the form data
      if (onSubmit) {
        onSubmit({
          ...values,
          id: initialData?.id
        } as MediaBuying);
      }

      toast({
        title: initialData ? "تم تحديث الحملة بنجاح" : "تم إضافة الحملة بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving media buying data:", error);
      toast({
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء محاولة حفظ بيانات الحملة الإعلانية.",
        variant: "destructive",
      });
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
};
