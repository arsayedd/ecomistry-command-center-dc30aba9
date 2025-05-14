
import { useState, useEffect } from "react";
import { RevenueWidget, BrandsRevenueWidget, MediaSpendingWidget, EmployeePerformanceWidget } from "@/components/dashboard/StatisticsWidget";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, Coins, TrendingUp, FileText, ShoppingBag } from "lucide-react";

const Dashboard = () => {
  // Sample dashboard metrics
  const dashboardMetrics = {
    totalRevenue: 172500,
    totalExpenses: 98700,
    totalProfit: 73800,
    totalEmployees: 24,
    totalOrders: 387,
    conversionRate: 12.5
  };

  return (
    <div dir="rtl" className="p-6">
      <h1 className="text-3xl font-bold mb-6">لوحة المعلومات</h1>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(dashboardMetrics.totalRevenue)}
              </p>
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
              <p className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(dashboardMetrics.totalExpenses)}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <CreditCard className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">صافي الأرباح</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(dashboardMetrics.totalProfit)}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">عدد الموظفين</p>
              <p className="text-2xl font-bold text-violet-600">
                {dashboardMetrics.totalEmployees}
              </p>
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
              <p className="text-2xl font-bold text-amber-600">
                {dashboardMetrics.totalOrders}
              </p>
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
              <p className="text-2xl font-bold text-emerald-600">
                {dashboardMetrics.conversionRate}%
              </p>
            </div>
            <div className="p-2 bg-emerald-100 rounded-full">
              <FileText className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueWidget />
        <BrandsRevenueWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MediaSpendingWidget />
        <EmployeePerformanceWidget />
      </div>
    </div>
  );
};

export default Dashboard;
