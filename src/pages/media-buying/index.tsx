
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import MediaBuyingDataTable from "@/components/media-buying/MediaBuyingDataTable";
import { MediaBuyingFilters } from "@/components/media-buying/MediaBuyingFilters";
import MediaBuyingPageHeader from "@/components/media-buying/MediaBuyingPageHeader";
import MediaBuyingDashboard from "@/components/media-buying/MediaBuyingDashboard";
import { useMediaBuyingData } from "@/hooks/useMediaBuyingData";
import { exportToCSV } from "@/utils/mediaBuyingUtils";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { MediaBuyingRecord } from "@/types";

export default function MediaBuyingPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const { user } = useAuth();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const {
    mediaBuying,
    loading,
    brands,
    employees,
    filters,
    handleFilterChange,
    handleDateChange
  } = useMediaBuyingData();

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          throw error;
        }
        
        if (!data.session) {
          console.log("User is not authenticated, redirecting to login");
          toast.error("يرجى تسجيل الدخول للوصول إلى هذه الصفحة");
          navigate("/auth/login");
          return;
        }
        
        console.log("Auth check complete");
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("فشل التحقق من حالة تسجيل الدخول");
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // تصفية بيانات الميديا بناءً على قيمة البحث
  const filteredData: MediaBuyingRecord[] = mediaBuying.filter((item: MediaBuyingRecord) => 
    item.platform.toLowerCase().includes(searchValue.toLowerCase()) ||
    (item.brand?.name && item.brand.name.toLowerCase().includes(searchValue.toLowerCase())) ||
    (item.employee?.full_name && item.employee.full_name.toLowerCase().includes(searchValue.toLowerCase()))
  );

  // التعامل مع التصدير إلى CSV
  const handleExportCSV = () => {
    exportToCSV(filteredData);
  };

  // التعامل مع إضافة سجل ميديا باينج جديد
  const handleAdd = () => {
    navigate("/media-buying/add");
  };

  // Loading state while checking authentication
  if (isAuthChecking || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>جاري التحميل...</span>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <MediaBuyingPageHeader mediaBuying={filteredData} onAdd={handleAdd} />
      
      {/* لوحة المعلومات والإحصائيات */}
      <MediaBuyingDashboard data={filteredData} />
      
      {/* عناصر التصفية */}
      <MediaBuyingFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        platform={filters.platform || ''}
        onPlatformChange={(value) => handleFilterChange("platform", value)}
        date={filters.date_from ? new Date(filters.date_from) : undefined}
        onDateChange={(date) => handleDateChange("date_from", date)}
        brandId={filters.brand_id || ''}
        onBrandChange={(value) => handleFilterChange("brand_id", value)}
        employeeId={filters.employee_id || ''}
        onEmployeeChange={(value) => handleFilterChange("employee_id", value)}
        onExport={handleExportCSV}
        onExportCSV={handleExportCSV}
        brands={brands}
        employees={employees}
      />

      <Card className="mt-6 shadow-sm">
        <MediaBuyingDataTable loading={loading} mediaBuying={filteredData} />
      </Card>
    </div>
  );
}
