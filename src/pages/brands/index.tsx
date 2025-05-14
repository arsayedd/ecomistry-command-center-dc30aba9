
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BrandsList } from "@/components/brands/BrandsList";
import { BrandsFilters } from "@/components/brands/BrandsFilters";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Brand } from "@/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    productType: "all"
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from Supabase
      // const { data, error } = await supabase.from('brands').select('*');
      
      // For now, using sample data
      const sampleBrands: Brand[] = [
        {
          id: "1",
          name: "Nike",
          product_type: "أحذية رياضية",
          description: "علامة تجارية عالمية للملابس والأحذية الرياضية",
          social_links: {
            facebook: "https://facebook.com/nike",
            instagram: "https://instagram.com/nike",
            tiktok: "https://tiktok.com/@nike",
            website: "https://nike.com"
          },
          logo_url: "https://via.placeholder.com/150",
          notes: "تركيز على منتجات الجودة العالية",
          status: "active",
          created_at: "2023-01-01"
        },
        {
          id: "2",
          name: "أديداس",
          product_type: "ملابس رياضية",
          description: "علامة تجارية ألمانية للملابس والأحذية الرياضية",
          social_links: {
            facebook: "https://facebook.com/adidas",
            instagram: "https://instagram.com/adidas",
            website: "https://adidas.com"
          },
          logo_url: "https://via.placeholder.com/150",
          status: "active",
          created_at: "2023-02-01"
        },
        {
          id: "3",
          name: "بوما",
          product_type: "مستلزمات رياضية",
          description: "علامة تجارية عالمية للملابس والأحذية الرياضية",
          social_links: {
            facebook: "https://facebook.com/puma",
            instagram: "https://instagram.com/puma",
          },
          logo_url: "https://via.placeholder.com/150",
          status: "pending",
          notes: "في مرحلة إعداد الحملات الإعلانية",
          created_at: "2023-03-01"
        },
        {
          id: "4",
          name: "ريبوك",
          product_type: "أحذية رياضية",
          status: "inactive",
          created_at: "2023-04-01"
        },
        {
          id: "5",
          name: "نيو بالانس",
          product_type: "أحذية رياضية",
          status: "active",
          created_at: "2023-05-01"
        }
      ];
      
      setBrands(sampleBrands);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("حدث خطأ أثناء تحميل البراندات");
      setLoading(false);
    }
  };

  const handleDelete = (brand: Brand) => {
    // In a real implementation, this would delete from Supabase
    // await supabase.from('brands').delete().eq('id', brand.id);
    
    toast.success(`تم حذف البراند ${brand.name} بنجاح`);
    setBrands(brands.filter(b => b.id !== brand.id));
  };

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.product_type || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === "all" || brand.status === filters.status;
    const matchesProductType = filters.productType === "all" || brand.product_type === filters.productType;
    
    return matchesSearch && matchesStatus && matchesProductType;
  });

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة البراندات</h1>
        <Link to="/brands/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة براند جديد
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>البراندات المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن براند..."
                className="pr-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              <span>فلترة</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <BrandsFilters 
              filters={filters}
              onApplyFilters={applyFilters}
              className="mb-4"
            />
          )}

          <BrandsList 
            brands={filteredBrands} 
            loading={loading}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
