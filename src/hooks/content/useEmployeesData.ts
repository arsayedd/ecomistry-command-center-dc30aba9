
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { toast } from "sonner";

export const useEmployeesData = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email, department, role")
        .order("full_name", { ascending: true });

      if (error) {
        throw error;
      }

      // Transform the data to match the User type
      const transformedEmployees: User[] = (data || []).map(item => ({
        id: item.id,
        full_name: item.full_name,
        email: item.email,
        department: item.department || "",
        role: item.role || "",
        permission_level: "",
        employment_type: "full_time", // Default values for required User properties
        salary_type: "monthly",
        status: "active",
        access_rights: "view",
        commission_type: "percentage",
        commission_value: 0,
        job_title: "",
        created_at: "",
        updated_at: ""
      }));

      setEmployees(transformedEmployees);
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      toast.error("فشل في تحميل بيانات الموظفين");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees, loading, fetchEmployees };
};
