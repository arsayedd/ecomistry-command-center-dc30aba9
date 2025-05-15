
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportActionsProps {
  onExportCSV?: () => void;
}

export function ExportActions({ onExportCSV }: ExportActionsProps) {
  if (!onExportCSV) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Download className="h-4 w-4 ml-2" />
          تصدير
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onExportCSV && (
          <DropdownMenuItem onClick={onExportCSV}>
            تصدير CSV
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
