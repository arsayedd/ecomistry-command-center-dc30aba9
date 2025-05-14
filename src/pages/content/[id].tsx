
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Edit, FileText, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/integrations/supabase/client";

export default function ContentTaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch content task details
  const { data: task, isLoading, error } = useQuery({
    queryKey: ["contentTask", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_tasks")
        .select(`
          *,
          employee:employees(
            id, 
            salary,
            commission_type,
            commission_value,
            user_id,
            user:users(full_name, email, department, role)
          ),
          brand:brands(
            id, 
            name, 
            product_type,
            status
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "قيد التنفيذ":
        return <Badge className="bg-yellow-500">قيد التنفيذ</Badge>;
      case "تم التسليم":
        return <Badge className="bg-green-500">تم التسليم</Badge>;
      case "متأخر":
        return <Badge className="bg-red-500">متأخر</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center">
        جاري التحميل...
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">خطأ في تحميل بيانات المهمة</h2>
        <p className="text-gray-500 mb-6">{error?.message || "لم يتم العثور على المهمة"}</p>
        <Button onClick={() => navigate("/content")}>
          العودة إلى قائمة المهمات
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/content")}
          className="ml-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">تفاصيل مهمة المحتوى</h1>
          <p className="text-gray-500">
            {task.task_type} - {task.brand?.name}
          </p>
        </div>
        <div className="mr-auto">
          <Link to={`/content/${id}/edit`}>
            <Button variant="outline" className="flex items-center">
              <Edit className="h-4 w-4 ml-2" />
              تعديل المهمة
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">تفاصيل المهمة</TabsTrigger>
              <TabsTrigger value="notes">الملاحظات والتعديلات</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات المهمة</CardTitle>
                  <CardDescription>التفاصيل الأساسية للمهمة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">نوع المهمة</h3>
                      <p className="mt-1 text-base">{task.task_type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">الحالة</h3>
                      <p className="mt-1">{getStatusBadge(task.status)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">تاريخ التسليم المتوقع</h3>
                      <p className="mt-1 text-base flex items-center">
                        <Calendar className="h-4 w-4 ml-2 text-gray-400" />
                        {task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd") : "غير محدد"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">تاريخ الإنشاء</h3>
                      <p className="mt-1 text-base">
                        {task.created_at ? format(new Date(task.created_at), "yyyy-MM-dd") : "غير محدد"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">رابط التسليم / المستند</h3>
                    {task.delivery_link ? (
                      <a
                        href={task.delivery_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        <LinkIcon className="h-4 w-4 ml-2" />
                        فتح الرابط
                      </a>
                    ) : (
                      <p className="text-gray-400">لم يتم إضافة رابط بعد</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>الملاحظات والتعديلات</CardTitle>
                  <CardDescription>ملاحظات وتعديلات مطلوبة على المحتوى</CardDescription>
                </CardHeader>
                <CardContent>
                  {task.notes ? (
                    <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                      {task.notes}
                    </div>
                  ) : (
                    <p className="text-gray-400">لا توجد ملاحظات</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>معلومات الكاتب والبراند</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">الكاتب</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium">{task.employee?.user?.full_name || "غير محدد"}</p>
                  <p className="text-sm text-gray-500">
                    {task.employee?.user?.email || ""}
                  </p>
                  <p className="text-sm text-gray-500">
                    {task.employee?.user?.department || ""}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">البراند</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium">{task.brand?.name || "غير محدد"}</p>
                  <p className="text-sm text-gray-500">
                    النوع: {task.brand?.product_type || "غير محدد"}
                  </p>
                  <p className="text-sm text-gray-500">
                    الحالة: {task.brand?.status || "غير محدد"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
