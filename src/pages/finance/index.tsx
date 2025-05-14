
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { Expense, Brand } from '@/types';
import { Download, Plus } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { exportToExcel, exportToPdf } from '@/utils/exportUtils';

const FinancePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [brands, setBrands] = useState<{ [key: string]: Brand }>({});
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch expenses
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('*');
        
        if (expensesError) throw expensesError;
        setExpenses(expensesData || []);
        
        // Fetch brands for reference
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('*');
        
        if (brandsError) throw brandsError;
        
        // Convert brands array to a lookup object
        const brandsLookup: { [key: string]: Brand } = {};
        brandsData?.forEach(brand => {
          brandsLookup[brand.id] = brand;
        });
        
        setBrands(brandsLookup);
        
      } catch (error) {
        console.error('Error fetching finance data:', error);
        toast.error('حدث خطأ أثناء تحميل البيانات المالية');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Helper function to calculate totals
  const calculateTotals = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    return {
      total,
      categoryTotals
    };
  };
  
  const { total, categoryTotals } = calculateTotals();
  
  // Helper function to translate category names
  const translateCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'salaries': 'رواتب',
      'ads': 'إعلانات',
      'rent': 'إيجار',
      'supplies': 'مستلزمات',
      'other': 'أخرى'
    };
    
    return categoryMap[category] || category;
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">النظام المالي</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => exportToExcel(expenses, 'مصروفات_إيكوميستري')}
            variant="outline"
            size="sm"
            disabled={isLoading || expenses.length === 0}
          >
            <Download className="h-4 w-4 ml-2" />
            تصدير Excel
          </Button>
          <Button
            onClick={() => exportToPdf(expenses, 'مصروفات_إيكوميستري')}
            variant="outline"
            size="sm"
            disabled={isLoading || expenses.length === 0}
          >
            <Download className="h-4 w-4 ml-2" />
            تصدير PDF
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="expenses">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="expenses">المصروفات</TabsTrigger>
          <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
          <TabsTrigger value="profit">الأرباح وهوامش الربح</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المصروفات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{total.toLocaleString()} ج.م</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">أكبر فئة مصروفات</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(categoryTotals).length > 0 ? (
                  <div>
                    <div className="text-2xl font-bold">
                      {translateCategory(
                        Object.entries(categoryTotals)
                          .sort((a, b) => b[1] - a[1])
                          .map(([category]) => category)[0]
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Object.entries(categoryTotals)
                        .sort((a, b) => b[1] - a[1])
                        .map(([, amount]) => amount)[0]?.toLocaleString()} ج.م
                    </p>
                  </div>
                ) : (
                  <div className="text-muted-foreground">لا توجد مصروفات</div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">إضافة مصروف جديد</CardTitle>
                <CardDescription>سجل المصروفات الجديدة مباشرة</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/finance/expenses/add')}
                  className="w-full"
                  disabled={isLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  مصروف جديد
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>قائمة المصروفات</CardTitle>
              <CardDescription>جميع المصروفات المسجلة في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : expenses.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  لا توجد مصروفات مسجلة بعد
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نوع المصروف</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>البراند</TableHead>
                      <TableHead className="text-left">القيمة (ج.م)</TableHead>
                      <TableHead>الوصف</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{translateCategory(expense.category)}</TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>
                          {expense.brand_id && brands[expense.brand_id] 
                            ? brands[expense.brand_id].name 
                            : '-'}
                        </TableCell>
                        <TableCell className="text-left font-medium">
                          {expense.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {expense.description || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-xl font-medium mb-4">قسم الإيرادات</h3>
            <div className="grid place-items-center mb-6">
              <div className="animate-pulse bg-green-100 text-green-800 text-2xl font-bold px-6 py-3 rounded-lg">
                قريباً
              </div>
            </div>
            <Button 
              onClick={() => navigate('/finance/revenues/add')}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              إضافة إيراد جديد
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="profit" className="space-y-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-xl font-medium mb-4">تقارير الأرباح وهوامش الربح</h3>
            <p className="text-muted-foreground mb-6">
              يتم احتساب الأرباح وهوامش الربح بناءً على الإيرادات والمصروفات المسجلة في النظام
            </p>
            
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" disabled={true}>
                <Download className="mr-2 h-4 w-4" />
                تصدير تقارير الربح
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancePage;
