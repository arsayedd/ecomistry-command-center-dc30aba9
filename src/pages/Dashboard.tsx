
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    dateRange,
    handleDateRangeChange,
    metrics,
    charts,
    isLoading
  } = useDashboardData();
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Display toast error if any of the queries had an error
  useEffect(() => {
    if (!isLoading && 
        (metrics.totalRevenue === 0 && 
         metrics.totalExpenses === 0 && 
         metrics.totalOrders === 0)) {
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل بيانات لوحة المعلومات. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }, [isLoading, metrics, toast]);

  return (
    <div dir="rtl" className="p-6">
      <h1 className="text-3xl font-bold mb-6">لوحة المعلومات</h1>
      
      {/* Filters */}
      <DashboardFilters 
        dateRange={dateRange} 
        onDateRangeChange={handleDateRangeChange} 
      />
      
      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      ) : (
        <>
          {/* Key metrics */}
          <DashboardMetrics metrics={metrics} isLoading={isLoading} />
          
          {/* Charts */}
          <DashboardCharts charts={charts} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
