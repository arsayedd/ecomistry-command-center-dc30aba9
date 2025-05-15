
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FileEdit, Search, Filter, Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Dummy content tasks data
  const contentTasks = [
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

  // Map status to Arabic and badge color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "inProgress":
        return <Badge className="bg-blue-500">قيد التنفيذ</Badge>;
      case "completed":
        return <Badge className="bg-green-500">تم</Badge>;
      case "delayed":
        return <Badge className="bg-red-500">متأخر</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  // Map task type to Arabic
  const getTaskTypeDisplay = (type: string) => {
    switch (type) {
      case "post":
        return "بوست";
      case "reel":
        return "رييل";
      case "ad":
        return "إعلان";
      case "landingPage":
        return "صفحة هبوط";
      case "product":
        return "منتج";
      default:
        return type;
    }
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
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="البحث عن مهام كتابة المحتوى..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={filterBrand} onValueChange={setFilterBrand}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="تصفية حسب البراند" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع البراندات</SelectItem>
                  <SelectItem value="براند أ">براند أ</SelectItem>
                  <SelectItem value="براند ب">براند ب</SelectItem>
                  <SelectItem value="براند ج">براند ج</SelectItem>
                  <SelectItem value="براند د">براند د</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="تصفية حسب النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="post">بوست</SelectItem>
                  <SelectItem value="reel">رييل</SelectItem>
                  <SelectItem value="ad">إعلان</SelectItem>
                  <SelectItem value="landingPage">صفحة هبوط</SelectItem>
                  <SelectItem value="product">منتج</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>مهام كتابة المحتوى</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>اسم الموظف</TableHead>
                <TableHead>البراند</TableHead>
                <TableHead>نوع المهمة</TableHead>
                <TableHead>تاريخ التسليم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>رابط التسليم</TableHead>
                <TableHead>ملاحظات</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.employeeName}</TableCell>
                    <TableCell>{task.brandName}</TableCell>
                    <TableCell>{getTaskTypeDisplay(task.taskType)}</TableCell>
                    <TableCell>{new Date(task.dueDate).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell>{getStatusDisplay(task.status)}</TableCell>
                    <TableCell>
                      {task.deliveryLink ? (
                        <a href={task.deliveryLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          عرض
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{task.notes || "-"}</TableCell>
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
                    لا توجد مهام مطابقة للبحث
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
