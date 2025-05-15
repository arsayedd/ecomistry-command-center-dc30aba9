
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BrandsList from "@/components/brands/BrandsList";
import BrandsFilters from "@/components/brands/BrandsFilters";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brand } from "@/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const { toast } = useToast();

  // Fetch brands from the database
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("brands").select("*");
        if (error) throw error;
        
        if (data) {
          const brandsData: Brand[] = data.map((brand) => ({
            id: brand.id,
            name: brand.name,
            status: brand.status as "active" | "inactive" | "pending", 
            product_type: brand.product_type || "",
            logo_url: (brand as any).logo_url || undefined,
            description: (brand as any).description || undefined,
            notes: (brand as any).notes || undefined,
            social_links: {
              instagram: brand.social_links?.instagram || undefined,
              facebook: brand.social_links?.facebook || undefined,
              tiktok: brand.social_links?.tiktok || undefined,
              youtube: brand.social_links?.youtube || undefined,
              linkedin: brand.social_links?.linkedin || undefined,
              website: brand.social_links?.website || undefined,
            },
            created_at: brand.created_at,
            updated_at: brand.updated_at
          }));
          
          setBrands(brandsData);
          setFilteredBrands(brandsData);
        }
      } catch (error: any) {
        console.error("Error fetching brands:", error.message);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات البراندات",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [toast]);

  // Apply filters when search term or status changes
  useEffect(() => {
    let result = [...brands];

    // Filter by search term
    if (searchTerm) {
      result = result.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus) {
      result = result.filter((brand) => brand.status === filterStatus);
    }

    setFilteredBrands(result);
  }, [brands, searchTerm, filterStatus]);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة البراندات</h1>
        <Link to="/brands/add">
          <Button className="mt-2 md:mt-0">
            <PlusCircle className="h-4 w-4 ml-2" />
            إضافة براند جديد
          </Button>
        </Link>
      </div>

      <BrandsFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={filterStatus}
        onStatusChange={setFilterStatus}
      />

      <Card>
        <CardContent className="p-0">
          <BrandsList brands={filteredBrands} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
