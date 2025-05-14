
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModerationReportForm } from "@/components/moderation/ModerationReportForm";

export default function AddModerationPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إضافة تقرير مودريشن جديد</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات التقرير</CardTitle>
        </CardHeader>
        <CardContent>
          <ModerationReportForm />
        </CardContent>
      </Card>
    </div>
  );
}
