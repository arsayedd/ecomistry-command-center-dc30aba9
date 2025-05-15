
import React from "react";
import { Card } from "@/components/ui/card";
import MediaBuyingDataTable from "@/components/media-buying/MediaBuyingDataTable";
import MediaBuyingFilterCard from "@/components/media-buying/MediaBuyingFilterCard";
import MediaBuyingPageHeader from "@/components/media-buying/MediaBuyingPageHeader";
import { useMediaBuyingData } from "@/hooks/useMediaBuyingData";

export default function MediaBuyingPage() {
  const {
    mediaBuying,
    loading,
    brands,
    employees,
    filters,
    handleFilterChange,
    handleDateChange
  } = useMediaBuyingData();

  return (
    <div>
      <MediaBuyingPageHeader mediaBuying={mediaBuying} />
      
      <MediaBuyingFilterCard 
        filters={filters}
        brands={brands}
        employees={employees}
        onFilterChange={handleFilterChange}
        onDateChange={handleDateChange}
      />

      <Card>
        <MediaBuyingDataTable loading={loading} mediaBuying={mediaBuying} />
      </Card>
    </div>
  );
}
