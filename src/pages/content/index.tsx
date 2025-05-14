
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  useMutation, 
  useQuery, 
  useQueryClient 
} from "@tanstack/react-query";
import { 
  ChevronDown, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Edit,
  MoreHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch content tasks
  const { data: contentTasks, isLoading } = useQuery({
    queryKey: ["contentTasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_tasks")
        .select(`
          *,
          employee:employees(id, user_id),
          employee_user:employees(user_id(full_name)),
          brand:brands(id, name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch employees for dropdown
  const { data: employees } = useQuery({
    queryKey: ["employees", "content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select(`
          id,
          user_id,
          user:users!inner(id, full_name, department)
        `)
        .eq("status", "active")
        .eq("users.department", "content")
        .order("users.full_name");

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch brands for dropdown
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });

  // Update task status mutation
  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase
        .from("content_tasks")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentTasks"] });
      toast({
        title: "تم تحديث حالة المهمة",
        description: "تم تحديث حالة المهمة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Filter tasks based on search query and filters
  const filteredTasks = contentTasks?.filter((task) => {
    const matchesSearch = 
      !searchQuery || 
      task.employee_user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.task_type?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBrand = !filterBrand || task.brand_id === filterBrand;
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesType = !filterType || task.task_type === filterType;
    
    return matchesSearch && matchesBrand && matchesStatus && matchesType;
  });

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة مهام كتابة المحتوى</h1>
        <Link to="/content/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة مهمة جديدة
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="بحث..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger>
                <SelectValue placeholder="اختر البراند" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع البراندات</SelectItem>
                {brands?.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="حالة المهمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الحالات</SelectItem>
                <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                <SelectItem value="تم التسليم">تم التسليم</SelectItem>
                <SelectItem value="متأخر">متأخر</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع المهمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الأنواع</SelectItem>
                <SelectItem value="بوست">بوست</SelectItem>
                <SelectItem value="إعلان">إعلان</SelectItem>
                <SelectItem value="رييل">رييل</SelectItem>
                <SelectItem value="منتج">منتج</SelectItem>
                <SelectItem value="صفحة هبوط">صفحة هبوط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>كاتب المحتوى</TableHead>
                <TableHead>البراند</TableHead>
                <TableHead>نوع المهمة</TableHead>
                <TableHead>تاريخ التسليم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>رابط التسليم</TableHead>
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
              ) : filteredTasks?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    لا توجد مهام مطابقة للبحث
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks?.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      {task.employee_user?.full_name || "غير محدد"}
                    </TableCell>
                    <TableCell>{task.brand?.name || "غير محدد"}</TableCell>
                    <TableCell>{task.task_type}</TableCell>
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
                            updateTaskStatus.mutate({ 
                              id: task.id, 
                              status: "قيد التنفيذ" 
                            })
                          }>
                            تحديث إلى: قيد التنفيذ
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => 
                            updateTaskStatus.mutate({ 
                              id: task.id, 
                              status: "تم التسليم" 
                            })
                          }>
                            تحديث إلى: تم التسليم
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => 
                            updateTaskStatus.mutate({ 
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
        </CardContent>
      </Card>
    </div>
  );
}
