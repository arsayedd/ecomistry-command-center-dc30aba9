
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function EmployeesPage() {
  const navigate = useNavigate();
  const { employees, loading, filters, handleFilterChange, refetchEmployees } = useEmployeesData();
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if user has access to this page
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    toast({
      title: "غير مصرح",
      description: "ليس لديك صلاحية الوصول إلى هذه الصفحة",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  const handleAddEmployee = () => {
    navigate("/employees/add");
  };

  const handleEditEmployee = (id: string) => {
    navigate(`/employees/${id}/edit`);
  };

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    
    setIsDeleting(true);
    try {
      // Delete the employee from Supabase
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", employeeToDelete);
      
      if (error) {
        console.error("Error deleting employee:", error);
        toast({
          title: "فشل الحذف",
          description: "حدث خطأ أثناء محاولة حذف الموظف",
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف بيانات الموظف بنجاح",
        });
        // Refetch employees to update the list
        refetchEmployees();
      }
    } catch (error) {
      console.error("Unexpected error during deletion:", error);
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ غير متوقع أثناء حذف الموظف",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  // Function to handle exporting data
  const handleExport = (format: string) => {
    if (format === 'csv') {
      exportToCSV(employees, 'employees-data');
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير بيانات الموظفين بتنسيق CSV",
      });
    } else if (format === 'excel') {
      exportToExcel(employees, 'employees-data');
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير بيانات الموظفين بتنسيق Excel",
      });
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
        isDeleting={isDeleting}
      />
    </div>
  );
}
