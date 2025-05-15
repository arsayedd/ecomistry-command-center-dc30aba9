
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaBuyingItem } from "@/types";
import { calculateMediaBuyingMetrics } from "@/utils/mediaBuyingUtils";

interface MediaBuyingDashboardProps {
  data: MediaBuyingItem[];
}

export default function MediaBuyingDashboard({ data }: MediaBuyingDashboardProps) {
  const metrics = calculateMediaBuyingMetrics(data);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            إجمالي الإنفاق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(metrics.totalSpend)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            إجمالي الطلبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.totalOrders}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            متوسط تكلفة الطلب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(metrics.averageCPP)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            متوسط العائد على الإنفاق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.averageROAS.toFixed(2)}x
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
