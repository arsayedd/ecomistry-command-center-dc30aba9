
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { SettingsGeneral } from "@/components/settings/SettingsGeneral";
import { SettingsAccount } from "@/components/settings/SettingsAccount";
import { SettingsSecurity } from "@/components/settings/SettingsSecurity";
import { SettingsNotifications } from "@/components/settings/SettingsNotifications";
import { SettingsLanguage } from "@/components/settings/SettingsLanguage";
import { SettingsTheme } from "@/components/settings/SettingsTheme";
import { SettingsSidebarItem } from "@/components/settings/SettingsSidebarItem";
import { Home, UserCog, Lock, Bell, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  
  const handleSaveSettings = () => {
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">إعدادات النظام</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <Card className="w-full md:w-64 shrink-0 h-fit">
          <CardContent className="p-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
              orientation="vertical"
            >
              <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full p-0">
                <SettingsSidebarItem 
                  value="general" 
                  active={activeTab === "general"} 
                  icon={<Home className="ml-2 h-4 w-4" />} 
                  label="عام" 
                />
                <SettingsSidebarItem 
                  value="account" 
                  active={activeTab === "account"} 
                  icon={<UserCog className="ml-2 h-4 w-4" />} 
                  label="الحساب" 
                />
                <SettingsSidebarItem 
                  value="security" 
                  active={activeTab === "security"} 
                  icon={<Lock className="ml-2 h-4 w-4" />} 
                  label="الأمان" 
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
                <SettingsSidebarItem 
                  value="theme" 
                  active={activeTab === "theme"} 
                  icon={<div className="ml-2 h-4 w-4 flex items-center justify-center"><ThemeToggle /></div>} 
                  label="المظهر" 
                />
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Content Panels */}
        <div className="flex-1">
          <TabsContent value="general" className="mt-0 border-0 p-0">
            <SettingsGeneral onSave={handleSaveSettings} />
          </TabsContent>

          <TabsContent value="account" className="mt-0 border-0 p-0">
            <SettingsAccount user={user} onSave={handleSaveSettings} />
          </TabsContent>

          <TabsContent value="security" className="mt-0 border-0 p-0">
            <SettingsSecurity onSave={handleSaveSettings} />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 border-0 p-0">
            <SettingsNotifications onSave={handleSaveSettings} />
          </TabsContent>

          <TabsContent value="language" className="mt-0 border-0 p-0">
            <SettingsLanguage onSave={handleSaveSettings} />
          </TabsContent>

          <TabsContent value="theme" className="mt-0 border-0 p-0">
            <SettingsTheme onSave={handleSaveSettings} />
          </TabsContent>
        </div>
      </div>
    </div>
  );
}
