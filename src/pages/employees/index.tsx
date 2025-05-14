
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Download, FileEdit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToPDF } from "@/utils/exportUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      // Fix: Change from "employees" to "users" table which exists in Supabase
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

  const handleExportPDF = () => {
    const filteredData = filterEmployees();
    // Fix: Use only 3 arguments as expected by the function
    exportToPDF(
      "employees_report",
      "تقرير الموظفين",
      filteredData
    );
  };

  const confirmDelete = (id: string) => {
    setDeleteEmployeeId(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteEmployeeId) return;

    try {
      // Fix: Change from "employees" to "users" table which exists in Supabase
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", deleteEmployeeId);

      if (error) throw error;

      // Update employees list after successful deletion
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">نشط</Badge>;
      case "inactive":
        return <Badge className="bg-red-500">غير نشط</Badge>;
      case "probation":
        return <Badge className="bg-yellow-500">تحت التجربة</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getDepartmentDisplay = (department: string) => {
    switch (department) {
      case "media-buying":
        return "ميديا بايينج";
      case "call-center":
        return "كول سنتر";
      case "moderation":
        return "مودريشن";
      case "content":
        return "كتابة محتوى";
      case "finance":
        return "قسم مالي";
      case "management":
        return "إدارة";
      default:
        return department;
    }
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

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="البحث عن موظف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأقسام</SelectItem>
                  <SelectItem value="media-buying">ميديا بايينج</SelectItem>
                  <SelectItem value="call-center">كول سنتر</SelectItem>
                  <SelectItem value="moderation">مودريشن</SelectItem>
                  <SelectItem value="content">كتابة محتوى</SelectItem>
                  <SelectItem value="finance">قسم مالي</SelectItem>
                  <SelectItem value="management">إدارة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="probation">تحت التجربة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="w-full md:w-auto" onClick={handleExportPDF}>
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الموظفين</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم بالكامل</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>الوظيفة</TableHead>
                  <TableHead>نوع التوظيف</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.full_name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department ? getDepartmentDisplay(employee.department) : "-"}</TableCell>
                      <TableCell>{employee.job_title || "-"}</TableCell>
                      <TableCell>
                        {employee.employment_type === "full-time" && "دوام كامل"}
                        {employee.employment_type === "part-time" && "دوام جزئي"}
                        {employee.employment_type === "freelancer" && "فريلانسر"}
                        {employee.employment_type === "per-piece" && "بالقطعة"}
                        {!employee.employment_type && "-"}
                      </TableCell>
                      <TableCell>{employee.status ? getStatusBadge(employee.status) : "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link to={`/employees/${employee.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => confirmDelete(employee.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      لا توجد بيانات موظفين مطابقة للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من رغبتك في الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف بيانات الموظف بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
