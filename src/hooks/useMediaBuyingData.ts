
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaBuyingRecord } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface Filters {
  platform: string | null;
  date_from: string | null;
  brand_id: string | null;
  employee_id: string | null;
}

export const useMediaBuyingData = () => {
  const [mediaBuying, setMediaBuying] = useState<MediaBuyingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>({
    platform: null,
    date_from: null,
    brand_id: null,
    employee_id: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMediaBuyingData();
    fetchBrands();
    fetchEmployees();
  }, [filters]);

  const fetchMediaBuyingData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("media_buying")
        .select(
          `
          id,
          platform,
          date,
          spend,
          orders_count,
          order_cost,
          roas,
          notes,
          campaign_link,
          created_at,
          updated_at,
          brand_id,
          employee_id,
          brand:brand_id (
            id,
            name
          ),
          employee:employee_id (
            id,
            full_name,
            email,
            department,
            role,
            permission_level
          )
        `
        )
        .order("date", { ascending: false });

      // Apply filters
      if (filters.platform) {
        query = query.eq("platform", filters.platform);
      }
      if (filters.date_from) {
        query = query.gte("date", filters.date_from);
      }
      if (filters.brand_id) {
        query = query.eq("brand_id", filters.brand_id);
      }
      if (filters.employee_id) {
        query = query.eq("employee_id", filters.employee_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Media buying fetch error:", error);
        throw error;
      }

      // Map the data to include brand name and employee full_name
      const mappedData = data?.map((item: any) => ({
        id: item.id,
        platform: item.platform,
        date: item.date,
        spend: item.spend,
        orders_count: item.orders_count,
        order_cost: item.order_cost,
        roas: item.roas,
        notes: item.notes,
        campaign_link: item.campaign_link,
        created_at: item.created_at,
        updated_at: item.updated_at,
        brand_id: item.brand_id,
        employee_id: item.employee_id,
        brand: item.brand,
        employee: item.employee
      })) as MediaBuyingRecord[];

      setMediaBuying(mappedData || []);
    } catch (error) {
      console.error("Error fetching media buying data:", error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء محاولة جلب بيانات الميديا باينج",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Brands fetch error:", error);
        throw error;
      }

      setBrands(data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast({
        title: "خطأ في جلب البيانات",
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
        console.error("Employees fetch error:", error);
        throw error;
      }

      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء محاولة جلب بيانات الموظفين",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (filterName: string, value: string | null) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleDateChange = (filterName: string, date: Date | undefined) => {
    const value = date ? date.toISOString().split('T')[0] : null;
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
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
