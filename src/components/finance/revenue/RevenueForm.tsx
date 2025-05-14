import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Revenue, Brand } from "@/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  date: z.date({
    required_error: "يجب اختيار التاريخ",
  }),
  brand_id: z.string().min(1, { message: "يجب اختيار البراند" }),
  units_sold: z.number().int().min(1, { message: "يجب إدخال عدد القطع المباعة" }),
  unit_price: z.number().min(1, { message: "يجب إدخال سعر القطعة" }),
  total_revenue: z.number().min(0, { message: "يجب حساب إجمالي الإيراد" }),
  notes: z.string().optional(),
});

interface RevenueFormProps {
  onSave: (data: any) => void;
  initialData?: Revenue;
}

export default function RevenueForm({ onSave, initialData }: RevenueFormProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      date: initialData.date ? new Date(initialData.date) : undefined,
    } : {
      date: new Date(),
      brand_id: "",
      units_sold: 0,
      unit_price: 0,
      total_revenue: 0,
      notes: "",
    },
  });

  // Calculate total revenue when units_sold or unit_price changes
  const unitsSold = form.watch("units_sold");
  const unitPrice = form.watch("unit_price");

  useEffect(() => {
    const totalRevenue = unitsSold * unitPrice;
    form.setValue("total_revenue", totalRevenue);
  }, [unitsSold, unitPrice, form]);

  // Fetch brands
  useEffect(() => {
    async function fetchBrands() {
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("*");

        if (error) {
          throw error;
        }

        if (data) {
          // Cast the data to match the Brand type
          const typedBrands: Brand[] = data.map(brand => ({
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
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast({
          title: "خطأ في جلب بيانات البراندات",
          description: "حدث خطأ أثناء محاولة جلب بيانات البراندات.",
          variant: "destructive",
        });
      }
    }

    fetchBrands();
  }, [toast]);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Format the data for submission
      const formData = {
        date: format(values.date, "yyyy-MM-dd"),
        brand_id: values.brand_id,
        units_sold: values.units_sold,
        unit_price: values.unit_price,
        total_revenue: values.total_revenue,
        notes: values.notes,
      };
      
      // Insert into Supabase
      const { error } = await supabase
        .from("revenues")
        .insert([formData]);
        
      if (error) throw error;
      
      // Call the onSave callback with the form data
      onSave(formData);

      toast({
        title: "تم حفظ الإيراد بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving revenue:", error);
      toast({
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء محاولة حفظ بيانات الإيراد.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className={format(field.value, "PPP")}
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

              {/* Units Sold */}
              <FormField
                control={form.control}
                name="units_sold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد القطع المباعة</FormLabel>
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

              {/* Unit Price */}
              <FormField
                control={form.control}
                name="unit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سعر القطعة</FormLabel>
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

              {/* Total Revenue */}
              <FormField
                control={form.control}
                name="total_revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>إجمالي الإيراد</FormLabel>
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

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ملاحظات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل ملاحظاتك هنا..."
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ الإيراد"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
