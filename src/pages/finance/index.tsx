
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, FileSpreadsheet, FilePdf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Brand } from "@/types";

// Sample data
const sampleBrands = [
  { id: "1", name: "براند أزياء", status: "active" },
  { id: "2", name: "براند تجميل", status: "active" },
  { id: "3", name: "براند أغذية", status: "active" },
];

const sampleExpenses = [
  {
    id: "1",
    category: "مرتبات",
    amount: 5000,
    date: "2025-05-10",
    brand_id: "1",
    brand: { id: "1", name: "براند أزياء", status: "active" },
    description: "مرتبات شهر مايو",
  },
  {
    id: "2",
    category: "إعلانات",
    amount: 3000,
    date: "2025-05-08",
    brand_id: "2",
    brand: { id: "2", name: "براند تجميل", status: "active" },
    description: "إعلانات فيسبوك",
  },
  {
    id: "3",
    category: "إيجار",
    amount: 10000,
    date: "2025-05-05",
    brand_id: null,
    description: "إيجار المقر الرئيسي",
  },
];

const sampleRevenues = [
  {
    id: "1",
    date: "2025-05-12",
    brand_id: "1",
    brand: { id: "1", name: "براند أزياء", status: "active" },
    quantity_sold: 50,
    price_per_unit: 300,
    total_amount: 15000,
    notes: "مبيعات الأسبوع الأول",
  },
  {
    id: "2",
    date: "2025-05-11",
    brand_id: "2",
    brand: { id: "2", name: "براند تجميل", status: "active" },
    quantity_sold: 30,
    price_per_unit: 200,
    total_amount: 6000,
    notes: "مبيعات نهاية الأسبوع",
  },
  {
    id: "3",
    date: "2025-05-09",
    brand_id: "3",
    brand: { id: "3", name: "براند أغذية", status: "active" },
    quantity_sold: 100,
    price_per_unit: 50,
    total_amount: 5000,
    notes: "طلبات أونلاين",
  },
];

export default function FinancePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("expenses");

  // Fetch expenses data
  const { data: expenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("expenses")
          .select(`
            *,
            brand:brands(id, name, status)
          `)
          .order("date", { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching expenses:", error);
        return sampleExpenses;
      }
    },
  });

  // Fetch revenues data
  const { data: revenues } = useQuery({
    queryKey: ["revenues"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("revenues")
          .select(`
            *,
            brand:brands(id, name, status)
          `)
          .order("date", { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching revenues:", error);
        return sampleRevenues;
      }
    },
  });

  // Calculate summary metrics
  const totalExpenses =
    expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  const totalRevenues =
    revenues?.reduce((sum, revenue) => sum + Number(revenue.total_amount), 0) || 0;
  const profit = totalRevenues - totalExpenses;
  const profitMargin =
    totalRevenues > 0 ? ((profit / totalRevenues) * 100).toFixed(1) : "0";

  // Export to Excel function
  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  // Export to PDF function
  const exportToPdf = (data, columns, filename) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text(filename, 105, 15, { align: "center" });

    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: data.map((item) =>
        columns.map((col) => {
          if (col.key === "brand") {
            return item.brand?.name || "—";
          }
          if (col.key === "date") {
            return format(new Date(item[col.key]), "yyyy-MM-dd");
          }
          return item[col.key]?.toString() || "—";
        })
      ),
      headStyles: {
        fillColor: [76, 175, 80],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      startY: 25,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 5,
        overflow: "linebreak",
        halign: "right",
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 40 },
      },
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">النظام المالي</h1>
        <div className="flex space-x-4 space-x-reverse mt-4 sm:mt-0">
          {activeTab === "expenses" && (
            <Button
              onClick={() => navigate("/finance/expenses/add")}
              className="flex items-center"
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة مصروف
            </Button>
          )}
          {activeTab === "revenues" && (
            <Button
              onClick={() => navigate("/finance/revenues/add")}
              className="flex items-center"
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة إيراد
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenues.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">صافي الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profit.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">هامش الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="expenses"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="expenses">المصروفات</TabsTrigger>
          <TabsTrigger value="revenues">الإيرادات</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>سجل المصروفات</CardTitle>
                <div className="flex space-x-2 space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      exportToExcel(expenses || sampleExpenses, "expenses")
                    }
                  >
                    <FileSpreadsheet className="ml-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      exportToPdf(
                        expenses || sampleExpenses,
                        [
                          { key: "category", header: "النوع" },
                          { key: "amount", header: "المبلغ" },
                          { key: "date", header: "التاريخ" },
                          { key: "brand", header: "البراند" },
                          { key: "description", header: "الوصف" },
                        ],
                        "expenses"
                      )
                    }
                  >
                    <FilePdf className="ml-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>النوع</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>البراند المرتبط</TableHead>
                      <TableHead>الوصف</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(expenses || sampleExpenses).map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <Badge
                            variant={
                              expense.category === "مرتبات"
                                ? "default"
                                : expense.category === "إعلانات"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{expense.amount.toLocaleString()} ج.م</TableCell>
                        <TableCell>
                          {format(new Date(expense.date), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell>
                          {expense.brand ? expense.brand.name : "—"}
                        </TableCell>
                        <TableCell>{expense.description || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenues">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>سجل الإيرادات</CardTitle>
                <div className="flex space-x-2 space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      exportToExcel(revenues || sampleRevenues, "revenues")
                    }
                  >
                    <FileSpreadsheet className="ml-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      exportToPdf(
                        revenues || sampleRevenues,
                        [
                          { key: "date", header: "التاريخ" },
                          { key: "brand", header: "البراند" },
                          { key: "quantity_sold", header: "الكمية" },
                          { key: "price_per_unit", header: "سعر القطعة" },
                          { key: "total_amount", header: "الإجمالي" },
                          { key: "notes", header: "ملاحظات" },
                        ],
                        "revenues"
                      )
                    }
                  >
                    <FilePdf className="ml-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>البراند</TableHead>
                      <TableHead>عدد القطع</TableHead>
                      <TableHead>سعر القطعة</TableHead>
                      <TableHead>الإجمالي</TableHead>
                      <TableHead>ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(revenues || sampleRevenues).map((revenue) => (
                      <TableRow key={revenue.id}>
                        <TableCell>
                          {format(new Date(revenue.date), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell>{revenue.brand.name}</TableCell>
                        <TableCell>{revenue.quantity_sold}</TableCell>
                        <TableCell>{revenue.price_per_unit} ج.م</TableCell>
                        <TableCell>{revenue.total_amount.toLocaleString()} ج.م</TableCell>
                        <TableCell>{revenue.notes || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
