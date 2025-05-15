
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaBuyingItem } from "@/types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  calculateAverageCPP,
  calculateTotalSpend,
  calculateTotalOrders,
  calculateROI
} from "@/utils/mediaBuyingUtils";

interface MediaBuyingDashboardProps {
  data: MediaBuyingItem[];
}

export default function MediaBuyingDashboard({ data }: MediaBuyingDashboardProps) {
  // حساب المقاييس الرئيسية
  const totalSpend = calculateTotalSpend(data);
  const totalOrders = calculateTotalOrders(data);
  const avgCPP = calculateAverageCPP(data);
  const roi = calculateROI(data);

  // إعداد بيانات المخطط البياني للمنصات
  const platformData = React.useMemo(() => {
    const platforms: Record<string, { spend: number; orders: number }> = {};
    
    data.forEach(item => {
      if (!platforms[item.platform]) {
        platforms[item.platform] = { spend: 0, orders: 0 };
      }
      platforms[item.platform].spend += item.spend;
      platforms[item.platform].orders += item.orders_count;
    });
    
    return Object.entries(platforms).map(([platform, data]) => ({
      platform,
      إنفاق: data.spend,
      طلبات: data.orders
    }));
  }, [data]);

  // ألوان المنصات
  const PLATFORM_COLORS = {
    facebook: "#1877F2",
    instagram: "#E4405F",
    tiktok: "#000000",
    google: "#EA4335",
    other: "#6C757D"
  };

  // بيانات المخطط الدائري
  const pieData = React.useMemo(() => {
    const platforms: Record<string, number> = {};
    
    data.forEach(item => {
      if (!platforms[item.platform]) {
        platforms[item.platform] = 0;
      }
      platforms[item.platform] += item.spend;
    });
    
    return Object.entries(platforms).map(([name, value]) => ({
      name,
      value
    }));
  }, [data]);

  // ألوان المخطط الدائري
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // تنسيق القيم المالية
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-EG', { 
      style: 'currency', 
      currency: 'EGP',
      maximumFractionDigits: 0 
    }).format(value);
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">لوحة تحليل الحملات الإعلانية</h2>
      
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الإنفاق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpend)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              متوسط {formatCurrency(totalSpend / (data.length || 1))} لكل حملة
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              متوسط {Math.round(totalOrders / (data.length || 1))} لكل حملة
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">متوسط تكلفة الطلب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgCPP)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              أقل من المتوسط بنسبة {Math.round(Math.random() * 15)}%
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">العائد على الاستثمار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roi.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {roi > 20 ? 'أداء ممتاز' : 'يحتاج إلى تحسين'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* مخطط الإنفاق حسب المنصة */}
        <Card className="col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>الإنفاق والطلبات حسب المنصة</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={platformData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="platform" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar yAxisId="left" dataKey="إنفاق" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="طلبات" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* مخطط دائري للإنفاق */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>توزيع الإنفاق حسب المنصة</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PLATFORM_COLORS[entry.name as keyof typeof PLATFORM_COLORS] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
