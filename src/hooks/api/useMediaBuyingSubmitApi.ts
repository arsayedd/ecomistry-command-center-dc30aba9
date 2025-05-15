
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MediaBuying } from "@/types";
import { format } from "date-fns";

export const useMediaBuyingSubmitApi = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Save media buying data
  const saveMediaBuying = async (values: MediaBuying, initialData?: MediaBuying) => {
    setLoading(true);
    try {
      // Format the data for submission
      const formData = {
        platform: values.platform,
        date: values.campaign_date instanceof Date ? 
          format(values.campaign_date, "yyyy-MM-dd") : values.campaign_date,
        brand_id: values.brand_id,
        employee_id: values.employee_id,
        spend: values.ad_spend,
        orders_count: values.orders_count,
        order_cost: values.cpp,
        roas: values.roas,
        notes: values.notes,
        campaign_link: values.campaign_link,
        created_at: initialData?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // If editing, update the record, otherwise insert
      if (initialData?.id) {
        const { error } = await supabase
          .from("media_buying")
          .update(formData)
          .eq("id", initialData.id);
          
        if (error) throw error;
        
        return { success: true, message: "تم تحديث الحملة بنجاح" };
      } else {
        const { error } = await supabase
          .from("media_buying")
          .insert([formData]);
          
        if (error) throw error;
        
        return { success: true, message: "تم إضافة الحملة بنجاح" };
      }
    } catch (error: any) {
      console.error("Error saving media buying data:", error);
      return { 
        success: false, 
        message: "حدث خطأ أثناء محاولة حفظ بيانات الحملة الإعلانية." 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveMediaBuying,
  };
};
