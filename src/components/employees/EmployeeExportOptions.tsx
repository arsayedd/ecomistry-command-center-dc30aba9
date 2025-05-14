
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

interface EmployeeExportOptionsProps {
  onExport: (type: 'pdf' | 'excel') => void;
}

export const EmployeeExportOptions = ({ onExport }: EmployeeExportOptionsProps) => {
  return (
    <div className="flex justify-end mb-4 gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => onExport('pdf')}
      >
        <FileText className="h-4 w-4" />
        <span>تصدير PDF</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => onExport('excel')}
      >
        <Download className="h-4 w-4" />
        <span>تصدير Excel</span>
      </Button>
    </div>
  );
};
