import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportToPDF } from "@/utils/exportUtils";
import { CommissionsFilters } from "@/components/commissions/CommissionsFilters";
import { CommissionsList } from "@/components/commissions/CommissionsList";

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
      filteredCommissions
    );
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

      <CommissionsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        onExport={handleExportPDF}
      />

      <Card>
        <CardHeader>
          <CardTitle>العمولات</CardTitle>
        </CardHeader>
        <CardContent>
          <CommissionsList commissions={filteredCommissions} />
        </CardContent>
      </Card>
    </div>
  );
}
