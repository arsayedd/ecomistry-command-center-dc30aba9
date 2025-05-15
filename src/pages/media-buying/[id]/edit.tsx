
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MediaBuyingForm from "@/components/media-buying/MediaBuyingForm";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MediaBuying } from "@/types";

export default function EditMediaBuyingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mediaBuying, setMediaBuying] = useState<MediaBuying | null>(null);

  useEffect(() => {
    const fetchMediaBuying = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from("media_buying")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) {
          console.error("Error fetching media buying:", error);
          throw error;
        }
        
        if (data) {
          // Transform the data to match MediaBuying type
          const formattedData: MediaBuying = {
            id: data.id,
            brand_id: data.brand_id,
            employee_id: data.employee_id,
            platform: data.platform,
            campaign_date: data.date,
            ad_spend: data.spend,
            orders_count: data.orders_count,
            cpp: data.order_cost || 0,
            roas: data.roas,
            campaign_link: data.campaign_link,
            notes: data.notes,
            created_at: data.created_at,
            updated_at: data.updated_at
          };
          
          setMediaBuying(formattedData);
        }
      } catch (error) {
        console.error("Error loading media buying data:", error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء محاولة جلب بيانات الحملة",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMediaBuying();
  }, [id, toast]);

  const handleSave = async (data: MediaBuying) => {
    try {
      const { error } = await supabase
        .from("media_buying")
        .update({
          platform: data.platform,
          date: data.campaign_date instanceof Date ? data.campaign_date.toISOString().split('T')[0] : data.campaign_date,
          brand_id: data.brand_id,
          employee_id: data.employee_id,
          spend: data.ad_spend,
          orders_count: data.orders_count,
          order_cost: data.cpp,
          campaign_link: data.campaign_link,
          notes: data.notes,
          roas: data.roas
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم تعديل الحملة الإعلانية بنجاح",
        variant: "default",
      });

      navigate("/media-buying");
    } catch (error) {
      console.error("Error updating media buying record:", error);
      toast({
        title: "خطأ في تعديل الحملة الإعلانية",
        description: "حدث خطأ أثناء محاولة تعديل بيانات الحملة الإعلانية",
        variant: "destructive",
      });
    }
  };

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
        <h1 className="text-3xl font-bold">تعديل الحملة الإعلانية</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <p>جاري التحميل...</p>
        </div>
      ) : mediaBuying ? (
        <MediaBuyingForm initialData={mediaBuying} onSubmit={handleSave} />
      ) : (
        <div className="text-center p-8">
          <p className="text-xl mb-4">لم يتم العثور على الحملة الإعلانية</p>
          <Button onClick={() => navigate("/media-buying")}>
            العودة إلى قائمة الحملات
          </Button>
        </div>
      )}
    </div>
  );
}
