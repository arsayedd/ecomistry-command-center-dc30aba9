
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function AddEmployeePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if user has access to this page
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    toast({
      title: "غير مصرح",
      description: "ليس لديك صلاحية الوصول إلى هذه الصفحة",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إضافة موظف جديد</h1>
        <p className="text-gray-600">أدخل بيانات الموظف الجديد</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <EmployeeForm />
      </div>
    </div>
  );
}
