
import React from "react";
import { format } from "date-fns";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CommissionFormValues } from "@/hooks/useCommissionForm";

interface CommissionDateFieldProps {
  form: UseFormReturn<CommissionFormValues>;
}

export const CommissionDateField = ({ form }: CommissionDateFieldProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Due Date */}
      <FormField
        control={form.control}
        name="due_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>تاريخ الاستحقاق</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>اختر التاريخ</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
