
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import { Brand } from '@/types';

const formSchema = z.object({
  date: z.date(),
  brand_id: z.string().min(1, { message: "يرجى اختيار البراند" }),
  pieces_sold: z.number().positive({ message: "يجب أن تكون القيمة رقم موجب" }),
  price_per_piece: z.number().positive({ message: "يجب أن تكون القيمة رقم موجب" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddRevenuePage = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      brand_id: '',
      pieces_sold: 0,
      price_per_piece: 0,
      notes: '',
    }
  });

  // Watch values to calculate total
  const piecesCount = form.watch('pieces_sold');
  const pricePerPiece = form.watch('price_per_piece');
  const totalRevenue = piecesCount * pricePerPiece;

  // Fetch brands
  useState(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        const { data: brandsData, error } = await supabase
          .from('brands')
          .select('*');
          
        if (error) throw error;
        setBrands(brandsData || []);
        
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast.error('حدث خطأ أثناء تحميل بيانات البراندات');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBrands();
  }, []);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Calculate total revenue
      const total = data.pieces_sold * data.price_per_piece;
      
      // Insert revenue into database
      const { data: revenue, error } = await supabase
        .from('revenues')
        .insert({
          date: format(data.date, 'yyyy-MM-dd'),
          brand_id: data.brand_id,
          pieces_sold: data.pieces_sold,
          price_per_piece: data.price_per_piece,
          total_revenue: total,
          notes: data.notes || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('تم إضافة الإيراد بنجاح');
      navigate('/finance');
    } catch (error: any) {
      console.error('Error adding revenue:', error);
      toast.error(error.message || 'حدث خطأ أثناء حفظ الإيراد');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إضافة إيراد جديد</h1>
        <p className="text-gray-600">أدخل بيانات الإيراد</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              "text-right w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isLoading}
                          >
                            {field.value ? (
                              format(field.value, "yyyy-MM-dd")
                            ) : (
                              <span>اختر تاريخ</span>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
                    <FormLabel>اسم البراند</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="text-right">
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pieces_sold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد القطع المباعة</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="أدخل عدد القطع" 
                        className="text-right"
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price_per_piece"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سعر القطعة (ج.م)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="أدخل سعر القطعة" 
                        className="text-right"
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ملاحظات (اختياري)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="أدخل ملاحظات الإيراد" 
                        className="resize-none text-right"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-900 mb-2">إجمالي الإيراد</h3>
                <div className="text-3xl font-bold text-green-700">
                  {totalRevenue.toLocaleString()} ج.م
                </div>
                <p className="text-sm text-green-600 mt-1">
                  {piecesCount} قطعة × {pricePerPiece} ج.م
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 rtl:space-x-reverse">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/finance')}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ الإيراد'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddRevenuePage;
