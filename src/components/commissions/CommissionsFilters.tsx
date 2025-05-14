
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { FilterBar } from "@/components/shared/FilterBar";

interface CommissionsFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  onExport: () => void;
}

export function CommissionsFilters({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  onExport
}: CommissionsFiltersProps) {
  return (
    <FilterBar
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="البحث عن عمولات..."
      onExport={onExport}
    >
      <div className="w-full md:w-48">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="تصفية حسب النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="confirmation">تأكيد</SelectItem>
            <SelectItem value="delivery">تسليم</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FilterBar>
  );
}
