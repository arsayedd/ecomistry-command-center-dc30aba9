
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, format } from "date-fns";

export const useDashboardData = () => {
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
    if (!dateRange?.from) return {};
    
    const fromDate = formatDateForQuery(startOfDay(dateRange.from));
    const toDate = dateRange.to ? formatDateForQuery(endOfDay(dateRange.to)) : fromDate;
    
    return { fromDate, toDate };
  };
  
  const { fromDate, toDate } = getDateFilter();
  
  // Query for total revenue
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['dashboard', 'revenue', fromDate, toDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenues')
        .select('total_revenue')
        .gte('date', fromDate)
        .lte('date', toDate);
        
      if (error) throw error;
      
      const totalRevenue = data.reduce((sum, item) => sum + (item.total_revenue || 0), 0);
      return totalRevenue;
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Query for expenses
  const { data: expensesData, isLoading: expensesLoading } = useQuery({
    queryKey: ['dashboard', 'expenses', fromDate, toDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .gte('date', fromDate)
        .lte('date', toDate);
      
      if (error) throw error;
      
      const totalExpenses = data.reduce((sum, item) => sum + (item.amount || 0), 0);
      return totalExpenses;
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Query for orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['dashboard', 'orders', fromDate, toDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('date', fromDate)
        .lte('date', toDate);
      
      if (error) throw error;
      
      return data.length;
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Query for employees count
  const { data: employeesCount, isLoading: employeesLoading } = useQuery({
    queryKey: ['dashboard', 'employees'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (error) throw error;
      
      return count || 0;
    }
  });
  
  // Query for revenue trend
  const { data: revenueTrend, isLoading: revenueTrendLoading } = useQuery({
    queryKey: ['dashboard', 'revenue-trend', fromDate, toDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenues')
        .select('date, total_revenue')
        .gte('date', fromDate)
        .lte('date', toDate)
        .order('date');
      
      if (error) throw error;
      
      // Aggregate by date
      const aggregatedData = data.reduce((acc, item) => {
        const date = item.date.substring(0, 10); // YYYY-MM-DD format
        
        if (!acc[date]) {
          acc[date] = {
            name: date,
            amount: 0
          };
        }
        
        acc[date].amount += item.total_revenue || 0;
        return acc;
      }, {} as Record<string, { name: string, amount: number }>);
      
      return Object.values(aggregatedData);
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Query for brands revenue
  const { data: brandsRevenue, isLoading: brandsRevenueLoading } = useQuery({
    queryKey: ['dashboard', 'brands-revenue', fromDate, toDate],
    queryFn: async () => {
      const { data: revenuesData, error: revenuesError } = await supabase
        .from('revenues')
        .select('brand_id, total_revenue')
        .gte('date', fromDate)
        .lte('date', toDate);
      
      if (revenuesError) throw revenuesError;
      
      // Get all brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('id, name');
      
      if (brandsError) throw brandsError;
      
      // Create a map of brand ids to names
      const brandMap = brandsData.reduce((acc, brand) => {
        acc[brand.id] = brand.name;
        return acc;
      }, {} as Record<string, string>);
      
      // Aggregate revenue by brand
      const aggregatedData = revenuesData.reduce((acc, item) => {
        if (!item.brand_id) return acc;
        
        const brandName = brandMap[item.brand_id] || 'غير معروف';
        
        if (!acc[item.brand_id]) {
          acc[item.brand_id] = {
            name: brandName,
            amount: 0
          };
        }
        
        acc[item.brand_id].amount += item.total_revenue || 0;
        return acc;
      }, {} as Record<string, { name: string, amount: number }>);
      
      // Convert to array and sort by amount
      return Object.values(aggregatedData)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);  // Get top 5 brands by revenue
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Conversion rate calculation
  const { data: conversionRate, isLoading: conversionRateLoading } = useQuery({
    queryKey: ['dashboard', 'conversion-rate', fromDate, toDate],
    queryFn: async () => {
      // Get total media buying metrics
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_buying')
        .select('spend, orders_count')
        .gte('date', fromDate)
        .lte('date', toDate);
      
      if (mediaError) throw mediaError;
      
      const totalAdSpend = mediaData.reduce((sum, item) => sum + (item.spend || 0), 0);
      const totalAdOrders = mediaData.reduce((sum, item) => sum + (item.orders_count || 0), 0);
      
      let rate = 0;
      
      // Calculate conversion rate - if there's no spend or no impressions data, default to 0
      if (totalAdSpend > 0) {
        rate = (totalAdOrders / totalAdSpend) * 100;
      }
      
      return parseFloat(rate.toFixed(2));
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Media spending distribution
  const { data: mediaSpending, isLoading: mediaSpendingLoading } = useQuery({
    queryKey: ['dashboard', 'media-spending', fromDate, toDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_buying')
        .select('platform, spend')
        .gte('date', fromDate)
        .lte('date', toDate);
      
      if (error) throw error;
      
      // Aggregate spend by platform
      const aggregatedData = data.reduce((acc, item) => {
        if (!item.platform) return acc;
        
        if (!acc[item.platform]) {
          acc[item.platform] = {
            name: item.platform,
            value: 0
          };
        }
        
        acc[item.platform].value += item.spend || 0;
        return acc;
      }, {} as Record<string, { name: string, value: number }>);
      
      // Convert to percentage of total
      const totalSpend = Object.values(aggregatedData).reduce((sum, item) => sum + item.value, 0);
      
      // Calculate percentages if there's spend data
      if (totalSpend > 0) {
        Object.values(aggregatedData).forEach(item => {
          item.value = parseFloat(((item.value / totalSpend) * 100).toFixed(1));
        });
      }
      
      return Object.values(aggregatedData);
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Employee performance data
  const { data: employeePerformance, isLoading: employeePerformanceLoading } = useQuery({
    queryKey: ['dashboard', 'employee-performance', fromDate, toDate],
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('call_center_orders')
        .select('employee_id, confirmed_orders')
        .gte('date', fromDate)
        .lte('date', toDate);
      
      if (ordersError) throw ordersError;
      
      // Get employee names
      const { data: employeesData, error: employeesError } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('department', 'call_center');
      
      if (employeesError) throw employeesError;
      
      // Create a map of employee ids to names
      const employeeMap = employeesData.reduce((acc, emp) => {
        acc[emp.id] = emp.full_name;
        return acc;
      }, {} as Record<string, string>);
      
      // Aggregate orders by employee
      const aggregatedData = ordersData.reduce((acc, item) => {
        if (!item.employee_id) return acc;
        
        const empName = employeeMap[item.employee_id] || 'غير معروف';
        
        if (!acc[item.employee_id]) {
          acc[item.employee_id] = {
            name: empName,
            orders: 0
          };
        }
        
        acc[item.employee_id].orders += item.confirmed_orders || 0;
        return acc;
      }, {} as Record<string, { name: string, orders: number }>);
      
      // Convert to array and sort by performance
      return Object.values(aggregatedData)
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);  // Get top 5 employees
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Calculate total profit
  const totalRevenue = revenueData || 0;
  const totalExpenses = expensesData || 0;
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  // Loading state for the whole dashboard
  const isLoading = 
    revenueLoading || 
    expensesLoading || 
    ordersLoading || 
    employeesLoading || 
    revenueTrendLoading || 
    brandsRevenueLoading || 
    conversionRateLoading ||
    mediaSpendingLoading ||
    employeePerformanceLoading;
  
  return {
    dateRange,
    handleDateRangeChange,
    metrics: {
      totalRevenue,
      totalExpenses,
      totalProfit,
      profitMargin: parseFloat(profitMargin.toFixed(2)),
      totalOrders: ordersData || 0,
      employeesCount: employeesCount || 0,
      conversionRate: conversionRate || 0
    },
    charts: {
      revenueTrend: revenueTrend || [],
      brandsRevenue: brandsRevenue || [],
      mediaSpending: mediaSpending || [],
      employeePerformance: employeePerformance || []
    },
    isLoading
  };
};
