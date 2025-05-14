
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterBrand: string;
  setFilterBrand: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  brands: { id: string; name: string }[];
}

export default function ContentSearchFilters({
  searchQuery,
  setSearchQuery,
  filterBrand,
  setFilterBrand,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  brands,
}: ContentSearchFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">البحث والتصفية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="بحث..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={filterBrand} onValueChange={setFilterBrand}>
            <SelectTrigger>
              <SelectValue placeholder="اختر البراند" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع البراندات</SelectItem>
              {brands?.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="حالة المهمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الحالات</SelectItem>
              <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
              <SelectItem value="تم التسليم">تم التسليم</SelectItem>
              <SelectItem value="متأخر">متأخر</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="نوع المهمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الأنواع</SelectItem>
              <SelectItem value="بوست">بوست</SelectItem>
              <SelectItem value="إعلان">إعلان</SelectItem>
              <SelectItem value="رييل">رييل</SelectItem>
              <SelectItem value="منتج">منتج</SelectItem>
              <SelectItem value="صفحة هبوط">صفحة هبوط</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
