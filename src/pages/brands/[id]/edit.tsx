
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandForm } from "@/components/brands/BrandForm";
import { Loader2 } from "lucide-react";

export default function EditBrandPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brand, setBrand] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch brand data
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("brands")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setBrand(data);
      } catch (error) {
        console.error("Error fetching brand:", error);
        toast({
          title: "خطأ في جلب بيانات البراند",
          description: "لم نتمكن من جلب بيانات البراند، يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBrand();
    }
  }, [id, toast]);

  const handleUpdateBrand = async (brandData) => {
    try {
      const { error } = await supabase
        .from("brands")
        .update(brandData)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم تحديث البراند",
        description: "تم تحديث بيانات البراند بنجاح",
      });

      navigate("/brands");
    } catch (error) {
      console.error("Error updating brand:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث البراند",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل البراند</h1>

      {isLoading ? (
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p>جارِ تحميل بيانات البراند...</p>
          </CardContent>
        </Card>
      ) : brand ? (
        <BrandForm initialData={brand} onSubmit={handleUpdateBrand} isEditing />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-500">لم يتم العثور على البراند</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">البراند المطلوب غير موجود أو تم حذفه</p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              onClick={() => navigate("/brands")}
            >
              العودة إلى قائمة البراندات
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
