
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface ContentMediaBuyingFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export function ContentMediaBuyingFormActions({ 
  isSubmitting, 
  onCancel 
}: ContentMediaBuyingFormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-end">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        إلغاء
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          'حفظ'
        )}
      </Button>
    </div>
  );
}
