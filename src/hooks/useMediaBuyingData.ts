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
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [employees, setEmployees] = useState<{ id: string; full_name: string }[]>([]);
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
        const { data, error } = await supabase.from("brands").select("id, name");
        if (error) throw error;
        if (data) setBrands(data);
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
          .select("id, full_name")
          .eq("role", "employee");
        if (error) throw error;
        if (data) setEmployees(data);
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
            const employee = item.employee ? (typeof item.employee === 'object' ? item.employee : null) : null;
            
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
              brand: item.brand,
              employee: employee ? {
                id: employee?.id || "",
                full_name: employee?.full_name || "غير معروف"
              } : null
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
