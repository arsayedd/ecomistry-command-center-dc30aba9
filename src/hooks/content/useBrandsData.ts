
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Brand } from "@/types";

export const useBrandsData = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
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
      
      // Convert data to match the Brand type
      const typedBrands: Brand[] = (data || []).map(brand => ({
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

  return { brands, fetchBrands };
};
