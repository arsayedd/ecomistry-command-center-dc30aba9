
import React from "react";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaBuyingRecord, Brand, User } from "@/types";
import { Edit, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface MediaBuyingListProps {
  data: (MediaBuyingRecord & {
    brand?: Brand;
    employee?: User;
  })[];
  isLoading: boolean;
}

export function MediaBuyingList({ data, isLoading }: MediaBuyingListProps) {
  
  // Platform display mapping
  const platformLabels: Record<string, { label: string; color: string }> = {
    facebook: { label: "فيسبوك", color: "bg-blue-500" },
    instagram: { label: "إنستجرام", color: "bg-pink-500" },
    tiktok: { label: "تيك توك", color: "bg-black" },
    google: { label: "جوجل", color: "bg-red-500" },
    other: { label: "أخرى", color: "bg-gray-500" }
  };

  const columns = [
    {
      key: "platform",
      header: "المنصة",
      cell: (record: MediaBuyingRecord & { brand?: Brand; employee?: User }) => (
        <Badge className={`${platformLabels[record.platform]?.color || "bg-gray-500"} text-white`}>
          {platformLabels[record.platform]?.label || record.platform}
        </Badge>
      ),
    },
    {
      key: "date",
      header: "التاريخ",
      cell: (record: MediaBuyingRecord & { brand?: Brand; employee?: User }) => (
        <span>{format(new Date(record.date), "yyyy-MM-dd")}</span>
      ),
    },
    {
      key: "brand",
      header: "البراند",
      cell: (record: MediaBuyingRecord & { brand?: Brand; employee?: User }) => (
        <span>{record.brand?.name || "غير محدد"}</span>
      ),
    },
    {
      key: "employee",
      header: "الموظف",
      cell: (record: MediaBuyingRecord & { brand?: Brand; employee?: User }) => (
        <span>{record.employee?.full_name || "غير محدد"}</span>
      ),
    },
    {
      key: "spend",
      header: "الإنفاق",
      cell: (record: MediaBuyingRecord & { brand?: Brand; employee?: User }) => (
        <span className="font-semibold">
          {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(record.spend)}
        </span>
      ),
    },
    {
      key: "orders",
      header: "عدد الطلبات",
      cell: (record: MediaBuyingRecord & { brand?: Brand; employee?: User }) => (
        <span>{record.orders_count}</span>
      ),
    },
    {
      key: "cpp",
      header: "CPP",
      cell: (record: MediaBuyingRecord & { brand?: Brand; employee?: User }) => {
        const cpp = record.orders_count > 0 
          ? record.spend / record.orders_count
          : record.order_cost || 0;
        
        return (
          <span className="font-semibold">
            {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(cpp)}
          </span>
        );
      },
    },
    {
      key: "roas",
      header: "ROAS",
      cell: (record: MediaBuyingRecord & { brand?: Brand; employee?: User }) => (
        <span className="font-semibold">{record.roas ? `${record.roas}x` : "غير محدد"}</span>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      cell: (record: MediaBuyingRecord & { brand?: Brand; employee?: User }) => (
        <div className="flex items-center space-x-2">
          <Link to={`/media-buying/${record.id}/edit`}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          
          {record.campaign_link && (
            <a href={record.campaign_link} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="لا توجد حملات إعلانية متاحة"
      colSpan={9}
    />
  );
}
