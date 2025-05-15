
import { useEffect } from "react";
import { useDateRangeFilter } from "@/hooks/dashboard/useDateRangeFilter";
import { useMetricsData } from "@/hooks/dashboard/useMetricsData";
import { useChartsData } from "@/hooks/dashboard/useChartsData";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";

export const useDashboardData = () => {
  const { toast } = useToast();
  const { dateRange, handleDateRangeChange, fromDate, toDate } = useDateRangeFilter();
  
  // Fetch metrics data
  const { metrics, isLoading: metricsLoading, hasErrors: metricsHasErrors } = useMetricsData(fromDate, toDate);
  
  // Fetch charts data
  const { charts, isLoading: chartsLoading, hasErrors: chartsHasErrors } = useChartsData(fromDate, toDate);
  
  // Combined loading state
  const isLoading = metricsLoading || chartsLoading;
  
  // Combined errors state
  const hasErrors = metricsHasErrors || chartsHasErrors;
  
  // Display toast error if any of the queries had an error
  useEffect(() => {
    if (hasErrors) {
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل بيانات لوحة المعلومات. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }, [hasErrors, toast]);
  
  return {
    dateRange,
    handleDateRangeChange,
    metrics,
    charts,
    isLoading,
    hasErrors
  };
};
