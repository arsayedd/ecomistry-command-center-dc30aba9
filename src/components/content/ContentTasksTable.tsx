
import { format } from "date-fns";
import { MoreHorizontal, Eye, Edit } from "lucide-react";
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
import { ContentTask } from "@/types";

interface ContentTasksTableProps {
  isLoading: boolean;
  tasks: ContentTask[];
  updateTaskStatus: (params: { id: string; status: string }) => void;
}

export default function ContentTasksTable({
  isLoading,
  tasks,
  updateTaskStatus,
}: ContentTasksTableProps) {
  // Status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "قيد التنفيذ":
        return <Badge className="bg-yellow-500">قيد التنفيذ</Badge>;
      case "تم التسليم":
        return <Badge className="bg-green-500">تم التسليم</Badge>;
      case "متأخر":
        return <Badge className="bg-red-500">متأخر</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Map task type to Arabic
  const getTaskType = (type: string) => {
    switch (type) {
      case "post": return "بوست";
      case "ad": return "إعلان";
      case "reel": return "رييل";
      case "product": return "منتج";
      case "landing_page": return "صفحة هبوط";
      case "other": return "أخرى";
      default: return type;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>كاتب المحتوى</TableHead>
          <TableHead>البراند</TableHead>
          <TableHead>نوع المهمة</TableHead>
          <TableHead>تاريخ التسليم</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>رابط التسليم</TableHead>
          <TableHead>ملاحظات</TableHead>
          <TableHead>الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-10">
              جاري التحميل...
            </TableCell>
          </TableRow>
        ) : tasks?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-10">
              لا توجد مهام مطابقة للبحث
            </TableCell>
          </TableRow>
        ) : (
          tasks?.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                {task.employee?.user?.full_name || "غير محدد"}
              </TableCell>
              <TableCell>{task.brand?.name || "غير محدد"}</TableCell>
              <TableCell>{getTaskType(task.task_type)}</TableCell>
              <TableCell>
                {task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd") : "غير محدد"}
              </TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell>
                {task.delivery_link ? (
                  <a
                    href={task.delivery_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    عرض التسليم
                  </a>
                ) : (
                  "لا يوجد"
                )}
              </TableCell>
              <TableCell>{task.notes || "لا توجد ملاحظات"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link to={`/content/${task.id}`}>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 ml-2" />
                        عرض التفاصيل
                      </DropdownMenuItem>
                    </Link>
                    <Link to={`/content/${task.id}/edit`}>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => 
                      updateTaskStatus({ 
                        id: task.id, 
                        status: "قيد التنفيذ" 
                      })
                    }>
                      تحديث إلى: قيد التنفيذ
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => 
                      updateTaskStatus({ 
                        id: task.id, 
                        status: "تم التسليم" 
                      })
                    }>
                      تحديث إلى: تم التسليم
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => 
                      updateTaskStatus({ 
                        id: task.id, 
                        status: "متأخر" 
                      })
                    }>
                      تحديث إلى: متأخر
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
