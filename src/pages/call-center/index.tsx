
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function CallCenterPage() {
  // This is a placeholder for now since we don't have the full orders table yet
  // In a real application, this would fetch data from the orders table
  
  const mockData = [
    {
      id: "1",
      employee_name: "أحمد محمد",
      date: "2023-05-01",
      brand_name: "براند تجريبي",
      orders_entered: 20,
      orders_confirmed: 15,
      orders_delivered: 12,
      commission_type: "percentage",
      commission_value: 5,
      total_commission: 600,
      notes: "أداء جيد"
    },
    {
      id: "2",
      employee_name: "سارة علي",
      date: "2023-05-01",
      brand_name: "براند تجريبي",
      orders_entered: 18,
      orders_confirmed: 14,
      orders_delivered: 10,
      commission_type: "fixed",
      commission_value: 50,
      total_commission: 500,
      notes: ""
    },
    {
      id: "3",
      employee_name: "محمود حسن",
      date: "2023-05-01",
      brand_name: "براند آخر",
      orders_entered: 25,
      orders_confirmed: 20,
      orders_delivered: 15,
      commission_type: "percentage",
      commission_value: 4,
      total_commission: 800,
      notes: "تحسن ملحوظ"
    }
  ];
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الكول سنتر</h1>
        <Link to="/call-center/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة تقرير جديد
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>تقارير الكول سنتر</span>
            <div className="flex items-center">
              <Button variant="outline" size="sm" className="mr-2">
                <Filter className="h-4 w-4 ml-2" />
                تصفية
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الموظف</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">البراند</TableHead>
                  <TableHead className="text-right">الأوردرات المُدخلة</TableHead>
                  <TableHead className="text-right">الأوردرات المؤكدة</TableHead>
                  <TableHead className="text-right">الأوردرات المسلّمة</TableHead>
                  <TableHead className="text-right">نوع العمولة</TableHead>
                  <TableHead className="text-right">قيمة العمولة</TableHead>
                  <TableHead className="text-right">إجمالي العمولة (ج.م)</TableHead>
                  <TableHead className="text-right">ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.employee_name}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.brand_name}</TableCell>
                    <TableCell>{record.orders_entered}</TableCell>
                    <TableCell>{record.orders_confirmed}</TableCell>
                    <TableCell>{record.orders_delivered}</TableCell>
                    <TableCell>
                      {record.commission_type === "percentage" ? "نسبة" : "ثابت"}
                    </TableCell>
                    <TableCell>
                      {record.commission_type === "percentage" 
                        ? `${record.commission_value}%` 
                        : `${record.commission_value} ج.م`
                      }
                    </TableCell>
                    <TableCell>{record.total_commission}</TableCell>
                    <TableCell>{record.notes || "لا يوجد"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
