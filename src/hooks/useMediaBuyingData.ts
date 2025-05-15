
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MediaBuyingItem, Brand, User } from "@/types";
import { format } from "date-fns";

interface MediaBuyingFilters {
  brand_id: string;
  platform: string;
  employee_id: string;
  date_from: string;
  date_to: string;
}

export const useMediaBuyingData = () => {
  const [mediaBuying, setMediaBuying] = useState<MediaBuyingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [filters, setFilters] = useState<MediaBuyingFilters>({
    brand_id: "",
    platform: "",
    employee_id: "",
    date_from: "",
    date_to: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase.from("brands").select("id, name, status, product_type, social_links");
        if (error) throw error;
        if (data) {
          // Convert the data to match the Brand type
          const typedBrands: Brand[] = data.map(brand => ({
            id: brand.id,
            name: brand.name,
            status: (brand.status || "active") as "active" | "inactive" | "pending",
            product_type: brand.product_type || "",
            social_links: typeof brand.social_links === 'object' ? 
              (brand.social_links as any || {}) : 
              { instagram: "", facebook: "", tiktok: "", youtube: "", linkedin: "", website: "" },
            description: "",
            notes: "",
            logo_url: "",
            created_at: "",
            updated_at: "",
          }));
          setBrands(typedBrands);
        }
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: `فشل في جلب بيانات البراندات: ${error.message}`,
          variant: "destructive",
        });
      }
    };

    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name, email, role, department, permission_level")
          .eq("role", "employee");
        if (error) throw error;
        if (data) {
          // Convert data to match the User type
          const typedEmployees = data.map(emp => ({
            id: emp.id,
            email: emp.email || "",
            full_name: emp.full_name || "",
            department: emp.department || "",
            role: emp.role || "",
            permission_level: emp.permission_level || "",
            employment_type: "full_time" as "full_time" | "part_time" | "contract",
            salary_type: "monthly" as "monthly" | "hourly" | "commission",
            status: "active" as "active" | "inactive" | "pending",
            access_rights: "view" as "admin" | "edit" | "view",
            commission_type: "percentage" as "percentage" | "fixed",
            commission_value: 0,
            job_title: "",
            created_at: "",
            updated_at: "",
          }));
          setEmployees(typedEmployees);
        }
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: `فشل في جلب بيانات الموظفين: ${error.message}`,
          variant: "destructive",
        });
      }
    };

    fetchBrands();
    fetchEmployees();
  }, [toast]);
  
  useEffect(() => {
    const fetchMediaBuying = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("media_buying")
          .select("*, brand:brand_id(*), employee:employee_id(*)");
        
        // Apply filters
        if (filters.brand_id) {
          query = query.eq("brand_id", filters.brand_id);
        }
        if (filters.platform) {
          query = query.eq("platform", filters.platform);
        }
        if (filters.employee_id) {
          query = query.eq("employee_id", filters.employee_id);
        }
        if (filters.date_from) {
          query = query.gte("date", filters.date_from);
        }
        if (filters.date_to) {
          query = query.lte("date", filters.date_to);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          // Process data to ensure proper structure with safe type handling
          const processedData: MediaBuyingItem[] = data.map(item => {
            // Type check for employee
            let employeeData: User | null = null;
            
            if (item.employee && typeof item.employee === 'object') {
              employeeData = {
                id: item.employee?.id || "",
                full_name: item.employee?.full_name || "غير معروف",
                email: item.employee?.email || "",
                department: item.employee?.department || "",
                role: item.employee?.role || "",
                permission_level: item.employee?.permission_level || "",
                employment_type: "full_time",
                salary_type: "monthly",
                status: "active",
                access_rights: "view",
                commission_type: "percentage",
                commission_value: 0,
                job_title: "",
                created_at: "",
                updated_at: ""
              };
            }

            // Type check for brand
            let brandData: Brand | null = null;
            if (item.brand && typeof item.brand === 'object') {
              brandData = {
                id: item.brand.id || "",
                name: item.brand.name || "غير معروف",
                status: (item.brand.status || "active") as "active" | "inactive" | "pending",
                product_type: item.brand.product_type || "",
                logo_url: "",
                description: "",
                notes: "",
                social_links: typeof item.brand.social_links === 'object' ? 
                  (item.brand.social_links as any || {}) : 
                  { instagram: "", facebook: "", tiktok: "", youtube: "", linkedin: "", website: "" },
                created_at: item.brand.created_at || "",
                updated_at: item.brand.updated_at || ""
              };
            }
            
            return {
              id: item.id,
              brand_id: item.brand_id,
              employee_id: item.employee_id,
              platform: item.platform,
              date: item.date,
              spend: item.spend,
              orders_count: item.orders_count,
              order_cost: item.order_cost,
              roas: (item as any).roas,
              campaign_link: (item as any).campaign_link,
              notes: (item as any).notes,
              created_at: item.created_at,
              updated_at: item.updated_at,
              brand: brandData,
              employee: employeeData
            };
          });
          
          setMediaBuying(processedData);
        }
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: `فشل في جلب بيانات الميديا بايينج: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMediaBuying();
  }, [filters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: format(date, "yyyy-MM-dd"),
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: "",
      }));
    }
  };

  return {
    mediaBuying,
    loading,
    brands,
    employees,
    filters,
    handleFilterChange,
    handleDateChange
  };
};
