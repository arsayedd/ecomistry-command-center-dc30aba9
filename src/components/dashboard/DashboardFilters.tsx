import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, RefreshCcw } from "lucide-react";
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

interface DashboardFiltersProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function DashboardFilters({
  dateRange,
  onDateRangeChange
}: DashboardFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();

  const handlePresetClick = (preset: string) => {
    switch(preset) {
      case "today":
        onDateRangeChange({ from: today, to: today });
        break;
      case "yesterday": {
        const yesterday = addDays(today, -1);
        onDateRangeChange({ from: yesterday, to: yesterday });
        break;
      }
      case "last7days": {
        const sevenDaysAgo = addDays(today, -6);
        onDateRangeChange({ from: sevenDaysAgo, to: today });
        break;
      }
      case "last30days": {
        const thirtyDaysAgo = addDays(today, -29);
        onDateRangeChange({ from: thirtyDaysAgo, to: today });
        break;
      }
      case "thisMonth": {
        const firstDayOfMonth = startOfMonth(today);
        onDateRangeChange({ from: firstDayOfMonth, to: today });
        break;
      }
      case "lastMonth": {
        const lastMonth = addDays(startOfMonth(today), -1);
        const firstDayLastMonth = startOfMonth(lastMonth);
        onDateRangeChange({ from: firstDayLastMonth, to: lastMonth });
        break;
      }
      case "thisWeek": {
        const startWeek = startOfWeek(today, { weekStartsOn: 0 });
        onDateRangeChange({ from: startWeek, to: today });
        break;
      }
      case "refresh": {
        // Keep the current date range but trigger a refresh
        onDateRangeChange({ ...dateRange });
        break;
      }
    }
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">لوحة المعلومات</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => handlePresetClick("refresh")}
            title="تحديث البيانات"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-nowrap space-x-1 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => handlePresetClick("today")}
            >
              اليوم
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => handlePresetClick("yesterday")}
            >
              أمس
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => handlePresetClick("last7days")}
            >
              آخر ٧ أيام
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => handlePresetClick("last30days")}
            >
              آخر ٣٠ يوم
            </Button>
          </div>
          
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            align="end"
          />
        </div>
      </div>
    </Card>
  );
}
