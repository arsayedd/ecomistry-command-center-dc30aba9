
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrandForm } from "@/components/brands/BrandForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Brand } from "@/types";

export default function AddBrandPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: Partial<Brand>) => {
    try {
      setLoading(true);
      
      console.log("Brand data to save:", data);
      
      // Save data to Supabase
      const { data: brandData, error } = await supabase
        .from('brands')
        .insert([data])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      console.log("Successfully saved brand:", brandData);
      
      toast.success("تم إضافة البراند بنجاح");
      navigate("/brands");
    } catch (error) {
      console.error("Error adding brand:", error);
      toast.error("حدث خطأ أثناء إضافة البراند");
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
