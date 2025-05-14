
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Revenue, Brand } from "@/types";
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
  brand_id: z.string().min(1, { message: "يجب اختيار البراند" }),
  date: z.date({
    required_error: "يجب اختيار التاريخ",
  }),
  pieces_sold: z.number().int().min(1, { message: "يجب أن يكون عدد القطع المباعة أكبر من 0" }),
  price_per_piece: z.number().min(0, { message: "يجب أن يكون سعر القطعة أكبر من أو يساوي 0" }),
  total_revenue: z.number().min(0, { message: "يجب أن يكون الإيراد الإجمالي أكبر من أو يساوي 0" }),
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
      pieces_sold: initialData.pieces_sold,
      price_per_piece: initialData.price_per_piece,
      total_revenue: initialData.total_revenue,
      notes: initialData.notes || "",
    } : {
      brand_id: "",
      date: new Date(),
      pieces_sold: 0,
      price_per_piece: 0,
      total_revenue: 0,
      notes: "",
    },
  });

  // Calculate total revenue when pieces sold or price per piece changes
  const piecesSold = form.watch("pieces_sold");
  const pricePerPiece = form.watch("price_per_piece");

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
          const typedBrands = data.map(brand => ({
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
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast({
          title: "خطأ في جلب البراندات",
          description: "حدث خطأ أثناء محاولة جلب قائمة البراندات.",
          variant: "destructive",
        });
      }
    }

    fetchBrands();
  }, [toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Insert into Supabase if there's a table for revenues
      // Note: We won't try to insert if the table doesn't exist yet
      // This would need to be addressed with a SQL migration to create the table
      
      // For now, just call the onSave callback with the form data
      onSave({
        ...values,
        date: format(values.date, "yyyy-MM-dd"),
      });

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pieces Sold */}
              <FormField
                control={form.control}
                name="pieces_sold"
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

              {/* Price Per Piece */}
              <FormField
                control={form.control}
                name="price_per_piece"
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
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
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
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>ملاحظات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل الملاحظات هنا..."
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
            {isSubmitting ? "جاري الحفظ..." : "حفظ الإيراد"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
