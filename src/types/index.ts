
export interface User {
  id: string;
  email: string;
  full_name: string;
  department?: string;
  role: string;
  permission_level: string;
  created_at?: string;
  updated_at?: string;
}

export interface Employee {
  id: string;
  user_id: string;
  salary: number;
  working_hours?: number;
  commission_type: 'fixed' | 'percentage' | 'none';
  commission_value: number;
  status: 'active' | 'inactive' | 'probation';
  contract_type: 'full_time' | 'part_time' | 'freelancer' | 'per_task';
  salary_type: 'monthly' | 'hourly' | 'per_task';
  job_title?: string;
  notes?: string;
  required_tasks?: number;
  created_at?: string;
  updated_at?: string;
  user?: User;
}

export interface Brand {
  id: string;
  name: string;
  product_type?: string;
  description?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
  };
  logo_url?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at?: string;
  updated_at?: string;
}

export interface MediaBuying {
  id: string;
  brand_id: string;
  employee_id: string;
  platform: string;
  spend: number;
  orders_count: number;
  order_cost: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  brand_id: string;
  employee_id: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'canceled';
  amount: number;
  commission?: number;
  date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CallCenterEntry {
  id: string;
  employee_id: string;
  brand_id: string;
  date: string;
  orders_entered: number;
  orders_confirmed: number;
  orders_delivered: number;
  commission_type: 'percentage' | 'fixed';
  commission_value: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description?: string;
  brand_id?: string;
  employee_id?: string;
  date: string;
  created_at?: string;
}

export interface Revenue {
  id: string;
  brand_id: string;
  amount: number;
  items_count?: number;
  item_price?: number;
  source?: string;
  notes?: string;
  date: string;
  created_at?: string;
}

export interface ContentTask {
  id: string;
  employee_id?: string;
  brand_id?: string;
  task_type: 'post' | 'ad' | 'reel' | 'product' | 'landing_page' | 'other';
  deadline?: string;
  status: 'in_progress' | 'delivered' | 'delayed';
  delivery_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ModerationTask {
  id: string;
  employee_id: string;
  daily_responses: number;
  open_messages: number;
  average_response_time?: number;
  platforms: string[];
  quality_rating?: 'excellent' | 'good' | 'poor';
  notes?: string;
  date: string;
  created_at?: string;
}

export interface CommissionEntry {
  id: string;
  employee_id: string;
  commission_type: 'confirmation' | 'delivery';
  value_type: 'percentage' | 'fixed';
  value: number;
  orders_count: number;
  total_calculated: number;
  due_date: string;
  created_at?: string;
}
