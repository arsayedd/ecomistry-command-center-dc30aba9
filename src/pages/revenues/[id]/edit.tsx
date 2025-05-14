
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export default function EditRevenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [revenue, setRevenue] = useState(null);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    amount: 0,
    date: "",
    brand_id: "",
    source: "",
  });

  // Fetch revenue and brands data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch revenue
        const { data: revenueData, error: revenueError } = await supabase
          .from("revenues")
          .select(`
            *,
            brand:brands(id, name)
          `)
          .eq("id", id)
          .single();

        if (revenueError) throw revenueError;
        
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("id, name")
          .order("name");
        
        if (brandsError) throw brandsError;
        
        setRevenue(revenueData);
        setBrands(brandsData || []);
        
        // Set form data
        if (revenueData) {
          setFormData({
            amount: revenueData.amount,
            date: revenueData.date,
            brand_id: revenueData.brand_id || "",
            source: revenueData.source || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "لم نتمكن من جلب بيانات الإيراد، يرجى المحاولة مرة أخرى.",
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

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("revenues")
        .update(formData)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم تحديث الإيراد",
        description: "تم تحديث بيانات الإيراد بنجاح",
      });

      navigate("/revenues");
    } catch (error) {
      console.error("Error updating revenue:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الإيراد",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل الإيراد</h1>

      {isLoading ? (
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p>جارِ تحميل بيانات الإيراد...</p>
          </CardContent>
        </Card>
      ) : revenue ? (
        <Card>
          <CardHeader>
            <CardTitle>بيانات الإيراد</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">البراند</Label>
                  <Select
                    value={formData.brand_id}
                    onValueChange={(value) => handleChange("brand_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر البراند" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">غير محدد</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source">مصدر الإيراد</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleChange("source", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مصدر الإيراد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مبيعات">مبيعات</SelectItem>
                      <SelectItem value="استشارات">استشارات</SelectItem>
                      <SelectItem value="خدمات">خدمات</SelectItem>
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/revenues")}>
                  إلغاء
                </Button>
                <Button type="submit">
                  حفظ التغييرات
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-500">لم يتم العثور على الإيراد</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">الإيراد المطلوب غير موجود أو تم حذفه</p>
            <Button onClick={() => navigate("/revenues")}>
              العودة إلى قائمة الإيرادات
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
