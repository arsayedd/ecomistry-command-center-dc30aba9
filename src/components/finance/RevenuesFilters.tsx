
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { FilterBar } from "@/components/shared/FilterBar";

interface RevenuesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  brands: any[];
  onExport: () => void;
}

export function RevenuesFilters({
  searchTerm,
  setSearchTerm,
  brandFilter,
  setBrandFilter,
  brands,
  onExport
}: RevenuesFiltersProps) {
  return (
    <FilterBar
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="البحث في الإيرادات..."
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
    </FilterBar>
  );
}
