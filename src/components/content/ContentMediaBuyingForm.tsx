
import React from "react";
import ContentMediaBuyingFormWrapper from "@/components/content/media-buying/ContentMediaBuyingFormWrapper";

export default function ContentMediaBuyingForm({ initialData }: { initialData?: any }) {
  return <ContentMediaBuyingFormWrapper initialData={initialData} />;
}

// Re-export types for compatibility
export { contentMediaBuyingFormSchema, type ContentMediaBuyingFormValues } from "@/hooks/useContentMediaBuyingForm";
