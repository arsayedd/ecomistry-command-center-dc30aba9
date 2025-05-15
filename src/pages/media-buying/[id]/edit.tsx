
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MediaBuying } from "@/types";
import { useToast } from "@/hooks/use-toast";
import MediaBuyingForm from "@/components/media-buying/MediaBuyingForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditMediaBuyingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mediaBuying, setMediaBuying] = useState<MediaBuying | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("media_buying")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) {
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
          title: "خطأ",
          description: "فشل في تحميل بيانات الحملة",
          variant: "destructive"
        });
        navigate("/media-buying");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate, toast]);
  
  const handleUpdate = async (data: MediaBuying) => {
    try {
      const { error } = await supabase
        .from("media_buying")
        .update({
          platform: data.platform,
          date: typeof data.campaign_date === 'string' ? data.campaign_date : data.campaign_date.toISOString().split('T')[0],
          brand_id: data.brand_id,
          employee_id: data.employee_id,
          spend: data.ad_spend,
          orders_count: data.orders_count,
          order_cost: data.cpp,
          campaign_link: data.campaign_link,
          notes: data.notes,
          roas: data.roas,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات الحملة بنجاح",
      });
      
      navigate("/media-buying");
    } catch (error) {
      console.error("Error updating media buying:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث بيانات الحملة",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تعديل حملة ميديا باينج</h1>
      </div>
      
      {mediaBuying && (
        <MediaBuyingForm initialData={mediaBuying} onSubmit={handleUpdate} />
      )}
    </div>
  );
}
