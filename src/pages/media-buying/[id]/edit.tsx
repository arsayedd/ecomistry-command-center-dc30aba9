
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MediaBuyingForm from "@/components/media-buying/MediaBuyingForm";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MediaBuying, MediaBuyingRecord } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditMediaBuyingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mediaBuyingRecord, setMediaBuyingRecord] = useState<MediaBuying | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMediaBuyingRecord() {
      if (!id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("media_buying")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        if (data) {
          // Convert to MediaBuying type
          const record: MediaBuying = {
            id: data.id,
            platform: data.platform,
            campaign_date: data.date,
            brand_id: data.brand_id,
            employee_id: data.employee_id,
            ad_spend: data.spend,
            orders_count: data.orders_count,
            cpp: data.order_cost,
            roas: data.roas,
            campaign_link: data.campaign_link || "",
            notes: data.notes || "",
            created_at: data.created_at
          };
          
          setMediaBuyingRecord(record);
        }
      } catch (error) {
        console.error("Error fetching media buying record:", error);
        toast({
          title: "خطأ في جلب بيانات الحملة الإعلانية",
          description: "حدث خطأ أثناء محاولة جلب بيانات الحملة الإعلانية",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchMediaBuyingRecord();
  }, [id, toast]);

  const handleSave = async (data: MediaBuying) => {
    if (!id) return;

    try {
      // Update the media buying record
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
          notes: data.notes
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم تحديث الحملة الإعلانية بنجاح",
        variant: "default",
      });

      // Navigate back to the media buying list
      navigate("/media-buying");
    } catch (error) {
      console.error("Error updating media buying record:", error);
      toast({
        title: "خطأ في تحديث الحملة الإعلانية",
        description: "حدث خطأ أثناء محاولة تحديث بيانات الحملة الإعلانية",
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
        <h1 className="text-3xl font-bold">تعديل بيانات الحملة الإعلانية</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : mediaBuyingRecord ? (
        <MediaBuyingForm onSubmit={handleSave} initialData={mediaBuyingRecord} />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">الحملة الإعلانية غير موجودة</p>
          <Button
            onClick={() => navigate("/media-buying")}
            className="mt-4"
          >
            العودة إلى قائمة الحملات الإعلانية
          </Button>
        </div>
      )}
    </div>
  );
}
