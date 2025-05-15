
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

  // Filter media buying data based on search value
  const filteredData = mediaBuying.filter(item => 
    item.platform.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.brand?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    (item.employee?.full_name && item.employee.full_name.toLowerCase().includes(searchValue.toLowerCase()))
  );

  // Handle export to CSV
  const handleExportCSV = () => {
    exportToCSV(filteredData);
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    // PDF export implementation would be added here
    console.log("Export to PDF", filteredData);
  };

  // Handle adding a new media buying record
  const handleAdd = () => {
    navigate("/media-buying/add");
  };

  return (
    <div className="p-6">
      <MediaBuyingPageHeader mediaBuying={filteredData} onAdd={handleAdd} />
      
      {/* Dashboard metrics */}
      <MediaBuyingDashboard data={filteredData} />
      
      {/* Filters */}
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
        onExportPDF={handleExportPDF}
        brands={brands}
        employees={employees}
      />

      <Card>
        <MediaBuyingDataTable loading={loading} mediaBuying={filteredData} />
      </Card>
    </div>
  );
}
