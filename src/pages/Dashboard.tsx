
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatsCard from "@/components/ui/StatsCard";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardMetricsChart from "@/components/dashboard/DashboardMetricsChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for the top brands performance
const topBrands = [
  { name: "Brand A", orders: 254, revenue: 38500, growth: 12.5 },
  { name: "Brand B", orders: 186, revenue: 24200, growth: 8.3 },
  { name: "Brand C", orders: 142, revenue: 18600, growth: -2.8 },
  { name: "Brand D", orders: 97, revenue: 12400, growth: 15.2 },
];

// Sample data for employee performance
const topEmployees = [
  { name: "Ahmed Hassan", role: "Media Buyer", performance: 98, department: "Media" },
  { name: "Sara Ahmed", role: "Call Center Agent", performance: 95, department: "Call Center" },
  { name: "Mohamed Ali", role: "Designer", performance: 92, department: "Design" },
  { name: "Amina Khaled", role: "Content Writer", performance: 90, department: "Content" },
];

// Sample recent alerts
const recentAlerts = [
  {
    id: 1,
    message: "Ad Set 'Summer Collection FB' is underperforming",
    time: "2 hours ago",
    type: "warning",
  },
  {
    id: 2,
    message: "Budget for 'Winter Campaign' is 80% spent",
    time: "5 hours ago",
    type: "info",
  },
  {
    id: 3,
    message: "Call Center performance dropped by 5%",
    time: "1 day ago",
    type: "danger",
  },
  {
    id: 4,
    message: "New design assets uploaded",
    time: "2 days ago",
    type: "success",
  },
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ecomistry-text">Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Last updated:</span>
            <span className="text-sm font-medium">Today at 12:30 PM</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value="$124,563"
            icon={<DollarSign size={24} />}
            change={12.5}
          />
          <StatsCard
            title="Total Orders"
            value="2,543"
            icon={<ShoppingCart size={24} />}
            change={8.2}
          />
          <StatsCard
            title="Active Employees"
            value="48"
            icon={<Users size={24} />}
            change={4.1}
          />
          <StatsCard
            title="Conversion Rate"
            value="3.2%"
            icon={<TrendingUp size={24} />}
            change={-1.8}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardMetricsChart 
            title="Financial Overview"
            className="col-span-1 lg:col-span-2"
          />
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className={`mt-0.5 p-1.5 rounded-full 
                      ${
                        alert.type === "warning" ? "bg-ecomistry-warning/20 text-ecomistry-warning" :
                        alert.type === "danger" ? "bg-ecomistry-error/20 text-ecomistry-error" :
                        alert.type === "success" ? "bg-ecomistry-primary/20 text-ecomistry-primary" :
                        "bg-blue-100 text-blue-600"
                      }
                    `}>
                      <AlertCircle size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="brands" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="brands">Top Brands</TabsTrigger>
            <TabsTrigger value="employees">Top Employees</TabsTrigger>
          </TabsList>
          <TabsContent value="brands" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Brand</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500">Orders</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500">Revenue</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {topBrands.map((brand) => (
                        <tr key={brand.name} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-md bg-ecomistry-primary/10 flex items-center justify-center">
                                <Package size={16} className="text-ecomistry-primary" />
                              </div>
                              <span className="ml-2 font-medium">{brand.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">{brand.orders}</td>
                          <td className="px-4 py-3 text-right">${brand.revenue.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              brand.growth >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            }`}>
                              {brand.growth >= 0 ? "+" : ""}{brand.growth}%
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="employees" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Employee</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Department</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {topEmployees.map((employee) => (
                        <tr key={employee.name} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-ecomistry-secondary/20 flex items-center justify-center">
                                <Users size={16} className="text-ecomistry-primary" />
                              </div>
                              <span className="ml-2 font-medium">{employee.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{employee.role}</td>
                          <td className="px-4 py-3">{employee.department}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end">
                              <div className="w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
                                <div 
                                  className="h-full bg-ecomistry-primary" 
                                  style={{ width: `${employee.performance}%` }} 
                                />
                              </div>
                              <span className="ml-2 font-medium">{employee.performance}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
