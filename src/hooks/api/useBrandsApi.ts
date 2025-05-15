
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brand } from "@/types";

export const useBrandsApi = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      console.log("Fetching brands data...");
      
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Brands fetch error:", error);
        throw error;
      }
      
      if (data) {
        console.log("Successfully fetched brands:", data.length);
        // Convert data to match the Brand type
        const typedBrands: Brand[] = data.map(brand => ({
          id: brand.id || "",
          name: brand.name || "",
          status: (brand.status || "active") as "active" | "inactive" | "pending",
          product_type: brand.product_type || "",
          logo_url: brand.logo_url || "",
          description: brand.description || "",
          notes: brand.notes || "",
          social_links: typeof brand.social_links === 'object' ? 
            (brand.social_links as any || {}) : 
            { instagram: "", facebook: "", tiktok: "", youtube: "", linkedin: "", website: "" },
          created_at: brand.created_at || "",
          updated_at: brand.updated_at || "",
        }));
        
        setBrands(typedBrands);
      } else {
        setBrands([]);
      }
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء محاولة جلب البراندات",
        variant: "destructive",
      });
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
