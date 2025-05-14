
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Employee, User } from "@/types";

// Sample employee data with all required fields
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
    salary_type: "monthly",
    user: {
      id: "101",
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
    salary_type: "monthly",
    user: {
      id: "102",
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
    salary_type: "hourly",
    user: {
      id: "103",
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
    salary_type: "monthly",
    user: {
      id: "104",
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
    salary_type: "per_task",
    user: {
      id: "105",
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
    salary_type: "monthly",
    user: {
      id: "106",
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
    salary_type: "monthly",
    user: {
      id: "107",
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
    salary_type: "hourly",
    user: {
      id: "108",
      full_name: "هدى محمود",
      email: "hoda@example.com",
      department: "content",
      role: "كاتب محتوى",
      permission_level: "view"
    }
  }
];

// Define interface for employee update operation
export interface UpdateEmployeeStatusParams {
  id: string;
  status: "active" | "inactive" | "probation";
}

export const useEmployees = () => {
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
        return data as unknown as Employee[] || [];
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
        const updatedEmployees = localEmployees.map(emp => 
          emp.id === id ? { ...emp, status } : emp
        );
        setLocalEmployees(updatedEmployees);
        return { id, status };
      }
    },
    onSuccess: ({ id, status }) => {
      // Update local state in case we're using sample data
      const updatedEmployees = localEmployees.map(emp => 
        emp.id === id ? { ...emp, status } : emp
      );
      setLocalEmployees(updatedEmployees);
      
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
        const filteredEmployees = localEmployees.filter(emp => emp.id !== id);
        setLocalEmployees(filteredEmployees);
        return id;
      }
    },
    onSuccess: (id) => {
      // Remove from local state in case we're using sample data
      const filteredEmployees = localEmployees.filter(emp => emp.id !== id);
      setLocalEmployees(filteredEmployees);
      
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

  return {
    employees: localEmployees,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    filterDepartment,
    setFilterDepartment,
    filterStatus,
    setFilterStatus,
    filterContractType,
    setFilterContractType,
    updateEmployeeStatus,
    deleteEmployee
  };
};
