
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import ContentMediaBuyingForm from "@/components/content/ContentMediaBuyingForm";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

export default function EditContentMediaBuyingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mediaBuyingData, setMediaBuyingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          throw error;
        }
        
        if (!data.session) {
          console.log("User is not authenticated, redirecting to login");
          toast.error("يرجى تسجيل الدخول للوصول إلى هذه الصفحة");
          navigate("/auth/login");
          return;
        }
        
        console.log("Auth check complete");
        setIsAuthChecking(false);
        fetchMediaBuyingData();
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("فشل التحقق من حالة تسجيل الدخول");
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [id, navigate]);

  const fetchMediaBuyingData = async () => {
    if (!id) return;

    try {
      console.log("Fetching media buying data for id:", id);
      
      // Fetch media buying data
      const { data: mediaBuying, error: mediaBuyingError } = await supabase
        .from("media_buying")
        .select("*, brand:brand_id(id, name), employee:employee_id(id, full_name)")
        .eq("id", id)
        .single();

      if (mediaBuyingError) {
        console.error("Error fetching media buying data:", mediaBuyingError);
        throw mediaBuyingError;
      }

      if (!mediaBuying) {
        toast.error("لم يتم العثور على بيانات الحملة");
        navigate("/content/media-buying");
        return;
      }

      console.log("Media buying data fetched:", mediaBuying);

      // Fetch related content task
      const { data: contentTask, error: contentTaskError } = await supabase
        .from("content_tasks")
        .select("*")
        .eq("media_campaign_id", id)
        .maybeSingle();

      if (contentTaskError) {
        console.error("Error fetching content task:", contentTaskError);
      }

      console.log("Content task fetched:", contentTask);

      // Format the data for the form
      const formattedData = {
        id: mediaBuying.id,
        platform: mediaBuying.platform,
        campaign_date: mediaBuying.date,
        brand_id: mediaBuying.brand_id,
        employee_id: mediaBuying.employee_id,
        ad_spend: mediaBuying.spend,
        orders_count: mediaBuying.orders_count,
        cpp: mediaBuying.order_cost,
        roas: mediaBuying.roas,
        campaign_link: mediaBuying.campaign_link,
        notes: mediaBuying.notes,
        content_task_id: contentTask?.id,
        task_type: contentTask?.task_type || "post",
        expected_delivery_date: contentTask?.expected_delivery_date || mediaBuying.date
      };

      setMediaBuyingData(formattedData);
    } catch (error) {
      console.error("Error fetching media buying data:", error);
      toast.error("حدث خطأ أثناء جلب بيانات الحملة");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>جاري التحميل...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-6" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-96 w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تعديل حملة ميديا باينج</h1>
      </div>

      <ContentMediaBuyingForm initialData={mediaBuyingData} />
    </div>
  );
}
