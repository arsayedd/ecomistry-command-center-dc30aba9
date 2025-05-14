
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, Upload, X } from "lucide-react";
import type { Brand } from "@/types";

interface BrandFormProps {
  initialData?: Partial<Brand>;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "اسم البراند مطلوب ويجب أن يكون أكثر من حرفين" }),
  product_type: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]).default("active"),
  social_links: z.object({
    facebook: z.string().url({ message: "يجب أن يكون رابط صحيح" }).optional().or(z.literal("")),
    instagram: z.string().url({ message: "يجب أن يكون رابط صحيح" }).optional().or(z.literal("")),
    tiktok: z.string().url({ message: "يجب أن يكون رابط صحيح" }).optional().or(z.literal("")),
    website: z.string().url({ message: "يجب أن يكون رابط صحيح" }).optional().or(z.literal("")),
  }).optional(),
  notes: z.string().optional(),
});

export function BrandForm({ initialData = {}, onSubmit, isSubmitting = false }: BrandFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData.logo_url || null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || "",
      product_type: initialData.product_type || "",
      description: initialData.description || "",
      status: (initialData.status as "active" | "inactive" | "pending") || "active",
      social_links: initialData.social_links || {
        facebook: "",
        instagram: "",
        tiktok: "",
        website: "",
      },
      notes: initialData.notes || "",
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, this would upload to Supabase Storage
      // and then update the form with the logo URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveLogo = () => {
    setLogoPreview(null);
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = {
      ...values,
      logo_url: logoPreview,
    };
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم البراند *</FormLabel>
                <FormControl>
                  <Input placeholder="اسم البراند" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="product_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>فئة المنتج</FormLabel>
                <FormControl>
                  <Input placeholder="فئة المنتج" {...field} />
                </FormControl>
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
              <FormLabel>وصف مختصر</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="وصف مختصر للبراند" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>حالة البراند</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالة البراند" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="inactive">موقف</SelectItem>
                  <SelectItem value="pending">تحت الإنشاء</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">روابط السوشيال ميديا</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="social_links.facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>فيسبوك</FormLabel>
                  <FormControl>
                    <Input placeholder="رابط صفحة الفيسبوك" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="social_links.instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>انستجرام</FormLabel>
                  <FormControl>
                    <Input placeholder="رابط حساب الانستجرام" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="social_links.tiktok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تيك توك</FormLabel>
                  <FormControl>
                    <Input placeholder="رابط حساب تيك توك" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="social_links.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الموقع الإلكتروني</FormLabel>
                  <FormControl>
                    <Input placeholder="رابط الموقع الإلكتروني" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">لوجو البراند</h3>
          <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
            {logoPreview ? (
              <div className="relative w-full max-w-xs">
                <img 
                  src={logoPreview} 
                  alt="Brand Logo Preview" 
                  className="h-40 w-full object-contain rounded-md" 
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleRemoveLogo}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="p-4 bg-muted rounded-full">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">اضغط لرفع لوجو</p>
                  <p className="text-xs text-muted-foreground">أو اسحب وأفلت</p>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                  onChange={handleLogoUpload}
                />
                <label htmlFor="logo-upload">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" /> اختيار ملف
                  </Button>
                </label>
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات / توجيهات</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="ملاحظات أو توجيهات خاصة بالبراند" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ البراند"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
