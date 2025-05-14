
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";

interface ExpensesListProps {
  expenses: any[];
  loading: boolean;
  getBrandName: (brandId: string) => string;
}

export function ExpensesList({ expenses, loading, getBrandName }: ExpensesListProps) {
  const getCategoryDisplay = (category: string) => {
    switch(category) {
      case "ads":
        return "إعلانات";
      case "salaries":
        return "رواتب";
      case "rent":
        return "إيجار";
      case "supplies":
        return "مستلزمات";
      case "other":
        return "أخرى";
      default:
        return category;
    }
  };

  const columns = [
    { 
      key: 'date', 
      header: 'التاريخ', 
      cell: (expense: any) => new Date(expense.date).toLocaleDateString('ar-EG')
    },
    { 
      key: 'category', 
      header: 'الفئة', 
      cell: (expense: any) => getCategoryDisplay(expense.category)
    },
    { 
      key: 'brand', 
      header: 'البراند', 
      cell: (expense: any) => getBrandName(expense.brand_id)
    },
    { 
      key: 'amount', 
      header: 'المبلغ', 
      cell: (expense: any) => (
        <span className="font-semibold text-red-600">{expense.amount.toLocaleString()} ج.م</span>
      )
    },
    { 
      key: 'description', 
      header: 'الوصف', 
      cell: (expense: any) => expense.description || "-"
    },
    { 
      key: 'actions', 
      header: 'الإجراءات', 
      cell: (expense: any) => (
        <Button variant="ghost" size="icon">
          <FileEdit className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns}
      data={expenses}
      isLoading={loading}
      emptyMessage="لا توجد مصروفات مطابقة للبحث"
      colSpan={6}
    />
  );
}
