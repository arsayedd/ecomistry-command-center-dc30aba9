
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChartsData = (fromDate: string | null, toDate: string | null) => {
  // Query for revenue trend
  const { 
    data: revenueTrend, 
    isLoading: revenueTrendLoading, 
    error: revenueTrendError 
  } = useQuery({
    queryKey: ['dashboard', 'revenue-trend', fromDate, toDate],
    queryFn: async () => {
      try {
        if (!fromDate || !toDate) return [];
        
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
  const { 
    data: brandsRevenue, 
    isLoading: brandsRevenueLoading, 
    error: brandsRevenueError 
  } = useQuery({
    queryKey: ['dashboard', 'brands-revenue', fromDate, toDate],
    queryFn: async () => {
      try {
        if (!fromDate || !toDate) return [];
        
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
  
  // Media spending distribution
  const { 
    data: mediaSpending, 
    isLoading: mediaSpendingLoading, 
    error: mediaSpendingError 
  } = useQuery({
    queryKey: ['dashboard', 'media-spending', fromDate, toDate],
    queryFn: async () => {
      try {
        if (!fromDate || !toDate) return [];
        
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
        
        // Calculate percentages if there's spend data
        const totalSpend = Object.values(aggregatedData).reduce((sum, item) => sum + item.value, 0);
        
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
  const { 
    data: employeePerformance, 
    isLoading: employeePerformanceLoading, 
    error: employeePerformanceError 
  } = useQuery({
    queryKey: ['dashboard', 'employee-performance', fromDate, toDate],
    queryFn: async () => {
      try {
        if (!fromDate || !toDate) return [];
        
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
  
  // Loading state for charts
  const isLoading = 
    revenueTrendLoading || 
    brandsRevenueLoading || 
    mediaSpendingLoading || 
    employeePerformanceLoading;
    
  // Check for errors in charts queries
  const hasErrors = 
    revenueTrendError || 
    brandsRevenueError || 
    mediaSpendingError || 
    employeePerformanceError;
  
  return {
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
