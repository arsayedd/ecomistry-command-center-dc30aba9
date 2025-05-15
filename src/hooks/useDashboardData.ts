
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export const useDashboardData = () => {
  const { toast } = useToast();
  
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
  const { data: revenueData, isLoading: revenueLoading, error: revenueError } = useQuery({
    queryKey: ['dashboard', 'revenue', fromDate, toDate],
    queryFn: async () => {
      try {
        console.log('Fetching revenue data for:', { fromDate, toDate });
        const { data, error } = await supabase
          .from('revenues')
          .select('total_revenue')
          .gte('date', fromDate)
          .lte('date', toDate);
          
        if (error) {
          console.error('Revenue query error:', error);
          throw error;
        }
        
        console.log('Revenue data fetched:', data?.length || 0, 'records');
        const totalRevenue = data?.reduce((sum, item) => sum + (item.total_revenue || 0), 0) || 0;
        return totalRevenue;
      } catch (err) {
        console.error('Revenue fetch error:', err);
        throw err;
      }
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Query for expenses
  const { data: expensesData, isLoading: expensesLoading, error: expensesError } = useQuery({
    queryKey: ['dashboard', 'expenses', fromDate, toDate],
    queryFn: async () => {
      try {
        console.log('Fetching expenses data for:', { fromDate, toDate });
        const { data, error } = await supabase
          .from('expenses')
          .select('amount')
          .gte('date', fromDate)
          .lte('date', toDate);
        
        if (error) {
          console.error('Expenses query error:', error);
          throw error;
        }
        
        console.log('Expenses data fetched:', data?.length || 0, 'records');
        const totalExpenses = data?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
        return totalExpenses;
      } catch (err) {
        console.error('Expenses fetch error:', err);
        throw err;
      }
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Query for orders
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['dashboard', 'orders', fromDate, toDate],
    queryFn: async () => {
      try {
        console.log('Fetching orders data for:', { fromDate, toDate });
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .gte('date', fromDate)
          .lte('date', toDate);
        
        if (error) {
          console.error('Orders query error:', error);
          throw error;
        }
        
        console.log('Orders data fetched:', data?.length || 0, 'records');
        return data?.length || 0;
      } catch (err) {
        console.error('Orders fetch error:', err);
        throw err;
      }
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Query for employees count
  const { data: employeesCount, isLoading: employeesLoading, error: employeesError } = useQuery({
    queryKey: ['dashboard', 'employees'],
    queryFn: async () => {
      try {
        console.log('Fetching employees count');
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
        
        if (error) {
          console.error('Employees count query error:', error);
          throw error;
        }
        
        console.log('Employees count fetched:', count);
        return count || 0;
      } catch (err) {
        console.error('Employees count fetch error:', err);
        throw err;
      }
    }
  });
  
  // Query for revenue trend
  const { data: revenueTrend, isLoading: revenueTrendLoading, error: revenueTrendError } = useQuery({
    queryKey: ['dashboard', 'revenue-trend', fromDate, toDate],
    queryFn: async () => {
      try {
        console.log('Fetching revenue trend for:', { fromDate, toDate });
        const { data, error } = await supabase
          .from('revenues')
          .select('date, total_revenue')
          .gte('date', fromDate)
          .lte('date', toDate)
          .order('date');
        
        if (error) {
          console.error('Revenue trend query error:', error);
          throw error;
        }
        
        console.log('Revenue trend data fetched:', data?.length || 0, 'records');
        // Fallback to empty array if data is null
        if (!data || data.length === 0) {
          return [];
        }
        
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
      } catch (err) {
        console.error('Revenue trend fetch error:', err);
        throw err;
      }
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Query for brands revenue
  const { data: brandsRevenue, isLoading: brandsRevenueLoading, error: brandsRevenueError } = useQuery({
    queryKey: ['dashboard', 'brands-revenue', fromDate, toDate],
    queryFn: async () => {
      try {
        console.log('Fetching brands revenue for:', { fromDate, toDate });
        const { data: revenuesData, error: revenuesError } = await supabase
          .from('revenues')
          .select('brand_id, total_revenue')
          .gte('date', fromDate)
          .lte('date', toDate);
        
        if (revenuesError) {
          console.error('Brands revenue query error:', revenuesError);
          throw revenuesError;
        }
        
        console.log('Brands revenue data fetched:', revenuesData?.length || 0, 'records');
        // Fallback to empty array if data is null
        if (!revenuesData || revenuesData.length === 0) {
          return [];
        }
        
        // Get all brands
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('id, name');
        
        if (brandsError) {
          console.error('Brands query error:', brandsError);
          throw brandsError;
        }
        
        console.log('Brands data fetched:', brandsData?.length || 0, 'records');
        // Fallback to empty object if data is null
        const brandMap = brandsData?.reduce((acc, brand) => {
          acc[brand.id] = brand.name;
          return acc;
        }, {} as Record<string, string>) || {};
        
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
      } catch (err) {
        console.error('Brands revenue fetch error:', err);
        throw err;
      }
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Conversion rate calculation
  const { data: conversionRate, isLoading: conversionRateLoading, error: conversionRateError } = useQuery({
    queryKey: ['dashboard', 'conversion-rate', fromDate, toDate],
    queryFn: async () => {
      try {
        console.log('Fetching conversion rate for:', { fromDate, toDate });
        // Get total media buying metrics
        const { data: mediaData, error: mediaError } = await supabase
          .from('media_buying')
          .select('spend, orders_count')
          .gte('date', fromDate)
          .lte('date', toDate);
        
        if (mediaError) {
          console.error('Media buying query error:', mediaError);
          throw mediaError;
        }
        
        console.log('Media buying data fetched:', mediaData?.length || 0, 'records');
        // Fallback to empty array if data is null
        if (!mediaData || mediaData.length === 0) {
          return 0;
        }
        
        const totalAdSpend = mediaData.reduce((sum, item) => sum + (item.spend || 0), 0);
        const totalAdOrders = mediaData.reduce((sum, item) => sum + (item.orders_count || 0), 0);
        
        let rate = 0;
        
        // Calculate conversion rate - if there's no spend or no impressions data, default to 0
        if (totalAdSpend > 0) {
          rate = (totalAdOrders / totalAdSpend) * 100;
        }
        
        return parseFloat(rate.toFixed(2));
      } catch (err) {
        console.error('Conversion rate fetch error:', err);
        throw err;
      }
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Media spending distribution
  const { data: mediaSpending, isLoading: mediaSpendingLoading, error: mediaSpendingError } = useQuery({
    queryKey: ['dashboard', 'media-spending', fromDate, toDate],
    queryFn: async () => {
      try {
        console.log('Fetching media spending for:', { fromDate, toDate });
        const { data, error } = await supabase
          .from('media_buying')
          .select('platform, spend')
          .gte('date', fromDate)
          .lte('date', toDate);
        
        if (error) {
          console.error('Media spending query error:', error);
          throw error;
        }
        
        console.log('Media spending data fetched:', data?.length || 0, 'records');
        // Fallback to empty array if data is null
        if (!data || data.length === 0) {
          return [];
        }
        
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
      } catch (err) {
        console.error('Media spending fetch error:', err);
        throw err;
      }
    },
    enabled: !!fromDate && !!toDate
  });
  
  // Employee performance data
  const { data: employeePerformance, isLoading: employeePerformanceLoading, error: employeePerformanceError } = useQuery({
    queryKey: ['dashboard', 'employee-performance', fromDate, toDate],
    queryFn: async () => {
      try {
        console.log('Fetching employee performance for:', { fromDate, toDate });
        const { data: ordersData, error: ordersError } = await supabase
          .from('call_center_orders')
          .select('employee_id, confirmed_orders')
          .gte('date', fromDate)
          .lte('date', toDate);
        
        if (ordersError) {
          console.error('Call center orders query error:', ordersError);
          throw ordersError;
        }
        
        console.log('Call center orders data fetched:', ordersData?.length || 0, 'records');
        // Fallback to empty array if data is null
        if (!ordersData || ordersData.length === 0) {
          return [];
        }
        
        // Get employee names
        const { data: employeesData, error: employeesError } = await supabase
          .from('users')
          .select('id, full_name')
          .eq('department', 'call_center');
        
        if (employeesError) {
          console.error('Employees query error:', employeesError);
          throw employeesError;
        }
        
        console.log('Employees data fetched:', employeesData?.length || 0, 'records');
        // Fallback to empty object if data is null
        const employeeMap = employeesData?.reduce((acc, emp) => {
          acc[emp.id] = emp.full_name;
          return acc;
        }, {} as Record<string, string>) || {};
        
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
      } catch (err) {
        console.error('Employee performance fetch error:', err);
        throw err;
      }
    },
    enabled: !!fromDate && !!toDate
  });

  // Check for errors and display appropriate toast
  const hasErrors = revenueError || expensesError || ordersError || employeesError || 
                    revenueTrendError || brandsRevenueError || conversionRateError ||
                    mediaSpendingError || employeePerformanceError;
  
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
    isLoading,
    hasErrors
  };
};
