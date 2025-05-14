
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BrandsFiltersProps {
  filters: {
    status: string;
    productType: string;
  };
  onApplyFilters: (filters: any) => void;
  className?: string;
}

export function BrandsFilters({ filters, onApplyFilters, className }: BrandsFiltersProps) {
  const [localFilters, setLocalFilters] = React.useState(filters);

  const handleChange = (key: string, value: string) => {
    setLocalFilters({
      ...localFilters,
      [key]: value
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: "all",
      productType: "all"
    };
    
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <div className={cn("p-4 border rounded-md space-y-4", className)} dir="rtl">
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-1">حالة البراند</label>
          <Select
            value={localFilters.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">فعال</SelectItem>
              <SelectItem value="inactive">موقف</SelectItem>
              <SelectItem value="pending">تحت الإنشاء</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium mb-1">فئة المنتج</label>
          <Select
            value={localFilters.productType}
            onValueChange={(value) => handleChange("productType", value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              <SelectItem value="أحذية رياضية">أحذية رياضية</SelectItem>
              <SelectItem value="ملابس رياضية">ملابس رياضية</SelectItem>
              <SelectItem value="مستلزمات رياضية">مستلزمات رياضية</SelectItem>
              <SelectItem value="إلكترونيات">إلكترونيات</SelectItem>
              <SelectItem value="مستحضرات تجميل">مستحضرات تجميل</SelectItem>
              <SelectItem value="أخرى">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          إعادة تعيين
        </Button>
        <Button onClick={handleApply}>
          تطبيق الفلتر
        </Button>
      </div>
    </div>
  );
}
