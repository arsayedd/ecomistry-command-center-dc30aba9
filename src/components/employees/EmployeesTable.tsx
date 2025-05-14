
import { format } from "date-fns";
import { ChevronUp, ChevronDown, MoreHorizontal, Eye, Edit, Trash2, FileText, FileExcel } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Employee {
  id: string;
  user_id: string;
  salary: number;
  commission_type: string | null;
  commission_value: number | null;
  status: string;
  created_at: string;
  contract_type?: string;
  user?: {
    full_name: string;
    email: string;
    department: string;
    role: string;
    permission_level: string;
  };
}

interface EmployeesTableProps {
  isLoading: boolean;
  employees: Employee[];
  sortColumn: string | null;
  sortDirection: string;
  handleSort: (column: string) => void;
  updateEmployeeStatus: (params: { id: string; status: string }) => void;
  deleteEmployee: (id: string) => void;
  exportData: (type: 'pdf' | 'excel') => void;
}

export default function EmployeesTable({
  isLoading,
  employees,
  sortColumn,
  sortDirection,
  handleSort,
  updateEmployeeStatus,
  deleteEmployee,
  exportData,
}: EmployeesTableProps) {
  // Status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">نشط</Badge>;
      case "inactive":
        return <Badge className="bg-red-500">غير نشط</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">معلق</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Convert department code to readable text
  const getDepartmentText = (departmentCode: string) => {
    switch (departmentCode) {
      case "call-center":
        return "كول سنتر";
      case "media-buying":
        return "ميديا بايينج";
      case "content":
        return "كتابة المحتوى";
      case "design":
        return "تصميم";
      case "moderation":
        return "موديريشن";
      default:
        return departmentCode;
    }
  };

  // Convert contract type to readable text
  const getContractTypeText = (contractType: string | undefined) => {
    switch (contractType) {
      case "full-time":
        return "دوام كامل";
      case "part-time":
        return "دوام جزئي";
      case "freelancer":
        return "فريلانسر";
      case "per-task":
        return "بالقطعة";
      default:
        return "غير محدد";
    }
  };

  // Convert permission level to readable text
  const getPermissionText = (permission: string | undefined) => {
    switch (permission) {
      case "view":
        return "مشاهدة فقط";
      case "add":
        return "إضافة فقط";
      case "edit":
        return "إضافة وتعديل";
      case "admin":
        return "تحكم كامل";
      default:
        return "غير محدد";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <div>
          <h2 className="text-xl font-bold">قائمة الموظفين</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('pdf')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            تصدير PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('excel')}
            className="flex items-center gap-2"
          >
            <FileExcel className="h-4 w-4" />
            تصدير Excel
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("full_name")}>
              الاسم
              {sortColumn === "full_name" && (
                sortDirection === "asc" ? <ChevronUp className="inline-block w-4 h-4 mr-1" /> : <ChevronDown className="inline-block w-4 h-4 mr-1" />
              )}
            </TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("department")}>
              القسم
              {sortColumn === "department" && (
                sortDirection === "asc" ? <ChevronUp className="inline-block w-4 h-4 mr-1" /> : <ChevronDown className="inline-block w-4 h-4 mr-1" />
              )}
            </TableHead>
            <TableHead>الوظيفة</TableHead>
            <TableHead>نوع التعاقد</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("salary")}>
              المرتب
              {sortColumn === "salary" && (
                sortDirection === "asc" ? <ChevronUp className="inline-block w-4 h-4 mr-1" /> : <ChevronDown className="inline-block w-4 h-4 mr-1" />
              )}
            </TableHead>
            <TableHead>نوع العمولة</TableHead>
            <TableHead>قيمة العمولة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>صلاحيات</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-10">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : employees?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-10">
                لا يوجد موظفين مطابقين للبحث
              </TableCell>
            </TableRow>
          ) : (
            employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.user?.full_name}</TableCell>
                <TableCell>{employee.user?.email}</TableCell>
                <TableCell>{getDepartmentText(employee.user?.department || "")}</TableCell>
                <TableCell>{employee.user?.role || "غير محدد"}</TableCell>
                <TableCell>{getContractTypeText(employee.contract_type)}</TableCell>
                <TableCell>{new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(employee.salary)}</TableCell>
                <TableCell>
                  {employee.commission_type === "percentage" ? "نسبة مئوية" : 
                   employee.commission_type === "fixed" ? "مبلغ ثابت" : "لا يوجد"}
                </TableCell>
                <TableCell>
                  {employee.commission_value 
                    ? employee.commission_type === "percentage" 
                      ? `${employee.commission_value}%` 
                      : new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(employee.commission_value)
                    : "لا يوجد"}
                </TableCell>
                <TableCell>{getStatusBadge(employee.status)}</TableCell>
                <TableCell>{getPermissionText(employee.user?.permission_level)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link to={`/employees/${employee.id}`}>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 ml-2" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/employees/${employee.id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={() => 
                        updateEmployeeStatus({ 
                          id: employee.id, 
                          status: employee.status === "active" ? "inactive" : "active" 
                        })
                      }>
                        {employee.status === "active" ? "تعطيل" : "تفعيل"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteEmployee(employee.id)}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
