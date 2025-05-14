
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
import { User } from "@/types";

interface ModerationFormData {
  employee_id: string;
  platform: "facebook" | "instagram" | "whatsapp";
  daily_responses: number;
  open_messages: number;
  average_response_time: number;
  performance_rating: number;
  supervisor_notes: string;
  date: Date;
}

export function ModerationReportForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<User[]>([]);
  const [formData, setFormData] = useState<ModerationFormData>({
    employee_id: "",
    platform: "facebook",
    daily_responses: 0,
    open_messages: 0,
    average_response_time: 0,
    performance_rating: 5,
    supervisor_notes: "",
    date: new Date()
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("department", "moderation");

      if (error) throw error;
      
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات الموظفين");
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
      if (!formData.employee_id) {
        throw new Error("يجب اختيار الموظف");
      }

      // Create a moderation record
      const { error } = await supabase
        .from("moderation")
        .insert([
          {
            employee_id: formData.employee_id,
            platform: formData.platform,
            daily_responses: formData.daily_responses,
            open_messages: formData.open_messages,
            average_response_time: formData.average_response_time,
            performance_rating: formData.performance_rating,
            supervisor_notes: formData.supervisor_notes,
            date: formData.date.toISOString().split('T')[0],
          }
        ]);
      
      if (error) throw error;
      
      toast.success("تم إضافة تقرير المودريشن بنجاح");
      navigate("/moderation");
      
    } catch (error: any) {
      console.error("Error adding moderation report:", error);
      toast.error(error.message || "حدث خطأ أثناء إضافة التقرير");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="employee_id">الموظف</Label>
          <Select
            value={formData.employee_id}
            onValueChange={(value) => handleSelectChange("employee_id", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الموظف" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Label htmlFor="platform">المنصة</Label>
          <Select
            value={formData.platform}
            onValueChange={(value: "facebook" | "instagram" | "whatsapp") => handleSelectChange("platform", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المنصة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facebook">فيسبوك</SelectItem>
              <SelectItem value="instagram">انستجرام</SelectItem>
              <SelectItem value="whatsapp">واتساب</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="daily_responses">عدد الردود اليومية</Label>
          <Input
            id="daily_responses"
            name="daily_responses"
            type="number"
            min={0}
            value={formData.daily_responses || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="open_messages">عدد الرسائل المفتوحة</Label>
          <Input
            id="open_messages"
            name="open_messages"
            type="number"
            min={0}
            value={formData.open_messages || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="average_response_time">متوسط وقت الرد (بالدقائق)</Label>
          <Input
            id="average_response_time"
            name="average_response_time"
            type="number"
            min={0}
            step={0.1}
            value={formData.average_response_time || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="performance_rating">تقييم الأداء (1-10)</Label>
          <Input
            id="performance_rating"
            name="performance_rating"
            type="number"
            min={1}
            max={10}
            step={0.1}
            value={formData.performance_rating || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supervisor_notes">ملاحظات المشرف</Label>
        <Textarea
          id="supervisor_notes"
          name="supervisor_notes"
          value={formData.supervisor_notes}
          onChange={handleChange}
          placeholder="أي ملاحظات إضافية عن أداء الموظف"
          rows={4}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/moderation')}
          className="ml-2"
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : "حفظ التقرير"}
        </Button>
      </div>
    </form>
  );
}
