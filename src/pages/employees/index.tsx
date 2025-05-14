import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  useMutation, 
  useQuery, 
  useQueryClient 
} from "@tanstack/react-query";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Edit, 
  MoreHorizontal 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

// Define proper interface for employee update operation
interface UpdateEmployeeStatusParams {
  id: string;
  status: string;
}

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select(`
          *,
          user:users!inner(id, full_name, email, department, role)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Update employee status mutation
  const updateEmployeeStatus = useMutation({
    mutationFn: async ({ id, status }: UpdateEmployeeStatusParams) => {
      const { error } = await supabase
        .from("employees")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "تم تحديث حالة الموظف",
        description: "تم تحديث حالة الموظف بنجاح",
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

  // Delete employee mutation
  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "تم حذف الموظف",
        description: "تم حذف الموظف بنجاح",
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

  // Handle sorting
  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort employees based on sortColumn and sortDirection
  const sortedEmployees = employees?.sort((a, b) => {
    if (sortColumn === "full_name") {
      const nameA = a.user?.full_name || "";
      const nameB = b.user?.full_name || "";
      return sortDirection === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortColumn === "department") {
      const departmentA = a.user?.department || "";
      const departmentB = b.user?.department || "";
      return sortDirection === "asc"
        ? departmentA.localeCompare(departmentB)
        : departmentB.localeCompare(departmentA);
    } else if (sortColumn === "salary") {
      const salaryA = a.salary || 0;
      const salaryB = b.salary || 0;
      return sortDirection === "asc" ? salaryA - salaryB : salaryB - salaryA;
    } else if (sortColumn === "created_at") {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  // Filter employees based on search query, department, and status
  const filteredEmployees = sortedEmployees?.filter((employee) => {
    const matchesSearch = 
      !searchQuery || 
      employee.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = !filterDepartment || employee.user?.department === filterDepartment;
    const matchesStatus = !filterStatus || employee.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Status badge color
  const getStatusBadge = (status) => {
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الموظفين</h1>
        <Link to="/employees/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة موظف جديد
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="بحث..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الأقسام</SelectItem>
                <SelectItem value="call-center">كول سنتر</SelectItem>
                <SelectItem value="media-buying">ميديا بايينج</SelectItem>
                <SelectItem value="content">كتابة المحتوى</SelectItem>
                <SelectItem value="design">تصميم</SelectItem>
                <SelectItem value="moderation">موديريشن</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="حالة الموظف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
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
              ) : filteredEmployees?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    لا يوجد موظفين مطابقين للبحث
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees?.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.user?.full_name}</TableCell>
                    <TableCell>{employee.user?.department}</TableCell>
                    <TableCell>{employee.user?.email}</TableCell>
                    <TableCell>{employee.salary}</TableCell>
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
                            updateEmployeeStatus.mutate({ 
                              id: employee.id, 
                              status: employee.status === "active" ? "inactive" : "active" 
                            })
                          }>
                            {employee.status === "active" ? "تعطيل" : "تفعيل"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteEmployee.mutate(employee.id)}>
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
        </CardContent>
      </Card>
    </div>
  );
}
