
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";

export const useEmployeesApi = (department?: string) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Create fetchEmployees function that can be called independently
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching employees data...");
      
      // Build query
      let query = supabase
        .from("users")
        .select("*");
        
      // Add department filter if specified
      if (department) {
        query = query.eq("department", department);
      }
      
      const { data: employeesData, error: employeesError } = await query.order("full_name", { ascending: true });

      if (employeesError) {
        console.error("Employees fetch error:", employeesError);
        throw employeesError;
      }
      
      if (employeesData) {
        console.log("Successfully fetched employees:", employeesData.length);
        
        // Cast the data to match User type
        const typedEmployees: User[] = employeesData.map(emp => ({
          id: emp.id || '',
          email: emp.email || '',
          full_name: emp.full_name || '',
          department: emp.department || '',
          role: emp.role || '',
          permission_level: emp.permission_level || '',
          employment_type: (emp.employment_type || 'full_time') as User['employment_type'],
          salary_type: (emp.salary_type || 'monthly') as User['salary_type'],
          status: (emp.status || 'active') as User['status'],
          access_rights: (emp.access_rights || 'view') as User['access_rights'],
          commission_type: (emp.commission_type || 'percentage') as User['commission_type'],
          commission_value: emp.commission_value || 0,
          job_title: emp.job_title || '',
          created_at: emp.created_at || '',
          updated_at: emp.updated_at || ''
        }));
        
        setEmployees(typedEmployees);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء محاولة جلب الموظفين.",
        variant: "destructive",
      });
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [toast, department]);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { 
    employees, 
    loading,
    refetch: fetchEmployees 
  };
};
