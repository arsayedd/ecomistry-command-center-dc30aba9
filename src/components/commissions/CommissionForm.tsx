
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { supabase } from "@/integrations/supabase/client";

interface CommissionFormData {
  employee_id: string;
  commission_type: 'confirmation' | 'delivery';
  value_type: 'percentage' | 'fixed';
  value_amount: number;
  orders_count: number;
  total_commission: number;
  due_date: Date;
}

export function CommissionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState<CommissionFormData>({
    employee_id: "",
    commission_type: "confirmation",
    value_type: "percentage",
    value_amount: 0,
    orders_count: 0,
    total_commission: 0,
    due_date: new Date()
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Calculate total commission whenever value_amount or orders_count changes
    calculateTotalCommission();
  }, [formData.value_amount, formData.orders_count, formData.value_type]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("department", "call_center");

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات الموظفين");
    }
  };

  const calculateTotalCommission = () => {
    let total = 0;
    
    if (formData.value_type === 'percentage') {
      // Calculate percentage of order value (assuming average order value of 100 for simplicity)
      const averageOrderValue = 100;
      total = (formData.value_amount / 100) * averageOrderValue * formData.orders_count;
    } else {
      // Fixed amount per order
      total = formData.value_amount * formData.orders_count;
    }
    
    setFormData((prev) => ({ ...prev, total_commission: total }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormData((prev) => ({ ...prev, due_date: date }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a commission record
      const { error } = await supabase
        .from("commissions")
        .insert([
          {
            employee_id: formData.employee_id,
            commission_type: formData.commission_type,
            value_type: formData.value_type,
            value_amount: formData.value_amount,
            orders_count: formData.orders_count,
            total_commission: formData.total_commission,
            due_date: formData.due_date.toISOString().split('T')[0],
          }
        ]);
      
      if (error) throw error;
      
      toast.success("تم إضافة العمولة بنجاح");
      navigate("/commissions");
      
    } catch (error: any) {
      console.error("Error adding commission:", error);
      toast.error(error.message || "حدث خطأ أثناء إضافة العمولة");
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
          <Label htmlFor="commission_type">نوع العمولة</Label>
          <Select
            value={formData.commission_type}
            onValueChange={(value: 'confirmation' | 'delivery') => handleSelectChange("commission_type", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع العمولة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmation">عمولة التأكيد</SelectItem>
              <SelectItem value="delivery">عمولة التسليم</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value_type">طريقة الحساب</Label>
          <Select
            value={formData.value_type}
            onValueChange={(value: 'percentage' | 'fixed') => handleSelectChange("value_type", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر طريقة الحساب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">نسبة مئوية</SelectItem>
              <SelectItem value="fixed">مبلغ ثابت</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value_amount">
            {formData.value_type === 'percentage' ? 'النسبة المئوية (%)' : 'المبلغ الثابت للطلب'}
          </Label>
          <Input
            id="value_amount"
            name="value_amount"
            type="number"
            min={0}
            step={formData.value_type === 'percentage' ? 0.1 : 1}
            value={formData.value_amount || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orders_count">عدد الطلبات</Label>
          <Input
            id="orders_count"
            name="orders_count"
            type="number"
            min={0}
            value={formData.orders_count || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_commission">إجمالي العمولة</Label>
          <Input
            id="total_commission"
            name="total_commission"
            type="number"
            value={formData.total_commission || ""}
            readOnly
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">تاريخ الاستحقاق</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-right font-normal",
                  !formData.due_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {formData.due_date ? (
                  format(formData.due_date, "PPP", { locale: arEG })
                ) : (
                  <span>اختر تاريخ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.due_date}
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
          onClick={() => navigate('/commissions')}
          className="ml-2"
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : "حفظ العمولة"}
        </Button>
      </div>
    </form>
  );
}
