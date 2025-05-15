
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brand } from "@/types";

export const useBrandsApi = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch brands data
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("*")
          .eq("status", "active");

        if (brandsError) throw brandsError;
        
        if (brandsData) {
          // Cast the data to match the Brand type
          const typedBrands: Brand[] = brandsData.map(brand => {
            let socialLinks: Brand["social_links"] = {};
            
            // Type-safely handle social_links if it exists and is an object
            if (brand.social_links && typeof brand.social_links === 'object') {
              const links = brand.social_links as Record<string, unknown>;
              socialLinks = {
                instagram: typeof links.instagram === 'string' ? links.instagram : '',
                facebook: typeof links.facebook === 'string' ? links.facebook : '',
                tiktok: typeof links.tiktok === 'string' ? links.tiktok : '',
                youtube: typeof links.youtube === 'string' ? links.youtube : '',
                linkedin: typeof links.linkedin === 'string' ? links.linkedin : '',
                website: typeof links.website === 'string' ? links.website : '',
              };
            }
            
            return {
              id: brand.id,
              name: brand.name,
              status: (brand.status || "active") as Brand['status'],
              product_type: brand.product_type || "",
              logo_url: brand.logo_url || "",
              description: brand.description || "",
              notes: brand.notes || "",
              social_links: socialLinks,
              created_at: brand.created_at || '',
              updated_at: brand.updated_at || ''
            };
          });
          
          setBrands(typedBrands);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء محاولة جلب البراندات.",
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
