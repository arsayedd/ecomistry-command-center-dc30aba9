
export interface User {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  permission_level: string;
}

export interface Employee {
  id: string;
  user_id: string;
  user?: User;
  salary: number;
  job_title?: string;
  position?: string;
  hire_date?: string;
  status: "active" | "inactive" | "probation";
  created_at?: string;
  updated_at?: string;
  contract_type?: "full_time" | "part_time" | "freelancer" | "per_task";
  salary_type?: "monthly" | "hourly" | "per_task";
  commission_type?: "fixed" | "percentage" | "none";
  commission_value?: number;
  working_hours?: number;
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
  };
}

export interface ContentTask {
  id: string;
  employee_id: string;
  employee?: Employee;
  brand_id: string;
  brand?: Brand;
  task_type: "post" | "ad" | "reel" | "product" | "landing_page" | "other";
  deadline?: string;
  due_date?: string;
  status: "pending" | "completed" | "delayed";
  delivery_link?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  category: "salaries" | "ads" | "rent" | "supplies" | "other";
  amount: number;
  date: string;
  brand_id?: string;
  brand?: Brand;
  employee_id?: string;
  employee?: Employee;
  description?: string;
  created_at?: string;
}

export interface Revenue {
  id: string;
  brand_id: string;
  brand?: Brand;
  amount: number;
  date: string;
  quantity?: number;
  price_per_item?: number;
  source?: string;
  notes?: string;
  created_at?: string;
}

export interface MediaBuyingRecord {
  id: string;
  platform: "facebook" | "instagram" | "tiktok" | "google" | "other";
  date: string;
  brand_id: string;
  brand?: Brand;
  employee_id?: string;
  employee?: Employee;
  spend: number;
  orders_count: number;
  order_cost?: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
