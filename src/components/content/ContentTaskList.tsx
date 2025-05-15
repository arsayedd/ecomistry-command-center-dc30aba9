
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileEdit } from "lucide-react";

export interface ContentTask {
  id: string;
  employeeName: string;
  brandName: string;
  taskType: string;
  dueDate: string;
  status: string;
  deliveryLink: string;
  notes: string;
}

interface ContentTaskListProps {
  tasks: ContentTask[];
}

export function ContentTaskList({ tasks }: ContentTaskListProps) {
  // Map status to Arabic and badge color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "inProgress":
        return <Badge className="bg-blue-500">قيد التنفيذ</Badge>;
      case "completed":
        return <Badge className="bg-green-500">تم</Badge>;
      case "delayed":
        return <Badge className="bg-red-500">متأخر</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  // Map task type to Arabic
  const getTaskTypeDisplay = (type: string) => {
    switch (type) {
      case "post":
        return "بوست";
      case "reel":
        return "رييل";
      case "ad":
        return "إعلان";
      case "landingPage":
        return "صفحة هبوط";
      case "product":
        return "منتج";
      default:
        return type;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>اسم الموظف</TableHead>
          <TableHead>البراند</TableHead>
          <TableHead>نوع المهمة</TableHead>
          <TableHead>تاريخ التسليم</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>رابط التسليم</TableHead>
          <TableHead>ملاحظات</TableHead>
          <TableHead>إجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.employeeName}</TableCell>
              <TableCell>{task.brandName}</TableCell>
              <TableCell>{getTaskTypeDisplay(task.taskType)}</TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleDateString('ar-EG')}</TableCell>
              <TableCell>{getStatusDisplay(task.status)}</TableCell>
              <TableCell>
                {task.deliveryLink ? (
                  <a href={task.deliveryLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    عرض
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{task.notes || "-"}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <FileEdit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="h-24 text-center">
              لا توجد مهام مطابقة للبحث
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
