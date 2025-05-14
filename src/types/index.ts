export type Employee = {
  id: string;
  user_id: string;
  user?: {
    full_name: string;
  };
  salary: number;
  position: string;
  hire_date: string;
  status: "active" | "inactive";
  created_at?: string;
};

export type Brand = {
  id: string;
  name: string;
  vertical:
    | "fashion"
    | "beauty"
    | "food"
    | "tech"
    | "home"
    | "travel"
    | "other";
  description?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  status: "active" | "inactive";
  created_at?: string;
};

export type ContentTask = {
  id: string;
  employee_id: string;
  employee?: Employee;
  brand_id: string;
  brand?: Brand;
  task_type: "post" | "ad" | "reel" | "product" | "landing_page" | "other";
  due_date: string;
  status: "pending" | "completed" | "delayed";
  delivery_link?: string;
  notes?: string;
  created_at?: string;
};

export type Finance = {
  id: string;
  category:
    | "salaries"
    | "ads"
    | "rent"
    | "supplies"
    | "other";
  amount: number;
  date: string;
  brand_id: string;
  brand?: Brand;
  employee_id: string;
  employee?: Employee;
  description?: string;
  created_at?: string;
};
