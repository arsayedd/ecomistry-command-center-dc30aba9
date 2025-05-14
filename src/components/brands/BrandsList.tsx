
import React from "react";
import { Link } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Edit, Trash2, Facebook, Instagram, Link2 } from "lucide-react";
import type { Brand } from "@/types";

interface BrandsListProps {
  brands: Brand[];
  loading?: boolean;
  onDelete?: (brand: Brand) => void;
}

export function BrandsList({ brands, loading, onDelete }: BrandsListProps) {
  if (loading) {
    return <div className="py-20 text-center">جاري تحميل البيانات...</div>;
  }

  return (
    <Table dir="rtl">
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">اللوجو</TableHead>
          <TableHead className="text-right">اسم البراند</TableHead>
          <TableHead className="text-right">الفئة</TableHead>
          <TableHead className="text-right">وصف مختصر</TableHead>
          <TableHead className="text-right">الحالة</TableHead>
          <TableHead className="text-right">السوشيال ميديا</TableHead>
          <TableHead className="text-right">إجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brands.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10 text-gray-500">
              لا توجد براندات لعرضها
            </TableCell>
          </TableRow>
        ) : (
          brands.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell>
                {brand.logo_url ? (
                  <div className="w-10 h-10 overflow-hidden rounded-md">
                    <AspectRatio ratio={1/1}>
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-md text-xs text-muted-foreground">
                    بدون لوجو
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell>{brand.product_type || "غير محدد"}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {brand.description || "غير متوفر"}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  brand.status === "active" ? "bg-green-100 text-green-800" :
                  brand.status === "inactive" ? "bg-red-100 text-red-800" :
                  brand.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {brand.status === "active" && "فعال"}
                  {brand.status === "inactive" && "موقف"}
                  {brand.status === "pending" && "تحت الإنشاء"}
                  {!brand.status && "غير محدد"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {brand.social_links?.facebook && (
                    <a href={brand.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      <Facebook size={16} />
                    </a>
                  )}
                  {brand.social_links?.instagram && (
                    <a href={brand.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500">
                      <Instagram size={16} />
                    </a>
                  )}
                  {brand.website || brand.social_links?.website && (
                    <a href={brand.website || brand.social_links?.website} target="_blank" rel="noopener noreferrer" className="text-gray-500">
                      <Link2 size={16} />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link to={`/brands/${brand.id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete && onDelete(brand)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
