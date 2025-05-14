
import { useState } from "react";
import { Link } from "react-router-dom";
import { Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DatabasePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">قاعدة البيانات</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إدارة قاعدة البيانات</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <Database className="h-16 w-16 text-green-500" />
          </div>
          <p className="text-gray-500">قريبًا سيتم تنفيذ صفحة إدارة قاعدة البيانات بشكل كامل</p>
        </CardContent>
      </Card>
    </div>
  );
}
