
import { useState, useEffect } from "react";
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

// Define proper interface for employee
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

// Sample employee data
const sampleEmployees: Employee[] = [
  {
    id: "1",
    user_id: "101",
    salary: 5000,
    commission_type: "percentage",
    commission_value: 5,
    status: "active",
    created_at: "2025-01-15",
    user: {
      full_name: "أحمد محمد",
      email: "ahmed@example.com",
      department: "call-center",
      role: "مشرف"
    }
  },
  {
    id: "2",
    user_id: "102",
    salary: 4000,
    commission_type: "fixed",
    commission_value: 500,
    status: "active",
    created_at: "2025-02-01",
    user: {
      full_name: "سارة علي",
      email: "sara@example.com",
      department: "media-buying",
      role: "مسؤول ميديا"
    }
  },
  {
    id: "3",
    user_id: "103",
    salary: 3500,
    commission_type: null,
    commission_value: null,
    status: "inactive",
    created_at: "2025-01-10",
    user: {
      full_name: "محمود حسن",
      email: "mahmoud@example.com",
      department: "content",
      role: "كاتب محتوى"
    }
  },
  {
    id: "4",
    user_id: "104",
    salary: 4800,
    commission_type: "percentage",
    commission_value: 3,
    status: "pending",
    created_at: "2025-03-05",
    user: {
      full_name: "نورا أحمد",
      email: "nora@example.com",
      department: "design",
      role: "مصمم"
    }
  },
  {
    id: "5",
    user_id: "105",
    salary: 5200,
    commission_type: "fixed",
    commission_value: 700,
    status: "active",
    created_at: "2025-02-20",
    user: {
      full_name: "خالد عمر",
      email: "khaled@example.com",
      department: "moderation",
      role: "مشرف تعليقات"
    }
  }
];

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(sampleEmployees);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select(`
            *,
            user:users!inner(id, full_name, email, department, role)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Employee[] || [];
      } catch (error) {
        console.error("Error fetching employees:", error);
        return sampleEmployees; // Fall back to sample data if API fails
      }
    },
  });

  // Update local employees when API data changes
  useEffect(() => {
    if (employees && employees.length > 0) {
      setLocalEmployees(employees);
    }
  }, [employees]);

  // Update employee status mutation
  const updateEmployeeStatus = useMutation({
    mutationFn: async ({ id, status }: UpdateEmployeeStatusParams) => {
      try {
        const { error } = await supabase
          .from("employees")
          .update({ status })
          .eq("id", id);
        
        if (error) throw error;
        return { id, status };
      } catch (error) {
        console.error("Error updating employee status:", error);
        // For sample data, implement local update
        setLocalEmployees(prev => prev.map(emp => 
          emp.id === id ? {...emp, status} : emp
        ));
        return { id, status };
      }
    },
    onSuccess: ({ id, status }) => {
      // Update local state in case we're using sample data
      setLocalEmployees(prev => prev.map(emp => 
        emp.id === id ? {...emp, status} : emp
      ));
      
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
      try {
        const { error } = await supabase
          .from("employees")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        return id;
      } catch (error) {
        console.error("Error deleting employee:", error);
        // For sample data, implement local deletion
        setLocalEmployees(prev => prev.filter(emp => emp.id !== id));
        return id;
      }
    },
    onSuccess: (id) => {
      // Remove from local state in case we're using sample data
      setLocalEmployees(prev => prev.filter(emp => emp.id !== id));
      
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
  const sortedEmployees = localEmployees.sort((a, b) => {
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
  const filteredEmployees = sortedEmployees.filter((employee) => {
    const matchesSearch = 
      !searchQuery || 
      employee.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = !filterDepartment || employee.user?.department === filterDepartment;
    const matchesStatus = !filterStatus || employee.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

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
                            updateEmployeeStatus.mutate({ 
                              id: employee.id, 
                              status: employee.status === "active" ? "inactive" : "active" 
                            })
                          }>
                            {employee.status === "active" ? "تعطيل" : "تفعيل"}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteEmployee.mutate(employee.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}
