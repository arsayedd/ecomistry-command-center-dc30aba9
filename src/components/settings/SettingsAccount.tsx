
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CircleCheck, UserCog } from "lucide-react";
import { useState } from "react";

interface SettingsAccountProps {
  user: any;
  onSave: () => void;
}

export function SettingsAccount({ user, onSave }: SettingsAccountProps) {
  const [name, setName] = useState(user?.user_metadata?.name || "مستخدم النظام");
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>معلومات الحساب</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">الاسم</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input 
            id="email" 
            type="email" 
            value={user?.email || ""} 
            disabled 
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <Label>الصورة الشخصية</Label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCog className="h-8 w-8 text-primary" />
            </div>
            <Button variant="outline">تغيير الصورة</Button>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
            <CircleCheck className="ml-2 h-4 w-4" />
            حفظ المعلومات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
