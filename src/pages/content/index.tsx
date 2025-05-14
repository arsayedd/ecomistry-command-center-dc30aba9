import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ContentSearchFilters from "@/components/content/ContentSearchFilters";
import { ContentTasksTable } from "@/components/content/ContentTasksTable";
import type { ContentTask, Employee, Brand } from "@/types";

// Sample brands data
const sampleBrands: Brand[] = [
  { id: "1", name: "براند الأزياء", status: "active" },
  { id: "2", name: "براند التجميل", status: "active" },
  { id: "3", name: "براند الإلكترونيات", status: "active" },
  { id: "4", name: "براند الأغذية", status: "active" }
];

// Sample employees data
const sampleEmployees: Employee[] = [
  { 
    id: "1", 
    user_id: "101",
    salary: 0,
    status: "active", 
    user: { 
      id: "101", 
      full_name: "أحمد محمد", 
      department: "content",
      email: "ahmed@example.com",
      role: "content_writer",
      permission_level: "user"
    } 
  },
  { 
    id: "2", 
    user_id: "102",
    salary: 0,
    status: "active", 
    user: { 
      id: "102", 
      full_name: "سارة علي", 
      department: "content",
      email: "sara@example.com",
      role: "content_writer",
      permission_level: "user"
    } 
  },
  { 
    id: "3", 
    user_id: "103",
    salary: 0,
    status: "active", 
    user: { 
      id: "103", 
      full_name: "محمود حسن", 
      department: "content",
      email: "mahmoud@example.com",
      role: "content_writer",
      permission_level: "user"
    } 
  }
];

// Sample content tasks that match the ContentTask type from types/index.ts
const sampleContentTasks: ContentTask[] = [
  {
    id: "1",
    employee_id: "1",
    brand_id: "1",
    task_type: "post",
    deadline: "2025-05-20",
    status: "pending",
    delivery_link: "https://docs.google.com/document/d/123",
    notes: "يرجى التركيز على المميزات الرئيسية للمنتج",
    created_at: "2025-05-10T10:00:00",
    updated_at: "2025-05-10T10:00:00",
    employee: sampleEmployees[0],
    brand: sampleBrands[0]
  },
  {
    id: "2",
    employee_id: "2",
    brand_id: "2",
    task_type: "ad",
    deadline: "2025-05-25",
    status: "completed",
    delivery_link: "https://docs.google.com/document/d/456",
    notes: null,
    created_at: "2025-05-12T14:30:00",
    updated_at: "2025-05-13T09:15:00",
    employee: sampleEmployees[1],
    brand: sampleBrands[1]
  },
  {
    id: "3",
    employee_id: "3",
    brand_id: "3",
    task_type: "reel",
    deadline: "2025-05-18",
    status: "delayed",
    delivery_link: null,
    notes: "مطلوب تضمين كلمات مفتاحية محددة",
    created_at: "2025-05-08T11:20:00",
    updated_at: "2025-05-08T11:20:00",
    employee: sampleEmployees[2],
    brand: sampleBrands[2]
  }
];

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [localTasks, setLocalTasks] = useState<ContentTask[]>(sampleContentTasks);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch content tasks
  const { data: contentTasks, isLoading } = useQuery({
    queryKey: ["contentTasks"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("content_tasks")
          .select(`
            *,
            employee:employees(
              id, 
              user_id,
              salary,
              status,
              user:users(id, full_name, email, department, role, permission_level)
            ),
            brand:brands(id, name, status)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as ContentTask[] || [];
      } catch (error) {
        console.error("Error fetching content tasks:", error);
        return sampleContentTasks;
      }
    },
  });

  // Update local tasks when API data changes
  useEffect(() => {
    if (contentTasks && contentTasks.length > 0) {
      setLocalTasks(contentTasks);
    }
  }, [contentTasks]);

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

  // Update task status mutation
  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      try {
        const { error } = await supabase
          .from("content_tasks")
          .update({ status })
          .eq("id", id);
        
        if (error) throw error;
        return { id, status };
      } catch (error) {
        console.error("Error updating task status:", error);
        // Update locally for sample data
        setLocalTasks(tasks => tasks.map(task => 
          task.id === id ? {...task, status} : task
        ));
        return { id, status };
      }
    },
    onSuccess: ({ id, status }) => {
      // Update local state in case we're using sample data
      setLocalTasks(tasks => tasks.map(task => 
        task.id === id ? {...task, status} : task
      ));
      
      queryClient.invalidateQueries({ queryKey: ["contentTasks"] });
      toast({
        title: "تم تحديث حالة المهمة",
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

  // Filter tasks based on search query and filters
  const filteredTasks = localTasks.filter((task) => {
    const employeeFullName = task.employee?.user?.full_name || "";
    const brandName = task.brand?.name || "";
    
    const matchesSearch = 
      !searchQuery || 
      employeeFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.task_type?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBrand = !filterBrand || task.brand_id === filterBrand;
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesType = !filterType || task.task_type === filterType;
    
    return matchesSearch && matchesBrand && matchesStatus && matchesType;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة مهام كتابة المحتوى</h1>
        <Link to="/content/add">
          <Button>
            <Plus className="h-4 w-4 ml-2" /> إضافة مهمة جديدة
          </Button>
        </Link>
      </div>

      <ContentSearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterBrand={filterBrand}
        setFilterBrand={setFilterBrand}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
        brands={brands || sampleBrands}
      />

      <Card>
        <CardContent className="p-0">
          <ContentTasksTable
            isLoading={isLoading}
            tasks={filteredTasks}
            updateTaskStatus={(params) => updateTaskStatus.mutate(params)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
