
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import DashboardMetricsChart from "@/components/dashboard/DashboardMetricsChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const { user } = useAuth();
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalActiveEmployees, setTotalActiveEmployees] = useState(0);
  const [averageCPP, setAverageCPP] = useState(0);
  const [dateFilter, setDateFilter] = useState('month'); // 'week', 'month', 'quarter', 'year'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch total brands
        const { count: brandsCount, error: brandsError } = await supabase
          .from('brands')
          .select('*', { count: 'exact', head: true });
        
        if (brandsError) throw brandsError;
        if (brandsCount !== null) setTotalBrands(brandsCount);

        // Fetch total orders
        const { count: ordersCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        
        if (ordersError) throw ordersError;
        if (ordersCount !== null) setTotalOrders(ordersCount);

        // Fetch total revenue
        const { data: revenueData, error: revenueError } = await supabase
          .from('revenues')
          .select('amount');
        
        if (revenueError) throw revenueError;
        const totalRev = revenueData.reduce((sum, item) => sum + (item.amount || 0), 0);
        setTotalRevenue(totalRev);

        // Fetch total expenses
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('amount');
        
        if (expensesError) throw expensesError;
        const totalExp = expensesData.reduce((sum, item) => sum + (item.amount || 0), 0);
        setTotalExpenses(totalExp);
        
        // Calculate profit
        setTotalProfit(totalRev - totalExp);

        // Fetch active employees
        const { count: activeEmployeesCount, error: employeesError } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
        
        if (employeesError) throw employeesError;
        if (activeEmployeesCount !== null) setTotalActiveEmployees(activeEmployeesCount);

        // Calculate average CPP (Cost Per Purchase)
        const { data: mediaBuyingData, error: mediaBuyingError } = await supabase
          .from('media_buying')
          .select('spend, orders_count');
        
        if (mediaBuyingError) throw mediaBuyingError;
        
        if (mediaBuyingData && mediaBuyingData.length > 0) {
          const totalSpend = mediaBuyingData.reduce((sum, item) => sum + (item.spend || 0), 0);
          const totalOrders = mediaBuyingData.reduce((sum, item) => sum + (item.orders_count || 0), 0);
          
          if (totalOrders > 0) {
            setAverageCPP(totalSpend / totalOrders);
          }
        }

      } catch (error: any) {
        toast({
          title: "خطأ في جلب البيانات",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateFilter]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مرحبا بك يا {user?.email}</h1>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">عرض البيانات لـ:</span>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="اختر الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">آخر أسبوع</SelectItem>
              <SelectItem value="month">آخر شهر</SelectItem>
              <SelectItem value="quarter">آخر ثلاثة أشهر</SelectItem>
              <SelectItem value="year">السنة الحالية</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : `${totalRevenue.toFixed(2)} جنيه`}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">إجمالي المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : `${totalExpenses.toFixed(2)} جنيه`}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">صافي الأرباح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : `${totalProfit.toFixed(2)} جنيه`}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">متوسط تكلفة الطلب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : `${averageCPP.toFixed(2)} جنيه`}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">إجمالي البراندات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : totalBrands}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : totalOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">الموظفين النشطين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : totalActiveEmployees}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">نسبة تحقيق الأهداف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">قريباً</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8">ملخص الأداء</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardMetricsChart 
          title="الإيرادات والمصروفات والأرباح" 
        />
        
        <DashboardMetricsChart 
          title="أداء الإعلانات بالمنصات" 
        />
      </div>
    </div>
  );
};

export default Dashboard;
