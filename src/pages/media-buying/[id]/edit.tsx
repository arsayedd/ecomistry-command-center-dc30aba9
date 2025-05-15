
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import MediaBuyingForm from "@/components/media-buying/MediaBuyingForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MediaBuying, Brand, User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditMediaBuyingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mediaBuying, setMediaBuying] = useState<MediaBuying | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMediaBuying = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("media_buying")
          .select("*, brand:brand_id(*), employee:employee_id(*)")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          // Safe type checking for employee
          let employeeData: User | null = null;
          
          if (data.employee && typeof data.employee === 'object') {
            employeeData = {
              id: data.employee?.id || "",
              full_name: data.employee?.full_name || "",
              email: data.employee?.email || "",
              department: data.employee?.department || "",
              role: data.employee?.role || "",
              permission_level: data.employee?.permission_level || "",
              employment_type: "full_time",
              salary_type: "monthly",
              status: "active",
              access_rights: "view",
              commission_type: "percentage",
              commission_value: 0,
              job_title: "",
              created_at: "",
              updated_at: ""
            };
          }

          // Safe type checking for brand
          let brandData: Brand | null = null;
          
          if (data.brand && typeof data.brand === 'object') {
            brandData = {
              id: data.brand.id || "",
              name: data.brand.name || "",
              status: (data.brand.status || "active") as "active" | "inactive" | "pending",
              product_type: data.brand.product_type || "",
              logo_url: "",
              description: "",
              notes: "",
              social_links: typeof data.brand.social_links === 'object' ? 
                (data.brand.social_links as any || {}) : 
                { instagram: "", facebook: "", tiktok: "", youtube: "", linkedin: "", website: "" },
              created_at: data.brand.created_at || "",
              updated_at: data.brand.updated_at || ""
            };
          }

          setMediaBuying({
            id: data.id,
            brand_id: data.brand_id,
            employee_id: data.employee_id,
            platform: data.platform,
            campaign_date: data.date,
            ad_spend: data.spend,
            orders_count: data.orders_count,
            cpp: data.order_cost || 0,
            roas: (data as any).roas || 0,
            campaign_link: (data as any).campaign_link || "",
            notes: (data as any).notes || "",
            brand: brandData,
            employee: employeeData,
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
        }
      } catch (error: any) {
        console.error("Error fetching media buying:", error);
        toast({
          title: "خطأ",
          description: "فشل في جلب بيانات الحملة الإعلانية",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMediaBuying();
  }, [id, toast]);

  const handleSave = (data: MediaBuying) => {
    toast({
      title: "تم التحديث بنجاح",
      description: "تم تحديث بيانات الحملة الإعلانية بنجاح",
    });
    navigate("/media-buying");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-80 mb-2" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/media-buying")}
          className="mb-2"
        >
          <ChevronRight className="ml-2 h-4 w-4" />
          العودة إلى الحملات الإعلانية
        </Button>
        <h1 className="text-3xl font-bold">تعديل حملة إعلانية</h1>
      </div>

      {mediaBuying && <MediaBuyingForm initialData={mediaBuying} onSubmit={handleSave} />}
    </div>
  );
}
