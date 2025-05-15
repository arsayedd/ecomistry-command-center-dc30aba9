
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import MediaBuyingDataTable from "@/components/media-buying/MediaBuyingDataTable";
import { MediaBuyingFilters } from "@/components/media-buying/MediaBuyingFilters";
import MediaBuyingPageHeader from "@/components/media-buying/MediaBuyingPageHeader";
import MediaBuyingDashboard from "@/components/media-buying/MediaBuyingDashboard";
import { useMediaBuyingData } from "@/hooks/useMediaBuyingData";
import { exportToCSV } from "@/utils/mediaBuyingUtils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MediaBuyingPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();
  
  const {
    mediaBuying,
    loading,
    brands,
    employees,
    filters,
    handleFilterChange,
    handleDateChange
  } = useMediaBuyingData();

  // Check authentication and authorization
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          toast({
            title: "خطأ في التحقق من حالة تسجيل الدخول",
            description: error.message,
            variant: "destructive",
          });
          navigate("/auth/login");
          return;
        }
        
        if (!data.session) {
          console.log("User is not authenticated, redirecting to login");
          toast({
            title: "يرجى تسجيل الدخول",
            description: "يجب تسجيل الدخول للوصول إلى هذه الصفحة",
            variant: "destructive",
          });
          navigate("/auth/login");
          return;
        }
        
        // Check user role (can be expanded based on your requirements)
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role, permission_level")
          .eq("id", data.session.user.id)
          .single();
        
        if (userError) {
          console.error("User data fetch error:", userError);
          toast({
            title: "خطأ في التحقق من صلاحيات المستخدم",
            description: userError.message,
            variant: "destructive",
          });
          setIsAuthorized(false);
        } else {
          // Check if user has appropriate role/permissions
          const hasAccess = 
            userData.role === 'admin' || 
            userData.role === 'manager' || 
            userData.permission_level === 'admin' ||
            userData.permission_level === 'edit';
          
          setIsAuthorized(hasAccess);
          
          if (!hasAccess) {
            toast({
              title: "غير مصرح",
              description: "ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة",
              variant: "destructive",
            });
          }
        }
        
        console.log("Auth check complete");
      } catch (error: any) {
        console.error("Auth check failed:", error);
        toast({
          title: "خطأ في التحقق من حالة تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  // Filter data based on search value
  const filteredData = mediaBuying.filter(item => 
    item.platform.toLowerCase().includes(searchValue.toLowerCase()) ||
    (item.brand?.name && item.brand.name.toLowerCase().includes(searchValue.toLowerCase())) ||
    (item.employee?.full_name && item.employee.full_name.toLowerCase().includes(searchValue.toLowerCase()))
  );

  // Export to CSV
  const handleExportCSV = () => {
    exportToCSV(filteredData);
    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير بيانات الميديا باينج بنجاح",
    });
  };

  // Add new media buying record
  const handleAdd = () => {
    navigate("/media-buying/add");
  };

  // Show loading state during auth check
  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  // Show access denied state
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">غير مصرح بالوصول</h1>
        <p className="text-gray-600 mb-6">
          ليس لديك الصلاحيات اللازمة للوصول إلى صفحة الميديا باينج.
        </p>
        <Button onClick={() => navigate("/")}>
          العودة إلى الصفحة الرئيسية
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <MediaBuyingPageHeader mediaBuying={filteredData} onAdd={handleAdd} />
      
      {/* Dashboard with metrics and statistics */}
      <MediaBuyingDashboard data={filteredData} />
      
      {/* Filters */}
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
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>جاري تحميل البيانات...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-xl font-medium mb-2">لا توجد بيانات</h3>
            <p className="text-gray-500 mb-6">لم يتم العثور على حملات ميديا باينج تطابق معايير البحث</p>
            <Button onClick={handleAdd}>إضافة حملة جديدة</Button>
          </div>
        ) : (
          <MediaBuyingDataTable loading={loading} mediaBuying={filteredData} />
        )}
      </Card>
    </div>
  );
}
