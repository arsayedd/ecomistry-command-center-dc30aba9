
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

export default function UserSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">إعدادات الملف الشخصي</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الملف الشخصي</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">الاسم الكامل</label>
                    <Input id="name" placeholder="أدخل الاسم الكامل" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                    <Input id="email" type="email" placeholder="أدخل البريد الإلكتروني" />
                  </div>
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium mb-1">نبذة تعريفية</label>
                  <textarea 
                    id="bio" 
                    rows={4} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="أدخل نبذة تعريفية مختصرة"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>حفظ التغييرات</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium mb-1">كلمة المرور الحالية</label>
                    <Input id="current-password" type="password" placeholder="أدخل كلمة المرور الحالية" />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium mb-1">كلمة المرور الجديدة</label>
                    <Input id="new-password" type="password" placeholder="أدخل كلمة المرور الجديدة" />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">تأكيد كلمة المرور</label>
                    <Input id="confirm-password" type="password" placeholder="أعد إدخال كلمة المرور الجديدة" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>تحديث كلمة المرور</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">إشعارات البريد الإلكتروني</h4>
                    <p className="text-sm text-muted-foreground">استلام إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">إشعارات المنصة</h4>
                    <p className="text-sm text-muted-foreground">استلام إشعارات داخل المنصة</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex justify-end">
                  <Button>حفظ التفضيلات</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
