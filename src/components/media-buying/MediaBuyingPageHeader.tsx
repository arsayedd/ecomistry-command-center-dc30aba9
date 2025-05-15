
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MediaBuyingExportActions from "@/components/media-buying/MediaBuyingExportActions";
import { MediaBuyingItem } from "@/types";

interface MediaBuyingPageHeaderProps {
  mediaBuying: MediaBuyingItem[];
}

export default function MediaBuyingPageHeader({ mediaBuying }: MediaBuyingPageHeaderProps) {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إدارة ميديا بايينج</h1>
        <p className="text-gray-500">
          عرض وتعديل وإضافة بيانات ميديا بايينج للموظفين
        </p>
      </div>

      <div className="my-6 flex justify-between items-center">
        <Button asChild>
          <Link to="/media-buying/add">إضافة ميديا بايينج</Link>
        </Button>
        <MediaBuyingExportActions mediaBuying={mediaBuying} />
      </div>
    </>
  );
}
