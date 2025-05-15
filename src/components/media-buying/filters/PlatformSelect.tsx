
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlatformSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlatformSelect({ value, onChange }: PlatformSelectProps) {
  return (
    <div className="w-full md:w-auto">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="المنصة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">كل المنصات</SelectItem>
          <SelectItem value="facebook">فيسبوك</SelectItem>
          <SelectItem value="instagram">إنستجرام</SelectItem>
          <SelectItem value="tiktok">تيك توك</SelectItem>
          <SelectItem value="google">جوجل</SelectItem>
          <SelectItem value="other">أخرى</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
