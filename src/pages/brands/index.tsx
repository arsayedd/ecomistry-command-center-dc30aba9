
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BrandsList } from "@/components/brands/BrandsList";
import { BrandsFilters } from "@/components/brands/BrandsFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");

      if (error) throw error;
      
      // Process the data to ensure social_links is properly handled
      const processedBrands = data.map(brand => ({
        ...brand,
        social_links: brand.social_links ? 
          (typeof brand.social_links === 'string' ? 
            JSON.parse(brand.social_links) : 
            brand.social_links) : 
          {}
      }));

      setBrands(processedBrands);
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      toast({
        title: "خطأ في جلب البيانات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredBrands = brands.filter(brand => {
    return (
      brand.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (brand.product_type && brand.product_type.toLowerCase().includes(searchValue.toLowerCase())) ||
      (brand.social_links && typeof brand.social_links === 'object' && brand.social_links.instagram && 
        brand.social_links.instagram.toLowerCase().includes(searchValue.toLowerCase())) ||
      (brand.social_links && typeof brand.social_links === 'object' && brand.social_links.facebook && 
        brand.social_links.facebook.toLowerCase().includes(searchValue.toLowerCase())) ||
      (brand.social_links && typeof brand.social_links === 'object' && brand.social_links.tiktok && 
        brand.social_links.tiktok.toLowerCase().includes(searchValue.toLowerCase())) ||
      (brand.social_links && typeof brand.social_links === 'object' && brand.social_links.youtube && 
        brand.social_links.youtube.toLowerCase().includes(searchValue.toLowerCase())) ||
      (brand.social_links && typeof brand.social_links === 'object' && brand.social_links.linkedin && 
        brand.social_links.linkedin.toLowerCase().includes(searchValue.toLowerCase())) ||
      (brand.social_links && typeof brand.social_links === 'object' && brand.social_links.website && 
        brand.social_links.website.toLowerCase().includes(searchValue.toLowerCase()))
    );
  });

  const handleAddBrand = () => {
    navigate("/brands/add");
  };

  const handleEdit = (brandId: string) => {
    navigate(`/brands/${brandId}/edit`);
  };

  const handleDelete = async (brandId: string) => {
    try {
      const { error } = await supabase.from("brands").delete().eq("id", brandId);

      if (error) throw error;

      setBrands(brands.filter(brand => brand.id !== brandId));

      toast({
        title: "تم حذف البراند بنجاح",
      });
    } catch (error: any) {
      console.error("Error deleting brand:", error);
      toast({
        title: "خطأ في حذف البراند",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">البراندات</h1>
        <Button onClick={handleAddBrand}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة براند جديد
        </Button>
      </div>

      <BrandsFilters searchValue={searchValue} onSearchChange={setSearchValue} />

      <Card className="mt-6">
        <BrandsList
          brands={filteredBrands}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  );
}
