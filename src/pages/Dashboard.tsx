
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    dateRange,
    handleDateRangeChange,
    metrics,
    charts,
    isLoading,
    hasErrors
  } = useDashboardData();
  
  // Handle refresh button click
  const handleRefresh = () => {
    handleDateRangeChange({ ...dateRange });
  };

  return (
    <div dir="rtl" className="p-6">
      <h1 className="text-3xl font-bold mb-6">لوحة المعلومات</h1>
      
      {/* Filters */}
      <DashboardFilters 
        dateRange={dateRange} 
        onDateRangeChange={handleDateRangeChange} 
      />
      
      {/* Error Alert */}
      {hasErrors && !isLoading && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ!</AlertTitle>
          <AlertDescription>
            حدث خطأ أثناء تحميل البيانات. يرجى التأكد من وجود الجداول المطلوبة في قاعدة البيانات أو حاول تحديث الصفحة.
          </AlertDescription>
        </Alert>
      )}
      
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
          <DashboardCharts 
            charts={charts} 
            isLoading={isLoading} 
            onRefresh={handleRefresh}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
