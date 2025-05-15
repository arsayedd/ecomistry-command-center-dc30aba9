
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FileEdit, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContentMediaBuyingData } from "@/hooks/useContentMediaBuyingData";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";

export default function ContentMediaBuyingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { mediaBuying, loading, brands, employees, filters, handleFilterChange, handleDateChange } = useContentMediaBuyingData();

  // Filter media buying data based on search query
  const filteredData = mediaBuying.filter(item => 
    item.platform.includes(searchQuery) ||
    (item.brand?.name && item.brand.name.includes(searchQuery)) ||
    (item.employee?.full_name && item.employee.full_name.includes(searchQuery)) ||
    (item.notes && item.notes.includes(searchQuery))
  );

  // Map platform to Arabic
  const getPlatformDisplay = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "فيسبوك";
      case "instagram":
        return "انستجرام";
      case "tiktok":
        return "تيكتوك";
      case "snapchat":
        return "سناب شات";
      case "google":
        return "جوجل";
      default:
        return platform;
    }
  };

  // Export function
  const handleExport = (format: 'csv' | 'excel') => {
    const exportData = filteredData.map(item => ({
      platform: getPlatformDisplay(item.platform),
      date: item.date,
      brand: item.brand?.name || '',
      employee: item.employee?.full_name || '',
      spend: item.spend,
      orders_count: item.orders_count,
      order_cost: item.order_cost,
      roas: item.roas,
      campaign_link: item.campaign_link || '',
      notes: item.notes || ''
    }));

    if (format === 'csv') {
      exportToCSV(exportData, 'content_media_buying_data');
    } else {
      exportToExcel(exportData, 'content_media_buying_data');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ميديا باينج المحتوى</h1>
        <Link to="/content/media-buying/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة حملة جديدة
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
                  placeholder="البحث عن حملات الميديا..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select 
                value={filters.brand_id || "all"} 
                onValueChange={(value) => handleFilterChange("brand_id", value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="تصفية حسب البراند" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع البراندات</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <Select 
                value={filters.platform || "all"} 
                onValueChange={(value) => handleFilterChange("platform", value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="تصفية حسب المنصة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المنصات</SelectItem>
                  <SelectItem value="facebook">فيسبوك</SelectItem>
                  <SelectItem value="instagram">انستجرام</SelectItem>
                  <SelectItem value="tiktok">تيكتوك</SelectItem>
                  <SelectItem value="snapchat">سناب شات</SelectItem>
                  <SelectItem value="google">جوجل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 ml-2" />
                CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 ml-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>حملات الميديا المرتبطة بالمحتوى</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنصة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>البراند</TableHead>
                  <TableHead>الإنفاق الإعلاني</TableHead>
                  <TableHead>عدد الأوردرات</TableHead>
                  <TableHead>تكلفة الأوردر</TableHead>
                  <TableHead>العائد على الإنفاق</TableHead>
                  <TableHead>رابط الحملة</TableHead>
                  <TableHead>ملاحظات</TableHead>
                  <TableHead>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge className="bg-primary">{getPlatformDisplay(item.platform)}</Badge>
                      </TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString('ar-EG')}</TableCell>
                      <TableCell>{item.brand?.name || "-"}</TableCell>
                      <TableCell>{item.spend}</TableCell>
                      <TableCell>{item.orders_count}</TableCell>
                      <TableCell>{item.order_cost}</TableCell>
                      <TableCell>{item.roas || "-"}</TableCell>
                      <TableCell>
                        {item.campaign_link ? (
                          <a href={item.campaign_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            عرض
                          </a>
                        ) : "-"}
                      </TableCell>
                      <TableCell>{item.notes || "-"}</TableCell>
                      <TableCell>
                        <Link to={`/content/media-buying/edit/${item.id}`}>
                          <Button variant="ghost" size="icon">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      لا توجد حملات مطابقة للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
