
import { useEffect } from "react";
import { useDateRangeFilter } from "@/hooks/dashboard/useDateRangeFilter";
import { useMetricsData } from "@/hooks/dashboard/useMetricsData";
import { useChartsData } from "@/hooks/dashboard/useChartsData";

export const useDashboardData = () => {
  const { dateRange, handleDateRangeChange, fromDate, toDate } = useDateRangeFilter();
  
  // Fetch metrics data
  const { metrics, isLoading: metricsLoading, hasErrors: metricsHasErrors } = useMetricsData(fromDate, toDate);
  
  // Fetch charts data
  const { charts, isLoading: chartsLoading, hasErrors: chartsHasErrors } = useChartsData(fromDate, toDate);
  
  // Combined loading state
  const isLoading = metricsLoading || chartsLoading;
  
  // Combined errors state
  const hasErrors = metricsHasErrors || chartsHasErrors;
  
  // Log any errors to console for debugging
  useEffect(() => {
    if (hasErrors) {
      console.error("Error loading dashboard data");
    }
  }, [hasErrors]);
  
  return {
    dateRange,
    handleDateRangeChange,
    metrics,
    charts,
    isLoading,
    hasErrors
  };
};
