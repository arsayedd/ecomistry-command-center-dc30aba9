
import React from "react";
import { MediaBuyingList } from "./MediaBuyingList";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaBuyingRecord } from "@/types";

interface MediaBuyingDataTableProps {
  loading: boolean;
  mediaBuying: MediaBuyingRecord[];
}

export default function MediaBuyingDataTable({ loading, mediaBuying }: MediaBuyingDataTableProps) {
  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
      </div>
    );
  }

  return <MediaBuyingList data={mediaBuying} isLoading={loading} />;
}

export { MediaBuyingDataTable };
