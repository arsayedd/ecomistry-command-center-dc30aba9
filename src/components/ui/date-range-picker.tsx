import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { ar } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateRangePickerProps {
  className?: string
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  align?: "start" | "center" | "end"
}

export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
  align = "start",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Preset date ranges
  const handleRangeSelection = (value: string) => {
    const today = new Date()
    const from = new Date(today)

    switch (value) {
      case "today":
        onDateRangeChange({ from: today, to: today })
        break
      case "yesterday": {
        const yesterday = addDays(today, -1)
        onDateRangeChange({ from: yesterday, to: yesterday })
        break
      }
      case "last7days":
        from.setDate(from.getDate() - 6)
        onDateRangeChange({ from, to: today })
        break
      case "last30days":
        from.setDate(from.getDate() - 29)
        onDateRangeChange({ from, to: today })
        break
      case "thisMonth": {
        const first = new Date(today.getFullYear(), today.getMonth(), 1)
        onDateRangeChange({ from: first, to: today })
        break
      }
      case "lastMonth": {
        const first = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const last = new Date(today.getFullYear(), today.getMonth(), 0)
        onDateRangeChange({ from: first, to: last })
        break
      }
      case "custom":
        // Keep the current selection if in custom mode
        break
      default:
        onDateRangeChange(undefined)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size={"sm"}
            className={cn(
              "w-auto justify-start text-right font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="ml-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy", { locale: ar })} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy", { locale: ar })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy", { locale: ar })
              )
            ) : (
              <span>اختر الفترة</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="p-3 border-b">
            <Select
              onValueChange={handleRangeSelection}
              defaultValue="custom"
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر فترة محددة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">اليوم</SelectItem>
                <SelectItem value="yesterday">أمس</SelectItem>
                <SelectItem value="last7days">آخر 7 أيام</SelectItem>
                <SelectItem value="last30days">آخر 30 يوم</SelectItem>
                <SelectItem value="thisMonth">هذا الشهر</SelectItem>
                <SelectItem value="lastMonth">الشهر الماضي</SelectItem>
                <SelectItem value="custom">فترة مخصصة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
