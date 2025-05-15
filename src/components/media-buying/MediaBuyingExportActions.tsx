
import React from "react";
import { Button } from "@/components/ui/button";
import { MediaBuyingItem } from "@/types";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";

interface MediaBuyingExportActionsProps {
  mediaBuying: MediaBuyingItem[];
}

export default function MediaBuyingExportActions({ mediaBuying }: MediaBuyingExportActionsProps) {
  const handleExportCSV = () => {
    if (!mediaBuying.length) return;
    
    const exportData = mediaBuying.map(item => ({
      'التاريخ': item.date,
      'المنصة': item.platform,
      'البراند': item.brand?.name || '',
      'الموظف': item.employee && typeof item.employee === 'object' && 'full_name' in item.employee ? 
        item.employee.full_name || 'غير معروف' : 'غير معروف',
      'الإنفاق': item.spend,
      'عدد الطلبات': item.orders_count,
      'تكلفة الطلب': item.order_cost,
      'ROAS': item.roas || 0,
      'ملاحظات': item.notes || ''
    }));
    
    exportToCSV(exportData, 'media_buying_report');
  };
  
  const handleExportPDF = () => {
    if (!mediaBuying.length) return;
    
    const exportData = mediaBuying.map(item => ({
      'التاريخ': item.date,
      'المنصة': item.platform,
      'البراند': item.brand?.name || '',
      'الموظف': item.employee && typeof item.employee === 'object' && 'full_name' in item.employee ? 
        item.employee.full_name || 'غير معروف' : 'غير معروف',
      'الإنفاق': item.spend,
      'عدد الطلبات': item.orders_count,
      'تكلفة الطلب': item.order_cost
    }));
    
    exportToPDF('media_buying_report', 'تقرير ميديا بايينج', exportData);
  };

  return (
    <div>
      <Button onClick={handleExportCSV} className="ml-2">تصدير CSV</Button>
      <Button onClick={handleExportPDF}>تصدير PDF</Button>
    </div>
  );
}
