
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { FilterBar } from "@/components/shared/FilterBar";

interface EmployeesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  onExport: () => void;
}

export function EmployeesFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  onExport
}: EmployeesFiltersProps) {
  return (
    <FilterBar
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="البحث عن موظف..."
      onExport={onExport}
    >
      <div className="w-full md:w-48">
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
