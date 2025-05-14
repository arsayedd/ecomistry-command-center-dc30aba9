
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Download, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToPDF } from "@/utils/exportUtils";

export default function CommissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Dummy commissions data
  const commissions = [
    {
      id: "1",
      employeeName: "محمد أحمد",
      commissionType: "confirmation",
      valueType: "percentage",
      value: 5,
      ordersCount: 120,
      totalCommission: 1800,
      dueDate: "2025-05-30"
    },
    {
      id: "2",
      employeeName: "سارة محمد",
      commissionType: "delivery",
      valueType: "fixed",
      value: 10,
      ordersCount: 85,
      totalCommission: 850,
      dueDate: "2025-05-30"
    },
    {
      id: "3",
      employeeName: "أحمد علي",
      commissionType: "confirmation",
      valueType: "percentage",
      value: 7,
      ordersCount: 95,
      totalCommission: 1995,
      dueDate: "2025-06-15"
    },
    {
      id: "4",
      employeeName: "نورا خالد",
      commissionType: "delivery",
      valueType: "fixed",
      value: 15,
      ordersCount: 65,
      totalCommission: 975,
      dueDate: "2025-06-15"
    },
    {
      id: "5",
      employeeName: "محمود سامي",
      commissionType: "confirmation",
      valueType: "fixed",
      value: 5,
      ordersCount: 150,
      totalCommission: 750,
      dueDate: "2025-05-30"
    }
  ];

  // Filter commissions based on search query and selected filters
  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = 
      commission.employeeName.includes(searchQuery) || 
      commission.id.includes(searchQuery);
    
    const matchesType = filterType === "all" || commission.commissionType === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleExportPDF = () => {
    exportToPDF(
      "commissions_report",
      "تقرير العمولات",
      filteredCommissions,
      ["الموظف", "نوع العمولة", "نوع القيمة", "القيمة", "عدد الطلبات", "إجمالي العمولة", "تاريخ الاستحقاق"],
      ["employeeName", "commissionType", "valueType", "value", "ordersCount", "totalCommission", "dueDate"]
    );
  };

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">العمولات</h1>
        <Link to="/commissions/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة عمولة جديدة
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="البحث عن عمولات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="تصفية حسب النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="confirmation">تأكيد</SelectItem>
                  <SelectItem value="delivery">تسليم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="w-full md:w-auto" onClick={handleExportPDF}>
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>العمولات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>اسم الموظف</TableHead>
                <TableHead>نوع العمولة</TableHead>
                <TableHead>نوع القيمة</TableHead>
                <TableHead>القيمة</TableHead>
                <TableHead>عدد الطلبات</TableHead>
                <TableHead>إجمالي العمولة</TableHead>
                <TableHead>تاريخ الاستحقاق</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions.length > 0 ? (
                filteredCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>{commission.id}</TableCell>
                    <TableCell>{commission.employeeName}</TableCell>
                    <TableCell>{getCommissionTypeDisplay(commission.commissionType)}</TableCell>
                    <TableCell>{getValueTypeDisplay(commission.valueType)}</TableCell>
                    <TableCell>{getValueDisplay(commission.valueType, commission.value)}</TableCell>
                    <TableCell>{commission.ordersCount}</TableCell>
                    <TableCell>{commission.totalCommission} ج.م</TableCell>
                    <TableCell>{new Date(commission.dueDate).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    لا توجد عمولات مطابقة للبحث
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
