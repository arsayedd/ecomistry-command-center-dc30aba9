
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MediaBuyingForm from "@/components/media-buying/MediaBuyingForm"; // Fixed import
import { Loader2 } from "lucide-react";
import { MediaBuying, Brand, User } from "@/types";

export default function EditMediaBuyingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mediaBuying, setMediaBuying] = useState<MediaBuying | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch media buying data
        const { data: mediaBuyingData, error: mediaBuyingError } = await supabase
          .from("media_buying")
          .select("*")
          .eq("id", id)
          .single();

        if (mediaBuyingError) {
          throw mediaBuyingError;
        }

        // Transform data to match MediaBuying type
        const transformedData: MediaBuying = {
          id: mediaBuyingData.id,
          brand_id: mediaBuyingData.brand_id,
          employee_id: mediaBuyingData.employee_id,
          platform: mediaBuyingData.platform,
          campaign_date: mediaBuyingData.date || "",
          ad_spend: mediaBuyingData.spend || 0,
          orders_count: mediaBuyingData.orders_count || 0,
          cpp: mediaBuyingData.order_cost || 0,
          roas: mediaBuyingData.roas || 0,
          campaign_link: mediaBuyingData.campaign_link || '',
          notes: mediaBuyingData.notes || '',
          created_at: mediaBuyingData.created_at,
          updated_at: mediaBuyingData.updated_at
        };

        setMediaBuying(transformedData);

        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("*");

        if (brandsError) {
          throw brandsError;
        }

        // Transform brands to match Brand type
        const typedBrands: Brand[] = brandsData.map((brand: any) => ({
          id: brand.id,
          name: brand.name,
          status: (brand.status || "active") as "active" | "inactive" | "pending",
          product_type: brand.product_type || "",
          logo_url: brand.logo_url || "",
          description: brand.description || "",
          notes: brand.notes || "",
          social_links: brand.social_links || {},
          created_at: brand.created_at,
          updated_at: brand.updated_at
        }));

        setBrands(typedBrands);

        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
          .from("users")
          .select("*");

        if (employeesError) {
          throw employeesError;
        }

        // Transform employees to match User type
        const typedEmployees: User[] = employeesData.map((employee: any) => ({
          id: employee.id,
          email: employee.email,
          full_name: employee.full_name,
          department: employee.department || "",
          role: employee.role,
          permission_level: employee.permission_level,
          employment_type: (employee.employment_type || "full_time") as "full_time" | "part_time" | "contract",
          salary_type: (employee.salary_type || "monthly") as "monthly" | "hourly" | "commission",
          status: (employee.status || "active") as "active" | "inactive" | "pending",
          access_rights: (employee.access_rights || "view") as "admin" | "edit" | "view",
          commission_type: (employee.commission_type || "percentage") as "percentage" | "fixed",
          commission_value: employee.commission_value || 0,
          job_title: employee.job_title || "",
          created_at: employee.created_at,
          updated_at: employee.updated_at
        }));

        setEmployees(typedEmployees);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, toast]);

  const handleUpdateMediaBuying = async (mediaBuyingData: MediaBuying) => {
    try {
      setIsLoading(true);
      
      // Transform MediaBuying type to database schema
      const dbData = {
        platform: mediaBuyingData.platform,
        date: typeof mediaBuyingData.campaign_date === 'string' 
          ? mediaBuyingData.campaign_date 
          : mediaBuyingData.campaign_date.toISOString().split('T')[0],
        brand_id: mediaBuyingData.brand_id,
        employee_id: mediaBuyingData.employee_id,
        spend: mediaBuyingData.ad_spend,
        orders_count: mediaBuyingData.orders_count,
        order_cost: mediaBuyingData.cpp,
        roas: mediaBuyingData.roas,
        campaign_link: mediaBuyingData.campaign_link,
        notes: mediaBuyingData.notes
      };

      const { error } = await supabase
        .from("media_buying")
        .update(dbData)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم تحديث بيانات الميديا باينج",
        description: "تم تحديث البيانات بنجاح.",
      });

      navigate("/media-buying");
    } catch (error: any) {
      console.error("Error updating media buying data:", error);
      toast({
        title: "Error",
        description: "Failed to update media buying data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل بيانات الميديا باينج</h1>

      {isLoading ? (
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p>جارِ تحميل البيانات...</p>
          </CardContent>
        </Card>
      ) : mediaBuying ? (
        <MediaBuyingForm
          initialData={mediaBuying}
          onSubmit={handleUpdateMediaBuying}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-500">
              لم يتم العثور على بيانات الميديا باينج
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              البيانات المطلوبة غير موجودة أو تم حذفها.
            </p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              onClick={() => navigate("/media-buying")}
            >
              العودة إلى قائمة بيانات الميديا باينج
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
