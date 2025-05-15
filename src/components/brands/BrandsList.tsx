
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Globe, MoreVertical, Edit, Trash, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Brand } from "@/types";

interface BrandsListProps {
  brands: Brand[];
}

export function BrandsList({ brands }: BrandsListProps) {
  const navigate = useNavigate();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "destructive";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {brands.map((brand) => (
        <Card key={brand.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge
                className={
                  brand.status === "active"
                    ? "bg-green-500"
                    : brand.status === "inactive"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }
              >
                {brand.status === "active"
                  ? "نشط"
                  : brand.status === "inactive"
                  ? "غير نشط"
                  : "معلق"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/brands/${brand.id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    تعديل
                  </DropdownMenuItem>
                  {brand.social_links?.website && (
                    <DropdownMenuItem asChild>
                      <a
                        href={brand.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        زيارة الموقع
                      </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-red-500" onClick={() => console.log("Delete", brand.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-3">
              {brand.logo_url && (
                <div className="w-12 h-12 rounded-md overflow-hidden">
                  <AspectRatio ratio={1 / 1}>
                    <img src={brand.logo_url} alt={brand.name} className="object-cover" />
                  </AspectRatio>
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{brand.name}</CardTitle>
                <CardDescription>{brand.product_type}</CardDescription>
              </div>
            </div>
          </CardHeader>
          {brand.description && (
            <CardContent className="text-sm text-gray-500">
              <p>{brand.description}</p>
            </CardContent>
          )}
          <CardFooter className="flex justify-between pt-3 border-t">
            <div className="flex space-x-2 rtl:space-x-reverse">
              {brand.social_links?.instagram && (
                <a
                  href={brand.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {brand.social_links?.facebook && (
                <a
                  href={brand.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {brand.social_links?.website && (
                <a
                  href={brand.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-600"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/brands/${brand.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              تعديل
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
