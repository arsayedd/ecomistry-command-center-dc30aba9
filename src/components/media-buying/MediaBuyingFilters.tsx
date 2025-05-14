
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
        if (brandsData) {
          // Cast the data to match the Brand type
          const typedBrands: Brand[] = brandsData.map(brand => ({
            id: brand.id,
            name: brand.name,
            status: (brand.status || "active") as Brand['status'],
            product_type: brand.product_type || "",
            social_links: brand.social_links ? {
              instagram: brand.social_links.instagram as string,
              facebook: brand.social_links.facebook as string,
              tiktok: brand.social_links.tiktok as string,
              youtube: brand.social_links.youtube as string,
              linkedin: brand.social_links.linkedin as string,
              website: brand.social_links.website as string,
            } : {},
            created_at: brand.created_at || '',
            updated_at: brand.updated_at || ''
          }));
          
          setBrands(typedBrands);
        }

        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
          .from("users")
          .select("*")
          .eq("department", "media_buying");

        if (employeesError) throw employeesError;
        if (employeesData) {
          // Cast the data to match User type
          const typedEmployees: User[] = employeesData.map(emp => ({
            id: emp.id,
            email: emp.email || '',
            full_name: emp.full_name || '',
            department: emp.department || '',
            role: emp.role || '',
            permission_level: emp.permission_level || '',
            employment_type: (emp.employment_type || 'full_time') as User['employment_type'],
            salary_type: (emp.salary_type || 'monthly') as User['salary_type'],
            status: (emp.status || 'active') as User['status'],
            access_rights: (emp.access_rights || 'view') as User['access_rights'],
            commission_type: (emp.commission_type || 'percentage') as User['commission_type'],
            commission_value: emp.commission_value || 0,
            job_title: emp.job_title || '',
            created_at: emp.created_at || '',
            updated_at: emp.updated_at || ''
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
