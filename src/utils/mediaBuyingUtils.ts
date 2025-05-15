
import { MediaBuyingItem } from "@/types";

interface MediaBuyingMetrics {
  totalSpend: number;
  totalOrders: number;
  averageCPP: number;
  averageROAS: number;
}

export const calculateMediaBuyingMetrics = (data: MediaBuyingItem[]): MediaBuyingMetrics => {
  // Calculate total spend and orders
  const totalSpend = data.reduce((sum, item) => sum + (item.spend || 0), 0);
  const totalOrders = data.reduce((sum, item) => sum + (item.orders_count || 0), 0);
  
  // Calculate averages
  const averageCPP = totalOrders > 0 ? totalSpend / totalOrders : 0;
  
  // Calculate average ROAS (Return on Ad Spend)
  // Assuming an average order value of 300 for example purposes
  const averageOrderValue = 300;
  const totalRevenue = totalOrders * averageOrderValue;
  const averageROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  
  return {
    totalSpend,
    totalOrders,
    averageCPP,
    averageROAS
  };
};

// Export data to CSV format
export const exportToCSV = (data: MediaBuyingItem[]) => {
  // Headers for the CSV file
  const headers = [
    "المنصة",
    "البراند",
    "الموظف",
    "التاريخ",
    "الإنفاق",
    "عدد الطلبات",
    "تكلفة الطلب الواحد",
    "العائد على الإنفاق"
  ];

  // Map data to rows
  const rows = data.map(item => [
    item.platform,
    item.brand?.name || "",
    item.employee?.full_name || "",
    item.date,
    item.spend.toString(),
    item.orders_count.toString(),
    item.order_cost?.toString() || "0",
    item.roas?.toString() || "0"
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create a link to download the CSV
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `media_buying_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
