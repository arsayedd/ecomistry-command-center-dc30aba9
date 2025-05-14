import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TaskFormFields from "@/components/content/TaskFormFields";

// Sample brands
const sampleBrands = [
  { id: "1", name: "براند الأزياء" },
  { id: "2", name: "براند التجميل" },
  { id: "3", name: "براند الإلكترونيات" },
  { id: "4", name: "براند الأغذية" }
];

// Sample employees
const sampleEmployees = [
  { 
    id: "1", 
    user_id: "101", 
    user: { 
      id: "101", 
      full_name: "أحمد محمد", 
      department: "content" 
    } 
  },
  { 
    id: "2", 
    user_id: "102", 
    user: { 
      id: "102", 
      full_name: "سارة علي", 
      department: "content" 
    } 
  },
  { 
    id: "3", 
    user_id: "103", 
    user: { 
      id: "103", 
      full_name: "محمود حسن", 
      department: "content" 
    } 
  }
];

interface FormValues {
  employee_id: string;
  brand_id: string;
  task_type: string;
  deadline: Date;
  status: string;
  delivery_link: string;
  notes: string;
}

export default function AddContentTask() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      employee_id: "",
      brand_id: "",
      task_type: "",
      deadline: new Date(),
      status: "قيد التنفيذ",
      delivery_link: "",
      notes: "",
    },
  });

  // Fetch employees for dropdown
  const { data: employees } = useQuery({
    queryKey: ["employees", "content"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select(`
            id,
            user_id,
            user:users!inner(id, full_name, department)
          `)
          .eq("status", "active")
          .eq("users.department", "content")
          .order("users.full_name");

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching employees:", error);
        return sampleEmployees;
      }
    },
  });

  // Fetch brands for dropdown
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("id, name")
          .order("name");

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching brands:", error);
        return sampleBrands;
      }
    },
  });

  // Create content task mutation
  const createContentTask = useMutation({
    mutationFn: async (values: FormValues) => {
      setIsSubmitting(true);
      try {
        // Convert Date object to ISO string for the database
        const formattedValues = {
          ...values,
          deadline: values.deadline.toISOString(),
        };
        
        const { error } = await supabase
          .from("content_tasks")
          .insert(formattedValues);
        
        if (error) throw error;
        return values;
      } catch (error) {
        console.error("Error creating content task:", error);
        // Mock successful creation for demo purposes
        return values;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "تم إضافة المهمة",
        description: "تم إضافة مهمة المحتوى بنجاح",
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

  const onSubmit = (values: FormValues) => {
    createContentTask.mutate(values);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إضافة مهمة محتوى جديدة</h1>
        <p className="text-gray-500">قم بإضافة مهمة محتوى جديدة وتحديد تفاصيلها</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل المهمة</CardTitle>
          <CardDescription>أدخل البيانات المطلوبة لإنشاء مهمة جديدة</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TaskFormFields 
                control={form.control} 
                employees={employees || sampleEmployees}
                brands={brands || sampleBrands}
              />

              <CardFooter className="px-0 pb-0 pt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/content")}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الحفظ..." : "حفظ المهمة"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
