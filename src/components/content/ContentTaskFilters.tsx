
import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentTaskFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterBrand: string;
  onFilterBrandChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  onExport: () => void;
}

export function ContentTaskFilters({
  searchQuery,
  onSearchChange,
  filterBrand,
  onFilterBrandChange,
  filterType,
  onFilterTypeChange,
  onExport
}: ContentTaskFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="البحث عن مهام كتابة المحتوى..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="w-full md:w-48">
        <Select value={filterBrand} onValueChange={onFilterBrandChange}>
          <SelectTrigger>
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="تصفية حسب البراند" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع البراندات</SelectItem>
            <SelectItem value="براند أ">براند أ</SelectItem>
            <SelectItem value="براند ب">براند ب</SelectItem>
            <SelectItem value="براند ج">براند ج</SelectItem>
            <SelectItem value="براند د">براند د</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-48">
        <Select value={filterType} onValueChange={onFilterTypeChange}>
          <SelectTrigger>
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="تصفية حسب النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="post">بوست</SelectItem>
            <SelectItem value="reel">رييل</SelectItem>
            <SelectItem value="ad">إعلان</SelectItem>
            <SelectItem value="landingPage">صفحة هبوط</SelectItem>
            <SelectItem value="product">منتج</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button variant="outline" className="w-full md:w-auto" onClick={onExport}>
        <Download className="h-4 w-4 ml-2" />
        تصدير
      </Button>
    </div>
  );
}
