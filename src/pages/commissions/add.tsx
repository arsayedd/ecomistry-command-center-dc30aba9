
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommissionForm } from "@/components/commissions/CommissionForm";

export default function AddCommissionPage() {
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
          <CommissionForm />
        </CardContent>
      </Card>
    </div>
  );
}
