
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseForm } from "@/components/finance/expense/ExpenseForm";

export default function AddExpensePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إضافة مصروف جديد</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات المصروف</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm />
        </CardContent>
      </Card>
    </div>
  );
}
