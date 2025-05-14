
import React from "react";
import { useNavigate } from "react-router-dom";
import CommissionForm from "@/components/commissions/CommissionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AddCommissionPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async (data: any) => {
    try {
      const { error } = await supabase
        .from("commissions")
        .insert([data]);

      if (error) throw error;

      toast({
        title: "تم إضافة العمولة بنجاح",
        variant: "default",
      });

      navigate("/commissions");
    } catch (error) {
      console.error("Error adding commission:", error);
      toast({
        title: "خطأ في إضافة العمولة",
        description: "حدث خطأ أثناء محاولة إضافة بيانات العمولة",
        variant: "destructive",
      });
    }
  };

  return (
    <div dir="rtl" className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/commissions")}
          className="mb-2"
        >
          <ChevronRight className="ml-2 h-4 w-4" />
          العودة إلى العمولات
        </Button>
        <h1 className="text-3xl font-bold">إضافة عمولة جديدة</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>بيانات العمولة</CardTitle>
        </CardHeader>
        <CardContent>
          <CommissionForm onSave={handleSave} />
        </CardContent>
      </Card>
    </div>
  );
}
