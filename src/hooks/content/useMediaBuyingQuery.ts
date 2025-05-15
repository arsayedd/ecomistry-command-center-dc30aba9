
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaBuyingRecord } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ContentFilters } from "./useContentFilters";

export const useMediaBuyingQuery = (filters: ContentFilters) => {
  const [mediaBuying, setMediaBuying] = useState<MediaBuyingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMediaBuyingData = async () => {
    setLoading(true);
    try {
      console.log("Fetching media buying data with filters:", filters);
      
      let query = supabase
        .from("media_buying")
        .select(`
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
        `)
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

      console.log("Fetched media buying records:", data?.length);
      
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
        brand: item.brand,
        employee: item.employee,
        brand_id: item.brand_id,
        employee_id: item.employee_id
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

  useEffect(() => {
    fetchMediaBuyingData();
  }, [filters]);

  return {
    mediaBuying,
    loading
  };
};
