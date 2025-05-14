import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Adjusted to match actual types from database
interface Brand {
  id: string;
  name: string;
  status: string;
  product_type?: string;
  social_links?: any;
  created_at?: string;
  updated_at?: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  permission_level: string;
}

interface Employee {
  id: string;
  user_id: string;
  status: string;
  salary: number;
  user?: User;
}

interface MediaBuyingRecord {
  id: string;
  platform: string;
  date: string;
  brand_id: string;
  brand?: Brand;
  employee_id?: string;
  employee?: Employee;
  spend: number;
  orders_count: number;
  order_cost?: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export default function MediaBuyingPage() {
  const [activeTab, setActiveTab] = useState("facebook");
  
  const { data: mediaBuyingRecords, isLoading } = useQuery({
    queryKey: ["media-buying", activeTab],
    queryFn: async () => {
      try {
        let query = supabase
          .from("media_buying")
          .select(`
            *,
            brand:brands(*),
            employee_id
          `)
          .order("date", { ascending: false });
        
        if (activeTab !== "all") {
          query = query.eq("platform", activeTab);
        }
          
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Type assertion to make it work with our interface
        return data as unknown as MediaBuyingRecord[];
      } catch (error) {
        console.error("Error fetching media buying records:", error);
        // Return mock data for testing UI
        return [
          {
            id: "1",
            platform: "facebook",
            date: "2023-05-01",
            brand_id: "1",
            brand: { id: "1", name: "براند تجريبي", status: "active" },
            employee_id: "1",
            employee: { 
              id: "1", 
              user_id: "1",
              status: "active",
              salary: 5000,
              user: { 
                id: "1",
                full_name: "أحمد محمد", 
                email: "ahmed@example.com",
                department: "media-buying",
                role: "مسؤول ميديا",
                permission_level: "admin"
              }
            },
            spend: 5000,
            orders_count: 25,
            order_cost: 200,
            roas: 2.5,
            campaign_link: "https://facebook.com/campaign",
            notes: "حملة ناجحة",
            created_at: "2023-05-01T10:00:00",
          },
          {
            id: "2",
            platform: "instagram",
            date: "2023-05-02",
            brand_id: "2",
            brand: { id: "2", name: "براند آخر", status: "active" },
            employee_id: "2",
            employee: { 
              id: "2", 
              user_id: "2",
              status: "active",
              salary: 6000,
              user: { 
                id: "2",
                full_name: "سارة أحمد", 
                email: "sara@example.com",
                department: "media-buying",
                role: "مسؤول ميديا",
                permission_level: "edit"
              }
            },
            spend: 3000,
            orders_count: 15,
            order_cost: 200,
            roas: 1.8,
            campaign_link: "https://instagram.com/campaign",
            notes: "بحاجة إلى تحسين",
            created_at: "2023-05-02T11:00:00",
          },
          {
            id: "3",
            platform: "tiktok",
            date: "2023-05-03",
            brand_id: "3",
            brand: { id: "3", name: "براند ثالث", status: "active" },
            employee_id: "3",
            employee: { 
              id: "3", 
              user_id: "3",
              status: "active",
              salary: 5500,
              user: { 
                id: "3",
                full_name: "محمود علي", 
                email: "mahmoud@example.com",
                department: "media-buying",
                role: "مسؤول ميديا",
                permission_level: "edit"
              }
            },
            spend: 2000,
            orders_count: 10,
            order_cost: 200,
            roas: 1.5,
            campaign_link: "https://tiktok.com/campaign",
            notes: "",
            created_at: "2023-05-03T12:00:00",
          }
        ] as MediaBuyingRecord[];
      }
    },
    enabled: Boolean(activeTab),
  });
  
  const getPlatformName = (platform: string) => {
    switch(platform) {
      case "facebook": return "فيسبوك";
      case "instagram": return "انستجرام";
      case "tiktok": return "تيك توك";
      case "google": return "جوجل";
      default: return platform;
    }
  };
  
  const calculateCpp = (spend: number, orders: number) => {
    if (orders === 0) return 0;
    return spend / orders;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الميديا بايينج</h1>
        <Link to="/media-buying/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة تقرير جديد
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="facebook">فيسبوك</TabsTrigger>
          <TabsTrigger value="instagram">انستجرام</TabsTrigger>
          <TabsTrigger value="tiktok">تيك توك</TabsTrigger>
          <TabsTrigger value="google">جوجل</TabsTrigger>
          <TabsTrigger value="other">أخرى</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>تقارير الميديا بايينج</span>
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="mr-2">
                  <Filter className="h-4 w-4 ml-2" />
                  تصفية
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-10">جاري تحميل البيانات...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المنصة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">البراند</TableHead>
                      <TableHead className="text-right">الإنفاق (ج.م)</TableHead>
                      <TableHead className="text-right">عدد الأوردرات</TableHead>
                      <TableHead className="text-right">CPP (ج.م)</TableHead>
                      <TableHead className="text-right">ROAS</TableHead>
                      <TableHead className="text-right">رابط الحملة</TableHead>
                      <TableHead className="text-right">ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mediaBuyingRecords && mediaBuyingRecords.length > 0 ? (
                      mediaBuyingRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <Badge variant="outline" className={`
                              ${record.platform === 'facebook' ? 'bg-blue-100 text-blue-800' : ''}
                              ${record.platform === 'instagram' ? 'bg-purple-100 text-purple-800' : ''}
                              ${record.platform === 'tiktok' ? 'bg-black text-white' : ''}
                              ${record.platform === 'google' ? 'bg-green-100 text-green-800' : ''}
                              ${record.platform === 'other' ? 'bg-gray-100 text-gray-800' : ''}
                            `}>
                              {getPlatformName(record.platform)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record.date ? format(new Date(record.date), "dd MMM yyyy", { locale: ar }) : "غير محدد"}
                          </TableCell>
                          <TableCell>{record.brand?.name || "غير محدد"}</TableCell>
                          <TableCell>{Number(record.spend).toLocaleString()}</TableCell>
                          <TableCell>{record.orders_count}</TableCell>
                          <TableCell>
                            {calculateCpp(Number(record.spend), record.orders_count).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>{record.roas || "غير محدد"}</TableCell>
                          <TableCell>
                            {record.campaign_link ? (
                              <a 
                                href={record.campaign_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate max-w-[150px] inline-block"
                              >
                                فتح الرابط
                              </a>
                            ) : (
                              "لا يوجد"
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {record.notes || "لا يوجد"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">
                          لا توجد بيانات للميديا بايينج
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
