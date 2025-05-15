
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types";
import { toast } from "sonner";

export const useBrandsData = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("id, name, logo_url")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      setBrands(data || []);
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      toast.error("فشل في تحميل بيانات البراندات");
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return { brands, loading, fetchBrands };
};
