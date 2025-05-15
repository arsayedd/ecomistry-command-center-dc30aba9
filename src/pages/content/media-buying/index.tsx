
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContentMediaBuyingData } from "@/hooks/useContentMediaBuyingData";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import { ContentMediaBuyingFilters } from "@/components/content/media-buying/ContentMediaBuyingFilters";
import { ContentMediaBuyingTable } from "@/components/content/media-buying/ContentMediaBuyingTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export default function ContentMediaBuyingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { mediaBuying, loading, brands, employees, filters, handleFilterChange } = useContentMediaBuyingData();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

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
          toast({
            description: "يرجى تسجيل الدخول للوصول إلى هذه الصفحة",
          });
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

  // Filter media buying data based on search query
  const filteredData = mediaBuying.filter(item => 
    (item.platform && item.platform.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.brand?.name && item.brand.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.employee?.full_name && item.employee.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Export functions
  const handleExportCSV = () => {
    const exportData = prepareExportData(filteredData);
    exportToCSV(exportData, 'content_media_buying_data');
  };

  const handleExportExcel = () => {
    const exportData = prepareExportData(filteredData);
    exportToExcel(exportData, 'content_media_buying_data');
  };

  // Prepare data for export
  const prepareExportData = (data: any[]) => {
    return data.map(item => ({
      platform: getPlatformDisplay(item.platform),
      date: item.date,
      brand: item.brand?.name || '',
      employee: item.employee?.full_name || '',
      spend: item.spend,
      orders_count: item.orders_count,
      order_cost: item.order_cost,
      roas: item.roas,
      campaign_link: item.campaign_link || '',
      notes: item.notes || ''
    }));
  };

  // Map platform to Arabic
  const getPlatformDisplay = (platform: string) => {
    switch (platform) {
      case "facebook": return "فيسبوك";
      case "instagram": return "انستجرام";
      case "tiktok": return "تيكتوك";
      case "snapchat": return "سناب شات";
      case "google": return "جوجل";
      default: return platform || '';
    }
  };

  // Loading state while checking authentication
  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>جاري التحميل...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ميديا باينج المحتوى</h1>
        <Link to="/content/media-buying/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة حملة جديدة
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <ContentMediaBuyingFilters
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            platform={filters.platform || ''}
            onPlatformChange={(value) => handleFilterChange("platform", value)}
            brandId={filters.brand_id || ''}
            onBrandChange={(value) => handleFilterChange("brand_id", value)}
            onExportCSV={handleExportCSV}
            onExportExcel={handleExportExcel}
            brands={brands}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>حملات الميديا المرتبطة بالمحتوى</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentMediaBuyingTable 
            loading={loading} 
            data={filteredData} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
