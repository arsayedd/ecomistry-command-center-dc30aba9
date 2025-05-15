
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Plus, Search } from "lucide-react";

export interface BrandsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter?: string;
  setStatusFilter?: (value: string) => void;
  categoryFilter?: string;
  setCategoryFilter?: (value: string) => void;
  onAddBrand?: () => void;
  onExport?: () => void;
}

export function BrandsFilters({
  searchTerm,
  setSearchTerm,
  statusFilter = "all",
  setStatusFilter = () => {},
  categoryFilter = "all",
  setCategoryFilter = () => {},
  onAddBrand,
  onExport
}: BrandsFiltersProps) {
  
  return (
    <div className="bg-card py-4 px-6 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث عن براند..."
            className="pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          {/* Status Filter */}
          <div className="w-full md:w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع البراندات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Category Filter */}
          <div className="w-full md:w-40">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="skincare">العناية بالبشرة</SelectItem>
                <SelectItem value="haircare">العناية بالشعر</SelectItem>
                <SelectItem value="makeup">المكياج</SelectItem>
                <SelectItem value="parfum">العطور</SelectItem>
                <SelectItem value="accessories">الإكسسوارات</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 mr-auto">
            {onExport && (
              <Button variant="outline" onClick={onExport}>
                تصدير
              </Button>
            )}
            
            {onAddBrand && (
              <Button onClick={onAddBrand}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة براند
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
