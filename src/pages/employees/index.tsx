
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmployeesList } from "@/components/employees/EmployeesList";
import { EmployeesFilters } from "@/components/employees/EmployeesFilters";
import { DeleteEmployeeDialog } from "@/components/employees/DeleteEmployeeDialog";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import { useEmployeesData } from "@/hooks/useEmployeesData";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileDown } from "lucide-react";

export default function EmployeesPage() {
  const navigate = useNavigate();
  const { employees, loading, filters, handleFilterChange } = useEmployeesData();
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddEmployee = () => {
    navigate("/employees/new");
  };

  const handleEditEmployee = (id: string) => {
    navigate(`/employees/${id}/edit`);
  };

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // Delete logic would go here
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  // Function to handle exporting data
  const handleExport = (format: string) => {
    if (format === 'csv') {
      exportToCSV(employees, 'employees-data');
    } else if (format === 'excel') {
      exportToExcel(employees, 'employees-data');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الموظفين</h1>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                <FileDown className="h-4 w-4 mr-2" />
                تصدير
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                تصدير CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                تصدير Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleAddEmployee}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة موظف
          </Button>
        </div>
      </div>

      <EmployeesFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      {loading ? (
        <Card className="mt-6">
          <CardContent className="flex justify-center items-center p-6">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="mr-2">جاري تحميل البيانات...</span>
          </CardContent>
        </Card>
      ) : (
        <EmployeesList 
          employees={employees} 
          loading={loading}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteClick}
        />
      )}

      <DeleteEmployeeDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
