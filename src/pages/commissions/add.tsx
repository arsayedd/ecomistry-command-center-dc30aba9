
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function AddCommissionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    commissionType: "confirmation", // confirmation, delivery
    valueType: "percentage", // percentage, fixed
    value: 0,
    ordersCount: 0,
    totalCommission: 0,
    dueDate: new Date()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update the form data
    const updatedFormData = {
      ...formData,
      [name]: name === "value" || name === "ordersCount" ? Number(value) : value
    };
    
    // Calculate total commission if both value and ordersCount are available
    if ((name === "value" || name === "ordersCount" || name === "valueType") && 
        updatedFormData.value && updatedFormData.ordersCount) {
      
      let totalCommission = 0;
      if (updatedFormData.valueType === "percentage") {
        // For percentage, we assume the calculation is based on some order value (50 in this example)
        const averageOrderValue = 300; // This is a dummy value, in a real app this would come from the database
        totalCommission = (updatedFormData.value / 100) * averageOrderValue * updatedFormData.ordersCount;
      } else {
        // For fixed amount, simply multiply by the number of orders
        totalCommission = updatedFormData.value * updatedFormData.ordersCount;
      }
      
      updatedFormData.totalCommission = totalCommission;
    }
    
    setFormData(updatedFormData);
  };

  const handleSelectChange = (name: string, value: string) => {
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    // Recalculate total commission if value type changes
    if (name === "valueType" && updatedFormData.value && updatedFormData.ordersCount) {
      let totalCommission = 0;
      
      if (value === "percentage") {
        const averageOrderValue = 300;
        totalCommission = (updatedFormData.value / 100) * averageOrderValue * updatedFormData.ordersCount;
      } else {
        totalCommission = updatedFormData.value * updatedFormData.ordersCount;
      }
      
      updatedFormData.totalCommission = totalCommission;
    }
    
    setFormData(updatedFormData);
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
      
      toast.success("تم إضافة العمولة بنجاح");
      navigate("/commissions");
    } catch (error) {
      console.error("Error adding commission:", error);
      toast.error("حدث خطأ أثناء إضافة العمولة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إضافة عمولة جديدة</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات العمولة</CardTitle>
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
                    <SelectItem value="emp5">محمود سامي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionType">نوع العمولة</Label>
                <Select
                  value={formData.commissionType}
                  onValueChange={(value) => handleSelectChange("commissionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع العمولة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmation">تأكيد</SelectItem>
                    <SelectItem value="delivery">تسليم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valueType">نوع القيمة</Label>
                <Select
                  value={formData.valueType}
                  onValueChange={(value) => handleSelectChange("valueType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع القيمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">نسبة</SelectItem>
                    <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  {formData.valueType === "percentage" ? "النسبة المئوية" : "المبلغ الثابت"}
                </Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min={0}
                  step={formData.valueType === "percentage" ? 0.1 : 1}
                  value={formData.value || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ordersCount">عدد الطلبات</Label>
                <Input
                  id="ordersCount"
                  name="ordersCount"
                  type="number"
                  min={0}
                  value={formData.ordersCount || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalCommission">إجمالي العمولة</Label>
                <Input
                  id="totalCommission"
                  name="totalCommission"
                  type="number"
                  value={formData.totalCommission || ""}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
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
                {loading ? "جاري الحفظ..." : "حفظ العمولة"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
