
import React from "react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";

interface ContentMediaBuyingFormActionsProps {
  loading: boolean;
  navigate: NavigateFunction;
}

export function ContentMediaBuyingFormActions({ loading, navigate }: ContentMediaBuyingFormActionsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button 
        variant="outline" 
        type="button" 
        onClick={() => navigate("/media-buying/content")}
      >
        إلغاء
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? "جاري الحفظ..." : "حفظ"}
      </Button>
    </div>
  );
}
