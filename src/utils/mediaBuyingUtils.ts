
import { MediaBuying, MediaBuyingItem } from "@/types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

// Helper for CSV export
export const mediaBuyingToCSV = (data: MediaBuyingItem[]) => {
  if (!data || data.length === 0) return "";
  
  // Define headers
  const headers = [
    "البراند",
    "المنصة",
    "الموظف",
    "التاريخ",
    "الإنفاق",
    "عدد الطلبات",
    "تكلفة الطلب",
    "العائد"
  ].join(",");
  
  // Create rows
  const rows = data.map((item) => {
    return [
      item.brand?.name || "غير محدد",
      item.platform,
      item.employee?.full_name || "غير محدد",
      item.date,
      item.spend,
      item.orders_count,
      item.order_cost,
      item.roas || "غير محدد"
    ].join(",");
  });
  
  // Join headers and rows
  return [headers, ...rows].join("\n");
};

// Helper for PDF export
export const mediaBuyingToPDF = (data: MediaBuyingItem[]) => {
  const doc = new jsPDF("p", "mm", "a4", true);
  
  // Set RTL mode
  (doc as any).setR2L(true);
  
  // Add title
  doc.setFontSize(18);
  doc.text("تقرير الميديا بايينج", 100, 20, { align: "center" });
  
  // Add subtitle with date
  doc.setFontSize(12);
  const today = format(new Date(), "yyyy-MM-dd");
  doc.text(`تاريخ التقرير: ${today}`, 100, 30, { align: "center" });
  
  // Create table data
  const tableColumn = [
    "العائد",
    "تكلفة الطلب",
    "عدد الطلبات",
    "الإنفاق",
    "التاريخ",
    "الموظف",
    "المنصة",
    "البراند",
  ];
  
  const tableRows = data.map((item) => [
    item.roas || "غير محدد",
    item.order_cost,
    item.orders_count,
    item.spend,
    item.date,
    item.employee?.full_name || "غير محدد",
    item.platform,
    item.brand?.name || "غير محدد",
  ]);
  
  // Generate table
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: {
      font: "courier",
      fontSize: 10,
      overflow: "linebreak",
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });
  
  return doc;
};

// Calculate metrics for media buying data
export const calculateMediaBuyingMetrics = (data: MediaBuyingItem[]) => {
  if (!data || data.length === 0) {
    return {
      totalSpend: 0,
      totalOrders: 0,
      averageCPP: 0,
      averageROAS: 0,
    };
  }
  
  const totalSpend = data.reduce((sum, item) => sum + item.spend, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders_count, 0);
  
  // Calculate average CPP
  const averageCPP = totalOrders > 0 ? totalSpend / totalOrders : 0;
  
  // Calculate average ROAS (only for items with ROAS value)
  const itemsWithRoas = data.filter((item) => item.roas !== undefined);
  const averageROAS = itemsWithRoas.length > 0
    ? itemsWithRoas.reduce((sum, item) => sum + (item.roas || 0), 0) / itemsWithRoas.length
    : 0;
  
  return {
    totalSpend,
    totalOrders,
    averageCPP,
    averageROAS,
  };
};
