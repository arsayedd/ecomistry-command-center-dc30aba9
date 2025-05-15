
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

interface SettingsNotificationsProps {
  onSave: () => void;
}

export function SettingsNotifications({ onSave }: SettingsNotificationsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>الإشعارات</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">إشعارات البريد الإلكتروني</Label>
            <p className="text-sm text-gray-500">استلام إشعارات عبر البريد الإلكتروني</p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications">الإشعارات العاجلة</Label>
            <p className="text-sm text-gray-500">استلام إشعارات على المتصفح</p>
          </div>
          <Switch
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
            <CircleCheck className="ml-2 h-4 w-4" />
            حفظ إعدادات الإشعارات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
