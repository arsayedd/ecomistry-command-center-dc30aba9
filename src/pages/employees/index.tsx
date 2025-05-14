
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  FileText,
  Search,
  Filter,
  FileExcel,
  FilePlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select(`
          *,
          users:user_id (
            full_name,
            email,
            department,
            role
          )
        `);

      if (error) throw error;
      return data || [];
    },
  });

  const getStatusBadgeClass = (status: string | null) => {
    if (!status) return "bg-gray-200 text-gray-700";
    
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-700";
      case "موقوف":
        return "bg-red-100 text-red-700";
      case "تحت التجربة":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getCommissionType = (commissionType: string | null) => {
    if (!commissionType) return "لا يوجد";
    
    switch (commissionType) {
      case "percentage":
        return "نسبة مئوية";
      case "fixed":
        return "مبلغ ثابت";
      default:
        return "لا يوجد";
    }
  };

  const filteredEmployees = employees?.filter((employee) => {
    const matchesSearch = !searchTerm || 
      (employee.users?.full_name && employee.users.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = !departmentFilter || employee.users?.department === departmentFilter;
    const matchesStatus = !statusFilter || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const exportToExcel = () => {
    // Functionality to export to Excel would go here
    alert("تصدير البيانات إلى Excel");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold">إدارة الموظفين</h1>
        <p className="text-gray-500">عرض وإدارة بيانات جميع موظفي الشركة</p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="بحث بالاسم..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={departmentFilter || ""} onValueChange={(value) => setDepartmentFilter(value || null)}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="جميع الأقسام" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الأقسام</SelectItem>
              <SelectItem value="ميديا">ميديا</SelectItem>
              <SelectItem value="كول سنتر">كول سنتر</SelectItem>
              <SelectItem value="مودريشن">مودريشن</SelectItem>
              <SelectItem value="ديزاين">ديزاين</SelectItem>
              <SelectItem value="كونتنت">كونتنت</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الحالات</SelectItem>
              <SelectItem value="نشط">نشط</SelectItem>
              <SelectItem value="موقوف">موقوف</SelectItem>
              <SelectItem value="تحت التجربة">تحت التجربة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <FileExcel className="ml-2 h-4 w-4" />
            تصدير Excel
          </Button>
          <Button asChild>
            <Link to="/employees/add">
              <FilePlus className="ml-2 h-4 w-4" />
              إضافة موظف
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Users className="ml-2" size={20} />
            قائمة الموظفين
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : filteredEmployees && filteredEmployees.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم بالكامل</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>الوظيفة</TableHead>
                    <TableHead>المرتب</TableHead>
                    <TableHead>العمولة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.users?.full_name}</TableCell>
                      <TableCell>{employee.users?.department || "-"}</TableCell>
                      <TableCell>{employee.users?.role || "-"}</TableCell>
                      <TableCell>{employee.salary ? `${employee.salary} ج.م` : "-"}</TableCell>
                      <TableCell>
                        {employee.commission_type ? `${getCommissionType(employee.commission_type)} - ${employee.commission_value || 0}` : "لا يوجد"}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(employee.status)}`}>
                          {employee.status || "غير محدد"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/employees/${employee.id}`}>
                              <FileText className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">لم يتم العثور على موظفين</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
