
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Brand, User } from "@/types";
import { ContentMediaBuyingFormValues } from "./ContentMediaBuyingForm";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ContentMediaBuyingBasicFieldsProps {
  form: UseFormReturn<ContentMediaBuyingFormValues>;
  brands: Brand[];
  employees: User[];
}

export function ContentMediaBuyingBasicFields({ form, brands, employees }: ContentMediaBuyingBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Platform */}
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
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="اختر المنصة" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-card border-border">
                <SelectItem value="facebook">فيسبوك</SelectItem>
                <SelectItem value="instagram">انستجرام</SelectItem>
                <SelectItem value="tiktok">تيكتوك</SelectItem>
                <SelectItem value="snapchat">سناب شات</SelectItem>
                <SelectItem value="google">جوجل</SelectItem>
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
                    className={cn(
                      "w-full pl-3 text-right font-normal bg-background border-border",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: ar })
                    ) : (
                      <span>اختر التاريخ</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  locale={ar}
                  className="bg-card text-foreground"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Task Type */}
      <FormField
        control={form.control}
        name="task_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>نوع المهمة</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="اختر نوع المهمة" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-card border-border">
                <SelectItem value="post">بوست</SelectItem>
                <SelectItem value="reel">رييل</SelectItem>
                <SelectItem value="ad">إعلان</SelectItem>
                <SelectItem value="landingPage">صفحة هبوط</SelectItem>
                <SelectItem value="product">منتج</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Expected Delivery Date */}
      <FormField
        control={form.control}
        name="expected_delivery_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>تاريخ التسليم المتوقع</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-right font-normal bg-background border-border",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: ar })
                    ) : (
                      <span>اختر التاريخ</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  locale={ar}
                  className="bg-card text-foreground"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Brand */}
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
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="اختر البراند" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-card border-border">
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

      {/* Employee */}
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
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="اختر الموظف" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-card border-border">
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
}
