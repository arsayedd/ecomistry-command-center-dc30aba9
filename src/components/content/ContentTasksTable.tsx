
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2 } from "lucide-react";
import type { ContentTask } from "@/types";

export interface ContentTasksTableProps {
  tasks: ContentTask[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  updateTaskStatus?: (params: { id: string, status: "pending" | "completed" | "delayed" }) => void;
}

export function ContentTasksTable({ 
  tasks, 
  isLoading, 
  onDelete,
  updateTaskStatus
}: ContentTasksTableProps) {
  if (isLoading) {
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">قيد التنفيذ</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">تم التسليم</Badge>;
      case "delayed":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">متأخر</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };
  
  const getTaskTypeText = (type: string) => {
    switch(type) {
      case "post":
        return "بوست";
      case "ad":
        return "إعلان";
      case "reel":
        return "رييل";
      case "product":
        return "منتج";
      case "landing_page":
        return "صفحة هبوط";
      default:
        return "أخرى";
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">الموظف</TableHead>
            <TableHead className="text-right">البراند</TableHead>
            <TableHead className="text-right">نوع المهمة</TableHead>
            <TableHead className="text-right">تاريخ التسليم</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">تاريخ الإنشاء</TableHead>
            <TableHead className="text-right">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                لا توجد مهام حتى الآن
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.employee?.user?.full_name || "غير محدد"}</TableCell>
                <TableCell>{task.brand?.name || "غير محدد"}</TableCell>
                <TableCell>{getTaskTypeText(task.task_type)}</TableCell>
                <TableCell>
                  {task.deadline || task.due_date ? 
                    format(new Date(task.deadline || task.due_date), "dd MMM yyyy", { locale: ar }) : 
                    "غير محدد"
                  }
                </TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>
                  {task.created_at ? 
                    format(new Date(task.created_at), "dd MMM yyyy", { locale: ar }) : 
                    "غير محدد"
                  }
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Link to={`/content/${task.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/content/${task.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    {onDelete && (
                      <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
