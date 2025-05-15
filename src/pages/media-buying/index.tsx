
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MediaBuyingItem } from "@/types";
import MediaBuyingDataTable from "@/components/media-buying/MediaBuyingDataTable";
import MediaBuyingFilterCard from "@/components/media-buying/MediaBuyingFilterCard";
import MediaBuyingExportActions from "@/components/media-buying/MediaBuyingExportActions";

export default function MediaBuyingPage() {
  const [mediaBuying, setMediaBuying] = useState<MediaBuyingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [employees, setEmployees] = useState<{ id: string; full_name: string }[]>([]);
  const [filters, setFilters] = useState({
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
          const processedData: MediaBuyingItem[] = data.map(item => ({
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
            employee: item.employee ? {
              id: typeof item.employee === 'object' && item.employee && 'id' in item.employee ? item.employee.id : undefined,
              full_name: typeof item.employee === 'object' && item.employee && 'full_name' in item.employee ? 
                item.employee.full_name : "غير معروف"
            } : null
          }));
          
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إدارة ميديا بايينج</h1>
        <p className="text-gray-500">
          عرض وتعديل وإضافة بيانات ميديا بايينج للموظفين
        </p>
      </div>

      <MediaBuyingFilterCard 
        filters={filters}
        brands={brands}
        employees={employees}
        onFilterChange={handleFilterChange}
        onDateChange={handleDateChange}
      />

      <div className="my-6 flex justify-between items-center">
        <Button asChild>
          <Link to="/media-buying/add">إضافة ميديا بايينج</Link>
        </Button>
        <MediaBuyingExportActions mediaBuying={mediaBuying} />
      </div>

      <Card>
        <MediaBuyingDataTable loading={loading} mediaBuying={mediaBuying} />
      </Card>
    </div>
  );
}
