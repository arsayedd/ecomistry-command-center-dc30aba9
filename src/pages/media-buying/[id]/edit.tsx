
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MediaBuyingForm from "@/components/media-buying/MediaBuyingForm";
import { MediaBuying } from "@/types";

export default function EditMediaBuyingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mediaBuying, setMediaBuying] = useState<MediaBuying | null>(null);

  useEffect(() => {
    const fetchMediaBuying = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from("media_buying")
          .select("*, brand:brand_id(*), employee:employee_id(*)")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          // Transform the data to match the MediaBuying type
          const mediaBuyingData: MediaBuying = {
            id: data.id,
            brand_id: data.brand_id,
            employee_id: data.employee_id,
            platform: data.platform,
            campaign_date: data.date, // Map date to campaign_date
            spend: data.spend,
            orders_count: data.orders_count,
            order_cost: data.order_cost,
            ad_spend: data.spend, // Use spend for ad_spend
            roas: data.roas || 0, // Default to 0 if not present
            campaign_link: data.campaign_link || "", // Default to empty string if not present
            notes: data.notes || "", // Default to empty string if not present
            brand: data.brand,
            employee: data.employee
          };

          setMediaBuying(mediaBuyingData);
        }
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: `فشل في جلب بيانات الحملة: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMediaBuying();
  }, [id]);

  const handleSave = async (formData: MediaBuying) => {
    try {
      setLoading(true);
      
      if (!id) return;

      // Transform the data back to match the database schema
      const updateData = {
        brand_id: formData.brand_id,
        employee_id: formData.employee_id,
        platform: formData.platform,
        date: formData.campaign_date,
        spend: formData.ad_spend,
        orders_count: formData.orders_count,
        order_cost: formData.order_cost,
        roas: formData.roas,
        campaign_link: formData.campaign_link,
        notes: formData.notes
      };

      const { error } = await supabase
        .from("media_buying")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات الحملة بنجاح",
      });
      
      navigate("/media-buying");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: `فشل تحديث بيانات الحملة: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">تعديل حملة ميديا بايينج</h1>
        <p className="text-gray-500">قم بتعديل بيانات الحملة الإعلانية</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>بيانات الحملة</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : mediaBuying ? (
            <MediaBuyingForm initialData={mediaBuying} onSubmit={handleSave} />
          ) : (
            <div className="text-center p-6">
              <p className="text-lg text-gray-500">لم يتم العثور على بيانات الحملة</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
