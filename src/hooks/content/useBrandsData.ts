
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBrandsData = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Brands fetch error:", error);
        throw error;
      }

      console.log("Fetched brands:", data?.length);
      setBrands(data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء محاولة جلب البراندات",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return { brands };
};
