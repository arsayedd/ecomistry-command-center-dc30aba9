
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Download, FileEdit, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToPDF } from "@/utils/exportUtils";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("expenses");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [revenues, setRevenues] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
    fetchBrands();
  }, []);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (expensesError) throw expensesError;
      setExpenses(expensesData || []);

      // Fetch revenues
      const { data: revenuesData, error: revenuesError } = await supabase
        .from("revenues")
        .select("*")
        .order("date", { ascending: false });

      if (revenuesError) throw revenuesError;
      setRevenues(revenuesData || []);
    } catch (error) {
      console.error("Error fetching finance data:", error);
      toast.error("حدث خطأ أثناء تحميل البيانات المالية");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*");

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : "غير محدد";
  };

  const handleExportPDF = () => {
    if (activeTab === "expenses") {
      const filteredData = filterExpenses();
      exportToPDF(
        "expenses_report",
        "تقرير المصروفات",
        filteredData,
        ["التاريخ", "الفئة", "البراند", "المبلغ", "الوصف"],
        ["date", "category", "brand_id", "amount", "description"]
      );
    } else {
      const filteredData = filterRevenues();
      exportToPDF(
        "revenues_report",
        "تقرير الإيرادات",
        filteredData,
        ["التاريخ", "البراند", "عدد القطع", "سعر القطعة", "الإجمالي", "الملاحظات"],
        ["date", "brand_id", "units_sold", "price_per_unit", "total_amount", "notes"]
      );
    }
  };

  const filterExpenses = () => {
    return expenses.filter(expense => {
      const matchesSearch = 
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(expense.amount).includes(searchTerm);
      
      const matchesBrand = brandFilter === "all" || expense.brand_id === brandFilter;
      const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
      
      return matchesSearch && matchesBrand && matchesCategory;
    });
  };

  const filterRevenues = () => {
    return revenues.filter(revenue => {
      const matchesSearch = 
        revenue.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(revenue.total_amount).includes(searchTerm);
      
      const matchesBrand = brandFilter === "all" || revenue.brand_id === brandFilter;
      
      return matchesSearch && matchesBrand;
    });
  };

  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case "ads":
        return "إعلانات";
      case "salaries":
        return "رواتب";
      case "rent":
        return "إيجار";
      case "supplies":
        return "مستلزمات";
      case "other":
        return "أخرى";
      default:
        return category;
    }
  };

  const filteredExpenses = filterExpenses();
  const filteredRevenues = filterRevenues();

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRevenues = filteredRevenues.reduce((sum, revenue) => sum + revenue.total_amount, 0);
  const profit = totalRevenues - totalExpenses;
  const profitMargin = totalRevenues > 0 ? (profit / totalRevenues) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">النظام المالي</h1>
        <div className="flex gap-2">
          {activeTab === "expenses" && (
            <Link to="/finance/expenses/add">
              <Button>
                <CreditCard className="h-4 w-4 ml-2" /> إضافة مصروف
              </Button>
            </Link>
          )}
          {activeTab === "revenues" && (
            <Link to="/finance/revenues/add">
              <Button>
                <DollarSign className="h-4 w-4 ml-2" /> إضافة إيراد
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalRevenues.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">إجمالي المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">صافي الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profit.toLocaleString()} ج.م
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">هامش الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitMargin.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">المصروفات</TabsTrigger>
          <TabsTrigger value="revenues">الإيرادات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="البحث في المصروفات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-48">
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 ml-2" />
                      <SelectValue placeholder="البراند" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع البراندات</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 ml-2" />
                      <SelectValue placeholder="الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفئات</SelectItem>
                      <SelectItem value="ads">إعلانات</SelectItem>
                      <SelectItem value="salaries">رواتب</SelectItem>
                      <SelectItem value="rent">إيجار</SelectItem>
                      <SelectItem value="supplies">مستلزمات</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="w-full md:w-auto" onClick={handleExportPDF}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>سجل المصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الفئة</TableHead>
                      <TableHead>البراند</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{new Date(expense.date).toLocaleDateString('ar-EG')}</TableCell>
                          <TableCell>{getCategoryDisplay(expense.category)}</TableCell>
                          <TableCell>{getBrandName(expense.brand_id)}</TableCell>
                          <TableCell className="font-semibold text-red-600">{expense.amount.toLocaleString()} ج.م</TableCell>
                          <TableCell>{expense.description || "-"}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          لا توجد مصروفات مطابقة للبحث
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenues" className="space-y-4">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="البحث في الإيرادات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-48">
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 ml-2" />
                      <SelectValue placeholder="البراند" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع البراندات</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="w-full md:w-auto" onClick={handleExportPDF}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>سجل الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>البراند</TableHead>
                      <TableHead>عدد القطع</TableHead>
                      <TableHead>سعر القطعة</TableHead>
                      <TableHead>الإجمالي</TableHead>
                      <TableHead>ملاحظات</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRevenues.length > 0 ? (
                      filteredRevenues.map((revenue) => (
                        <TableRow key={revenue.id}>
                          <TableCell>{new Date(revenue.date).toLocaleDateString('ar-EG')}</TableCell>
                          <TableCell>{getBrandName(revenue.brand_id)}</TableCell>
                          <TableCell>{revenue.units_sold}</TableCell>
                          <TableCell>{revenue.price_per_unit.toLocaleString()} ج.م</TableCell>
                          <TableCell className="font-semibold text-green-600">{revenue.total_amount.toLocaleString()} ج.م</TableCell>
                          <TableCell>{revenue.notes || "-"}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          لا توجد إيرادات مطابقة للبحث
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
