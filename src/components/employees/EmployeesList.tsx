
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileEdit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { User } from "@/types";

interface EmployeesListProps {
  employees: User[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EmployeesList({ employees, loading, onEdit, onDelete }: EmployeesListProps) {
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

  const columns = [
    { 
      key: 'name', 
      header: 'الاسم بالكامل', 
      cell: (employee: any) => <span className="font-medium">{employee.full_name}</span> 
    },
    { 
      key: 'email', 
      header: 'البريد الإلكتروني', 
      cell: (employee: any) => employee.email 
    },
    { 
      key: 'department', 
      header: 'القسم', 
      cell: (employee: any) => employee.department ? getDepartmentDisplay(employee.department) : "-" 
    },
    { 
      key: 'job_title', 
      header: 'الوظيفة', 
      cell: (employee: any) => employee.job_title || "-" 
    },
    { 
      key: 'employment_type', 
      header: 'نوع التوظيف', 
      cell: (employee: any) => {
        if (employee.employment_type === "full-time") return "دوام كامل";
        if (employee.employment_type === "part-time") return "دوام جزئي";
        if (employee.employment_type === "freelancer") return "فريلانسر";
        if (employee.employment_type === "per-piece") return "بالقطعة";
        return "-";
      }
    },
    { 
      key: 'status', 
      header: 'الحالة', 
      cell: (employee: any) => employee.status ? getStatusBadge(employee.status) : "-" 
    },
    { 
      key: 'actions', 
      header: 'الإجراءات', 
      cell: (employee: any) => (
        <div className="flex space-x-2">
          <Link to={`/employees/${employee.id}/edit`}>
            <Button variant="ghost" size="icon">
              <FileEdit className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(employee.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns}
      data={employees}
      isLoading={loading}
      emptyMessage="لا توجد بيانات موظفين مطابقة للبحث"
      colSpan={7}
    />
  );
}
