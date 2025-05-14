
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface EmployeeFormData {
  full_name: string;
  email: string;
  department: string;
  job_title: string;
  employment_type: string;
  salary_type: string;
  salary_amount: number;
  commission_type: string;
  commission_value: number;
  status: string;
  access_rights: string;
  role: string;
  permission_level: string;
}

export default function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    full_name: "",
    email: "",
    department: "",
    job_title: "",
    employment_type: "full-time",
    salary_type: "monthly",
    salary_amount: 0,
    commission_type: "none",
    commission_value: 0,
    status: "active",
    access_rights: "view",
    role: "",
    permission_level: ""
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        // Fix: Change from "employees" to "users" table which exists in Supabase
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setFormData({
            full_name: data.full_name || "",
            email: data.email || "",
            department: data.department || "",
            job_title: data.job_title || "",
            employment_type: data.employment_type || "full-time",
            salary_type: data.salary_type || "monthly",
            salary_amount: data.salary_amount || 0,
            commission_type: data.commission_type || "none",
            commission_value: data.commission_value || 0,
            status: data.status || "active",
            access_rights: data.access_rights || "view",
            role: data.role || "",
            permission_level: data.permission_level || ""
          });
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error("فشل في جلب بيانات الموظف");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Fix: Change from "employees" to "users" table which exists in Supabase
      const { error } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          email: formData.email,
          department: formData.department,
          job_title: formData.job_title,
          employment_type: formData.employment_type,
          salary_type: formData.salary_type,
          salary_amount: formData.salary_amount,
          commission_type: formData.commission_type,
          commission_value: formData.commission_value,
          status: formData.status,
          access_rights: formData.access_rights,
          role: formData.role,
          permission_level: formData.permission_level,
          updated_at: new Date().toISOString() // Fix: Convert Date to string
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast.success("تم تحديث بيانات الموظف بنجاح");
      navigate("/employees");
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("فشل في تحديث بيانات الموظف");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تعديل بيانات الموظف</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات الموظف</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">الاسم بالكامل</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="الاسم بالكامل"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="البريد الإلكتروني"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">القسم</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="media-buying">ميديا بايينج</SelectItem>
                    <SelectItem value="call-center">كول سنتر</SelectItem>
                    <SelectItem value="moderation">مودريشن</SelectItem>
                    <SelectItem value="content">كتابة محتوى</SelectItem>
                    <SelectItem value="finance">قسم مالي</SelectItem>
                    <SelectItem value="management">إدارة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_title">الوظيفة</Label>
                <Input
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="المسمى الوظيفي"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_type">نوع التوظيف</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) => handleSelectChange("employment_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع التوظيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">دوام كامل</SelectItem>
                    <SelectItem value="part-time">دوام جزئي</SelectItem>
                    <SelectItem value="freelancer">فريلانسر</SelectItem>
                    <SelectItem value="per-piece">بالقطعة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_type">نوع المرتب</Label>
                <Select
                  value={formData.salary_type}
                  onValueChange={(value) => handleSelectChange("salary_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المرتب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">شهري</SelectItem>
                    <SelectItem value="hourly">بالساعة</SelectItem>
                    <SelectItem value="per-task">لكل مهمة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_amount">قيمة المرتب</Label>
                <Input
                  id="salary_amount"
                  name="salary_amount"
                  type="number"
                  value={formData.salary_amount}
                  onChange={handleChange}
                  placeholder="قيمة المرتب"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission_type">نوع العمولة</Label>
                <Select
                  value={formData.commission_type}
                  onValueChange={(value) => handleSelectChange("commission_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع العمولة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">نسبة</SelectItem>
                    <SelectItem value="fixed">ثابت</SelectItem>
                    <SelectItem value="none">لا يوجد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission_value">قيمة العمولة</Label>
                <Input
                  id="commission_value"
                  name="commission_value"
                  type="number"
                  value={formData.commission_value}
                  onChange={handleChange}
                  placeholder="قيمة العمولة"
                  disabled={formData.commission_type === "none"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالة الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="probation">تحت التجربة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="access_rights">صلاحيات الوصول</Label>
                <Select
                  value={formData.access_rights}
                  onValueChange={(value) => handleSelectChange("access_rights", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر صلاحيات الوصول" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">مشاهدة</SelectItem>
                    <SelectItem value="add">إضافة</SelectItem>
                    <SelectItem value="edit">تعديل</SelectItem>
                    <SelectItem value="full-access">إدارة كاملة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/employees')}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
