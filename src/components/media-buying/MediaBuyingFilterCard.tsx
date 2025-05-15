
import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Brand {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  full_name: string;
}

interface MediaBuyingFilters {
  brand_id: string;
  platform: string;
  employee_id: string;
  date_from: string;
  date_to: string;
}

interface MediaBuyingFilterCardProps {
  filters: MediaBuyingFilters;
  brands: Brand[];
  employees: Employee[];
  onFilterChange: (name: string, value: string) => void;
  onDateChange: (name: string, date: Date | undefined) => void;
}

export default function MediaBuyingFilterCard({
  filters,
  brands,
  employees,
  onFilterChange,
  onDateChange,
}: MediaBuyingFilterCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>فلترة البيانات</CardTitle>
        <CardDescription>
          استخدم الفلاتر لتضييق نطاق البيانات المعروضة
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div>
          <Label htmlFor="brand_id">البراند</Label>
          <Select name="brand_id" onValueChange={(value) => onFilterChange("brand_id", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر براند" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">إظهار الكل</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="platform">المنصة</Label>
          <Input
            type="text"
            id="platform"
            name="platform"
            placeholder="اسم المنصة"
            value={filters.platform}
            onChange={(e) => onFilterChange("platform", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="employee_id">الموظف</Label>
          <Select name="employee_id" onValueChange={(value) => onFilterChange("employee_id", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر موظف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">إظهار الكل</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-1">
          <Label>من تاريخ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-right font-normal",
                  !filters.date_from && "text-muted-foreground"
                )}
              >
                {filters.date_from ? (
                  format(new Date(filters.date_from), "yyyy-MM-dd")
                ) : (
                  <span>اختر تاريخ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={filters.date_from ? new Date(filters.date_from) : undefined}
                onSelect={(date) => onDateChange("date_from", date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("2020-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="md:col-span-1">
          <Label>إلى تاريخ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-right font-normal",
                  !filters.date_to && "text-muted-foreground"
                )}
              >
                {filters.date_to ? (
                  format(new Date(filters.date_to), "yyyy-MM-dd")
                ) : (
                  <span>اختر تاريخ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={filters.date_to ? new Date(filters.date_to) : undefined}
                onSelect={(date) => onDateChange("date_to", date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("2020-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
