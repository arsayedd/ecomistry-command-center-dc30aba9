
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

interface SettingsLanguageProps {
  onSave: () => void;
}

export function SettingsLanguage({ onSave }: SettingsLanguageProps) {
  const [language, setLanguage] = useState("ar");

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>إعدادات اللغة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language">لغة النظام</Label>
          <select
            id="language"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:ring-offset-1"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ar">العربية</option>
            <option value="en">الإنجليزية</option>
          </select>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
            <CircleCheck className="ml-2 h-4 w-4" />
            حفظ إعدادات اللغة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
