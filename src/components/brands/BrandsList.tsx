
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileEdit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { Brand } from "@/types";

export interface BrandsListProps {
  brands: Brand[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BrandsList({ brands, loading, onEdit, onDelete }: BrandsListProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">نشط</Badge>;
      case "inactive":
        return <Badge className="bg-red-500">غير نشط</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">قيد المراجعة</Badge>;
      default:
        return <Badge className="bg-gray-500">{status || "-"}</Badge>;
    }
  };

  const columns = [
    {
      key: "name",
      header: "اسم البراند",
      cell: (brand: Brand) => <span className="font-medium">{brand.name}</span>
    },
    {
      key: "product_type",
      header: "الفئة",
      cell: (brand: Brand) => brand.product_type || "-"
    },
    {
      key: "status",
      header: "الحالة",
      cell: (brand: Brand) => getStatusBadge(brand.status)
    },
    {
      key: "website",
      header: "الموقع الإلكتروني",
      cell: (brand: Brand) => {
        const socialLinks = brand.social_links || {};
        if (typeof socialLinks === 'object' && socialLinks.website) {
          return (
            <a
              href={socialLinks.website as string}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {socialLinks.website as string}
            </a>
          );
        }
        return "-";
      }
    },
    {
      key: "actions",
      header: "الإجراءات",
      cell: (brand: Brand) => (
        <div className="flex space-x-2">
          <Link to={`/brands/${brand.id}/edit`}>
            <Button variant="ghost" size="icon" onClick={() => onEdit(brand.id)}>
              <FileEdit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(brand.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={brands}
      isLoading={loading}
      emptyMessage="لا توجد بيانات براندات مطابقة للبحث"
      colSpan={5}
    />
  );
}
