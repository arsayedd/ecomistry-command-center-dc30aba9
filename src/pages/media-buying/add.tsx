
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Brand } from '@/types';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  platform: z.string().min(1, { message: 'يرجى اختيار المنصة' }),
  date: z.date({ required_error: 'يرجى اختيار التاريخ' }),
  brand_id: z.string().min(1, { message: 'يرجى اختيار البراند' }),
  employee_id: z.string().optional(),
  spend: z.number().positive({ message: 'يجب أن يكون الإنفاق أكبر من صفر' }),
  orders_count: z.number().nonnegative({ message: 'يجب أن يكون عدد الأوردرات صفر أو أكبر' }),
  order_cost: z.number().optional(),
  roas: z.number().optional(),
  campaign_link: z.string().url({ message: 'يرجى إدخال رابط صحيح' }).optional().or(z.literal('')),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddMediaBuyingPage = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [users, setUsers] = useState<{ id: string; full_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: '',
      date: new Date(),
      brand_id: '',
      employee_id: '',
      spend: 0,
      orders_count: 0,
      order_cost: 0,
      roas: 0,
      campaign_link: '',
      notes: '',
    },
  });
  
  // Watch values for calculating CPP and ROAS
  const spend = form.watch('spend');
  const ordersCount = form.watch('orders_count');
  
  // Auto-calculate CPP (Cost Per Purchase)
  const cpp = ordersCount > 0 ? spend / ordersCount : 0;
  
  // Fetch brands and employees
  useState(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('*')
          .order('name', { ascending: true });
          
        if (brandsError) throw brandsError;
        setBrands(brandsData || []);
        
        // Fetch media buying employees
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name')
          .eq('department', 'media_buying')
          .order('full_name', { ascending: true });
          
        if (usersError) throw usersError;
        setUsers(usersData || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Auto-calculate CPP if not provided
      const orderCost = values.order_cost || (values.orders_count > 0 ? values.spend / values.orders_count : 0);
      
      // Insert media buying record into database
      const { error } = await supabase
        .from('media_buying')
        .insert({
          platform: values.platform,
          date: format(values.date, 'yyyy-MM-dd'),
          brand_id: values.brand_id,
          employee_id: values.employee_id || null,
          spend: values.spend,
          orders_count: values.orders_count,
          order_cost: orderCost,
          roas: values.roas || 0,
          campaign_link: values.campaign_link || null,
          notes: values.notes || null,
        });
      
      if (error) throw error;
      
      toast.success('تم إضافة بيانات الإعلان بنجاح');
      navigate('/media-buying');
      
    } catch (error: any) {
      console.error('Error adding media buying record:', error);
      toast.error(error.message || 'حدث خطأ أثناء حفظ بيانات الإعلان');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إضافة حملة إعلانية جديدة</h1>
        <p className="text-gray-600">أدخل بيانات الحملة الإعلانية الجديدة</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المنصة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر المنصة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="facebook">فيسبوك</SelectItem>
                        <SelectItem value="instagram">إنستجرام</SelectItem>
                        <SelectItem value="tiktok">تيك توك</SelectItem>
                        <SelectItem value="google">جوجل</SelectItem>
                        <SelectItem value="other">منصة أخرى</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FormLabel>البراند</FormLabel>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الموظف المسؤول (اختياري)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر الموظف" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">بدون تحديد موظف</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name}
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
                name="spend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإنفاق الإعلاني (ج.م)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="text-right" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="orders_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الأوردرات</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="text-right" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900">CPP (يتم حسابه تلقائيًا)</h3>
                <div className="text-2xl font-bold text-blue-700 mt-2">
                  {cpp.toFixed(2)} ج.م
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  الإنفاق: {spend} ج.م / عدد الأوردرات: {ordersCount}
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="roas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ROAS (العائد على الإنفاق الإعلاني)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="text-right" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      يمكنك إدخاله يدويًا إذا كان معروفًا
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="campaign_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط الحملة (اختياري)</FormLabel>
                    <FormControl>
                      <Input 
                        className="text-right" 
                        {...field}
                        placeholder="https://..."
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="resize-none text-right" 
                      {...field}
                      placeholder="أية ملاحظات إضافية حول الحملة الإعلانية"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4 rtl:space-x-reverse">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/media-buying')}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ الحملة الإعلانية'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddMediaBuyingPage;
