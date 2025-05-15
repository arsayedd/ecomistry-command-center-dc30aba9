
export interface User {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  permission_level: string;
  job_title?: string;
  employment_type?: 'full_time' | 'part_time' | 'freelancer' | 'per_piece';
  salary_type?: 'monthly' | 'hourly' | 'per_task';
  salary_amount?: number;
  commission_type?: 'percentage' | 'fixed' | 'none';
  commission_value?: number;
  status?: 'active' | 'inactive' | 'trial';
  access_rights?: 'view' | 'add' | 'edit' | 'full_manage';
  created_at?: string;
  updated_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  product_type?: string;
  vertical?: "fashion" | "beauty" | "food" | "tech" | "home" | "travel" | "other";
  description?: string;
  website?: string;
  logo_url?: string;
  status: "active" | "inactive" | "pending";
  created_at?: string;
  updated_at?: string;
  notes?: string;
  social_links?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface Expense {
  id: string;
  category: "salaries" | "ads" | "rent" | "supplies" | "other";
  amount: number;
  date: string;
  brand_id?: string;
  brand?: Brand;
  description?: string;
  created_at?: string;
  employee_id?: string;
  employee?: User;
}

export interface MediaBuyingRecord {
  id: string;
  platform: "facebook" | "instagram" | "tiktok" | "google" | "other";
  date: string;
  brand_id: string;
  brand?: Brand;
  employee_id?: string;
  employee?: User;
  spend: number;
  orders_count: number;
  order_cost?: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MediaBuying {
  id?: string;
  platform: string;
  campaign_date: Date | string;
  brand_id: string;
  employee_id: string;
  brand?: Brand;
  employee?: User;
  ad_spend: number;
  orders_count: number;
  cpp?: number;
  order_cost?: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  date: string;
  brand_id?: string;
  brand?: Brand;
  employee_id?: string;
  employee?: User;
  amount: number;
  commission?: number;
  status?: 'confirmed' | 'delivered' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface Commission {
  id: string;
  employee_id: string;
  employee?: User;
  commission_type: 'confirmation' | 'delivery';
  value_type: 'percentage' | 'fixed';
  value_amount: number;
  orders_count: number;
  total_commission: number;
  due_date: string;
  created_at?: string;
}

export interface Moderation {
  id: string;
  employee_id: string;
  employee?: User;
  daily_responses: number;
  open_messages: number;
  average_response_time: number;
  platform: 'facebook' | 'instagram' | 'whatsapp';
  performance_rating: number;
  supervisor_notes?: string;
  date: string;
  created_at?: string;
}

export interface ContentTask {
  id: string;
  employee_id: string;
  employee?: User;
  brand_id: string;
  brand?: Brand;
  task_type: 'post' | 'ad' | 'reel' | 'landing_page' | 'product';
  expected_delivery_date: string;
  status: 'in_progress' | 'completed' | 'delayed';
  delivery_link?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Revenue {
  id: string;
  date: string;
  brand_id: string;
  brand?: Brand;
  pieces_sold: number;
  price_per_piece: number;
  total_revenue: number;
  notes?: string;
  created_at?: string;
}

export interface DashboardMetrics {
  total_revenue: number;
  total_expenses: number;
  total_profit: number;
  confirmed_orders: number;
  delivered_orders: number;
  goal_achievement_percentage: number;
}
