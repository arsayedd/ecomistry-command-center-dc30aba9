
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeForm } from "@/components/employees/EmployeeForm";

export default function AddEmployeePage() {
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
