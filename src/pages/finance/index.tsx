
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Expense, Revenue } from "@/types";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("expenses");

  // Fetch expenses
  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("expenses")
          .select(`
            *,
            brand:brands(*),
            employee:employees(
              *,
              user:users(*)
            )
          `)
          .order("date", { ascending: false });

        if (error) throw error;
        return data as Expense[] || [];
      } catch (error) {
        console.error("Error fetching expenses:", error);
        // Return mock data
        return [] as Expense[];
      }
    },
  });

  // Fetch revenues
  const { data: revenues, isLoading: isLoadingRevenues } = useQuery({
    queryKey: ["revenues"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("revenues")
          .select(`
            *,
            brand:brands(*)
          `)
          .order("date", { ascending: false });

        if (error) throw error;
        return data as Revenue[] || [];
      } catch (error) {
        console.error("Error fetching revenues:", error);
        // Return mock data
        return [] as Revenue[];
      }
    },
  });

  // Get category name in Arabic
  const getCategoryName = (category: string) => {
    switch(category) {
      case "salaries": return "رواتب";
      case "ads": return "إعلانات";
      case "rent": return "إيجار";
      case "supplies": return "مستلزمات";
      case "other": return "أخرى";
      default: return category;
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses?.reduce((acc, expense) => acc + Number(expense.amount), 0) || 0;
  
  // Calculate total revenues
  const totalRevenues = revenues?.reduce((acc, revenue) => acc + Number(revenue.amount), 0) || 0;
  
  // Calculate profit
  const profit = totalRevenues - totalExpenses;
  
  // Calculate profit margin
  const profitMargin = totalRevenues > 0 ? (profit / totalRevenues) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">النظام المالي</h1>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">إجمالي الإيرادات</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{totalRevenues.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">إجمالي المصروفات</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{totalExpenses.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">صافي الربح</div>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'} mt-1`}>
              {profit.toLocaleString()} ج.م
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">هامش الربح</div>
            <div className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-emerald-600' : 'text-red-600'} mt-1`}>
              {profitMargin.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="expenses" className="flex-1">المصروفات</TabsTrigger>
          <TabsTrigger value="revenues" className="flex-1">الإيرادات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>المصروفات</CardTitle>
              <Link to="/finance/expenses/add">
                <Button>
                  <Plus className="h-4 w-4 ml-2" /> إضافة مصروف
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingExpenses ? (
                <div className="text-center py-10">جاري تحميل البيانات...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table dir="rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">نوع المصروف</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">البراند المرتبط</TableHead>
                        <TableHead className="text-right">القيمة (ج.م)</TableHead>
                        <TableHead className="text-right">الموظف المسؤول</TableHead>
                        <TableHead className="text-right">ملاحظات / وصف العملية</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses && expenses.length > 0 ? (
                        expenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>{getCategoryName(expense.category)}</TableCell>
                            <TableCell>
                              {expense.date ? format(new Date(expense.date), "dd MMM yyyy", { locale: ar }) : "غير محدد"}
                            </TableCell>
                            <TableCell>{expense.brand?.name || "غير محدد"}</TableCell>
                            <TableCell>{Number(expense.amount).toLocaleString()}</TableCell>
                            <TableCell>{expense.employee?.user?.full_name || "غير محدد"}</TableCell>
                            <TableCell className="max-w-xs truncate">{expense.description || "لا يوجد"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            لا توجد مصروفات مسجلة
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenues">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>الإيرادات</CardTitle>
              <Link to="/revenues/add">
                <Button>
                  <Plus className="h-4 w-4 ml-2" /> إضافة إيراد
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingRevenues ? (
                <div className="text-center py-10">جاري تحميل البيانات...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table dir="rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">البراند</TableHead>
                        <TableHead className="text-right">عدد القطع المباعة</TableHead>
                        <TableHead className="text-right">سعر القطعة (ج.م)</TableHead>
                        <TableHead className="text-right">إجمالي الإيراد (ج.م)</TableHead>
                        <TableHead className="text-right">المصدر</TableHead>
                        <TableHead className="text-right">ملاحظات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenues && revenues.length > 0 ? (
                        revenues.map((revenue) => (
                          <TableRow key={revenue.id}>
                            <TableCell>
                              {revenue.date ? format(new Date(revenue.date), "dd MMM yyyy", { locale: ar }) : "غير محدد"}
                            </TableCell>
                            <TableCell>{revenue.brand?.name || "غير محدد"}</TableCell>
                            <TableCell>{revenue.quantity || "غير محدد"}</TableCell>
                            <TableCell>
                              {revenue.price_per_item ? Number(revenue.price_per_item).toLocaleString() : "غير محدد"}
                            </TableCell>
                            <TableCell>{Number(revenue.amount).toLocaleString()}</TableCell>
                            <TableCell>{revenue.source || "غير محدد"}</TableCell>
                            <TableCell className="max-w-xs truncate">{revenue.notes || "لا يوجد"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            لا توجد إيرادات مسجلة
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
