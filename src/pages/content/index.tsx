
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentTaskFilters } from "@/components/content/ContentTaskFilters";
import { ContentTaskList, ContentTask } from "@/components/content/ContentTaskList";

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Dummy content tasks data
  const contentTasks: ContentTask[] = [
    {
      id: "1",
      employeeName: "محمد أحمد",
      brandName: "براند أ",
      taskType: "post",
      dueDate: "2025-05-20",
      status: "inProgress",
      deliveryLink: "https://example.com/post1",
      notes: "يجب التركيز على فوائد المنتج"
    },
    {
      id: "2",
      employeeName: "سارة محمد",
      brandName: "براند ب",
      taskType: "reel",
      dueDate: "2025-05-18",
      status: "completed",
      deliveryLink: "https://example.com/reel2",
      notes: ""
    },
    {
      id: "3",
      employeeName: "أحمد علي",
      brandName: "براند ج",
      taskType: "ad",
      dueDate: "2025-05-25",
      status: "delayed",
      deliveryLink: "",
      notes: "تأخير بسبب انتظار الصور من العميل"
    },
    {
      id: "4",
      employeeName: "نورا خالد",
      brandName: "براند أ",
      taskType: "landingPage",
      dueDate: "2025-05-30",
      status: "inProgress",
      deliveryLink: "",
      notes: "تصميم صفحة هبوط للعرض الترويجي"
    },
    {
      id: "5",
      employeeName: "محمد أحمد",
      brandName: "براند د",
      taskType: "product",
      dueDate: "2025-05-15",
      status: "completed",
      deliveryLink: "https://example.com/product5",
      notes: ""
    }
  ];

  // Filter tasks based on search query and selected filters
  const filteredTasks = contentTasks.filter(task => {
    const matchesSearch = 
      task.employeeName.includes(searchQuery) || 
      task.brandName.includes(searchQuery) ||
      task.notes.includes(searchQuery);
    
    const matchesBrand = filterBrand === "all" || task.brandName === filterBrand;
    const matchesType = filterType === "all" || task.taskType === filterType;
    
    return matchesSearch && matchesBrand && matchesType;
  });

  const handleExport = () => {
    console.log("Exporting data...");
    // Implementation will be added later
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">كتابة المحتوى</h1>
        <div className="flex gap-2">
          <Link to="/content/media-buying">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 ml-2" /> ميديا باينج المحتوى
            </Button>
          </Link>
          <Link to="/content/add">
            <Button>
              <Plus className="h-4 w-4 ml-2" /> إضافة مهمة جديدة
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <ContentTaskFilters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterBrand={filterBrand}
            onFilterBrandChange={setFilterBrand}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            onExport={handleExport}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>مهام كتابة المحتوى</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentTaskList tasks={filteredTasks} />
        </CardContent>
      </Card>
    </div>
  );
}
