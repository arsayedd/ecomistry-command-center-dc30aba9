
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";

interface RevenuesListProps {
  revenues: any[];
  loading: boolean;
  getBrandName: (brandId: string) => string;
}

export function RevenuesList({ revenues, loading, getBrandName }: RevenuesListProps) {
  const columns = [
    { 
      key: 'date', 
      header: 'التاريخ', 
      cell: (revenue: any) => new Date(revenue.date).toLocaleDateString('ar-EG')
    },
    { 
      key: 'brand', 
      header: 'البراند', 
      cell: (revenue: any) => getBrandName(revenue.brand_id)
    },
    { 
      key: 'units_sold', 
      header: 'عدد القطع', 
      cell: (revenue: any) => revenue.units_sold
    },
    { 
      key: 'price_per_unit', 
      header: 'سعر القطعة', 
      cell: (revenue: any) => `${revenue.price_per_unit.toLocaleString()} ج.م`
    },
    { 
      key: 'total_amount', 
      header: 'الإجمالي', 
      cell: (revenue: any) => (
        <span className="font-semibold text-green-600">{revenue.total_amount.toLocaleString()} ج.م</span>
      )
    },
    { 
      key: 'notes', 
      header: 'ملاحظات', 
      cell: (revenue: any) => revenue.notes || "-"
    },
    { 
      key: 'actions', 
      header: 'الإجراءات', 
      cell: (revenue: any) => (
        <Button variant="ghost" size="icon">
          <FileEdit className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns}
      data={revenues}
      isLoading={loading}
      emptyMessage="لا توجد إيرادات مطابقة للبحث"
      colSpan={7}
    />
  );
}
