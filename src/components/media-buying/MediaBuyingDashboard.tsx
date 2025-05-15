
import React, { useMemo } from "react";
import { MediaBuyingItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface MediaBuyingDashboardProps {
  data: MediaBuyingItem[];
}

export default function MediaBuyingDashboard({ data }: MediaBuyingDashboardProps) {
  // Calculate total stats
  const stats = useMemo(() => {
    const totalSpend = data.reduce((sum, item) => sum + (item.spend || 0), 0);
    const totalOrders = data.reduce((sum, item) => sum + (item.orders_count || 0), 0);
    const avgCPP = totalOrders > 0 ? totalSpend / totalOrders : 0;
    
    // Group by platform
    const platformData: Record<string, { spend: number, orders: number }> = {};
    data.forEach(item => {
      if (!platformData[item.platform]) {
        platformData[item.platform] = { spend: 0, orders: 0 };
      }
      platformData[item.platform].spend += item.spend || 0;
      platformData[item.platform].orders += item.orders_count || 0;
    });
    
    const platformChartData = Object.entries(platformData).map(([platform, stats]) => ({
      platform,
      spend: stats.spend,
      orders: stats.orders,
      cpp: stats.orders > 0 ? stats.spend / stats.orders : 0
    }));
    
    return {
      totalSpend,
      totalOrders,
      avgCPP,
      platformChartData
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Spend */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">إجمالي الإنفاق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalSpend.toFixed(2)} $</div>
          <p className="text-sm text-muted-foreground">إجمالي مبالغ الإنفاق على الإعلانات</p>
        </CardContent>
      </Card>
      
      {/* Total Orders */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">عدد الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalOrders}</div>
          <p className="text-sm text-muted-foreground">إجمالي عدد الطلبات المستلمة</p>
        </CardContent>
      </Card>
      
      {/* Average CPP */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">متوسط تكلفة الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.avgCPP.toFixed(2)} $</div>
          <p className="text-sm text-muted-foreground">متوسط تكلفة الحصول على طلب واحد</p>
        </CardContent>
      </Card>
      
      {/* Platform Performance */}
      {stats.platformChartData.length > 0 && (
        <Card className="col-span-1 md:col-span-3 shadow-sm border-border">
          <CardHeader>
            <CardTitle>أداء المنصات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.platformChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="platform" className="text-foreground" />
                  <YAxis className="text-foreground" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Bar dataKey="orders" name="عدد الطلبات" fill="var(--primary)" />
                  <Bar dataKey="spend" name="الإنفاق ($)" fill="var(--secondary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
