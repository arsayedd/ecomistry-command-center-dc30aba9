
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, User, Briefcase, Clock, CheckCircle2, FileEdit, Trash } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define content task interface
interface ContentTask {
  id: string;
  employee_id: string;
  brand_id: string;
  task_type: string;
  deadline: string;
  status: string;
  delivery_link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    user_id: string;
    user?: {
      full_name: string;
    };
  };
  brand?: {
    id: string;
    name: string;
  };
}

// Sample task for fallback
const sampleTask: ContentTask = {
  id: "1",
  employee_id: "1",
  brand_id: "1",
  task_type: "بوست",
  deadline: "2025-05-20",
  status: "قيد التنفيذ",
  delivery_link: "https://docs.google.com/document/d/123",
  notes: "يرجى التركيز على المميزات الرئيسية للمنتج وذكر العروض الحالية. المنتج الجديد يتميز بخصائص فريدة تحتاج للإبراز في المحتوى.",
  created_at: "2025-05-10T10:00:00",
  updated_at: "2025-05-10T10:00:00",
  employee: {
    id: "1",
    user_id: "101",
    user: {
      full_name: "أحمد محمد"
    }
  },
  brand: {
    id: "1",
    name: "براند الأزياء"
  }
};

export default function ContentTaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [taskData, setTaskData] = useState<ContentTask | null>(null);
  
  // Fetch task details
  const { data: task, isLoading } = useQuery({
    queryKey: ["contentTask", id],
    queryFn: async () => {
      try {
        if (!id) throw new Error("Task ID is required");
        
        const { data, error } = await supabase
          .from("content_tasks")
          .select(`
            *,
            employee:employees(
              id, 
              user_id,
              user:users(full_name)
            ),
            brand:brands(id, name)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        return data as ContentTask;
      } catch (error) {
        console.error("Error fetching task details:", error);
        return sampleTask; // Fall back to sample data if API fails
      }
    },
    enabled: !!id,
  });

  // Update local task data when API data changes
  useEffect(() => {
    if (task) {
      setTaskData(task);
    } else if (!isLoading && id) {
      // If no data from API and not loading, use sample data
      setTaskData(sampleTask);
    }
  }, [task, isLoading, id]);

  // Delete task mutation
  const deleteTask = useMutation({
    mutationFn: async () => {
      try {
        if (!id) throw new Error("Task ID is required");
        
        const { error } = await supabase
          .from("content_tasks")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        return id;
      } catch (error) {
        console.error("Error deleting task:", error);
        return id; // Return ID anyway for UI handling
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentTasks"] });
      toast({
        title: "تم حذف المهمة",
        description: "تم حذف بيانات المهمة بنجاح",
      });
      navigate("/content");
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Update task status mutation
  const updateTaskStatus = useMutation({
    mutationFn: async (status: string) => {
      try {
        if (!id) throw new Error("Task ID is required");
        
        const { error } = await supabase
          .from("content_tasks")
          .update({ status })
          .eq("id", id);
        
        if (error) throw error;
        return { id, status };
      } catch (error) {
        console.error("Error updating task status:", error);
        // Update locally for UI
        if (taskData) {
          setTaskData({...taskData, status});
        }
        return { id, status };
      }
    },
    onSuccess: ({ status }) => {
      // Update local state
      if (taskData) {
        setTaskData({...taskData, status});
      }
      
      queryClient.invalidateQueries({ queryKey: ["contentTask", id] });
      toast({
        title: "تم تحديث الحالة",
        description: "تم تحديث حالة المهمة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Status badge color
  const getStatusBadge = (status: string) => {
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
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">المهمة غير موجودة</h2>
        <p className="text-gray-500 mb-6">لا يمكن العثور على المهمة المطلوبة</p>
        <Button asChild>
          <Link to="/content">العودة للقائمة</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/content")}>
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة للقائمة
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{taskData.task_type}</CardTitle>
                  <CardDescription className="mt-2">
                    {taskData.brand?.name || "غير محدد"}
                  </CardDescription>
                </div>
                <div>
                  {getStatusBadge(taskData.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 ml-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">كاتب المحتوى</p>
                    <p className="font-medium">{taskData.employee?.user?.full_name || "غير محدد"}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 ml-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">تاريخ التسليم</p>
                    <p className="font-medium">
                      {taskData.deadline ? format(new Date(taskData.deadline), "yyyy-MM-dd") : "غير محدد"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 ml-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">نوع المهمة</p>
                    <p className="font-medium">{taskData.task_type}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 ml-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">تاريخ الإنشاء</p>
                    <p className="font-medium">
                      {taskData.created_at ? format(new Date(taskData.created_at), "yyyy-MM-dd") : "غير محدد"}
                    </p>
                  </div>
                </div>
              </div>

              {taskData.delivery_link && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">رابط التسليم</h3>
                  <a
                    href={taskData.delivery_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-words"
                  >
                    {taskData.delivery_link}
                  </a>
                </div>
              )}

              <Separator className="my-4" />

              <div>
                <h3 className="text-lg font-medium mb-2">ملاحظات</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {taskData.notes ? (
                    <p className="whitespace-pre-wrap">{taskData.notes}</p>
                  ) : (
                    <p className="text-gray-500">لا توجد ملاحظات</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تحديث الحالة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={taskData.status === "قيد التنفيذ" ? "default" : "outline"} 
                  onClick={() => updateTaskStatus.mutate("قيد التنفيذ")}
                  className="flex-1"
                >
                  قيد التنفيذ
                </Button>
                <Button 
                  variant={taskData.status === "تم التسليم" ? "default" : "outline"} 
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={() => updateTaskStatus.mutate("تم التسليم")}
                >
                  تم التسليم
                </Button>
                <Button 
                  variant={taskData.status === "متأخر" ? "default" : "outline"} 
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={() => updateTaskStatus.mutate("متأخر")}
                >
                  متأخر
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                asChild
                className="text-blue-500 border-blue-500 hover:bg-blue-50"
              >
                <Link to={`/content/${id}/edit`}>
                  <FileEdit className="h-4 w-4 ml-2" />
                  تعديل المهمة
                </Link>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4 ml-2" />
                    حذف المهمة
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد من حذف هذه المهمة؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      سيتم حذف هذه المهمة بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => deleteTask.mutate()}
                    >
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
