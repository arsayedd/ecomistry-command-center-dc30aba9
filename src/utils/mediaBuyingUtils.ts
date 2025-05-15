
import { saveAs } from "file-saver";
import { utils, write } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { MediaBuyingItem } from "@/types";

// تصدير بيانات الميديا باينج إلى ملف CSV
export const mediaBuyingToCSV = (data: MediaBuyingItem[]) => {
  // تحويل البيانات إلى سطور CSV
  const header = "البراند,المنصة,الموظف,التاريخ,الإنفاق,عدد الطلبات,تكلفة الطلب,العائد\n";
  const rows = data.map((item) => {
    return [
      item.brand?.name || "غير محدد",
      item.platform,
      item.employee?.full_name || "غير محدد",
      item.date,
      item.spend,
      item.orders_count,
      item.order_cost || 0,
      item.roas || "غير محدد",
    ].join(",");
  });
  
  return header + rows.join("\n");
};

// تصدير بيانات الميديا باينج إلى ملف PDF
export const mediaBuyingToPDF = (data: MediaBuyingItem[]) => {
  const doc = new jsPDF();
  
  // إضافة عنوان للتقرير
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("تقرير الحملات الإعلانية", doc.internal.pageSize.width / 2, 20, { align: "center" });
  
  // تحضير البيانات للجدول
  const tableData = data.map((item) => [
    item.brand?.name || "غير محدد",
    item.platform,
    item.employee?.full_name || "غير محدد",
    item.date,
    `${item.spend} جنيه`,
    item.orders_count,
    `${item.order_cost || 0} جنيه`,
    item.roas ? `${item.roas}x` : "غير محدد",
  ]);
  
  // إنشاء الجدول
  autoTable(doc, {
    head: [["البراند", "المنصة", "الموظف", "التاريخ", "الإنفاق", "عدد الطلبات", "تكلفة الطلب", "العائد"]],
    body: tableData,
    headStyles: {
      fillColor: [67, 176, 42], // لون أخضر للرأس
      textColor: 255,
      halign: "center",
    },
    bodyStyles: {
      halign: "center",
    },
    startY: 30,
  });
  
  return doc;
};

// التصدير إلى CSV
export const exportToCSV = (data: MediaBuyingItem[]) => {
  const csvContent = mediaBuyingToCSV(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "media-buying-report.csv");
};

// حساب متوسط تكلفة الطلب
export const calculateAverageCPP = (data: MediaBuyingItem[]): number => {
  if (data.length === 0) return 0;
  
  let totalSpend = 0;
  let totalOrders = 0;
  
  data.forEach(item => {
    totalSpend += item.spend;
    totalOrders += item.orders_count;
  });
  
  return totalOrders > 0 ? totalSpend / totalOrders : 0;
};

// حساب إجمالي الإنفاق
export const calculateTotalSpend = (data: MediaBuyingItem[]): number => {
  return data.reduce((sum, item) => sum + item.spend, 0);
};

// حساب إجمالي عدد الطلبات
export const calculateTotalOrders = (data: MediaBuyingItem[]): number => {
  return data.reduce((sum, item) => sum + item.orders_count, 0);
};

// حساب ROI
export const calculateROI = (data: MediaBuyingItem[]): number => {
  const totalSpend = calculateTotalSpend(data);
  // افتراضي: قيمة متوسطة للطلب = 300 جنيه
  const averageOrderValue = 300;
  const totalRevenue = calculateTotalOrders(data) * averageOrderValue;
  
  return totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;
};
