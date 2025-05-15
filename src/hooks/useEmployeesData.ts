
import { useState, useEffect, useCallback } from "react";
import { useEmployeesApi } from "./api/useEmployeesApi";

export const useEmployeesData = () => {
  const { employees: fetchedEmployees, loading, refetch } = useEmployeesApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [filteredEmployees, setFilteredEmployees] = useState(fetchedEmployees);

  // Filter employees based on search term and filters
  useEffect(() => {
    let filtered = [...fetchedEmployees];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (employee.job_title && employee.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((employee) => employee.status === statusFilter);
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((employee) => employee.department === departmentFilter);
    }

    setFilteredEmployees(filtered);
  }, [fetchedEmployees, searchTerm, statusFilter, departmentFilter]);

  const filters = {
    searchTerm,
    statusFilter,
    departmentFilter,
  };

  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case "search":
        setSearchTerm(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
      case "department":
        setDepartmentFilter(value);
        break;
      default:
        break;
    }
  };

  // Function to refetch employees
  const refetchEmployees = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    employees: filteredEmployees,
    loading,
    filters,
    handleFilterChange,
    refetchEmployees,
  };
};
