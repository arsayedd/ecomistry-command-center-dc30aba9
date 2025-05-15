import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmployeesList } from "@/components/employees/EmployeesList";
import { EmployeesFilters } from "@/components/employees/EmployeesFilters";
import { DeleteEmployeeDialog } from "@/components/employees/DeleteEmployeeDialog";
import { exportToPDF } from "@/utils/exportUtils";

export default function EmployeesPage() {
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات الموظفين");
    } finally {
      setLoading(false);
    }
  };

  // Handle exports
  const handleExportPDF = () => {
    const filteredData = filterEmployees();
    exportToPDF(
      "employees_report",
      "تقرير الموظفين",
      filteredData
    );
  };

  // Handle delete
  const confirmDelete = (id: string) => {
    setDeleteEmployeeId(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteEmployeeId) return;

    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", deleteEmployeeId);

      if (error) throw error;

      setEmployees(employees.filter(emp => emp.id !== deleteEmployeeId));
      toast.success("تم حذف بيانات الموظف بنجاح");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("حدث خطأ أثناء حذف بيانات الموظف");
    } finally {
      setShowDeleteDialog(false);
      setDeleteEmployeeId(null);
    }
  };

  // Filter employees based on search and filters
  const filterEmployees = () => {
    return employees.filter(employee => {
      const matchesSearch = 
        employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  };

  const filteredEmployees = filterEmployees();

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

      <EmployeesFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        onExport={handleExportPDF}
      />

      <Card>
        <CardHeader>
          <CardTitle>قائمة الموظفين</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeesList 
            employees={filteredEmployees} 
            loading={loading} 
            onDeleteClick={confirmDelete} 
          />
        </CardContent>
      </Card>

      <DeleteEmployeeDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog} 
        onConfirm={handleDelete} 
      />
    </div>
  );
}
