
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import MediaBuyingDataTable from "@/components/media-buying/MediaBuyingDataTable";
import { MediaBuyingFilters } from "@/components/media-buying/MediaBuyingFilters";
import MediaBuyingPageHeader from "@/components/media-buying/MediaBuyingPageHeader";
import MediaBuyingDashboard from "@/components/media-buying/MediaBuyingDashboard";
import { useMediaBuyingData } from "@/hooks/useMediaBuyingData";
import { exportToCSV } from "@/utils/mediaBuyingUtils";
import { useNavigate } from "react-router-dom";

export default function MediaBuyingPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const {
    mediaBuying,
    loading,
    brands,
    employees,
    filters,
    handleFilterChange,
    handleDateChange
  } = useMediaBuyingData();

  // تصفية بيانات الميديا بناءً على قيمة البحث
  const filteredData = mediaBuying.filter(item => 
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

  return (
    <div className="p-6" dir="rtl">
      <MediaBuyingPageHeader mediaBuying={filteredData} onAdd={handleAdd} />
      
      {/* لوحة المعلومات والإحصائيات */}
      <MediaBuyingDashboard data={filteredData} />
      
      {/* عناصر التصفية */}
      <MediaBuyingFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        platform={filters.platform}
        onPlatformChange={(value) => handleFilterChange("platform", value)}
        date={filters.date_from ? new Date(filters.date_from) : undefined}
        onDateChange={(date) => handleDateChange("date_from", date)}
        brandId={filters.brand_id}
        onBrandChange={(value) => handleFilterChange("brand_id", value)}
        employeeId={filters.employee_id}
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
