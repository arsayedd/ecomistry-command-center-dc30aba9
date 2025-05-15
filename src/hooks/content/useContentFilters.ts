
import { useState } from "react";

export interface ContentFilters {
  platform: string | null;
  date_from: string | null;
  brand_id: string | null;
  employee_id: string | null;
  task_type: string | null;
}

export const useContentFilters = () => {
  const [filters, setFilters] = useState<ContentFilters>({
    platform: null,
    date_from: null,
    brand_id: null,
    employee_id: null,
    task_type: null
  });

  const handleFilterChange = (filterName: string, value: string | null) => {
    console.log(`Setting filter ${filterName} to`, value);
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleDateChange = (filterName: string, date: Date | undefined) => {
    const value = date ? date.toISOString().split('T')[0] : null;
    console.log(`Setting date filter ${filterName} to`, value);
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return {
    filters,
    handleFilterChange,
    handleDateChange
  };
};
