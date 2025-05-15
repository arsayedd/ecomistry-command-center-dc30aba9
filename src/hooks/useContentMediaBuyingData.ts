
import { useState, useEffect } from "react";
import { useContentFilters } from "@/hooks/content/useContentFilters";
import { useContentMediaBuyingQuery } from "@/hooks/content/useMediaBuyingQuery";
import { useBrandsData } from "@/hooks/content/useBrandsData";
import { useEmployeesData } from "@/hooks/content/useEmployeesData";
import { MediaBuyingRecord } from "@/types";
import { toast } from "sonner";

export const useContentMediaBuyingData = () => {
  const { filters, handleFilterChange, handleDateChange } = useContentFilters();
  const { mediaBuying, loading: mediaLoading } = useContentMediaBuyingQuery(filters);
  const { brands, loading: brandsLoading } = useBrandsData();
  const { employees, loading: employeesLoading } = useEmployeesData();
  const [error, setError] = useState<string | null>(null);

  // Calculate CPP for all records
  const processedMediaBuying = mediaBuying.map((record) => {
    // Calculate CPP if not already calculated
    if (!record.order_cost && record.orders_count > 0) {
      const calculatedCpp = record.spend / record.orders_count;
      return {
        ...record,
        order_cost: parseFloat(calculatedCpp.toFixed(2))
      };
    }
    return record;
  });

  // Show error toast when something fails
  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  // We consider loading as true if any of the queries are loading
  const loading = mediaLoading || brandsLoading || employeesLoading;

  // Aggregate statistics for dashboard
  const statistics = {
    totalSpend: processedMediaBuying.reduce((sum, item) => sum + (item.spend || 0), 0),
    totalOrders: processedMediaBuying.reduce((sum, item) => sum + (item.orders_count || 0), 0),
    averageCpp: processedMediaBuying.length > 0 ? 
      processedMediaBuying.reduce((sum, item) => sum + (item.order_cost || 0), 0) / processedMediaBuying.length : 
      0,
    averageRoas: processedMediaBuying.length > 0 ? 
      processedMediaBuying.reduce((sum, item) => sum + (item.roas || 0), 0) / processedMediaBuying.length : 
      0
  };

  // Platform distribution
  const platformStats = processedMediaBuying.reduce((acc: Record<string, number>, item) => {
    const platform = item.platform || 'unknown';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});

  return {
    mediaBuying: processedMediaBuying,
    loading,
    brands,
    employees,
    filters,
    statistics,
    platformStats,
    handleFilterChange,
    handleDateChange,
    error
  };
};
