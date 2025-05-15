
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, format } from "date-fns";

export const useDateRangeFilter = () => {
  // Default to last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: thirtyDaysAgo,
    to: today
  });
  
  const formatDateForQuery = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };
  
  // Handle date range changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };
  
  // Get the date filters as ISO strings for Supabase query
  const getDateFilter = () => {
    if (!dateRange?.from) return { fromDate: null, toDate: null };
    
    const fromDate = formatDateForQuery(startOfDay(dateRange.from));
    const toDate = dateRange.to ? formatDateForQuery(endOfDay(dateRange.to)) : fromDate;
    
    return { fromDate, toDate };
  };
  
  const { fromDate, toDate } = getDateFilter();
  
  return {
    dateRange,
    handleDateRangeChange,
    fromDate,
    toDate
  };
};
