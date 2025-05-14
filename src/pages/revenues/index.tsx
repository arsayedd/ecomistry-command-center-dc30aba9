
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  useMutation, 
  useQuery, 
  useQueryClient 
} from "@tanstack/react-query";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function RevenuesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch revenues
  const { data: revenues, isLoading } = useQuery({
    queryKey: ["revenues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revenues")
        .select(`
          *,
          brand:brands(id, name)
        `)
        .order("date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch brands for filter
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });

  // Delete revenue mutation
  const deleteRevenue = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("revenues")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenues"] });
      toast({
        title: "تم حذف الإيراد",
        description: "تم حذف بيانات الإيراد بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Filter revenues based on search and filters
  const filteredRevenues = revenues?.filter((revenue) => {
    const brandName = revenue.brand?.name || "";
    
    const matchesSearch = !searchQuery || 
      brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (revenue.source && revenue.source.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesBrand = !filterBrand || revenue.brand_id === filterBrand;
    const matchesSource = !filterSource || revenue.source === filterSource;
    
    return matchesSearch && matchesBrand && matchesSource;
  });

  // Calculate total revenue
  const totalRevenue = filteredRevenues?.reduce((sum, revenue) => sum + Number(revenue.amount), 0) || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الإيرادات</h1>
        <Button>
          <Plus className="h-4 w-4 ml-2" /> إضافة إيراد جديد
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">إجمالي الإيرادات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(totalRevenue)}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="بحث..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger>
                <SelectValue placeholder="اختر البراند" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع البراندات</SelectItem>
                {brands?.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger>
                <SelectValue placeholder="مصدر الإيراد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع المصادر</SelectItem>
                <SelectItem value="مبيعات">مبيعات</SelectItem>
                <SelectItem value="استشارات">استشارات</SelectItem>
                <SelectItem value="خدمات">خدمات</SelectItem>
                <SelectItem value="أخرى">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>البراند</TableHead>
                <TableHead>المصدر</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : filteredRevenues?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    لا توجد إيرادات مطابقة للبحث
                  </TableCell>
                </TableRow>
              ) : (
                filteredRevenues?.map((revenue) => (
                  <TableRow key={revenue.id}>
                    <TableCell>{revenue.brand?.name || "غير محدد"}</TableCell>
                    <TableCell>{revenue.source || "غير محدد"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(revenue.amount)}
                    </TableCell>
                    <TableCell>
                      {revenue.date ? format(new Date(revenue.date), "yyyy-MM-dd") : "غير محدد"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteRevenue.mutate(revenue.id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash className="h-4 w-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
