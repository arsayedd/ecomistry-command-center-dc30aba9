
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Brand, Revenue } from "@/types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Form schema with validation
export const revenueFormSchema = z.object({
  date: z.date({
    required_error: "يجب اختيار التاريخ",
  }),
  brand_id: z.string().min(1, { message: "يجب اختيار البراند" }),
  units_sold: z.number().int().min(1, { message: "يجب إدخال عدد القطع المباعة" }),
  unit_price: z.number().min(1, { message: "يجب إدخال سعر القطعة" }),
  total_revenue: z.number().min(0, { message: "يجب حساب إجمالي الإيراد" }),
  notes: z.string().optional(),
});

export type RevenueFormValues = z.infer<typeof revenueFormSchema>;

export function useRevenueForm(initialData?: Revenue) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form with default values or initial data
  const form = useForm<RevenueFormValues>({
    resolver: zodResolver(revenueFormSchema),
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

  // Watch for changes to calculate total
  const unitsSold = form.watch("units_sold");
  const unitPrice = form.watch("unit_price");

  // Calculate total revenue when units_sold or unit_price changes
  useEffect(() => {
    const totalRevenue = unitsSold * unitPrice;
    form.setValue("total_revenue", totalRevenue);
  }, [unitsSold, unitPrice, form]);

  // Fetch brands from Supabase
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
          const typedBrands: Brand[] = data.map(brand => {
            let socialLinks = {};
            
            // Type-safely handle social_links if it exists and is an object
            if (brand.social_links && typeof brand.social_links === 'object') {
              const links = brand.social_links as Record<string, unknown>;
              socialLinks = {
                instagram: typeof links.instagram === 'string' ? links.instagram : '',
                facebook: typeof links.facebook === 'string' ? links.facebook : '',
                tiktok: typeof links.tiktok === 'string' ? links.tiktok : '',
                youtube: typeof links.youtube === 'string' ? links.youtube : '',
                linkedin: typeof links.linkedin === 'string' ? links.linkedin : '',
                website: typeof links.website === 'string' ? links.website : '',
              };
            }
            
            return {
              id: brand.id,
              name: brand.name,
              status: (brand.status || "active") as Brand['status'],
              product_type: brand.product_type || "",
              logo_url: brand.logo_url || "", // Add the logo_url field
              social_links: socialLinks,
              created_at: brand.created_at || '',
              updated_at: brand.updated_at || ''
            };
          });
          
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

  // Submit handler
  const handleSubmit = async (values: RevenueFormValues) => {
    setIsSubmitting(true);
    try {
      // Format the data for submission
      const formData = {
        date: format(values.date, "yyyy-MM-dd"),
        brand_id: values.brand_id,
        pieces_sold: values.units_sold,
        price_per_piece: values.unit_price,
        total_revenue: values.total_revenue,
        notes: values.notes,
      };
      
      // Insert into Supabase
      const { error } = await supabase
        .from("revenues")
        .insert(formData);
        
      if (error) throw error;
      
      toast({
        title: "تم حفظ الإيراد بنجاح",
        variant: "default",
      });
      
      // Reset form after successful submission
      form.reset({
        date: new Date(),
        brand_id: "",
        units_sold: 0,
        unit_price: 0,
        total_revenue: 0,
        notes: "",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving revenue:", error);
      toast({
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء محاولة حفظ بيانات الإيراد.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    brands,
    isSubmitting,
    handleSubmit
  };
}
