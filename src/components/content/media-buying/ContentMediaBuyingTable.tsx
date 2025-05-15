
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { FileEdit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MediaBuyingRecord } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ContentMediaBuyingTableProps {
  loading: boolean;
  data: MediaBuyingRecord[];
}

export function ContentMediaBuyingTable({ loading, data }: ContentMediaBuyingTableProps) {
  // Map platform to Arabic and assign colors
  const getPlatformDetails = (platform: string) => {
    const platforms: Record<string, { label: string, color: string }> = {
      "facebook": { label: "فيسبوك", color: "bg-blue-500" },
      "instagram": { label: "انستجرام", color: "bg-pink-500" },
      "tiktok": { label: "تيكتوك", color: "bg-gray-900" },
      "snapchat": { label: "سناب شات", color: "bg-yellow-400" },
      "google": { label: "جوجل", color: "bg-red-500" },
      "other": { label: "أخرى", color: "bg-gray-500" }
    };
    
    return platforms[platform] || { label: platform, color: "bg-gray-500" };
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-EG', { 
      style: 'currency', 
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 rtl:space-x-reverse">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
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
          {data && data.length > 0 ? (
            data.map((item) => {
              const platformDetails = getPlatformDetails(item.platform);
              const roas = item.roas ? `${item.roas}x` : "-";
              const costPerOrder = item.order_cost || (item.orders_count > 0 ? item.spend / item.orders_count : 0);
              
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge className={platformDetails.color + " text-white"}>
                      {platformDetails.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.date ? format(new Date(item.date), "dd MMM yyyy", { locale: ar }) : "-"}
                  </TableCell>
                  <TableCell>{item.brand?.name || "-"}</TableCell>
                  <TableCell>{formatCurrency(item.spend)}</TableCell>
                  <TableCell>{item.orders_count}</TableCell>
                  <TableCell>{formatCurrency(costPerOrder)}</TableCell>
                  <TableCell>{roas}</TableCell>
                  <TableCell>
                    {item.campaign_link ? (
                      <a href={item.campaign_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-500 hover:text-blue-700">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        عرض
                      </a>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    {item.notes ? (
                      <div className="max-w-xs truncate" title={item.notes}>
                        {item.notes}
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    <Link to={`/content/media-buying/edit/${item.id}`}>
                      <Button variant="ghost" size="icon">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                لا توجد حملات مطابقة للبحث
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
