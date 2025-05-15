
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMetricsData = (fromDate: string | null, toDate: string | null) => {
  const { toast } = useToast();
  
  // Query for total revenue
  const { 
    data: revenueData, 
    isLoading: revenueLoading, 
    error: revenueError 
  } = useQuery({
    queryKey: ['dashboard', 'revenue', fromDate, toDate],
    queryFn: async () => {
      try {
        if (!fromDate || !toDate) return 0;
        
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
  const { 
    data: expensesData, 
    isLoading: expensesLoading, 
    error: expensesError 
  } = useQuery({
    queryKey: ['dashboard', 'expenses', fromDate, toDate],
    queryFn: async () => {
      try {
        if (!fromDate || !toDate) return 0;
        
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
  const { 
    data: ordersData, 
    isLoading: ordersLoading, 
    error: ordersError 
  } = useQuery({
    queryKey: ['dashboard', 'orders', fromDate, toDate],
    queryFn: async () => {
      try {
        if (!fromDate || !toDate) return 0;
        
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
  const { 
    data: employeesCount, 
    isLoading: employeesLoading, 
    error: employeesError 
  } = useQuery({
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

  // Conversion rate calculation
  const { 
    data: conversionRate, 
    isLoading: conversionRateLoading, 
    error: conversionRateError 
  } = useQuery({
    queryKey: ['dashboard', 'conversion-rate', fromDate, toDate],
    queryFn: async () => {
      try {
        if (!fromDate || !toDate) return 0;
        
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
  
  // Calculate total profit
  const totalRevenue = revenueData || 0;
  const totalExpenses = expensesData || 0;
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  // Loading state for metrics
  const isLoading = 
    revenueLoading || 
    expensesLoading || 
    ordersLoading || 
    employeesLoading || 
    conversionRateLoading;

  // Check for errors in metrics queries
  const hasErrors = 
    revenueError || 
    expensesError || 
    ordersError || 
    employeesError ||
    conversionRateError;
    
  return {
    metrics: {
      totalRevenue,
      totalExpenses,
      totalProfit,
      profitMargin: parseFloat(profitMargin.toFixed(2)),
      totalOrders: ordersData || 0,
      employeesCount: employeesCount || 0,
      conversionRate: conversionRate || 0
    },
    isLoading,
    hasErrors
  };
};
