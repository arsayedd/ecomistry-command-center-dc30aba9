
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueForm } from "@/components/finance/revenue/RevenueForm";

export default function AddRevenuePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إضافة إيراد جديد</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات الإيراد</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueForm />
        </CardContent>
      </Card>
    </div>
  );
}
