
export interface Brand {
  id: string;
  name: string;
  product_type?: string;
  description?: string;
  status?: string;
  logo_url?: string;
  notes?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
    [key: string]: string | undefined;
  };
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  permission_level: string;
  job_title?: string;
  status?: string;
  employment_type?: string; // Changed from union type to string
  salary_type?: string; // Changed from union type to string
  salary_amount?: number;
  commission_type?: string;
  commission_value?: number;
  access_rights?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface CallCenterOrder {
  id: string;
  order_date: string;
  customer_name: string;
  phone_number: string;
  address: string;
  brand_id: string;
  employee_id: string;
  order_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Media Buying Types
export interface MediaBuying {
  id?: string;
  platform: string;
  campaign_date: string | Date;
  brand_id: string;
  employee_id: string;
  ad_spend: number;
  orders_count: number;
  cpp: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MediaBuyingRecord {
  id: string;
  platform: string;
  date: string;
  spend: number;
  orders_count: number;
  order_cost: number;
  roas: number;
  notes?: string; // Made notes optional to match with MediaBuyingItem
  campaign_link?: string;
  created_at: string;
  updated_at: string;
  brand_id: string;
  employee_id: string;
  brand?: Brand;
  employee?: User;
}

export interface MediaBuyingItem {
  id: string;
  platform: string;
  date: string;
  spend: number;
  orders_count: number;
  order_cost: number;
  roas: number;
  notes: string; // This field is required in MediaBuyingItem
  campaign_link: string;
  created_at: string;
  updated_at: string;
  brand_id: string;
  employee_id: string;
  brand?: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
  employee?: {
    id: string;
    full_name: string;
    email: string;
    department: string;
    role: string;
    permission_level: number;
    created_at: string;
    updated_at: string;
  };
}

// Added missing types that were referenced in the code
export interface Commission {
  id?: string;
  employee_id: string;
  commission_type: string;
  value_type: string;
  value_amount: number;
  orders_count: number;
  total_commission: number;
  due_date: string | Date;
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
