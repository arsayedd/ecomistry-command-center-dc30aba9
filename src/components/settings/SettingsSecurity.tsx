
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

interface SettingsSecurityProps {
  onSave: () => void;
}

export function SettingsSecurity({ onSave }: SettingsSecurityProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>الأمان</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="current-password">كلمة المرور الحالية</Label>
          <Input 
            id="current-password" 
            type="password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
          <Input 
            id="new-password" 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
          <Input 
            id="confirm-password" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
            <CircleCheck className="ml-2 h-4 w-4" />
            تحديث كلمة المرور
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
