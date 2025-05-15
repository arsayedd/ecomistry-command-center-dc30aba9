
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEmployeesData = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name")
        .order("full_name", { ascending: true });

      if (error) {
        console.error("Employees fetch error in content:", error);
        throw error;
      }

      console.log("Fetched employees for content:", data?.length);
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees in content:", error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء محاولة جلب بيانات الموظفين",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees };
};
