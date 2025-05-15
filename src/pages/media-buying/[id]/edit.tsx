
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
            employee: data.employee ? {
              id: data.employee && typeof data.employee === 'object' && 'id' in data.employee ? data.employee.id : '',
              email: data.employee && typeof data.employee === 'object' && 'email' in data.employee ? data.employee.email : '',
              full_name: data.employee && typeof data.employee === 'object' && 'full_name' in data.employee ? data.employee.full_name : '',
              department: data.employee && typeof data.employee === 'object' && 'department' in data.employee ? data.employee.department : '',
              role: data.employee && typeof data.employee === 'object' && 'role' in data.employee ? data.employee.role : '',
              permission_level: data.employee && typeof data.employee === 'object' && 'permission_level' in data.employee ? data.employee.permission_level : '',
              employment_type: (data.employee && typeof data.employee === 'object' && 'employment_type' in data.employee ? data.employee.employment_type : 'full_time') as User['employment_type'],
              salary_type: (data.employee && typeof data.employee === 'object' && 'salary_type' in data.employee ? data.employee.salary_type : 'monthly') as User['salary_type'],
              status: (data.employee && typeof data.employee === 'object' && 'status' in data.employee ? data.employee.status : 'active') as User['status'],
              access_rights: (data.employee && typeof data.employee === 'object' && 'access_rights' in data.employee ? data.employee.access_rights : 'view') as User['access_rights'],
              commission_type: (data.employee && typeof data.employee === 'object' && 'commission_type' in data.employee ? data.employee.commission_type : 'percentage') as User['commission_type'],
              commission_value: data.employee && typeof data.employee === 'object' && 'commission_value' in data.employee ? data.employee.commission_value : 0,
              job_title: data.employee && typeof data.employee === 'object' && 'job_title' in data.employee ? data.employee.job_title : '',
              created_at: data.employee && typeof data.employee === 'object' && 'created_at' in data.employee ? data.employee.created_at : '',
              updated_at: data.employee && typeof data.employee === 'object' && 'updated_at' in data.employee ? data.employee.updated_at : '',
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
