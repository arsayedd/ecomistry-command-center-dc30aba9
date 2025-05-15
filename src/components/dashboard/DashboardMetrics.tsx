
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Coins, Users, TrendingUp, FileText, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardMetricsProps {
  metrics: {
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
    profitMargin: number;
    totalOrders: number;
    employeesCount: number;
    conversionRate: number;
  };
  isLoading: boolean;
}

export function DashboardMetrics({ metrics, isLoading }: DashboardMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', { 
      style: 'currency', 
      currency: 'EGP',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
            {isLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics.totalRevenue)}
              </p>
            )}
          </div>
          <div className="p-2 bg-green-100 rounded-full">
            <Coins className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">إجمالي المصروفات</p>
            {isLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(metrics.totalExpenses)}
              </p>
            )}
          </div>
          <div className="p-2 bg-red-100 rounded-full">
            <Coins className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">صافي الأرباح</p>
            {isLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <p className={`text-2xl font-bold ${metrics.totalProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(metrics.totalProfit)}
              </p>
            )}
          </div>
          <div className={`p-2 ${metrics.totalProfit >= 0 ? 'bg-blue-100' : 'bg-red-100'} rounded-full`}>
            <TrendingUp className={`h-8 w-8 ${metrics.totalProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">عدد الموظفين</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-violet-600">
                {metrics.employeesCount}
              </p>
            )}
          </div>
          <div className="p-2 bg-violet-100 rounded-full">
            <Users className="h-8 w-8 text-violet-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">عدد الطلبات</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-amber-600">
                {metrics.totalOrders}
              </p>
            )}
          </div>
          <div className="p-2 bg-amber-100 rounded-full">
            <ShoppingBag className="h-8 w-8 text-amber-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">معدل التحويل</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-emerald-600">
                {metrics.conversionRate}%
              </p>
            )}
          </div>
          <div className="p-2 bg-emerald-100 rounded-full">
            <FileText className="h-8 w-8 text-emerald-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
