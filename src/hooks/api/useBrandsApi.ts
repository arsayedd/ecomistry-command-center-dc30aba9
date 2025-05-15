
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brand } from "@/types";

export const useBrandsApi = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("brands").select("*");
        if (error) throw error;
        
        if (data) {
          // Transform the data to match the Brand type
          const transformedBrands: Brand[] = data.map(item => ({
            id: item.id,
            name: item.name,
            status: item.status as "active" | "inactive" | "pending",
            product_type: item.product_type || "",
            logo_url: (item as any).logo_url || undefined,
            description: (item as any).description || undefined,
            notes: (item as any).notes || undefined,
            social_links: item.social_links as Brand["social_links"],
            created_at: item.created_at,
            updated_at: item.updated_at
          }));
          setBrands(transformedBrands);
        }
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: `فشل في جلب بيانات البراندات: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [toast]);

  return { brands, loading };
};
