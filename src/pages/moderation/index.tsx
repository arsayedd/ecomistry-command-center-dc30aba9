
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModerationPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">موديريشن</h1>
        <Link to="/moderation/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة تقرير جديد
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تقارير الموديريشن</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">قريبًا سيتم تنفيذ صفحة الموديريشن بشكل كامل</p>
        </CardContent>
      </Card>
    </div>
  );
}
