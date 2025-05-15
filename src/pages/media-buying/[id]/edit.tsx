import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaBuyingForm } from "@/components/media-buying/MediaBuyingForm";
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

        setMediaBuying(mediaBuyingData);

        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("*");

        if (brandsError) {
          throw brandsError;
        }

        setBrands(brandsData);

        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
          .from("users")
          .select("*");

        if (employeesError) {
          throw employeesError;
        }

        setEmployees(employeesData);
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
      const { error } = await supabase
        .from("media_buying")
        .update(mediaBuyingData)
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
          brands={brands}
          employees={employees}
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
