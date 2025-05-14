
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaBuyingRecord } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState, useEffect, useMemo } from "react";

interface MediaBuyingAnalyticsProps {
  data: MediaBuyingRecord[];
}

// Define chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function MediaBuyingAnalytics({ data }: MediaBuyingAnalyticsProps) {
  const [currentChart, setCurrentChart] = useState("platform");

  // Process data for platform comparison chart
  const platformData = useMemo(() => {
    const platforms = data.reduce<Record<string, { spend: number; orders: number }>>((acc, item) => {
      if (!acc[item.platform]) {
        acc[item.platform] = { spend: 0, orders: 0 };
      }
      acc[item.platform].spend += item.spend;
      acc[item.platform].orders += item.orders_count;
      return acc;
    }, {});

    return Object.entries(platforms).map(([platform, values]) => ({
      name: getPlatformName(platform),
      spend: values.spend,
      orders: values.orders,
      cpp: values.orders > 0 ? values.spend / values.orders : 0,
    }));
  }, [data]);

  // Process data for daily trend chart
  const trendData = useMemo(() => {
    const dateMap = data.reduce<Record<string, { spend: number; orders: number }>>((acc, item) => {
      const date = new Date(item.date).toLocaleDateString("ar-EG");
      if (!acc[date]) {
        acc[date] = { spend: 0, orders: 0 };
      }
      acc[date].spend += item.spend;
      acc[date].orders += item.orders_count;
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.entries(dateMap)
      .map(([date, values]) => ({
        date,
        spend: values.spend,
        orders: values.orders,
        cpp: values.orders > 0 ? values.spend / values.orders : 0,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("/"));
        const dateB = new Date(b.date.split("/").reverse().join("/"));
        return dateA.getTime() - dateB.getTime();
      });
  }, [data]);

  // Helper function to get platform names in Arabic
  function getPlatformName(platform: string): string {
    const platformNames: Record<string, string> = {
      facebook: "فيسبوك",
      instagram: "إنستجرام",
      tiktok: "تيك توك",
      google: "جوجل",
      other: "أخرى",
    };
    return platformNames[platform] || platform;
  }

  return (
    <Card className="p-4">
      <Tabs
        defaultValue="platform"
        value={currentChart}
        onValueChange={setCurrentChart}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platform">مقارنة المنصات</TabsTrigger>
          <TabsTrigger value="trend">تحليل الاتجاه</TabsTrigger>
          <TabsTrigger value="distribution">توزيع الإنفاق</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="mt-4">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={platformData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="spend"
                  name="الإنفاق"
                  fill="#8884d8"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  name="عدد الطلبات"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="trend" className="mt-4">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="spend"
                  name="الإنفاق"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="عدد الطلبات"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="spend"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {platformData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("ar-EG", {
                      style: "currency",
                      currency: "EGP",
                    }).format(Number(value))
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
