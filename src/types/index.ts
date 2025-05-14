
export interface User {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  permission_level: string;
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
}

export interface MediaBuyingRecord {
  id: string;
  platform: "facebook" | "instagram" | "tiktok" | "google" | "other";
  date: string;
  brand_id: string;
  brand?: Brand;
  employee_id?: string;
  spend: number;
  orders_count: number;
  order_cost?: number;
  roas?: number;
  campaign_link?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
