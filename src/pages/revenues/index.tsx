
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  useMutation, 
  useQuery, 
  useQueryClient 
} from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
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
import type { Revenue } from "@/types";

// Sample data for initial display
const sampleRevenues: Revenue[] = [
  {
    id: "1",
    amount: 5000,
    date: "2025-05-12",
    created_at: "2025-05-12T00:00:00",
    brand_id: "1",
    source: "مبيعات",
    brand: { id: "1", name: "براند أزياء", status: "active" }
  },
  {
    id: "2",
    amount: 3500,
    date: "2025-05-11",
    created_at: "2025-05-11T00:00:00",
    brand_id: "2",
    source: "خدمات",
    brand: { id: "2", name: "براند تجميل", status: "active" }
  },
  {
    id: "3",
    amount: 7800,
    date: "2025-05-10",
    created_at: "2025-05-10T00:00:00",
    brand_id: "3",
    source: "استشارات",
    brand: { id: "3", name: "براند أغذية", status: "active" }
  }
];

// Sample data for brands
const sampleBrands = [
  { id: "1", name: "براند أزياء", status: "active" },
  { id: "2", name: "براند تجميل", status: "active" },
  { id: "3", name: "براند أغذية", status: "active" },
  { id: "4", name: "براند إلكترونيات", status: "active" }
];

export default function RevenuesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [localRevenues, setLocalRevenues] = useState<Revenue[]>(sampleRevenues);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch revenues
  const { data: revenues, isLoading } = useQuery({
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
        return data as Revenue[] || [];
      } catch (error) {
        console.error("Error fetching revenues:", error);
        return sampleRevenues; // Fall back to sample data if API fails
      }
    },
  });

  // Update local revenues when API data changes
  useEffect(() => {
    if (revenues && revenues.length > 0) {
      setLocalRevenues(revenues);
    }
  }, [revenues]);

  // Fetch brands for filter
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("id, name")
          .order("name");

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching brands:", error);
        return sampleBrands; // Fall back to sample brands if API fails
      }
    },
  });

  // Delete revenue mutation
  const deleteRevenue = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from("revenues")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        return id;
      } catch (error) {
        console.error("Error deleting revenue:", error);
        // For sample data, implement local deletion
        setLocalRevenues(prev => prev.filter(rev => rev.id !== id));
        return id;
      }
    },
    onSuccess: (id) => {
      // Remove from local state in case we're using sample data
      setLocalRevenues(prev => prev.filter(rev => rev.id !== id));
      
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
  const filteredRevenues = localRevenues.filter((revenue) => {
    const brandName = revenue.brand?.name || "";
    
    const matchesSearch = !searchQuery || 
      brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (revenue.source && revenue.source.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesBrand = !filterBrand || revenue.brand_id === filterBrand;
    const matchesSource = !filterSource || revenue.source === filterSource;
    
    return matchesSearch && matchesBrand && matchesSource;
  });

  // Calculate total revenue
  const totalRevenue = filteredRevenues.reduce((sum, revenue) => sum + Number(revenue.amount), 0) || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الإيرادات</h1>
        <Link to="/revenues/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة إيراد جديد
          </Button>
        </Link>
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
                {(brands || sampleBrands)?.map((brand) => (
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
                          <Link to={`/revenues/${revenue.id}/edit`}>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 ml-2" />
                              تعديل
                            </DropdownMenuItem>
                          </Link>
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
