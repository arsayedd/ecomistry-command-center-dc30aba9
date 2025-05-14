
import React from "react";
import { useNavigate } from "react-router-dom";
import MediaBuyingForm from "@/components/media-buying/MediaBuyingForm";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AddMediaBuyingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async (data: any) => {
    try {
      // Insert the data into the media_buying table
      const { error } = await supabase
        .from("media_buying")
        .insert([data]);

      if (error) throw error;

      toast({
        title: "تم إضافة الحملة الإعلانية بنجاح",
        variant: "default",
      });

      // Navigate back to the media buying list
      navigate("/media-buying");
    } catch (error) {
      console.error("Error adding media buying record:", error);
      toast({
        title: "خطأ في إضافة الحملة الإعلانية",
        description: "حدث خطأ أثناء محاولة إضافة بيانات الحملة الإعلانية",
        variant: "destructive",
      });
    }
  };

  return (
    <div dir="rtl" className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/media-buying")}
          className="mb-2"
        >
          <ChevronRight className="ml-2 h-4 w-4" />
          العودة إلى الحملات الإعلانية
        </Button>
        <h1 className="text-3xl font-bold">إضافة حملة إعلانية جديدة</h1>
      </div>

      <MediaBuyingForm onSave={handleSave} />
    </div>
  );
}
