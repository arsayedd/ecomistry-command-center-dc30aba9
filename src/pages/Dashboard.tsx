
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
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
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">مرحبا بك {user?.email}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      <h2 className="text-xl font-semibold mt-8">ملخص الأداء</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">قريبًا سيتم إضافة رسوم بيانية ومخططات تفاعلية هنا لعرض البيانات بشكل مرئي.</p>
      </div>
    </div>
  );
};

export default Dashboard;
