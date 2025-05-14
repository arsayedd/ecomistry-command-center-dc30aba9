
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { FilterBar } from "@/components/shared/FilterBar";

interface ExpensesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  brands: any[];
  onExport: () => void;
}

export function ExpensesFilters({
  searchTerm,
  setSearchTerm,
  brandFilter,
  setBrandFilter,
  categoryFilter,
  setCategoryFilter,
  brands,
  onExport
}: ExpensesFiltersProps) {
  return (
    <FilterBar
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="البحث في المصروفات..."
      onExport={onExport}
    >
      <div className="w-full md:w-48">
        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="البراند" />
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            <SelectItem value="ads">إعلانات</SelectItem>
            <SelectItem value="salaries">رواتب</SelectItem>
            <SelectItem value="rent">إيجار</SelectItem>
            <SelectItem value="supplies">مستلزمات</SelectItem>
            <SelectItem value="other">أخرى</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FilterBar>
  );
}
