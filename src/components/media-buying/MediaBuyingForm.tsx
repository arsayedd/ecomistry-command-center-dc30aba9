
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MediaBuyingRecord, Brand, User } from "@/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  platform: z.enum(["facebook", "instagram", "tiktok", "google", "other"]),
  date: z.date({
    required_error: "التاريخ مطلوب",
  }),
  brand_id: z.string().min(1, { message: "يجب اختيار البراند" }),
  employee_id: z.string().optional(),
  spend: z.number().min(0, { message: "يجب أن يكون الإنفاق أكبر من أو يساوي 0" }),
  orders_count: z.number().int().min(0, { message: "يجب أن يكون عدد الطلبات أكبر من أو يساوي 0" }),
  order_cost: z.number().optional(),
  roas: z.number().optional(),
  campaign_link: z.string().optional(),
  notes: z.string().optional(),
});

interface MediaBuyingFormProps {
  onSave: (data: any) => void;
  initialData?: MediaBuyingRecord;
}

export default function MediaBuyingForm({ onSave, initialData }: MediaBuyingFormProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      date: initialData.date ? new Date(initialData.date) : undefined,
      employee_id: initialData.employee_id || "",
      spend: initialData.spend,
      orders_count: initialData.orders_count,
      order_cost: initialData.order_cost || 0,
      roas: initialData.roas || 0,
      campaign_link: initialData.campaign_link || "",
      notes: initialData.notes || "",
    } : {
      platform: "facebook",
      date: new Date(),
      brand_id: "",
      employee_id: "",
      spend: 0,
      orders_count: 0,
      order_cost: 0,
      roas: 0,
      campaign_link: "",
      notes: "",
    },
  });

  // Calculate CPP (Cost Per Purchase) when spend or orders count changes
  const spend = form.watch("spend");
  const ordersCount = form.watch("orders_count");

  useEffect(() => {
    if (ordersCount > 0) {
      const cpp = spend / ordersCount;
      form.setValue("order_cost", cpp);
    } else {
      form.setValue("order_cost", 0);
    }
  }, [spend, ordersCount, form]);

  // Fetch brands and employees from the database
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("*");

        if (brandsError) throw brandsError;
        if (brandsData) {
          // Cast the data to match the Brand type
          const typedBrands = brandsData.map(brand => ({
            ...brand,
            status: (brand.status || "active") as "active" | "inactive" | "pending",
            vertical: brand.vertical as "fashion" | "beauty" | "food" | "tech" | "home" | "travel" | "other",
            social_links: brand.social_links as {
              instagram?: string;
              facebook?: string;
              tiktok?: string;
              youtube?: string;
              linkedin?: string;
              website?: string;
            }
          }));
          
          setBrands(typedBrands);
        }

        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
          .from("users")
          .select("*")
          .eq("department", "media_buying");

        if (employeesError) throw employeesError;
        if (employeesData) {
          // Cast the data to match User type
          const typedEmployees = employeesData.map(emp => ({
            ...emp,
            employment_type: (emp.employment_type || "full_time") as "full_time" | "part_time" | "freelancer" | "per_piece",
            salary_type: (emp.salary_type || "monthly") as "monthly" | "hourly" | "per_task",
            status: (emp.status || "active") as "active" | "inactive" | "trial",
            access_rights: (emp.access_rights || "view") as "view" | "add" | "edit" | "full_manage"
          }));
          
          setEmployees(typedEmployees);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء محاولة جلب البراندات والموظفين.",
          variant: "destructive",
        });
      }
    }

    fetchData();
  }, [toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const formData = {
        platform: values.platform,
        date: format(values.date, "yyyy-MM-dd"),
        brand_id: values.brand_id,
        employee_id: values.employee_id || null,
        spend: values.spend,
        orders_count: values.orders_count,
        order_cost: values.order_cost || null,
        roas: values.roas || null,
        campaign_link: values.campaign_link || null,
        notes: values.notes || null
      };

      // Try to insert or update in the database
      if (initialData?.id) {
        // Update existing record
        const { error } = await supabase
          .from("media_buying")
          .update(formData)
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("media_buying")
          .insert([formData]);

        if (error) throw error;
      }

      // Call the onSave callback
      onSave(formData);

      toast({
        title: "تم حفظ بيانات الحملة الإعلانية بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving media buying record:", error);
      toast({
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء محاولة حفظ بيانات الحملة الإعلانية.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platform */}
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المنصة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المنصة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="facebook">فيسبوك</SelectItem>
                        <SelectItem value="instagram">إنستجرام</SelectItem>
                        <SelectItem value="tiktok">تيك توك</SelectItem>
                        <SelectItem value="google">جوجل</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
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
                            className={`w-full pl-3 text-right font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>اختر التاريخ</span>
                            )}
                            <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Brand Selection */}
              <FormField
                control={form.control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البراند</FormLabel>
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
                        {brands.map((brand) => (
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

              {/* Employee Selection */}
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الموظف المسؤول</FormLabel>
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
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Spend */}
              <FormField
                control={form.control}
                name="spend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مبلغ الإنفاق الإعلاني</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Orders Count */}
              <FormField
                control={form.control}
                name="orders_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الطلبات</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order Cost (CPP) */}
              <FormField
                control={form.control}
                name="order_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تكلفة الطلب (CPP)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ROAS */}
              <FormField
                control={form.control}
                name="roas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العائد على الإنفاق الإعلاني (ROAS)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campaign Link */}
              <FormField
                control={form.control}
                name="campaign_link"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>رابط الحملة الإعلانية</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل رابط الحملة الإعلانية..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>ملاحظات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل ملاحظات إضافية هنا..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ البيانات"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
