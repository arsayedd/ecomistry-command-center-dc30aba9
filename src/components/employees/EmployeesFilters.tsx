
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { FilterBar } from "@/components/shared/FilterBar";

interface EmployeesFiltersProps {
  filters: {
    searchTerm: string;
    statusFilter: string;
    departmentFilter: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
}

export function EmployeesFilters({ filters, onFilterChange }: EmployeesFiltersProps) {
  return (
    <FilterBar
      searchValue={filters.searchTerm}
      onSearchChange={(value) => onFilterChange("search", value)}
      searchPlaceholder="البحث عن موظف..."
      onExport={() => {}}
    >
      <div className="w-full md:w-48">
        <Select 
          value={filters.departmentFilter} 
          onValueChange={(value) => onFilterChange("department", value)}
        >
          <SelectTrigger>
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="القسم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأقسام</SelectItem>
            <SelectItem value="media-buying">ميديا بايينج</SelectItem>
            <SelectItem value="call-center">كول سنتر</SelectItem>
            <SelectItem value="moderation">مودريشن</SelectItem>
            <SelectItem value="content">كتابة محتوى</SelectItem>
            <SelectItem value="finance">قسم مالي</SelectItem>
            <SelectItem value="management">إدارة</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-48">
        <Select 
          value={filters.statusFilter} 
          onValueChange={(value) => onFilterChange("status", value)}
        >
          <SelectTrigger>
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
            <SelectItem value="probation">تحت التجربة</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FilterBar>
  );
}
