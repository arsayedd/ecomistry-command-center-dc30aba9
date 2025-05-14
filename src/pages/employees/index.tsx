
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EmployeeSearchFilters from "@/components/employees/EmployeeSearchFilters";
import { EmployeesTable } from "@/components/employees/EmployeesTable";
import { exportToPDF, exportToExcel } from "@/utils/exportUtils";
import { useEmployees } from "@/hooks/useEmployees";
import { filterEmployees, sortEmployees } from "@/utils/employeeUtils";

export default function EmployeesPage() {
  const { toast } = useToast();
  
  const {
    employees,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    filterDepartment,
    setFilterDepartment,
    filterStatus,
    setFilterStatus,
    filterContractType,
    setFilterContractType,
    updateEmployeeStatus,
    deleteEmployee
  } = useEmployees();

  // Handle sorting
  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Get sorted and filtered employees
  const sortedEmployees = sortEmployees(employees, sortColumn, sortDirection);
  const filteredEmployees = filterEmployees(
    sortedEmployees,
    searchQuery,
    filterDepartment,
    filterStatus,
    filterContractType
  );

  // Handle exporting data
  const handleExport = (type: 'pdf' | 'excel') => {
    // Define columns for export
    const columns = [
      { header: "الاسم", dataKey: "user.full_name" },
      { header: "البريد الإلكتروني", dataKey: "user.email" },
      { header: "القسم", dataKey: "user.department" },
      { header: "الوظيفة", dataKey: "user.role" },
      { header: "نوع التعاقد", dataKey: "contract_type" },
      { header: "المرتب", dataKey: "salary" },
      { header: "نوع العمولة", dataKey: "commission_type" },
      { header: "قيمة العمولة", dataKey: "commission_value" },
      { header: "الحالة", dataKey: "status" },
      { header: "صلاحيات", dataKey: "user.permission_level" },
    ];

    if (type === 'pdf') {
      exportToPDF(filteredEmployees, "قائمة_الموظفين", columns);
    } else {
      exportToExcel(filteredEmployees, "قائمة_الموظفين", columns);
    }

    toast({
      title: `تم تصدير البيانات بصيغة ${type === 'pdf' ? 'PDF' : 'Excel'}`,
      description: "تم تصدير بيانات الموظفين بنجاح",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الموظفين</h1>
        <Link to="/employees/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة موظف جديد
          </Button>
        </Link>
      </div>

      <EmployeeSearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterContractType={filterContractType}
        setFilterContractType={setFilterContractType}
      />

      <Card>
        <CardContent className="p-0">
          <EmployeesTable
            employees={filteredEmployees}
            isLoading={isLoading}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
            updateEmployeeStatus={updateEmployeeStatus.mutate}
            deleteEmployee={deleteEmployee.mutate}
            exportData={handleExport}
          />
        </CardContent>
      </Card>
    </div>
  );
}
