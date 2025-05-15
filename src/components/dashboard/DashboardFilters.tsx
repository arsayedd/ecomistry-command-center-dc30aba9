
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Card } from "@/components/ui/card";

interface DashboardFiltersProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function DashboardFilters({
  dateRange,
  onDateRangeChange
}: DashboardFiltersProps) {
  return (
    <Card className="p-4 mb-6 flex justify-between items-center">
      <h2 className="text-lg font-semibold">لوحة المعلومات</h2>
      <div className="flex items-center gap-4">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
    </Card>
  );
}
