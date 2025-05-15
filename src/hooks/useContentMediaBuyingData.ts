
import { useContentFilters } from "./content/useContentFilters";
import { useBrandsData } from "./content/useBrandsData";
import { useEmployeesData } from "./content/useEmployeesData";
import { useMediaBuyingQuery } from "./content/useMediaBuyingQuery";

export const useContentMediaBuyingData = () => {
  // Use our custom hooks to manage different parts of the state and logic
  const { filters, handleFilterChange, handleDateChange } = useContentFilters();
  const { brands } = useBrandsData();
  const { employees } = useEmployeesData();
  const { mediaBuying, loading } = useMediaBuyingQuery(filters);

  return {
    mediaBuying,
    loading,
    brands,
    employees,
    filters,
    handleFilterChange,
    handleDateChange
  };
};
