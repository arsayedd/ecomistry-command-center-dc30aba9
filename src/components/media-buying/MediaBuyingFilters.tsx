
import React, { useState, useEffect } from "react";
import { FilterBar } from "@/components/shared/FilterBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Brand, User } from "@/types";
import { useToast } from "@/hooks/use-toast";

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
}: MediaBuyingFiltersProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("*");

        if (brandsError) throw brandsError;
        if (brandsData) setBrands(brandsData);

        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
          .from("users")
          .select("*")
          .eq("department", "media_buying");

        if (employeesError) throw employeesError;
        if (employeesData) {
          // Cast the employment_type to match User type
          const typedEmployees = employeesData.map(emp => ({
            ...emp,
            employment_type: emp.employment_type as "full_time" | "part_time" | "freelancer" | "per_piece",
            status: emp.status as "active" | "inactive" | "trial",
            access_rights: emp.access_rights as "view" | "add" | "edit" | "full_manage",
          }));
          setEmployees(typedEmployees);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء محاولة جلب البراندات والموظفين.",
          variant: "destructive",
        });
      }
    }

    fetchData();
  }, [toast]);

  return (
    <FilterBar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="بحث في الحملات..."
      onExport={onExport}
    >
      {/* Platform Filter */}
      <div className="w-full md:w-auto">
        <Select value={platform} onValueChange={onPlatformChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="المنصة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">كل المنصات</SelectItem>
            <SelectItem value="facebook">فيسبوك</SelectItem>
            <SelectItem value="instagram">إنستجرام</SelectItem>
            <SelectItem value="tiktok">تيك توك</SelectItem>
            <SelectItem value="google">جوجل</SelectItem>
            <SelectItem value="other">أخرى</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Filter */}
      <div className="w-full md:w-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-right">
              {date ? (
                format(date, "PPP")
              ) : (
                <span>اختر التاريخ</span>
              )}
              <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
              className="rounded-md border"
            />
            <div className="p-3 border-t">
              <Button variant="ghost" className="w-full" onClick={() => onDateChange(undefined)}>
                إلغاء التاريخ
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Brand Filter */}
      <div className="w-full md:w-auto">
        <Select value={brandId} onValueChange={onBrandChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="البراند" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">كل البراندات</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employee Filter */}
      <div className="w-full md:w-auto">
        <Select value={employeeId} onValueChange={onEmployeeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="الموظف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">كل الموظفين</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FilterBar>
  );
}
