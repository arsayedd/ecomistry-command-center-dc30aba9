
import React from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Employee } from "@/types";
import { EmployeeExportOptions } from "./EmployeeExportOptions";

export interface EmployeesTableProps {
  employees: Employee[];
  isLoading?: boolean;
  sortColumn: string | null;
  sortDirection: string;
  handleSort: (column: string) => void;
  updateEmployeeStatus: (params: { id: string; status: "active" | "inactive" | "probation" }) => void;
  deleteEmployee: (id: string) => void;
  exportData: (type: 'pdf' | 'excel') => void;
}

export function EmployeesTable({ 
  employees, 
  isLoading,
  sortColumn,
  sortDirection,
  handleSort,
  updateEmployeeStatus,
  deleteEmployee,
  exportData
}: EmployeesTableProps) {
  if (isLoading) {
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <EmployeeExportOptions onExport={exportData} />

      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead 
              className="text-right cursor-pointer" 
              onClick={() => handleSort('full_name')}
            >
              الاسم {sortColumn === 'full_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-right">البريد الإلكتروني</TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => handleSort('department')}
            >
              القسم {sortColumn === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-right">الوظيفة</TableHead>
            <TableHead className="text-right">نوع التعاقد</TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => handleSort('salary')}
            >
              المرتب {sortColumn === 'salary' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-right">نوع العمولة</TableHead>
            <TableHead className="text-right">قيمة العمولة</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">صلاحيات</TableHead>
            <TableHead className="text-right">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-10 text-gray-500">
                لا توجد بيانات للموظفين
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.user?.full_name || "غير محدد"}</TableCell>
                <TableCell>{employee.user?.email || "غير محدد"}</TableCell>
                <TableCell>{employee.user?.department || "غير محدد"}</TableCell>
                <TableCell>{employee.job_title || "غير محدد"}</TableCell>
                <TableCell>
                  {employee.contract_type === "full_time" && "دوام كامل"}
                  {employee.contract_type === "part_time" && "دوام جزئي"}
                  {employee.contract_type === "freelancer" && "عمل حر"}
                  {employee.contract_type === "per_task" && "بالمهمة"}
                  {!employee.contract_type && "غير محدد"}
                </TableCell>
                <TableCell>
                  {employee.salary} 
                  {employee.salary_type === "monthly" && " / شهري"}
                  {employee.salary_type === "hourly" && " / ساعة"}
                  {employee.salary_type === "per_task" && " / مهمة"}
                </TableCell>
                <TableCell>
                  {employee.commission_type === "fixed" && "ثابتة"}
                  {employee.commission_type === "percentage" && "نسبة"}
                  {employee.commission_type === "none" && "لا يوجد"}
                  {!employee.commission_type && "غير محدد"}
                </TableCell>
                <TableCell>{employee.commission_value || 0}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    employee.status === "active" ? "bg-green-100 text-green-800" :
                    employee.status === "inactive" ? "bg-red-100 text-red-800" :
                    employee.status === "probation" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {employee.status === "active" && "نشط"}
                    {employee.status === "inactive" && "غير نشط"}
                    {employee.status === "probation" && "تحت الاختبار"}
                    {!employee.status && "غير محدد"}
                  </span>
                </TableCell>
                <TableCell>{employee.user?.permission_level || "غير محدد"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        // Toggle status
                        const newStatus = employee.status === "active" ? "inactive" : "active";
                        updateEmployeeStatus({ 
                          id: employee.id,
                          status: newStatus as "active" | "inactive" | "probation"
                        });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteEmployee(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
