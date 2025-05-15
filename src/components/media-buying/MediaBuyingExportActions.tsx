
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { MediaBuyingItem } from "@/types";
import { utils, write } from "xlsx";
import { mediaBuyingToCSV } from "@/utils/mediaBuyingUtils";

interface MediaBuyingExportActionsProps {
  mediaBuying: MediaBuyingItem[];
}

export default function MediaBuyingExportActions({ mediaBuying }: MediaBuyingExportActionsProps) {
  const handleExportExcel = () => {
    const worksheet = utils.json_to_sheet(
      mediaBuying.map((item) => ({
        "البراند": item.brand?.name || "غير محدد",
        "المنصة": item.platform,
        "الموظف": item.employee?.full_name || "غير محدد",
        "التاريخ": item.date,
        "الإنفاق": item.spend,
        "عدد الطلبات": item.orders_count,
        "تكلفة الطلب": item.order_cost,
        "العائد": item.roas || "غير محدد",
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Media Buying");
    
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    
    // Create temporary download link
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "media-buying-report.xlsx");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csvContent = mediaBuyingToCSV(mediaBuying);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create temporary download link
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "media-buying-report.csv");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 ml-2" />
          تصدير
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportExcel}>
          تصدير Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          تصدير CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
