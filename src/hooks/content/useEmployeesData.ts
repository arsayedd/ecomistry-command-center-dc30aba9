
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

      setEmployees(data || []);
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
