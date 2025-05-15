
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContentMediaBuyingData } from "@/hooks/useContentMediaBuyingData";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import { ContentMediaBuyingFilters } from "@/components/content/media-buying/ContentMediaBuyingFilters";
import { ContentMediaBuyingTable } from "@/components/content/media-buying/ContentMediaBuyingTable";

export default function ContentMediaBuyingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { mediaBuying, loading, brands, employees, filters, handleFilterChange } = useContentMediaBuyingData();

  // Filter media buying data based on search query
  const filteredData = mediaBuying.filter(item => 
    item.platform.includes(searchQuery) ||
    (item.brand?.name && item.brand.name.includes(searchQuery)) ||
    (item.employee?.full_name && item.employee.full_name.includes(searchQuery)) ||
    (item.notes && item.notes.includes(searchQuery))
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
      default: return platform;
    }
  };

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
            platform={filters.platform}
            onPlatformChange={(value) => handleFilterChange("platform", value)}
            brandId={filters.brand_id}
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
