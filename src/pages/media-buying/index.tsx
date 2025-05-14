import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";

// Define MediaBuyingItem type
interface MediaBuyingItem {
  id: string;
  brand_id: string;
  employee_id: string;
  platform: string;
  date: string;
  spend: number;
  orders_count: number;
  order_cost: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  brand?: {
    id: string;
    name: string;
  };
  employee?: {
    id: string;
    full_name: string;
  };
}

export default function MediaBuyingPage() {
  const [mediaBuying, setMediaBuying] = useState<MediaBuyingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [employees, setEmployees] = useState<{ id: string; full_name: string }[]>([]);
  const [filters, setFilters] = useState({
    brand_id: "",
    platform: "",
    employee_id: "",
    date_from: "",
    date_to: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase.from("brands").select("id, name");
        if (error) throw error;
        if (data) setBrands(data);
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: `فشل في جلب بيانات البراندات: ${error.message}`,
          variant: "destructive",
        });
      }
    };

    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name")
          .eq("role", "employee");
        if (error) throw error;
        if (data) setEmployees(data);
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: `فشل في جلب بيانات الموظفين: ${error.message}`,
          variant: "destructive",
        });
      }
    };

    fetchBrands();
    fetchEmployees();
  }, [toast]);
  
  useEffect(() => {
    const fetchMediaBuying = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("media_buying")
          .select("*, brand:brand_id(*), employee:employee_id(*)");
        
        // Apply filters
        if (filters.brand_id) {
          query = query.eq("brand_id", filters.brand_id);
        }
        if (filters.platform) {
          query = query.eq("platform", filters.platform);
        }
        if (filters.employee_id) {
          query = query.eq("employee_id", filters.employee_id);
        }
        if (filters.date_from) {
          query = query.gte("date", filters.date_from);
        }
        if (filters.date_to) {
          query = query.lte("date", filters.date_to);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          // Process data to ensure proper structure
          const processedData: MediaBuyingItem[] = data.map(item => ({
            id: item.id,
            brand_id: item.brand_id,
            employee_id: item.employee_id,
            platform: item.platform,
            date: item.date,
            spend: item.spend,
            orders_count: item.orders_count,
            order_cost: item.order_cost,
            roas: (item as any).roas,
            campaign_link: (item as any).campaign_link,
            notes: (item as any).notes,
            created_at: item.created_at,
            updated_at: item.updated_at,
            brand: item.brand,
            employee: {
              id: item.employee.id || "",
              full_name: typeof item.employee === 'object' && 'full_name' in item.employee 
                ? item.employee.full_name 
                : "غير معروف"
            }
          }));
          
          setMediaBuying(processedData);
        }
      } catch (error: any) {
        toast({
          title: "خطأ",
          description: `فشل في جلب بيانات الميديا بايينج: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMediaBuying();
  }, [filters]);

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: format(date, "yyyy-MM-dd"),
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: "",
      }));
    }
  };

  const handleExportCSV = () => {
    if (!mediaBuying.length) return;
    
    const exportData = mediaBuying.map(item => ({
      'التاريخ': item.date,
      'المنصة': item.platform,
      'البراند': item.brand?.name || '',
      'الموظف': item.employee?.full_name || '',
      'الإنفاق': item.spend,
      'عدد الطلبات': item.orders_count,
      'تكلفة الطلب': item.order_cost,
      'ROAS': item.roas || 0,
      'ملاحظات': item.notes || ''
    }));
    
    exportToCSV(exportData, 'media_buying_report');
  };
  
  const handleExportPDF = () => {
    if (!mediaBuying.length) return;
    
    const exportData = mediaBuying.map(item => ({
      'التاريخ': item.date,
      'المنصة': item.platform,
      'البراند': item.brand?.name || '',
      'الموظف': item.employee?.full_name || '',
      'الإنفاق': item.spend,
      'عدد الطلبات': item.orders_count,
      'تكلفة الطلب': item.order_cost
    }));
    
    exportToPDF(exportData, 'media_buying_report');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إدارة ميديا بايينج</h1>
        <p className="text-gray-500">
          عرض وتعديل وإضافة بيانات ميديا بايينج للموظفين
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فلترة البيانات</CardTitle>
          <CardDescription>
            استخدم الفلاتر لتضييق نطاق البيانات المعروضة
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div>
            <Label htmlFor="brand_id">البراند</Label>
            <Select name="brand_id" onValueChange={(value) => setFilters({...filters, brand_id: value})}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر براند" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">إظهار الكل</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="platform">المنصة</Label>
            <Input
              type="text"
              id="platform"
              name="platform"
              placeholder="اسم المنصة"
              value={filters.platform}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <Label htmlFor="employee_id">الموظف</Label>
            <Select name="employee_id" onValueChange={(value) => setFilters({...filters, employee_id: value})}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر موظف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">إظهار الكل</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-1">
            <Label>من تاريخ</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.date_from && "text-muted-foreground"
                  )}
                >
                  {filters.date_from ? (
                    format(new Date(filters.date_from), "yyyy-MM-dd")
                  ) : (
                    <span>اختر تاريخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={filters.date_from ? new Date(filters.date_from) : undefined}
                  onSelect={(date) => handleDateChange("date_from", date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("2020-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-1">
            <Label>إلى تاريخ</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.date_to && "text-muted-foreground"
                  )}
                >
                  {filters.date_to ? (
                    format(new Date(filters.date_to), "yyyy-MM-dd")
                  ) : (
                    <span>اختر تاريخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={filters.date_to ? new Date(filters.date_to) : undefined}
                  onSelect={(date) => handleDateChange("date_to", date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("2020-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <div className="my-6 flex justify-between items-center">
        <Button asChild>
          <Link to="/media-buying/add">إضافة ميديا بايينج</Link>
        </Button>
        <div>
          <Button onClick={handleExportCSV} className="ml-2">تصدير CSV</Button>
          <Button onClick={handleExportPDF}>تصدير PDF</Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>البراند</TableHead>
              <TableHead>المنصة</TableHead>
              <TableHead>الموظف</TableHead>
              <TableHead>تاريخ الحملة</TableHead>
              <TableHead>الإنفاق</TableHead>
              <TableHead>عدد الطلبات</TableHead>
              <TableHead>تكلفة الطلب</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : mediaBuying.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  لا توجد بيانات
                </TableCell>
              </TableRow>
            ) : (
              mediaBuying.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.brand?.name}</TableCell>
                  <TableCell>{item.platform}</TableCell>
                  <TableCell>{item.employee?.full_name}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.spend}</TableCell>
                  <TableCell>{item.orders_count}</TableCell>
                  <TableCell>{item.order_cost}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="link">
                      <Link to={`/media-buying/${item.id}/edit`}>تعديل</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
