
import React from "react";
import { Button } from "@/components/ui/button";
import { MediaBuyingItem } from "@/types";
import { Plus } from "lucide-react";

interface MediaBuyingPageHeaderProps {
  mediaBuying: MediaBuyingItem[];
  onAdd?: () => void;
}

export default function MediaBuyingPageHeader({ mediaBuying, onAdd }: MediaBuyingPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">الحملات الإعلانية</h1>
        <p className="text-muted-foreground">
          {mediaBuying.length} حملة إعلانية
        </p>
      </div>
      
      {onAdd && (
        <Button onClick={onAdd} className="mt-2 sm:mt-0">
          <Plus className="w-4 h-4 ml-2" />
          إضافة حملة جديدة
        </Button>
      )}
    </div>
  );
}
