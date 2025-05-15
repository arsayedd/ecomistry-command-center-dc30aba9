
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brand, User, MediaBuying } from "@/types";
import { format } from "date-fns";

export const useMediaBuyingApi = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch brands and employees data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("*")
          .eq("status", "active");

        if (brandsError) throw brandsError;
        
        if (brandsData) {
          // Cast the data to match the Brand type
          const typedBrands: Brand[] = brandsData.map(brand => {
            let socialLinks: Brand["social_links"] = {};
            
            // Type-safely handle social_links if it exists and is an object
            if (brand.social_links && typeof brand.social_links === 'object') {
              const links = brand.social_links as Record<string, unknown>;
              socialLinks = {
                instagram: typeof links.instagram === 'string' ? links.instagram : '',
                facebook: typeof links.facebook === 'string' ? links.facebook : '',
                tiktok: typeof links.tiktok === 'string' ? links.tiktok : '',
                youtube: typeof links.youtube === 'string' ? links.youtube : '',
                linkedin: typeof links.linkedin === 'string' ? links.linkedin : '',
                website: typeof links.website === 'string' ? links.website : '',
              };
            }
            
            return {
              id: brand.id,
              name: brand.name,
              status: (brand.status || "active") as Brand['status'],
              product_type: brand.product_type || "",
              logo_url: brand.logo_url,
              description: brand.description,
              notes: brand.notes,
              social_links: socialLinks,
              created_at: brand.created_at || '',
              updated_at: brand.updated_at || ''
            };
          });
          
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

  // Save media buying data
  const saveMediaBuying = async (values: MediaBuying, initialData?: MediaBuying) => {
    setLoading(true);
    try {
      // Format the data for submission
      const formData = {
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
        created_at: new Date().toISOString(),
      };
      
      // If editing, update the record, otherwise insert
      if (initialData?.id) {
        const { error } = await supabase
          .from("media_buying")
          .update(formData)
          .eq("id", initialData.id);
          
        if (error) throw error;
        
        return { success: true, message: "تم تحديث الحملة بنجاح" };
      } else {
        const { error } = await supabase
          .from("media_buying")
          .insert([formData]);
          
        if (error) throw error;
        
        return { success: true, message: "تم إضافة الحملة بنجاح" };
      }
    } catch (error: any) {
      console.error("Error saving media buying data:", error);
      return { 
        success: false, 
        message: "حدث خطأ أثناء محاولة حفظ بيانات الحملة الإعلانية." 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    brands,
    employees,
    loading,
    saveMediaBuying,
  };
};
