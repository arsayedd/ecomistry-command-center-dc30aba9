
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

export default function AddModerationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    platform: "facebook", // facebook, instagram, whatsapp
    dailyResponses: 0,
    openMessages: 0,
    averageResponseTime: "",
    performance: "good", // excellent, good, average, poor
    supervisorNotes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("تم إضافة بيانات المودريشن بنجاح");
      navigate("/moderation");
    } catch (error) {
      console.error("Error adding moderation data:", error);
      toast.error("حدث خطأ أثناء إضافة بيانات المودريشن");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إضافة بيانات مودريشن جديدة</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات المودريشن</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeId">الموظف</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => handleSelectChange("employeeId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emp1">موظف 1</SelectItem>
                    <SelectItem value="emp2">موظف 2</SelectItem>
                    <SelectItem value="emp3">موظف 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">المنصة</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => handleSelectChange("platform", value)}
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
                <Label htmlFor="dailyResponses">عدد الردود اليومية</Label>
                <Input
                  id="dailyResponses"
                  name="dailyResponses"
                  type="number"
                  min={0}
                  value={formData.dailyResponses}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openMessages">عدد الرسائل المفتوحة</Label>
                <Input
                  id="openMessages"
                  name="openMessages"
                  type="number"
                  min={0}
                  value={formData.openMessages}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="averageResponseTime">متوسط وقت الرد</Label>
                <Input
                  id="averageResponseTime"
                  name="averageResponseTime"
                  value={formData.averageResponseTime}
                  onChange={handleChange}
                  placeholder="مثال: 5 دقائق"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="performance">تقييم الأداء</Label>
                <Select
                  value={formData.performance}
                  onValueChange={(value) => handleSelectChange("performance", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التقييم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">ممتاز</SelectItem>
                    <SelectItem value="good">جيد</SelectItem>
                    <SelectItem value="average">متوسط</SelectItem>
                    <SelectItem value="poor">ضعيف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisorNotes">ملاحظات المشرف</Label>
              <Textarea
                id="supervisorNotes"
                name="supervisorNotes"
                value={formData.supervisorNotes}
                onChange={handleChange}
                placeholder="أدخل ملاحظات المشرف"
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
                {loading ? "جاري الحفظ..." : "حفظ البيانات"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
