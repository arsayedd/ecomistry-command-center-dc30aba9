
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";

interface CommissionsListProps {
  commissions: any[];
}

export function CommissionsList({ commissions }: CommissionsListProps) {
  // Map commission type to Arabic
  const getCommissionTypeDisplay = (type: string) => {
    switch (type) {
      case "confirmation":
        return "تأكيد";
      case "delivery":
        return "تسليم";
      default:
        return type;
    }
  };

  // Map value type to Arabic
  const getValueTypeDisplay = (type: string) => {
    switch (type) {
      case "percentage":
        return "نسبة";
      case "fixed":
        return "مبلغ ثابت";
      default:
        return type;
    }
  };

  // Format value display
  const getValueDisplay = (valueType: string, value: number) => {
    return valueType === "percentage" ? `${value}%` : `${value} ج.م`;
  };

  const columns = [
    { 
      key: 'id', 
      header: '#', 
      cell: (commission: any) => commission.id
    },
    { 
      key: 'employeeName', 
      header: 'اسم الموظف', 
      cell: (commission: any) => commission.employeeName
    },
    { 
      key: 'commissionType', 
      header: 'نوع العمولة', 
      cell: (commission: any) => getCommissionTypeDisplay(commission.commissionType)
    },
    { 
      key: 'valueType', 
      header: 'نوع القيمة', 
      cell: (commission: any) => getValueTypeDisplay(commission.valueType)
    },
    { 
      key: 'value', 
      header: 'القيمة', 
      cell: (commission: any) => getValueDisplay(commission.valueType, commission.value)
    },
    { 
      key: 'ordersCount', 
      header: 'عدد الطلبات', 
      cell: (commission: any) => commission.ordersCount
    },
    { 
      key: 'totalCommission', 
      header: 'إجمالي العمولة', 
      cell: (commission: any) => `${commission.totalCommission} ج.م`
    },
    { 
      key: 'dueDate', 
      header: 'تاريخ الاستحقاق', 
      cell: (commission: any) => new Date(commission.dueDate).toLocaleDateString('ar-EG')
    },
    { 
      key: 'actions', 
      header: 'إجراءات', 
      cell: (commission: any) => (
        <Button variant="ghost" size="icon">
          <FileEdit className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns}
      data={commissions}
      emptyMessage="لا توجد عمولات مطابقة للبحث"
      colSpan={9}
    />
  );
}
