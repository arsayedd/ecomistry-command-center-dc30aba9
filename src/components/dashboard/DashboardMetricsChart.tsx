
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data
const revenueData = [
  { name: "يناير", revenue: 4000, expenses: 2400, profit: 1600 },
  { name: "فبراير", revenue: 3000, expenses: 1398, profit: 1602 },
  { name: "مارس", revenue: 9800, expenses: 3908, profit: 5892 },
  { name: "أبريل", revenue: 3780, expenses: 2908, profit: 872 },
  { name: "مايو", revenue: 5890, expenses: 4800, profit: 1090 },
  { name: "يونيو", revenue: 8390, expenses: 3800, profit: 4590 },
  { name: "يوليو", revenue: 4490, expenses: 3300, profit: 1190 },
];

const platformData = [
  { name: "فيسبوك", spend: 4000, orders: 240, cpp: 16.7 },
  { name: "انستجرام", spend: 3000, orders: 200, cpp: 15 },
  { name: "تيك توك", spend: 2000, orders: 120, cpp: 16.7 },
  { name: "جوجل", spend: 1000, orders: 80, cpp: 12.5 },
];

interface DashboardMetricsChartProps {
  title: string;
  className?: string;
}

export default function DashboardMetricsChart({
  title,
  className,
}: DashboardMetricsChartProps) {
  const [range, setRange] = React.useState("7d");
  const isPlatformChart = title.includes("إعلانات") || title.includes("منصات");
  
  return (
    <Card className={className} dir="rtl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Select defaultValue={range} onValueChange={setRange}>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="اختر المدة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">آخر ٧ أيام</SelectItem>
            <SelectItem value="30d">آخر ٣٠ يوم</SelectItem>
            <SelectItem value="90d">آخر ٩٠ يوم</SelectItem>
            <SelectItem value="year">هذا العام</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {isPlatformChart ? (
            <BarChart
              data={platformData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="spend"
                name="الإنفاق"
                fill="#43B02A"
              />
              <Bar
                dataKey="orders"
                name="الطلبات"
                fill="#FFB547"
              />
              <Bar
                dataKey="cpp"
                name="متوسط التكلفة"
                fill="#7AC943"
              />
            </BarChart>
          ) : (
            <LineChart
              data={revenueData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="الإيرادات"
                stroke="#43B02A"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="المصروفات"
                stroke="#E53935"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="الأرباح"
                stroke="#7AC943"
                strokeWidth={2}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
