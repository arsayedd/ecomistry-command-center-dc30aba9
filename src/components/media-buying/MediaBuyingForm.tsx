import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brand, MediaBuying, User } from "@/types";

const formSchema = z.object({
  platform: z.string().min(1, { message: "يجب تحديد المنصة" }),
  campaign_date: z.date({
    required_error: "يجب اختيار تاريخ الحملة",
  }),
  brand_id: z.string().min(1, { message: "يجب اختيار البراند" }),
  employee_id: z.string().min(1, { message: "يجب اختيار الموظف المسؤول" }),
  ad_spend: z.number().min(0, { message: "يجب إدخال مبلغ الإنفاق الإعلاني" }),
  orders_count: z.number().int().min(0, { message: "يجب إدخال عدد الأوردرات" }),
  cpp: z.number().min(0).optional(),
  roas: z.number().min(0).optional(),
  campaign_link: z.string().optional(),
  notes: z.string().optional(),
});

interface MediaBuyingFormProps {
  initialData?: MediaBuying;
  onSubmit: (data: MediaBuying) => void;
}

export default function MediaBuyingForm({ initialData, onSubmit }: MediaBuyingFormProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      campaign_date: initialData.campaign_date ? new Date(initialData.campaign_date) : new Date(),
      ad_spend: initialData.ad_spend,
      orders_count: initialData.orders_count,
      cpp: initialData.cpp,
      roas: initialData.roas,
    } : {
      platform: "",
      campaign_date: new Date(),
      brand_id: "",
      employee_id: "",
      ad_spend: 0,
      orders_count: 0,
      cpp: 0,
      roas: 0,
      campaign_link: "",
      notes: "",
    },
  });

  // Calculate CPP when ad_spend or orders_count changes
  const adSpend = form.watch("ad_spend");
  const ordersCount = form.watch("orders_count");

  useEffect(() => {
    if (ordersCount > 0) {
      const cpp = adSpend / ordersCount;
      form.setValue("cpp", parseFloat(cpp.toFixed(2)));
    } else {
      form.setValue("cpp", 0);
    }
  }, [adSpend, ordersCount, form]);

  // Fetch brands and employees data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("*")
          .eq("status", "active");

        if (brandsError) throw brandsError;
        
        if (brandsData) {
          // Cast the data to match the Brand type
          const typedBrands: Brand[] = brandsData.map(brand => ({
            id: brand.id,
            name: brand.name,
            status: (brand.status || "active") as Brand['status'],
            product_type: brand.product_type || "",
            social_links: brand.social_links || {},
            created_at: brand.created_at || '',
            updated_at: brand.updated_at || ''
          }));
          
          setBrands(typedBrands);
        }

        // Fetch employees from media_buying department
        const { data: employeesData, error: employeesError } = await supabase
          .from("users")
          .select("*")
          .eq("department", "media_buying");

        if (employeesError) throw employeesError;
        
        if (employeesData) {
          // Cast the data to match User type
          const typedEmployees: User[] = employeesData.map(emp => ({
            id: emp.id,
            email: emp.email || '',
            full_name: emp.full_name || '',
            phone: emp.phone || '',
            department: emp.department || '',
            role: emp.role || '',
            employment_type: (emp.employment_type || 'full_time') as User['employment_type'],
            salary_type: (emp.salary_type || 'monthly') as User['salary_type'],
            status: (emp.status || 'active') as User['status'],
            access_rights: (emp.access_rights || 'view') as User['access_rights'],
            commission_type: (emp.commission_type || 'percentage') as User['commission_type'],
            commission_value: emp.commission_value || 0,
            created_at: emp.created_at || '',
            updated_at: emp.updated_at || ''
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

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      // Format the data for submission
      const formData = {
        ...values,
        campaign_date: format(values.campaign_date, "yyyy-MM-dd"),
        created_at: new Date().toISOString(),
      };
      
      // If editing, update the record, otherwise insert
      if (initialData?.id) {
        const { error } = await supabase
          .from("media_buying")
          .update(formData)
          .eq("id", initialData.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("media_buying")
          .insert([formData]);
          
        if (error) throw error;
      }
      
      // Call the onSubmit callback with the form data
      onSubmit(formData as unknown as MediaBuying);

      toast({
        title: initialData ? "تم تحديث الحملة بنجاح" : "تم إضافة الحملة بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving media buying data:", error);
      toast({
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء محاولة حفظ بيانات الحملة الإعلانية.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platform Selection */}
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

              {/* Campaign Date */}
              <FormField
                control={form.control}
                name="campaign_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ الحملة</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>اختر التاريخ</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
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

              {/* Ad Spend */}
              <FormField
                control={form.control}
                name="ad_spend"
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
                    <FormLabel>عدد الأوردرات</FormLabel>
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

              {/* CPP (Calculated) */}
              <FormField
                control={form.control}
                name="cpp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPP (تكلفة الأوردر)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
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
                    <FormLabel>ROAS (عائد الإنفاق الإعلاني)</FormLabel>
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
                  <FormItem>
                    <FormLabel>رابط الحملة</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                      />
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
                  <FormItem>
                    <FormLabel>ملاحظات</FormLabel>
                    <FormControl>
                      <Textarea
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
          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ الحملة"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
