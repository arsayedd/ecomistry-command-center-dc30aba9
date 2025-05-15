
export interface Brand {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending";
  product_type: string;
  logo_url?: string;
  description?: string;
  notes?: string;
  social_links: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  department: string;
  role: string;
  permission_level: string;
  employment_type: "full_time" | "part_time" | "contract";
  salary_type: "monthly" | "hourly" | "commission";
  status: "active" | "inactive" | "pending";
  access_rights: "admin" | "edit" | "view";
  commission_type: "percentage" | "fixed";
  commission_value: number;
  job_title: string;
  created_at: string;
  updated_at: string;
}

export interface MediaBuying {
  id?: string;
  brand_id: string;
  employee_id: string;
  platform: string;
  campaign_date: Date | string;
  ad_spend: number;
  spend?: number;
  orders_count: number;
  cpp: number;
  order_cost?: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  brand?: Brand;
  employee?: User | null;
  created_at?: string;
  updated_at?: string;
}

export interface MediaBuyingItem {
  id: string;
  brand_id: string;
  employee_id: string;
  platform: string;
  date: string;
  spend: number;
  orders_count: number;
  order_cost: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  brand?: {
    id: string;
    name: string;
  };
  employee?: {
    id?: string;
    full_name?: string;
  } | null;
}

export interface Commission {
  id?: string;
  employee_id: string;
  commission_type: string;
  value_type: string;
  value_amount: number;
  due_date: string | Date;
  orders_count: number;
  total_commission: number;
  created_at?: string;
}

export interface Revenue {
  id?: string;
  brand_id: string;
  date: string | Date;
  pieces_sold: number;
  price_per_piece: number;
  total_revenue: number;
  notes?: string;
  created_at?: string;
}

export interface Moderation {
  id?: string;
  employee_id: string;
  platform: string;
  date: string | Date;
  daily_responses: number;
  open_messages: number;
  average_response_time: number;
  performance_rating: number;
  supervisor_notes?: string;
  created_at?: string;
}

export interface MediaBuyingRecord {
  id: string;
  brand_id: string;
  employee_id: string;
  platform: string;
  date: string;
  spend: number;
  orders_count: number;
  order_cost: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  brand?: Brand;
  employee?: User;
}
