
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { exportToPDF } from "@/utils/exportUtils";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { StatisticsCards } from "@/components/finance/StatisticsCards";
import { ExpensesFilters } from "@/components/finance/ExpensesFilters";
import { RevenuesFilters } from "@/components/finance/RevenuesFilters";
import { ExpensesList } from "@/components/finance/ExpensesList";
import { RevenuesList } from "@/components/finance/RevenuesList";

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

      // Mock revenues data since the table doesn't exist yet
      setRevenues([
        {
          id: '1',
          date: '2023-05-01',
          brand_id: '1',
          units_sold: 10,
          price_per_unit: 100,
          total_amount: 1000,
          notes: 'Test revenue'
        }
      ]);
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
        filteredData
      );
    } else {
      const filteredData = filterRevenues();
      exportToPDF(
        "revenues_report",
        "تقرير الإيرادات",
        filteredData
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

      <StatisticsCards 
        totalRevenues={totalRevenues}
        totalExpenses={totalExpenses}
        profit={profit}
        profitMargin={profitMargin}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">المصروفات</TabsTrigger>
          <TabsTrigger value="revenues">الإيرادات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="space-y-4">
          <ExpensesFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            brands={brands}
            onExport={handleExportPDF}
          />

          <Card>
            <CardHeader>
              <CardTitle>سجل المصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensesList 
                expenses={filteredExpenses} 
                loading={loading} 
                getBrandName={getBrandName}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenues" className="space-y-4">
          <RevenuesFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            brands={brands}
            onExport={handleExportPDF}
          />

          <Card>
            <CardHeader>
              <CardTitle>سجل الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenuesList 
                revenues={filteredRevenues}
                loading={loading}
                getBrandName={getBrandName}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
