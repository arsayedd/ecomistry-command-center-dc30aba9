
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { CircleCheck, Home, Lock, Bell, Globe, UserCog } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  
  const handleSaveSettings = () => {
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-64 shrink-0">
          <CardHeader>
            <CardTitle>الإعدادات</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              orientation="vertical"
              className="w-full"
            >
              <TabsList className="flex flex-col items-start h-auto bg-transparent space-y-1">
                <TabsTrigger
                  value="general"
                  className="w-full justify-start text-right px-2"
                >
                  <Home className="ml-2 h-4 w-4" />
                  عام
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="w-full justify-start text-right px-2"
                >
                  <UserCog className="ml-2 h-4 w-4" />
                  الحساب
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="w-full justify-start text-right px-2"
                >
                  <Lock className="ml-2 h-4 w-4" />
                  الأمان
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="w-full justify-start text-right px-2"
                >
                  <Bell className="ml-2 h-4 w-4" />
                  الإشعارات
                </TabsTrigger>
                <TabsTrigger
                  value="language"
                  className="w-full justify-start text-right px-2"
                >
                  <Globe className="ml-2 h-4 w-4" />
                  اللغة
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex-1">
          <TabsContent value="general" className="mt-0 border-0 p-0">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات العامة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">اسم الشركة</Label>
                  <Input id="company-name" defaultValue="Ecomistry" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">الموقع الإلكتروني</Label>
                  <Input id="website" type="url" defaultValue="https://ecomistry.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <select
                    id="timezone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:ring-offset-1"
                    defaultValue="Africa/Cairo"
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:ring-offset-1"
                    defaultValue="dd/MM/yyyy"
                  >
                    <option value="dd/MM/yyyy">اليوم/الشهر/السنة (21/05/2023)</option>
                    <option value="MM/dd/yyyy">الشهر/اليوم/السنة (05/21/2023)</option>
                    <option value="yyyy-MM-dd">السنة-الشهر-اليوم (2023-05-21)</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    حفظ الإعدادات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-0 border-0 p-0">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الحساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input id="name" defaultValue={user?.user_metadata?.name || "مستخدم النظام"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>الصورة الشخصية</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCog className="h-8 w-8 text-gray-500" />
                    </div>
                    <Button variant="outline">تغيير الصورة</Button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    حفظ المعلومات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0 border-0 p-0">
            <Card>
              <CardHeader>
                <CardTitle>الأمان</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    تحديث كلمة المرور
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 border-0 p-0">
            <Card>
              <CardHeader>
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
                
                <Separator />
                
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
                  <Button onClick={handleSaveSettings}>
                    حفظ إعدادات الإشعارات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="mt-0 border-0 p-0">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات اللغة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">لغة النظام</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:ring-offset-1"
                    defaultValue="ar"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">الإنجليزية</option>
                  </select>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    حفظ إعدادات اللغة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
}
