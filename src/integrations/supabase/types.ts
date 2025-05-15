export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brand_employees: {
        Row: {
          brand_id: string | null
          created_at: string | null
          employee_id: string | null
          id: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_employees_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string | null
          id: string
          name: string
          product_type: string | null
          social_links: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          product_type?: string | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          product_type?: string | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      call_center_orders: {
        Row: {
          brand_id: string | null
          commission_type: string | null
          commission_value: number | null
          confirmed_orders: number
          created_at: string | null
          date: string
          delivered_orders: number
          employee_id: string | null
          entered_orders: number
          id: string
          notes: string | null
          total_commission: number | null
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          commission_type?: string | null
          commission_value?: number | null
          confirmed_orders?: number
          created_at?: string | null
          date: string
          delivered_orders?: number
          employee_id?: string | null
          entered_orders?: number
          id?: string
          notes?: string | null
          total_commission?: number | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          commission_type?: string | null
          commission_value?: number | null
          confirmed_orders?: number
          created_at?: string | null
          date?: string
          delivered_orders?: number
          employee_id?: string | null
          entered_orders?: number
          id?: string
          notes?: string | null
          total_commission?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_center_orders_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_center_orders_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          commission_type: string
          created_at: string | null
          due_date: string
          employee_id: string
          id: string
          orders_count: number
          total_commission: number
          value_amount: number
          value_type: string
        }
        Insert: {
          commission_type: string
          created_at?: string | null
          due_date: string
          employee_id: string
          id?: string
          orders_count?: number
          total_commission?: number
          value_amount?: number
          value_type: string
        }
        Update: {
          commission_type?: string
          created_at?: string | null
          due_date?: string
          employee_id?: string
          id?: string
          orders_count?: number
          total_commission?: number
          value_amount?: number
          value_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      content_tasks: {
        Row: {
          brand_id: string
          created_at: string | null
          delivery_link: string | null
          employee_id: string
          expected_delivery_date: string
          id: string
          notes: string | null
          status: string
          task_type: string
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          delivery_link?: string | null
          employee_id: string
          expected_delivery_date: string
          id?: string
          notes?: string | null
          status: string
          task_type: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          delivery_link?: string | null
          employee_id?: string
          expected_delivery_date?: string
          id?: string
          notes?: string | null
          status?: string
          task_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_tasks_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tasks_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          brand_id: string | null
          category: string
          created_at: string | null
          date: string
          description: string | null
          id: string
        }
        Insert: {
          amount: number
          brand_id?: string | null
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
        }
        Update: {
          amount?: number
          brand_id?: string | null
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      media_buying: {
        Row: {
          brand_id: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          order_cost: number | null
          orders_count: number
          platform: string
          spend: number
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          order_cost?: number | null
          orders_count: number
          platform: string
          spend: number
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          order_cost?: number | null
          orders_count?: number
          platform?: string
          spend?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_buying_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation: {
        Row: {
          average_response_time: number
          created_at: string | null
          daily_responses: number
          date: string
          employee_id: string
          id: string
          open_messages: number
          performance_rating: number
          platform: string
          supervisor_notes: string | null
        }
        Insert: {
          average_response_time?: number
          created_at?: string | null
          daily_responses?: number
          date: string
          employee_id: string
          id?: string
          open_messages?: number
          performance_rating: number
          platform: string
          supervisor_notes?: string | null
        }
        Update: {
          average_response_time?: number
          created_at?: string | null
          daily_responses?: number
          date?: string
          employee_id?: string
          id?: string
          open_messages?: number
          performance_rating?: number
          platform?: string
          supervisor_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          brand_id: string | null
          commission: number | null
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          brand_id?: string | null
          commission?: number | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          brand_id?: string | null
          commission?: number | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      revenues: {
        Row: {
          brand_id: string
          created_at: string | null
          date: string
          id: string
          notes: string | null
          pieces_sold: number
          price_per_piece: number
          total_revenue: number
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          pieces_sold: number
          price_per_piece: number
          total_revenue: number
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          pieces_sold?: number
          price_per_piece?: number
          total_revenue?: number
        }
        Relationships: [
          {
            foreignKeyName: "revenues_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          access_rights: string | null
          commission_type: string | null
          commission_value: number | null
          created_at: string | null
          department: string | null
          email: string
          employment_type: string | null
          full_name: string
          id: string
          job_title: string | null
          permission_level: string
          role: string
          salary_amount: number | null
          salary_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          access_rights?: string | null
          commission_type?: string | null
          commission_value?: number | null
          created_at?: string | null
          department?: string | null
          email: string
          employment_type?: string | null
          full_name: string
          id?: string
          job_title?: string | null
          permission_level: string
          role: string
          salary_amount?: number | null
          salary_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          access_rights?: string | null
          commission_type?: string | null
          commission_value?: number | null
          created_at?: string | null
          department?: string | null
          email?: string
          employment_type?: string | null
          full_name?: string
          id?: string
          job_title?: string | null
          permission_level?: string
          role?: string
          salary_amount?: number | null
          salary_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role_safely: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
