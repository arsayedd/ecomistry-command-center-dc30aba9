
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label?: string;
}

export function DatePicker({ date, onChange, label = "اختر التاريخ" }: DatePickerProps) {
  return (
    <div className="w-full md:w-auto">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-right">
            {date ? (
              format(date, "PPP")
            ) : (
              <span>{label}</span>
            )}
            <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onChange}
            initialFocus
            className="rounded-md border"
          />
          <div className="p-3 border-t">
            <Button variant="ghost" className="w-full" onClick={() => onChange(undefined)}>
              إلغاء التاريخ
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
