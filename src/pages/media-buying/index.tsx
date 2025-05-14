
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { MediaBuyingFilters } from "@/components/media-buying/MediaBuyingFilters";
import { MediaBuyingList } from "@/components/media-buying/MediaBuyingList";
import { MediaBuyingAnalytics } from "@/components/media-buying/MediaBuyingAnalytics";
import { exportToCSV } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { Brand, User } from "@/types";

interface MediaBuyingItem {
  id: string;
  platform: string;
  date: string;
  brand_id: string;
  employee_id: string;
  spend: number;
  orders_count: number;
  order_cost: number;
  brand?: { id: string; name: string };
  employee?: { id: string; full_name: string };
  notes?: string;
  roas?: number;
  created_at: string;
  updated_at: string;
}

export default function MediaBuyingPage() {
  const [searchValue, setSearchValue] = useState("");
  const [platform, setPlatform] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [brandId, setBrandId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  
  const { toast } = useToast();

  // Fetch media buying records with related data
  const { data: mediaBuying, isLoading } = useQuery({
    queryKey: ["media-buying", searchValue, platform, date, brandId, employeeId],
    queryFn: async () => {
      let query = supabase
        .from("media_buying")
        .select(`
          *,
          brand:brands(id, name),
          employee:users(id, full_name)
        `);
      
      // Apply filters
      if (platform) {
        query = query.eq("platform", platform);
      }
      
      if (date) {
        const dateString = date.toISOString().split("T")[0];
        query = query.eq("date", dateString);
      }
      
      if (brandId) {
        query = query.eq("brand_id", brandId);
      }
      
      if (employeeId) {
        query = query.eq("employee_id", employeeId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return (data || []) as MediaBuyingItem[];
    },
  });

  // Filter data based on search term
  const filteredData = mediaBuying?.filter(record => {
    if (!searchValue) return true;
    
    const searchTerm = searchValue.toLowerCase();
    const brandName = record.brand?.name?.toLowerCase() || "";
    const employeeName = record.employee?.full_name?.toLowerCase() || "";
    const notes = record.notes?.toLowerCase() || "";
    
    return (
      brandName.includes(searchTerm) ||
      employeeName.includes(searchTerm) ||
      notes.includes(searchTerm)
    );
  }) || [];

  // Handle export functionality
  const handleExport = () => {
    try {
      if (!filteredData.length) {
        toast({
          title: "لا توجد بيانات للتصدير",
          description: "لا توجد بيانات متاحة للتصدير حاليًا",
          variant: "destructive",
        });
        return;
      }

      // Format data for export
      const dataToExport = filteredData.map(record => ({
        "المنصة": getPlatformName(record.platform),
        "التاريخ": new Date(record.date).toLocaleDateString("ar-EG"),
        "البراند": record.brand?.name || "غير محدد",
        "الموظف": record.employee?.full_name || "غير محدد",
        "الإنفاق": record.spend,
        "عدد الطلبات": record.orders_count,
        "تكلفة الطلب (CPP)": record.orders_count > 0 ? record.spend / record.orders_count : 0,
        "العائد على الإنفاق (ROAS)": record.roas || "غير محدد",
        "ملاحظات": record.notes || ""
      }));

      exportToCSV(dataToExport, "media-buying-report");
      
      toast({
        title: "تم تصدير البيانات بنجاح",
        description: "تم تصدير بيانات الحملات الإعلانية بنجاح",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "خطأ في تصدير البيانات",
        description: "حدث خطأ أثناء محاولة تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  // Helper function to get platform names in Arabic
  function getPlatformName(platform: string): string {
    const platformNames: Record<string, string> = {
      facebook: "فيسبوك",
      instagram: "إنستجرام",
      tiktok: "تيك توك",
      google: "جوجل",
      other: "أخرى",
    };
    return platformNames[platform] || platform;
  }

  return (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">إدارة الميديا بايينج</h1>
        <Link to="/media-buying/add">
          <Button className="w-full md:w-auto">
            <Plus className="ml-2 h-4 w-4" /> إضافة حملة جديدة
          </Button>
        </Link>
      </div>

      {/* Analytics Charts */}
      {filteredData.length > 0 && (
        <MediaBuyingAnalytics data={filteredData} />
      )}

      {/* Filters */}
      <MediaBuyingFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        platform={platform}
        onPlatformChange={setPlatform}
        date={date}
        onDateChange={setDate}
        brandId={brandId}
        onBrandChange={setBrandId}
        employeeId={employeeId}
        onEmployeeChange={setEmployeeId}
        onExport={handleExport}
      />

      {/* Data Table */}
      <MediaBuyingList data={filteredData} isLoading={isLoading} />
    </div>
  );
}
