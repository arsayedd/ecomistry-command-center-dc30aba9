
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// Sample brands
const sampleBrands = [
  { id: "1", name: "براند أزياء" },
  { id: "2", name: "براند تجميل" },
  { id: "3", name: "براند أغذية" }
];

// Sample employees
const sampleEmployees = [
  { id: "1", user: { full_name: "أحمد محمد" } },
  { id: "2", user: { full_name: "سارة أحمد" } },
  { id: "3", user: { full_name: "محمود علي" } }
];

const formSchema = z.object({
  category: z.string({
    required_error: "الرجاء اختيار نوع المصروف",
  }),
  amount: z.string().min(1, {
    message: "الرجاء إدخال المبلغ",
  }),
  date: z.date({
    required_error: "الرجاء اختيار التاريخ",
  }),
  brand_id: z.string().optional(),
  employee_id: z.string().optional(),
  description: z.string().optional(),
});

export default function AddExpensePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      amount: "",
      date: new Date(),
      description: "",
    },
  });

  // Fetch brands
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

  // Fetch employees
  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select(`
            id,
            user:users!inner(full_name)
          `);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching employees:", error);
        return sampleEmployees;
      }
    },
  });

  // Create expense mutation
  const createExpense = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      try {
        const { data, error } = await supabase
          .from("expenses")
          .insert([
            {
              category: values.category,
              amount: parseFloat(values.amount),
              date: format(values.date, "yyyy-MM-dd"),
              brand_id: values.brand_id || null,
              employee_id: values.employee_id || null,
              description: values.description || null,
            },
          ])
          .select();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error creating expense:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة المصروف بنجاح",
      });
      navigate("/finance");
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createExpense.mutate(values);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إضافة مصروف جديد</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات المصروف</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع المصروف</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع المصروف" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="مرتبات">مرتبات</SelectItem>
                          <SelectItem value="إعلانات">إعلانات</SelectItem>
                          <SelectItem value="إيجار">إيجار</SelectItem>
                          <SelectItem value="مستلزمات">مستلزمات</SelectItem>
                          <SelectItem value="أخرى">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المبلغ (جنيه)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="أدخل المبلغ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>التاريخ</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-right font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span>اختر التاريخ</span>
                              )}
                              <CalendarIcon className="mr-auto h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البراند المرتبط (اختياري)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر البراند" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">بدون ارتباط</SelectItem>
                          {(brands || sampleBrands)?.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموظف المسؤول (اختياري)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الموظف" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">بدون موظف</SelectItem>
                          {(employees || sampleEmployees)?.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.user?.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف (اختياري)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل وصف المصروف"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={createExpense.isPending}
                >
                  {createExpense.isPending ? "جاري الحفظ..." : "حفظ المصروف"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
