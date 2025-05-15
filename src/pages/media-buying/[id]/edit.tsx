
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MediaBuyingForm from "@/components/media-buying/MediaBuyingForm";
import { MediaBuying, Brand, User } from "@/types";

export default function EditMediaBuyingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mediaBuying, setMediaBuying] = useState<MediaBuying | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMediaBuying = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("media_buying")
          .select("*, brand:brand_id(*), employee:employee_id(*)")
          .eq("id", id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Get employee data safely, ensuring type safety
          const employeeData = data.employee ? (typeof data.employee === 'object' ? data.employee : null) : null;
          
          // Create properly typed MediaBuying object
          const formattedData: MediaBuying = {
            id: data.id,
            brand_id: data.brand_id || "",
            employee_id: data.employee_id || "",
            platform: data.platform,
            campaign_date: data.date,
            ad_spend: data.spend,
            orders_count: data.orders_count,
            cpp: data.order_cost || 0,
            roas: (data as any).roas,
            campaign_link: (data as any).campaign_link,
            notes: (data as any).notes,
            brand: data.brand as Brand,
            employee: employeeData ? {
              id: employeeData?.id || '',
              email: employeeData?.email || '',
              full_name: employeeData?.full_name || '',
              department: employeeData?.department || '',
              role: employeeData?.role || '',
              permission_level: employeeData?.permission_level || '',
              employment_type: (employeeData?.employment_type || 'full_time') as User['employment_type'],
              salary_type: (employeeData?.salary_type || 'monthly') as User['salary_type'],
              status: (employeeData?.status || 'active') as User['status'],
              access_rights: (employeeData?.access_rights || 'view') as User['access_rights'],
              commission_type: (employeeData?.commission_type || 'percentage') as User['commission_type'],
              commission_value: employeeData?.commission_value || 0,
              job_title: employeeData?.job_title || '',
              created_at: employeeData?.created_at || '',
              updated_at: employeeData?.updated_at || '',
            } : null,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
          
          setMediaBuying(formattedData);
        }
      } catch (error: any) {
        toast({
          title: "خطأ في جلب البيانات",
          description: `فشل في جلب بيانات الحملة الإعلانية: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMediaBuying();
  }, [id, toast]);

  const handleSubmitSuccess = () => {
    navigate("/media-buying");
  };

  if (loading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  if (!mediaBuying) {
    return (
      <div className="p-8 text-center">
        لم يتم العثور على بيانات لهذه الحملة الإعلانية
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">تعديل الحملة الإعلانية</h1>
        <p className="text-gray-500">
          قم بتحديث بيانات الحملة الإعلانية
        </p>
      </div>

      <MediaBuyingForm 
        initialData={mediaBuying} 
        onSubmit={handleSubmitSuccess} 
      />
    </div>
  );
}
