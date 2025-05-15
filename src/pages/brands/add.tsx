
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrandForm } from "@/components/brands/BrandForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Brand } from "@/types";

export default function AddBrandPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: Partial<Brand>) => {
    try {
      setLoading(true);
      
      console.log("Brand data to save:", data);
      
      // تأكد من وجود الحقول الإلزامية
      if (!data.name) {
        throw new Error("اسم البراند مطلوب");
      }
      
      // ضبط القيم الافتراضية إذا لم تكن موجودة
      const brandData = {
        name: data.name,
        product_type: data.product_type || "",
        description: data.description || "",
        status: data.status || "active",
        social_links: data.social_links || {},
        notes: data.notes || "",
      };
      
      // حفظ البيانات في Supabase
      const { data: savedBrand, error } = await supabase
        .from('brands')
        .insert(brandData)
        .select()
        .single();
      
      if (error) {
        console.error("Error adding brand:", error);
        throw error;
      }
      
      console.log("Successfully saved brand:", savedBrand);
      
      toast({
        title: "تم إضافة البراند بنجاح",
        variant: "default",
      });
      
      navigate("/brands");
    } catch (error: any) {
      console.error("Error adding brand:", error);
      toast({
        title: "حدث خطأ أثناء إضافة البراند",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>إضافة براند جديد</CardTitle>
          <CardDescription>أضف تفاصيل البراند الجديد</CardDescription>
        </CardHeader>
        <CardContent>
          <BrandForm onSubmit={handleSubmit} isSubmitting={loading} />
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={() => navigate("/brands")}>
            إلغاء
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
