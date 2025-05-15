
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BrandsFilters } from "@/components/brands/BrandsFilters";
import { BrandsList } from "@/components/brands/BrandsList";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types";
import { useBrandsApi } from "@/hooks/api/useBrandsApi";

export default function BrandsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { brands, loading, fetchBrands } = useBrandsApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const filteredBrands = brands.filter((brand) => {
    // Filter by search term
    const matchesSearch =
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.product_type &&
        brand.product_type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || brand.status === statusFilter;
    
    // Filter by category
    const matchesCategory = categoryFilter === "all" || brand.product_type === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddBrand = () => {
    navigate("/brands/add");
  };

  const handleEditBrand = (brandId: string) => {
    navigate(`/brands/${brandId}/edit`);
  };

  const handleDeleteBrand = async (brandId: string) => {
    try {
      const { error } = await supabase.from("brands").delete().eq("id", brandId);
      
      if (error) throw error;
      
      toast({
        title: "تم حذف البراند بنجاح",
        variant: "default",
      });
      
      // Refresh brands list
      fetchBrands();
      
    } catch (error: any) {
      toast({
        title: "خطأ في حذف البراند",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleExport = () => {
    try {
      // Convert data to CSV
      const headers = ["اسم البراند", "الفئة", "الحالة"];
      const csvData = filteredBrands.map((brand) => [
        brand.name,
        brand.product_type || "-",
        brand.status
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.join(","))
      ].join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "brands.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "تم تصدير البيانات بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error exporting brands:", error);
      toast({
        title: "خطأ في تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">إدارة البراندات</h1>
        <p className="text-gray-500">إدارة جميع البراندات ومتابعة حالتها</p>
      </div>
      
      {/* Filters */}
      <BrandsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onAddBrand={handleAddBrand}
        onExport={handleExport}
      />
      
      {/* Brands List */}
      <Card className="shadow-sm">
        <BrandsList 
          brands={filteredBrands} 
          loading={loading} 
          onEdit={handleEditBrand} 
          onDelete={handleDeleteBrand} 
        />
      </Card>
    </div>
  );
}
