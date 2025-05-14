
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
  commission_type: 'fixed' | 'percentage';
  commission_value: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  product_type?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
  };
  status: 'active' | 'inactive' | 'paused';
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
  created_at?: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description?: string;
  brand_id?: string;
  date: string;
  created_at?: string;
}

export interface Revenue {
  id: string;
  brand_id: string;
  amount: number;
  source?: string;
  date: string;
  created_at?: string;
}
