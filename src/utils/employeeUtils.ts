
import { Employee } from "@/types";

// Sort employees based on column and direction
export const sortEmployees = (
  employees: Employee[],
  sortColumn: string | null,
  sortDirection: string
): Employee[] => {
  if (!sortColumn) return employees;

  return [...employees].sort((a, b) => {
    if (sortColumn === "full_name") {
      const nameA = a.user?.full_name || "";
      const nameB = b.user?.full_name || "";
      return sortDirection === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortColumn === "department") {
      const departmentA = a.user?.department || "";
      const departmentB = b.user?.department || "";
      return sortDirection === "asc"
        ? departmentA.localeCompare(departmentB)
        : departmentB.localeCompare(departmentA);
    } else if (sortColumn === "salary") {
      const salaryA = a.salary || 0;
      const salaryB = b.salary || 0;
      return sortDirection === "asc" ? salaryA - salaryB : salaryB - salaryA;
    } else if (sortColumn === "created_at") {
      const dateA = new Date(a.created_at || "").getTime();
      const dateB = new Date(b.created_at || "").getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });
};

// Filter employees based on search query and filters
export const filterEmployees = (
  employees: Employee[],
  searchQuery: string,
  filterDepartment: string,
  filterStatus: string,
  filterContractType: string
): Employee[] => {
  return employees.filter((employee) => {
    const matchesSearch = 
      !searchQuery || 
      employee.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = !filterDepartment || employee.user?.department === filterDepartment;
    const matchesStatus = !filterStatus || employee.status === filterStatus;
    const matchesContractType = !filterContractType || employee.contract_type === filterContractType;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesContractType;
  });
};
