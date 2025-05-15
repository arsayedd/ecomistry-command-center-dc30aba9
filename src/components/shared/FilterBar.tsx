
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onExport?: () => void;
  children?: React.ReactNode;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "بحث...",
  onExport,
  children,
}: FilterBarProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div className="w-full md:w-64 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background border-border"
          />
        </div>
        
        <div className="flex items-center flex-wrap gap-2">
          {children}
        </div>
        
        <div className="flex items-center justify-end ml-auto">
          {onExport && (
            <Button variant="outline" size="sm" className="border-border bg-background" onClick={onExport}>
              <Download className="w-4 h-4 ml-2" />
              تصدير CSV
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
