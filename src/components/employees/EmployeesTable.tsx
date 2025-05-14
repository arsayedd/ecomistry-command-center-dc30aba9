
import React from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Edit, FileText, Trash2 } from "lucide-react";
import type { Employee } from "@/types";

interface EmployeesTableProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onExport?: (type: 'pdf' | 'excel') => void;
}

export function EmployeesTable({ 
  employees, 
  onEdit, 
  onDelete,
  onExport
}: EmployeesTableProps) {
  return (
    <div className="w-full overflow-auto">
      <div className="flex justify-end mb-4 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => onExport && onExport('pdf')}
        >
          <FileText className="h-4 w-4" />
          <span>تصدير PDF</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => onExport && onExport('excel')}
        >
          <Download className="h-4 w-4" />
          <span>تصدير Excel</span>
        </Button>
      </div>

      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">الاسم</TableHead>
            <TableHead className="text-right">البريد الإلكتروني</TableHead>
            <TableHead className="text-right">القسم</TableHead>
            <TableHead className="text-right">الوظيفة</TableHead>
            <TableHead className="text-right">نوع التعاقد</TableHead>
            <TableHead className="text-right">المرتب</TableHead>
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
                      onClick={() => onEdit && onEdit(employee)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete && onDelete(employee)}
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
