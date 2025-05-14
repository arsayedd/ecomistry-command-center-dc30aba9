
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
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
  Cell,
} from "recharts";

interface StatisticsWidgetProps {
  title: string;
  type: "line" | "bar" | "pie";
  data: any[];
  dataKey: string;
  colors?: string[];
}

const defaultColors = ["#16a34a", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899"];

export function StatisticsWidget({ title, type, data, dataKey, colors = defaultColors }: StatisticsWidgetProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === "line" ? (
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={colors[0]}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : type === "bar" ? (
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={dataKey} fill={colors[0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey={dataKey}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function RevenueWidget() {
  // Sample data
  const revenueData = [
    { name: "يناير", amount: 25000 },
    { name: "فبراير", amount: 35000 },
    { name: "مارس", amount: 28000 },
    { name: "أبريل", amount: 42000 },
    { name: "مايو", amount: 38000 },
  ];

  return <StatisticsWidget title="الإيرادات الشهرية" type="line" data={revenueData} dataKey="amount" />;
}

export function BrandsRevenueWidget() {
  // Sample data
  const brandsData = [
    { name: "براند أزياء", amount: 42000 },
    { name: "براند تجميل", amount: 28500 },
    { name: "براند أغذية", amount: 18700 },
    { name: "براند أجهزة", amount: 32400 },
  ];

  return <StatisticsWidget title="إيرادات البراندات" type="bar" data={brandsData} dataKey="amount" />;
}

export function MediaSpendingWidget() {
  // Sample data
  const mediaData = [
    { name: "فيسبوك", value: 35 },
    { name: "انستجرام", value: 25 },
    { name: "تيك توك", value: 20 },
    { name: "جوجل", value: 15 },
    { name: "أخرى", value: 5 },
  ];

  return (
    <StatisticsWidget 
      title="توزيع الإنفاق الإعلاني" 
      type="pie" 
      data={mediaData} 
      dataKey="value"
      colors={["#3b5998", "#e1306c", "#000000", "#4285F4", "#f48024"]} 
    />
  );
}

export function EmployeePerformanceWidget() {
  // Sample data
  const employeeData = [
    { name: "أحمد", orders: 58 },
    { name: "سارة", orders: 47 },
    { name: "محمد", orders: 65 },
    { name: "نور", orders: 52 },
    { name: "خالد", orders: 40 },
  ];

  return <StatisticsWidget title="أداء موظفي الكول سنتر" type="bar" data={employeeData} dataKey="orders" colors={["#8b5cf6"]} />;
}
