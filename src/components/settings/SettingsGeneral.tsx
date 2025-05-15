
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

interface SettingsGeneralProps {
  onSave: () => void;
}

export function SettingsGeneral({ onSave }: SettingsGeneralProps) {
  const [companyName, setCompanyName] = useState("Ecomistry");
  const [website, setWebsite] = useState("https://ecomistry.com");
  const [timezone, setTimezone] = useState("Africa/Cairo");
  const [dateFormat, setDateFormat] = useState("dd/MM/yyyy");

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>الإعدادات العامة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="company-name">اسم الشركة</Label>
          <Input 
            id="company-name" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">الموقع الإلكتروني</Label>
          <Input 
            id="website" 
            type="url" 
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">المنطقة الزمنية</Label>
          <select
            id="timezone"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-1 focus:ring-ring focus:ring-offset-1"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="Africa/Cairo">القاهرة (توقيت مصر)</option>
            <option value="Asia/Riyadh">الرياض (توقيت السعودية)</option>
            <option value="Asia/Dubai">دبي (توقيت الإمارات)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date-format">تنسيق التاريخ</Label>
          <select
            id="date-format"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-1 focus:ring-ring focus:ring-offset-1"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
          >
            <option value="dd/MM/yyyy">اليوم/الشهر/السنة (21/05/2023)</option>
            <option value="MM/dd/yyyy">الشهر/اليوم/السنة (05/21/2023)</option>
            <option value="yyyy-MM-dd">السنة-الشهر-اليوم (2023-05-21)</option>
          </select>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
            <CircleCheck className="ml-2 h-4 w-4" />
            حفظ الإعدادات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
