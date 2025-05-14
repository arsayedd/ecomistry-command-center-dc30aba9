
import React from "react";
import { format } from "date-fns";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { MediaBuyingFormValues } from "@/hooks/useMediaBuyingForm";
import { Brand, User } from "@/types";

interface MediaBuyingBasicFieldsProps {
  form: UseFormReturn<MediaBuyingFormValues>;
  brands: Brand[];
  employees: User[];
}

export const MediaBuyingBasicFields = ({ form, brands, employees }: MediaBuyingBasicFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Platform Selection */}
      <FormField
        control={form.control}
        name="platform"
        render={({ field }) => (
          <FormItem>
            <FormLabel>المنصة</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنصة" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="facebook">فيسبوك</SelectItem>
                <SelectItem value="instagram">إنستجرام</SelectItem>
                <SelectItem value="tiktok">تيك توك</SelectItem>
                <SelectItem value="google">جوجل</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Campaign Date */}
      <FormField
        control={form.control}
        name="campaign_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>تاريخ الحملة</FormLabel>
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

      {/* Brand Selection */}
      <FormField
        control={form.control}
        name="brand_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>البراند</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر البراند" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Employee Selection */}
      <FormField
        control={form.control}
        name="employee_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الموظف المسؤول</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الموظف" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
