
import { useState } from "react";
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

export default function AddContentTaskPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    brandId: "",
    taskType: "post", // post, reel, ad, landingPage, product
    dueDate: new Date(),
    status: "inProgress", // inProgress, completed, delayed
    deliveryLink: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, dueDate: date }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("تم إضافة مهمة كتابة المحتوى بنجاح");
      navigate("/content");
    } catch (error) {
      console.error("Error adding content task:", error);
      toast.error("حدث خطأ أثناء إضافة مهمة كتابة المحتوى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إضافة مهمة كتابة محتوى جديدة</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات المهمة</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeId">الموظف</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => handleSelectChange("employeeId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emp1">محمد أحمد</SelectItem>
                    <SelectItem value="emp2">سارة محمد</SelectItem>
                    <SelectItem value="emp3">أحمد علي</SelectItem>
                    <SelectItem value="emp4">نورا خالد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandId">البراند</Label>
                <Select
                  value={formData.brandId}
                  onValueChange={(value) => handleSelectChange("brandId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر البراند" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand1">براند أ</SelectItem>
                    <SelectItem value="brand2">براند ب</SelectItem>
                    <SelectItem value="brand3">براند ج</SelectItem>
                    <SelectItem value="brand4">براند د</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskType">نوع المهمة</Label>
                <Select
                  value={formData.taskType}
                  onValueChange={(value) => handleSelectChange("taskType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المهمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post">بوست</SelectItem>
                    <SelectItem value="reel">رييل</SelectItem>
                    <SelectItem value="ad">إعلان</SelectItem>
                    <SelectItem value="landingPage">صفحة هبوط</SelectItem>
                    <SelectItem value="product">منتج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">تاريخ التسليم المتوقع</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !formData.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {formData.dueDate ? (
                        format(formData.dueDate, "PPP", { locale: arEG })
                      ) : (
                        <span>اختر تاريخ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inProgress">قيد التنفيذ</SelectItem>
                    <SelectItem value="completed">تم</SelectItem>
                    <SelectItem value="delayed">متأخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryLink">رابط أو ملف التسليم</Label>
                <Input
                  id="deliveryLink"
                  name="deliveryLink"
                  value={formData.deliveryLink}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات / تعديلات مطلوبة</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="أدخل ملاحظات أو تعديلات مطلوبة"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "جاري الحفظ..." : "حفظ المهمة"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
