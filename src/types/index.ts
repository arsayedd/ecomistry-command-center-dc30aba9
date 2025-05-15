export interface Brand {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  permission_level: number;
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
  notes?: string;
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
    notes: string;
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
