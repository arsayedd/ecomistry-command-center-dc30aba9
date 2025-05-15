
import React from "react";
import { useNavigate } from "react-router-dom";
import ModerationReportForm from "@/components/moderation/ModerationReportForm";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function AddModerationReportPage() {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate("/moderation");
  };

  return (
    <div dir="rtl" className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleNavigateBack}
          className="mb-2"
        >
          <ChevronRight className="ml-2 h-4 w-4" />
          العودة إلى تقارير التنسيق
        </Button>
        <h1 className="text-3xl font-bold">إضافة تقرير تنسيق جديد</h1>
      </div>

      <ModerationReportForm 
        onSave={() => {
          navigate("/moderation");
        }} 
      />
    </div>
  );
}
