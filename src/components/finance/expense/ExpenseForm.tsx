
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

type Brand = {
  id: string;
  name: string;
  product_type: string;
  status: "active" | "inactive" | "pending";
  social_links: any;
  created_at: string;
  updated_at: string;
};

interface ExpenseFormData {
  category: string;
  amount: number;
  date: Date;
  brand_id: string;
  description: string;
}

export function ExpenseForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState<ExpenseFormData>({
    category: "ads",
    amount: 0,
    date: new Date(),
    brand_id: "",
    description: ""
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
      
      // Convert string status to the expected enum type
      const formattedBrands = data?.map(brand => ({
        ...brand,
        status: brand.status as "active" | "inactive" | "pending"
      })) || [];
      
      setBrands(formattedBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("حدث خطأ أثناء تحميل البراندات");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
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
      const { error } = await supabase
        .from("expenses")
        .insert([
          {
            category: formData.category,
            amount: formData.amount,
            date: formData.date.toISOString().split('T')[0],
            brand_id: formData.brand_id || null,
            description: formData.description
          }
        ]);

      if (error) throw error;

      toast.success("تم إضافة المصروف بنجاح");
      navigate("/finance");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("حدث خطأ أثناء إضافة المصروف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">نوع المصروف</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع المصروف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ads">إعلانات</SelectItem>
              <SelectItem value="salaries">رواتب</SelectItem>
              <SelectItem value="rent">إيجار</SelectItem>
              <SelectItem value="supplies">مستلزمات</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">القيمة بالجنيه</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={0}
            step={0.01}
            value={formData.amount || ""}
            onChange={handleChange}
            required
          />
        </div>

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
          <Label htmlFor="brand_id">البراند المرتبط (اختياري)</Label>
          <Select
            value={formData.brand_id}
            onValueChange={(value) => handleSelectChange("brand_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر البراند" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون براند</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">وصف المصروف</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="وصف تفصيلي للمصروف"
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
          {loading ? "جاري الحفظ..." : "حفظ المصروف"}
        </Button>
      </div>
    </form>
  );
}
