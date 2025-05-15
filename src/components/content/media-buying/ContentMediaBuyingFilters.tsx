
import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentMediaBuyingFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  platform: string | null;
  onPlatformChange: (value: string | null) => void;
  brandId: string | null;
  onBrandChange: (value: string | null) => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  brands: any[];
}

export function ContentMediaBuyingFilters({
  searchValue,
  onSearchChange,
  platform,
  onPlatformChange,
  brandId,
  onBrandChange,
  onExportCSV,
  onExportExcel,
  brands
}: ContentMediaBuyingFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="البحث عن حملات الميديا..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="w-full md:w-48">
        <Select 
          value={brandId || "all"} 
          onValueChange={(value) => onBrandChange(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="تصفية حسب البراند" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع البراندات</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-48">
        <Select 
          value={platform || "all"} 
          onValueChange={(value) => onPlatformChange(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="تصفية حسب المنصة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المنصات</SelectItem>
            <SelectItem value="facebook">فيسبوك</SelectItem>
            <SelectItem value="instagram">انستجرام</SelectItem>
            <SelectItem value="tiktok">تيكتوك</SelectItem>
            <SelectItem value="snapchat">سناب شات</SelectItem>
            <SelectItem value="google">جوجل</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExportCSV}>
          <Download className="h-4 w-4 ml-2" />
          CSV
        </Button>
        <Button variant="outline" onClick={onExportExcel}>
          <Download className="h-4 w-4 ml-2" />
          Excel
        </Button>
      </div>
    </div>
  );
}
