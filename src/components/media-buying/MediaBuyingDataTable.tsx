
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MediaBuyingItem } from "@/types";

interface MediaBuyingDataTableProps {
  loading: boolean;
  mediaBuying: MediaBuyingItem[];
}

export default function MediaBuyingDataTable({ loading, mediaBuying }: MediaBuyingDataTableProps) {
  return (
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
              <TableCell>
                {item.employee && typeof item.employee === 'object' && 'full_name' in item.employee 
                  ? item.employee.full_name 
                  : "غير معروف"}
              </TableCell>
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
  );
}
