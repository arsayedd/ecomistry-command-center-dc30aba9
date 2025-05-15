
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BrandsFilters } from "@/components/brands/BrandsFilters";
import { BrandsList } from "@/components/brands/BrandsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Brand } from "@/types";

export default function BrandsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample data for brands
  const sampleBrands: Brand[] = [
    {
      id: "1",
      name: "امازون ستور",
      product_type: "ملابس",
      description: "متجر متخصص في بيع الملابس الرياضية والكاجوال",
      social_links: {
        facebook: "https://facebook.com/amazon-store",
        instagram: "https://instagram.com/amazon-store",
        tiktok: "https://tiktok.com/@amazon-store",
        website: "https://amazon-store.com",
      },
      logo_url: "https://via.placeholder.com/150",
      notes: "يتم التعاون معهم منذ 2020",
      status: "active",
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
    },
    {
      id: "2",
      name: "سوق كوم",
      product_type: "إلكترونيات",
      description: "منصة إلكترونية لبيع وشراء الإلكترونيات",
      social_links: {
        facebook: "https://facebook.com/souq",
        instagram: "https://instagram.com/souq",
        website: "https://souq.com",
      },
      logo_url: "https://via.placeholder.com/150",
      status: "active",
      created_at: "2023-02-15",
      updated_at: "2023-02-15",
    },
    {
      id: "3",
      name: "ستايل هاوس",
      product_type: "أزياء",
      description: "متجر متخصص في الأزياء والموضة",
      social_links: {
        facebook: "https://facebook.com/stylehouse",
        instagram: "https://instagram.com/stylehouse",
      },
      logo_url: "https://via.placeholder.com/150",
      status: "pending",
      notes: "في مرحلة التفاوض",
      created_at: "2023-03-10",
      updated_at: "2023-03-10",
    },
    {
      id: "4",
      name: "تك هوم",
      product_type: "أجهزة منزلية",
      status: "inactive",
      social_links: {},
      created_at: "2023-04-05",
      updated_at: "2023-04-05",
    },
    {
      id: "5",
      name: "جرين ماركت",
      product_type: "منتجات عضوية",
      status: "active",
      social_links: {},
      created_at: "2023-05-20",
      updated_at: "2023-05-20",
    },
  ];

  // Filter brands by search term and status
  const filteredBrands = sampleBrands.filter((brand) => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ? true : brand.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">البراندات</h1>
        <Button onClick={() => navigate("/brands/add")}>
          <Plus className="mr-2 h-4 w-4" />
          إضافة براند جديد
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <BrandsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
          />
        </CardContent>
      </Card>

      <BrandsList brands={filteredBrands} />
    </div>
  );
}
