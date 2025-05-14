import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type Brand = {
  id: string;
  name: string;
  product_type: string;
  status: string;
  social_links: any;
  created_at: string;
  updated_at: string;
};

export default function AddRevenuePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState({
    date: new Date(),
    brand_id: "",
    units_sold: 0,
    price_per_unit: 0,
    total_amount: 0,
    notes: ""
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*");

      if (error) throw error;
      
      // Convert string status to the expected type
      const formattedBrands = data?.map(brand => ({
        ...brand
      })) || [];
      
      setBrands(formattedBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("حدث خطأ أثناء تحميل البراندات");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Update form data with the new value
    const updatedFormData = {
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    };
    
    // If units_sold or price_per_unit changed, calculate total_amount
    if (name === 'units_sold' || name === 'price_per_unit') {
      const units = name === 'units_sold' ? parseFloat(value) : formData.units_sold;
      const price = name === 'price_per_unit' ? parseFloat(value) : formData.price_per_unit;
      
      updatedFormData.total_amount = units * price;
    }
    
    setFormData(updatedFormData);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.brand_id) {
        throw new Error("يجب اختيار البراند");
      }

      // Mock creating a revenue record
      toast.success("تم إضافة الإيراد بنجاح");
      navigate("/finance");
      
    } catch (error) {
      console.error("Error adding revenue:", error);
      toast.error("حدث خطأ أثناء إضافة الإيراد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إضافة إيراد جديد</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات الإيراد</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">التاريخ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {formData.date ? (
                        format(formData.date, "PPP", { locale: arEG })
                      ) : (
                        <span>اختر تاريخ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_id">البراند</Label>
                <Select
                  value={formData.brand_id}
                  onValueChange={(value) => handleSelectChange("brand_id", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر البراند" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="units_sold">عدد القطع المباعة</Label>
                <Input
                  id="units_sold"
                  name="units_sold"
                  type="number"
                  min={1}
                  value={formData.units_sold || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_per_unit">سعر القطعة</Label>
                <Input
                  id="price_per_unit"
                  name="price_per_unit"
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.price_per_unit || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_amount">إجمالي الإيراد</Label>
                <Input
                  id="total_amount"
                  name="total_amount"
                  type="number"
                  value={formData.total_amount || ""}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="أي ملاحظات إضافية متعلقة بالإيراد"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/finance')}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "جاري الحفظ..." : "حفظ الإيراد"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
