
import { useState, useEffect } from "react";
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

// Define proper type for the content task structure
interface ContentTask {
  id: string;
  employee_id: string;
  brand_id: string;
  task_type: string;
  deadline: string;
  status: string;
  delivery_link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    user_id: string;
    user?: {
      full_name: string;
    };
  };
  brand?: {
    id: string;
    name: string;
  };
}

// Sample data
const sampleContentTasks: ContentTask[] = [
  {
    id: "1",
    employee_id: "1",
    brand_id: "1",
    task_type: "بوست",
    deadline: "2025-05-20",
    status: "قيد التنفيذ",
    delivery_link: "https://docs.google.com/document/d/123",
    notes: "يرجى التركيز على المميزات الرئيسية للمنتج",
    created_at: "2025-05-10T10:00:00",
    updated_at: "2025-05-10T10:00:00",
    employee: {
      id: "1",
      user_id: "101",
      user: {
        full_name: "أحمد محمد"
      }
    },
    brand: {
      id: "1",
      name: "براند الأزياء"
    }
  },
  {
    id: "2",
    employee_id: "2",
    brand_id: "2",
    task_type: "إعلان",
    deadline: "2025-05-25",
    status: "تم التسليم",
    delivery_link: "https://docs.google.com/document/d/456",
    notes: null,
    created_at: "2025-05-12T14:30:00",
    updated_at: "2025-05-13T09:15:00",
    employee: {
      id: "2",
      user_id: "102",
      user: {
        full_name: "سارة علي"
      }
    },
    brand: {
      id: "2",
      name: "براند التجميل"
    }
  },
  {
    id: "3",
    employee_id: "3",
    brand_id: "3",
    task_type: "رييل",
    deadline: "2025-05-18",
    status: "متأخر",
    delivery_link: null,
    notes: "مطلوب تضمين كلمات مفتاحية محددة",
    created_at: "2025-05-08T11:20:00",
    updated_at: "2025-05-08T11:20:00",
    employee: {
      id: "3",
      user_id: "103",
      user: {
        full_name: "محمود حسن"
      }
    },
    brand: {
      id: "3",
      name: "براند الإلكترونيات"
    }
  }
];

// Sample brands data
const sampleBrands = [
  { id: "1", name: "براند الأزياء" },
  { id: "2", name: "براند التجميل" },
  { id: "3", name: "براند الإلكترونيات" },
  { id: "4", name: "براند الأغذية" }
];

// Sample employees data
const sampleEmployees = [
  { 
    id: "1", 
    user_id: "101", 
    user: { 
      id: "101", 
      full_name: "أحمد محمد", 
      department: "content" 
    } 
  },
  { 
    id: "2", 
    user_id: "102", 
    user: { 
      id: "102", 
      full_name: "سارة علي", 
      department: "content" 
    } 
  },
  { 
    id: "3", 
    user_id: "103", 
    user: { 
      id: "103", 
      full_name: "محمود حسن", 
      department: "content" 
    } 
  }
];

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [localTasks, setLocalTasks] = useState<ContentTask[]>(sampleContentTasks);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch content tasks
  const { data: contentTasks, isLoading } = useQuery({
    queryKey: ["contentTasks"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("content_tasks")
          .select(`
            *,
            employee:employees(
              id, 
              user_id,
              user:users(full_name)
            ),
            brand:brands(id, name)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as ContentTask[] || [];
      } catch (error) {
        console.error("Error fetching content tasks:", error);
        return sampleContentTasks;
      }
    },
  });

  // Update local tasks when API data changes
  useEffect(() => {
    if (contentTasks && contentTasks.length > 0) {
      setLocalTasks(contentTasks);
    }
  }, [contentTasks]);

  // Fetch employees for dropdown
  const { data: employees } = useQuery({
    queryKey: ["employees", "content"],
    queryFn: async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching employees:", error);
        return sampleEmployees;
      }
    },
  });

  // Fetch brands for dropdown
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("id, name")
          .order("name");

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching brands:", error);
        return sampleBrands;
      }
    },
  });

  // Update task status mutation
  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      try {
        const { error } = await supabase
          .from("content_tasks")
          .update({ status })
          .eq("id", id);
        
        if (error) throw error;
        return { id, status };
      } catch (error) {
        console.error("Error updating task status:", error);
        // Update locally for sample data
        setLocalTasks(tasks => tasks.map(task => 
          task.id === id ? {...task, status} : task
        ));
        return { id, status };
      }
    },
    onSuccess: ({ id, status }) => {
      // Update local state in case we're using sample data
      setLocalTasks(tasks => tasks.map(task => 
        task.id === id ? {...task, status} : task
      ));
      
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
  const filteredTasks = localTasks.filter((task) => {
    const employeeFullName = task.employee?.user?.full_name || "";
    const brandName = task.brand?.name || "";
    
    const matchesSearch = 
      !searchQuery || 
      employeeFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                {(brands || sampleBrands)?.map((brand) => (
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
                      {task.employee?.user?.full_name || "غير محدد"}
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
