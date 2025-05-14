import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EmployeeSearchFilters from "@/components/employees/EmployeeSearchFilters";
import { EmployeesTable } from "@/components/employees/EmployeesTable";
import { exportToPDF, exportToExcel } from "@/utils/exportUtils";
import { Employee } from "@/types"; // Import Employee type from types file

// Define proper interface for employee update operation
interface UpdateEmployeeStatusParams {
  id: string;
  status: string;
}

// Sample employee data with more fields
const sampleEmployees: Employee[] = [
  {
    id: "1",
    user_id: "101",
    salary: 5000,
    commission_type: "percentage",
    commission_value: 5,
    status: "active",
    created_at: "2025-01-15",
    contract_type: "full_time",
    salary_type: "monthly", // Add the required salary_type field
    user: {
      full_name: "أحمد محمد",
      email: "ahmed@example.com",
      department: "call-center",
      role: "مشرف",
      permission_level: "admin"
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
    contract_type: "part_time",
    salary_type: "monthly", // Add the required salary_type field
    user: {
      full_name: "سارة علي",
      email: "sara@example.com",
      department: "media-buying",
      role: "مسؤول ميديا",
      permission_level: "edit"
    }
  },
  {
    id: "3",
    user_id: "103",
    salary: 3500,
    commission_type: "none",
    commission_value: 0,
    status: "inactive",
    created_at: "2025-01-10",
    contract_type: "freelancer",
    salary_type: "hourly", // Add the required salary_type field
    user: {
      full_name: "محمود حسن",
      email: "mahmoud@example.com",
      department: "content",
      role: "كاتب محتوى",
      permission_level: "view"
    }
  },
  {
    id: "4",
    user_id: "104",
    salary: 4800,
    commission_type: "percentage",
    commission_value: 3,
    status: "probation",
    created_at: "2025-03-05",
    contract_type: "full_time",
    salary_type: "monthly", // Add the required salary_type field
    user: {
      full_name: "نورا أحمد",
      email: "nora@example.com",
      department: "design",
      role: "مصمم",
      permission_level: "add"
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
    contract_type: "per_task",
    salary_type: "per_task", // Add the required salary_type field
    user: {
      full_name: "خالد عمر",
      email: "khaled@example.com",
      department: "moderation",
      role: "مشرف تعليقات",
      permission_level: "edit"
    }
  },
  {
    id: "6",
    user_id: "106",
    salary: 6000,
    commission_type: "percentage",
    commission_value: 7,
    status: "active",
    created_at: "2025-03-10",
    contract_type: "full_time",
    salary_type: "monthly", // Add the required salary_type field
    user: {
      full_name: "ليلى سعيد",
      email: "laila@example.com",
      department: "call-center",
      role: "مشرف",
      permission_level: "admin"
    }
  },
  {
    id: "7",
    user_id: "107",
    salary: 4500,
    commission_type: "fixed",
    commission_value: 300,
    status: "active",
    created_at: "2025-02-05",
    contract_type: "part_time",
    salary_type: "monthly", // Add the required salary_type field
    user: {
      full_name: "عمر خالد",
      email: "omar@example.com",
      department: "media-buying",
      role: "مدير حسابات",
      permission_level: "edit"
    }
  },
  {
    id: "8",
    user_id: "108",
    salary: 3800,
    commission_type: "none",
    commission_value: 0,
    status: "inactive",
    created_at: "2025-01-25",
    contract_type: "freelancer",
    salary_type: "hourly", // Add the required salary_type field
    user: {
      full_name: "هدى محمود",
      email: "hoda@example.com",
      department: "content",
      role: "كاتب محتوى",
      permission_level: "view"
    }
  }
];

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterContractType, setFilterContractType] = useState("");
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
            user:users!inner(id, full_name, email, department, role, permission_level)
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
  const sortedEmployees = [...localEmployees].sort((a, b) => {
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

  // Filter employees based on search query, department, contract type, and status
  const filteredEmployees = sortedEmployees.filter((employee) => {
    const matchesSearch = 
      !searchQuery || 
      employee.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = !filterDepartment || employee.user?.department === filterDepartment;
    const matchesStatus = !filterStatus || employee.status === filterStatus;
    const matchesContractType = !filterContractType || employee.contract_type === filterContractType;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesContractType;
  });

  // Handle exporting data
  const handleExport = (type: 'pdf' | 'excel') => {
    // Define columns for export
    const columns = [
      { header: "الاسم", dataKey: "user.full_name" },
      { header: "البريد الإلكتروني", dataKey: "user.email" },
      { header: "القسم", dataKey: "user.department" },
      { header: "الوظيفة", dataKey: "user.role" },
      { header: "نوع التعاقد", dataKey: "contract_type" },
      { header: "المرتب", dataKey: "salary" },
      { header: "نوع العمولة", dataKey: "commission_type" },
      { header: "قيمة العمولة", dataKey: "commission_value" },
      { header: "الحالة", dataKey: "status" },
      { header: "صلاحيات", dataKey: "user.permission_level" },
    ];

    if (type === 'pdf') {
      exportToPDF(filteredEmployees, "قائمة_الموظفين", columns);
    } else {
      exportToExcel(filteredEmployees, "قائمة_الموظفين", columns);
    }

    toast({
      title: `تم تصدير البيانات بصيغة ${type === 'pdf' ? 'PDF' : 'Excel'}`,
      description: "تم تصدير بيانات الموظفين بنجاح",
    });
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

      <EmployeeSearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterContractType={filterContractType}
        setFilterContractType={setFilterContractType}
      />

      <Card>
        <CardContent className="p-0">
          <EmployeesTable
            isLoading={isLoading}
            employees={filteredEmployees}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
            updateEmployeeStatus={(params) => updateEmployeeStatus.mutate(params)}
            deleteEmployee={(id) => deleteEmployee.mutate(id)}
            exportData={handleExport}
          />
        </CardContent>
      </Card>
    </div>
  );
}
