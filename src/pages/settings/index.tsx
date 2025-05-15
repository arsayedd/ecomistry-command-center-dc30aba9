
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { SettingsAccount } from "@/components/settings/SettingsAccount";
import { SettingsSecurity } from "@/components/settings/SettingsSecurity";
import { SettingsTheme } from "@/components/settings/SettingsTheme";
import { SettingsNotifications } from "@/components/settings/SettingsNotifications";
import { SettingsLanguage } from "@/components/settings/SettingsLanguage";
import { useToast } from "@/hooks/use-toast";
import { SettingsSidebarItem } from "@/components/settings/SettingsSidebarItem";
import { ShieldCheck, Bell, Palette, Globe, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleSave = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ التغييرات بنجاح",
    });
  };

  const user = {
    user_metadata: {
      name: "مستخدم النظام"
    },
    email: "user@example.com"
  };

  return (
    <div className="container p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة إعدادات حسابك ومظهر النظام</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-64 p-1">
          <Tabs 
            value={activeTab}
            onValueChange={setActiveTab} 
            className="w-full" 
            orientation="vertical"
          >
            <TabsList className="flex flex-col h-auto bg-transparent space-y-1 p-0">
              <SettingsSidebarItem 
                value="account" 
                active={activeTab === "account"} 
                icon={<User className="ml-2 h-4 w-4" />} 
                label="معلومات الحساب" 
              />
              <SettingsSidebarItem 
                value="security" 
                active={activeTab === "security"} 
                icon={<ShieldCheck className="ml-2 h-4 w-4" />} 
                label="الأمان" 
              />
              <SettingsSidebarItem 
                value="theme" 
                active={activeTab === "theme"} 
                icon={<Palette className="ml-2 h-4 w-4" />} 
                label="المظهر" 
              />
              <SettingsSidebarItem 
                value="notifications" 
                active={activeTab === "notifications"} 
                icon={<Bell className="ml-2 h-4 w-4" />} 
                label="الإشعارات" 
              />
              <SettingsSidebarItem 
                value="language" 
                active={activeTab === "language"} 
                icon={<Globe className="ml-2 h-4 w-4" />} 
                label="اللغة" 
              />
            </TabsList>
          </Tabs>
        </Card>

        <div className="flex-1">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="account" className="m-0">
              <SettingsAccount user={user} onSave={handleSave} />
            </TabsContent>
            <TabsContent value="security" className="m-0">
              <SettingsSecurity onSave={handleSave} />
            </TabsContent>
            <TabsContent value="theme" className="m-0">
              <SettingsTheme onSave={handleSave} />
            </TabsContent>
            <TabsContent value="notifications" className="m-0">
              <SettingsNotifications onSave={handleSave} />
            </TabsContent>
            <TabsContent value="language" className="m-0">
              <SettingsLanguage onSave={handleSave} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
