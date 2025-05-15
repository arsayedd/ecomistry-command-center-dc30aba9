
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MediaBuyingRecord } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentMediaBuyingTableProps {
  loading: boolean;
  data: MediaBuyingRecord[];
}

export function ContentMediaBuyingTable({ loading, data }: ContentMediaBuyingTableProps) {
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
        return platform || '';
    }
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
        {data.length > 0 ? (
          data.map((item) => (
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
  );
}
