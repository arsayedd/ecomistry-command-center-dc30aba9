
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";

export const useEmployeesApi = (department?: string) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        console.log("Fetching employees data...");
        
        // Check if user is authenticated
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          console.log("No active session found for employees fetch");
          setEmployees([]);
          return;
        }
        
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
          
          // Convert database records to User objects with type assertion
          const typedEmployees = employeesData.map(emp => ({
            id: emp.id || '',
            email: emp.email || '',
            full_name: emp.full_name || '',
            department: emp.department || '',
            role: emp.role || '',
            permission_level: emp.permission_level || '',
            job_title: emp.job_title || '',
            status: emp.status,
            employment_type: emp.employment_type,
            salary_type: emp.salary_type,
            salary_amount: emp.salary_amount,
            access_rights: emp.access_rights,
            commission_type: emp.commission_type,
            commission_value: emp.commission_value || 0,
            created_at: emp.created_at || '',
            updated_at: emp.updated_at || ''
          })) as User[];
          
          setEmployees(typedEmployees);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء محاولة جلب الموظفين.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [toast, department]);

  return { employees, loading };
};
