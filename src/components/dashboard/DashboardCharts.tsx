
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface RevenueTrendItem {
  name: string;
  amount: number;
}

interface BrandRevenueItem {
  name: string;
  amount: number;
}

interface MediaSpendingItem {
  name: string;
  value: number;
}

interface EmployeePerformanceItem {
  name: string;
  orders: number;
}

interface DashboardChartsProps {
  charts: {
    revenueTrend: RevenueTrendItem[];
    brandsRevenue: BrandRevenueItem[];
    mediaSpending: MediaSpendingItem[];
    employeePerformance: EmployeePerformanceItem[];
  };
  isLoading: boolean;
  onRefresh?: () => void;
}

export function DashboardCharts({ charts, isLoading, onRefresh }: DashboardChartsProps) {
  const COLORS = ["#16a34a", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899"];
  const MEDIA_COLORS = {"فيسبوك": "#3b5998", "انستجرام": "#e1306c", "تيك توك": "#000000", "جوجل": "#4285F4", "أخرى": "#f48024"};
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP', 
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatPieChartLabel = ({ name, percent }: { name: string, percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  // Empty state component
  const EmptyState = ({ title, onRefreshClick }: { title: string, onRefreshClick?: () => void }) => (
    <div className="h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground">
      <p className="mb-4 text-center">{title}</p>
      {onRefreshClick && (
        <Button variant="outline" size="sm" onClick={onRefreshClick} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          تحديث البيانات
        </Button>
      )}
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-[90%]" />
              </div>
            ) : charts.revenueTrend.length === 0 ? (
              <EmptyState 
                title="لا توجد بيانات للإيرادات في هذه الفترة" 
                onRefreshClick={onRefresh} 
              />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={charts.revenueTrend}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tickFormatter={(value) => {
                        // Format the date to show only day and month
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                      height={50}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis tickFormatter={(value) => `${value.toLocaleString()} ج.م`} />
                    <Tooltip 
                      formatter={(value) => [`${formatCurrency(value as number)}`, 'الإيرادات']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      name="الإيرادات"
                      stroke="#16a34a"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Brands Revenue */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">إيرادات البراندات</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-[90%]" />
              </div>
            ) : charts.brandsRevenue.length === 0 ? (
              <EmptyState 
                title="لا توجد بيانات لإيرادات البراندات في هذه الفترة" 
                onRefreshClick={onRefresh} 
              />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={charts.brandsRevenue}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${value.toLocaleString()} ج.م`} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip formatter={(value) => [`${formatCurrency(value as number)}`, 'الإيرادات']} />
                    <Legend />
                    <Bar 
                      dataKey="amount" 
                      name="الإيرادات" 
                      fill="#3b82f6" 
                      radius={[0, 4, 4, 0]} 
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Media Spending Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">توزيع الإنفاق الإعلاني</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-[250px] rounded-full" />
              </div>
            ) : charts.mediaSpending.length === 0 ? (
              <EmptyState 
                title="لا توجد بيانات للإنفاق الإعلاني في هذه الفترة" 
                onRefreshClick={onRefresh} 
              />
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.mediaSpending}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={formatPieChartLabel}
                      nameKey="name"
                    >
                      {charts.mediaSpending.map((entry, index) => {
                        const platformColor = (MEDIA_COLORS as any)[entry.name] || COLORS[index % COLORS.length];
                        return <Cell key={`cell-${index}`} fill={platformColor} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'النسبة']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employee Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">أداء موظفي الكول سنتر</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-[90%]" />
              </div>
            ) : charts.employeePerformance.length === 0 ? (
              <EmptyState 
                title="لا توجد بيانات لأداء الموظفين في هذه الفترة" 
                onRefreshClick={onRefresh}
              />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={charts.employeePerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} طلب`, 'عدد الطلبات']} />
                    <Legend />
                    <Bar 
                      dataKey="orders" 
                      name="عدد الطلبات" 
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]} 
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
