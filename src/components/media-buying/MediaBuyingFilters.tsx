
import React from "react";
import { FilterBar } from "@/components/shared/FilterBar";
import { PlatformSelect } from "./filters/PlatformSelect";
import { DatePicker } from "./filters/DatePicker";
import { EntitySelect } from "./filters/EntitySelect";
import { ExportActions } from "./filters/ExportActions";
import { Brand, User } from "@/types";

interface MediaBuyingFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  platform: string;
  onPlatformChange: (value: string) => void;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  brandId: string;
  onBrandChange: (value: string) => void;
  employeeId: string;
  onEmployeeChange: (value: string) => void;
  onExport: () => void;
  onExportCSV?: () => void;
  brands: Brand[];
  employees: User[];
}

export function MediaBuyingFilters({
  searchValue,
  onSearchChange,
  platform,
  onPlatformChange,
  date,
  onDateChange,
  brandId,
  onBrandChange,
  employeeId,
  onEmployeeChange,
  onExport,
  onExportCSV,
  brands,
  employees,
}: MediaBuyingFiltersProps) {
  return (
    <FilterBar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="بحث في الحملات..."
      onExport={onExport}
    >
      {/* Platform Filter */}
      <PlatformSelect value={platform} onChange={onPlatformChange} />

      {/* Date Filter */}
      <DatePicker date={date} onChange={onDateChange} />

      {/* Brand Filter */}
      <EntitySelect
        value={brandId}
        onChange={onBrandChange}
        entities={brands}
        placeholder="البراند"
        emptyLabel="كل البراندات"
      />

      {/* Employee Filter */}
      <EntitySelect
        value={employeeId}
        onChange={onEmployeeChange}
        entities={employees}
        placeholder="الموظف"
        emptyLabel="كل الموظفين"
      />

      {/* Export Actions */}
      <ExportActions onExportCSV={onExportCSV} />
    </FilterBar>
  );
}
