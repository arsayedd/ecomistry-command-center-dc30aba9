
import { format } from "date-fns";
import { ChevronUp, ChevronDown, MoreHorizontal, Eye, Edit } from "lucide-react";
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
  user?: {
    full_name: string;
    email: string;
    department: string;
    role: string;
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
}

export default function EmployeesTable({
  isLoading,
  employees,
  sortColumn,
  sortDirection,
  handleSort,
  updateEmployeeStatus,
  deleteEmployee,
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => handleSort("full_name")}>
            اسم الموظف
            {sortColumn === "full_name" && (
              sortDirection === "asc" ? <ChevronUp className="inline-block w-4 h-4 mr-1" /> : <ChevronDown className="inline-block w-4 h-4 mr-1" />
            )}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("department")}>
            القسم
            {sortColumn === "department" && (
              sortDirection === "asc" ? <ChevronUp className="inline-block w-4 h-4 mr-1" /> : <ChevronDown className="inline-block w-4 h-4 mr-1" />
            )}
          </TableHead>
          <TableHead>البريد الإلكتروني</TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("salary")}>
            المرتب
            {sortColumn === "salary" && (
              sortDirection === "asc" ? <ChevronUp className="inline-block w-4 h-4 mr-1" /> : <ChevronDown className="inline-block w-4 h-4 mr-1" />
            )}
          </TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
            تاريخ الإنضمام
            {sortColumn === "created_at" && (
              sortDirection === "asc" ? <ChevronUp className="inline-block w-4 h-4 mr-1" /> : <ChevronDown className="inline-block w-4 h-4 mr-1" />
            )}
          </TableHead>
          <TableHead>الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10">
              جاري التحميل...
            </TableCell>
          </TableRow>
        ) : employees?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10">
              لا يوجد موظفين مطابقين للبحث
            </TableCell>
          </TableRow>
        ) : (
          employees?.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.user?.full_name}</TableCell>
              <TableCell>{getDepartmentText(employee.user?.department || "")}</TableCell>
              <TableCell>{employee.user?.email}</TableCell>
              <TableCell>{new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(employee.salary)}</TableCell>
              <TableCell>{getStatusBadge(employee.status)}</TableCell>
              <TableCell>
                {employee.created_at ? format(new Date(employee.created_at), "yyyy-MM-dd") : "غير محدد"}
              </TableCell>
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
  );
}
