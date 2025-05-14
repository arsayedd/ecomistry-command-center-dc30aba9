
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  useMutation,
  useQuery, 
  useQueryClient 
} from "@tanstack/react-query";
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash,
  FileText,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Expense, Revenue } from "@/types";
import { format } from "date-fns";

// Sample data for initial display
const sampleExpenses: Expense[] = [
  {
    id: "1",
    category: "مرتبات",
    amount: 7500,
    description: "مرتبات شهر مايو",
    date: "2025-05-10",
    created_at: "2025-05-01"
  },
  {
    id: "2",
    category: "إعلانات",
    amount: 5000,
    description: "إعلانات فيسبوك",
    brand_id: "1",
    date: "2025-05-08",
    created_at: "2025-05-01"
  },
  {
    id: "3",
    category: "إيجار",
    amount: 10000,
    description: "إيجار المكتب",
    date: "2025-05-05",
    created_at: "2025-05-01"
  }
];

// Sample brands
const sampleBrands = [
  { id: "1", name: "براند أزياء" },
  { id: "2", name: "براند تجميل" },
  { id: "3", name: "براند أغذية" }
];

// Sample employees
const sampleEmployees = [
  { id: "1", user: { full_name: "أحمد محمد" } },
  { id: "2", user: { full_name: "سارة أحمد" } },
  { id: "3", user: { full_name: "محمود علي" } }
];

// Sample data for initial display
const sampleRevenues: Revenue[] = [
  {
    id: "1",
    brand_id: "1",
    amount: 15000,
    items_count: 30,
    item_price: 500,
    date: "2025-05-12",
    created_at: "2025-05-12",
    brand: { id: "1", name: "براند أزياء" }
  },
  {
    id: "2",
    brand_id: "2",
    amount: 18000,
    items_count: 36,
    item_price: 500,
    date: "2025-05-11",
    created_at: "2025-05-11",
    brand: { id: "2", name: "براند تجميل" }
  },
  {
    id: "3",
    brand_id: "3",
    amount: 22000,
    items_count: 44,
    item_price: 500,
    date: "2025-05-10",
    created_at: "2025-05-10",
    brand: { id: "3", name: "براند أغذية" }
  }
];

export default function FinancePage() {
  const [searchExpense, setSearchExpense] = useState("");
  const [searchRevenue, setSearchRevenue] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [activeTab, setActiveTab] = useState("revenues");
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(sampleExpenses);
  const [localRevenues, setLocalRevenues] = useState<Revenue[]>(sampleRevenues);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch expenses
  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("expenses")
          .select(`
            *,
            brand:brands(id, name),
            employee:employees(id, user:users(full_name))
          `)
          .order("date", { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching expenses:", error);
        return sampleExpenses;
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
            brand:brands(id, name)
          `)
          .order("date", { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching revenues:", error);
        return sampleRevenues;
      }
    },
  });

  // Fetch brands
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("id, name")
          .order("name");

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching brands:", error);
        return sampleBrands;
      }
    },
  });

  // Update local data when API data changes
  useEffect(() => {
    if (expenses && expenses.length > 0) {
      setLocalExpenses(expenses as Expense[]);
    }
    if (revenues && revenues.length > 0) {
      setLocalRevenues(revenues as Revenue[]);
    }
  }, [expenses, revenues]);

  // Filter expenses
  const filteredExpenses = localExpenses.filter((expense) => {
    const matchesSearch = !searchExpense || 
      expense.category.toLowerCase().includes(searchExpense.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchExpense.toLowerCase());
    
    const matchesCategory = !filterCategory || expense.category === filterCategory;
    const matchesBrand = !filterBrand || expense.brand_id === filterBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Filter revenues
  const filteredRevenues = localRevenues.filter((revenue) => {
    const brandName = revenue.brand?.name || "";
    
    const matchesSearch = !searchRevenue || 
      brandName.toLowerCase().includes(searchRevenue.toLowerCase());
    
    const matchesBrand = !filterBrand || revenue.brand_id === filterBrand;
    
    return matchesSearch && matchesBrand;
  });

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const totalRevenues = filteredRevenues.reduce((sum, revenue) => sum + Number(revenue.amount), 0);
  const profit = totalRevenues - totalExpenses;
  const profitMargin = totalRevenues > 0 ? (profit / totalRevenues) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">النظام المالي</h1>
        <div className="flex gap-2">
          <Link to="/finance/expenses/add">
            <Button variant="outline">
              <Plus className="h-4 w-4 ml-2" /> إضافة مصروف
            </Button>
          </Link>
          <Link to="/finance/revenues/add">
            <Button>
              <Plus className="h-4 w-4 ml-2" /> إضافة إيراد
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(totalRevenues)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">إجمالي المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(totalExpenses)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">صافي الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(profit)}
            </div>
            <div className="text-sm text-gray-500">
              هامش الربح: {profitMargin.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="revenues" className="flex-1">الإيرادات</TabsTrigger>
          <TabsTrigger value="expenses" className="flex-1">المصروفات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenues" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">البحث والتصفية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="بحث..."
                    className="pl-10"
                    value={searchRevenue}
                    onChange={(e) => setSearchRevenue(e.target.value)}
                  />
                </div>

                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر البراند" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع البراندات</SelectItem>
                    {(brands || sampleBrands)?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="flex-row justify-between items-center py-4">
              <CardTitle className="text-lg">الإيرادات</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  <span>تصدير PDF</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span>تصدير Excel</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>اسم البراند</TableHead>
                    <TableHead>عدد القطع المباع</TableHead>
                    <TableHead>سعر القطعة</TableHead>
                    <TableHead>إجمالي الإيراد</TableHead>
                    <TableHead>ملاحظات</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingRevenues ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        جاري التحميل...
                      </TableCell>
                    </TableRow>
                  ) : filteredRevenues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        لا توجد إيرادات مطابقة للبحث
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRevenues.map((revenue) => (
                      <TableRow key={revenue.id}>
                        <TableCell>
                          {format(new Date(revenue.date), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell>{revenue.brand?.name || "غير محدد"}</TableCell>
                        <TableCell>{revenue.items_count || "غير محدد"}</TableCell>
                        <TableCell>
                          {revenue.item_price ? 
                            new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(revenue.item_price) : 
                            "غير محدد"}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(revenue.amount)}
                        </TableCell>
                        <TableCell>{revenue.notes || "لا توجد ملاحظات"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link to={`/finance/revenues/${revenue.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">البحث والتصفية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="بحث..."
                    className="pl-10"
                    value={searchExpense}
                    onChange={(e) => setSearchExpense(e.target.value)}
                  />
                </div>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="نوع المصروف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الأنواع</SelectItem>
                    <SelectItem value="مرتبات">مرتبات</SelectItem>
                    <SelectItem value="إعلانات">إعلانات</SelectItem>
                    <SelectItem value="إيجار">إيجار</SelectItem>
                    <SelectItem value="مستلزمات">مستلزمات</SelectItem>
                    <SelectItem value="أخرى">أخرى</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="البراند المرتبط" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع البراندات</SelectItem>
                    {(brands || sampleBrands)?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="flex-row justify-between items-center py-4">
              <CardTitle className="text-lg">المصروفات</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  <span>تصدير PDF</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span>تصدير Excel</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>نوع المصروف</TableHead>
                    <TableHead>البراند المرتبط</TableHead>
                    <TableHead>الموظف المسؤول</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingExpenses ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        جاري التحميل...
                      </TableCell>
                    </TableRow>
                  ) : filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        لا توجد مصروفات مطابقة للبحث
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {format(new Date(expense.date), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>
                          {expense.brand_id ? brands?.find(b => b.id === expense.brand_id)?.name || "غير محدد" : "غير مرتبط"}
                        </TableCell>
                        <TableCell>
                          {expense.employee_id ? 
                            sampleEmployees.find(e => e.id === expense.employee_id)?.user?.full_name || "غير محدد" : 
                            "غير محدد"}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(expense.amount)}
                        </TableCell>
                        <TableCell>{expense.description || "لا يوجد وصف"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link to={`/finance/expenses/${expense.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
