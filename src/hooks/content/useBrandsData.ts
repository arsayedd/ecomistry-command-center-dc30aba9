
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

      // Transform the data to match the Brand type
      const transformedBrands: Brand[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        logo_url: item.logo_url || "",
        status: "active", // Default values for required Brand properties
        product_type: "",
        description: "",
        notes: "",
        social_links: { instagram: "", facebook: "", tiktok: "", youtube: "", linkedin: "", website: "" },
        created_at: "",
        updated_at: ""
      }));

      setBrands(transformedBrands);
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
