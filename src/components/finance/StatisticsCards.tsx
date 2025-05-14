
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatisticsCardsProps {
  totalRevenues: number;
  totalExpenses: number;
  profit: number;
  profitMargin: number;
}

export function StatisticsCards({ 
  totalRevenues, 
  totalExpenses, 
  profit, 
  profitMargin 
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">إجمالي الإيرادات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalRevenues.toLocaleString()} ج.م</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">إجمالي المصروفات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} ج.م</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">صافي الربح</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profit.toLocaleString()} ج.م
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">هامش الربح</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profitMargin.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
