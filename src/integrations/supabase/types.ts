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
      admins: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          first_name: string | null
          id: string
          is_active: boolean
          last_name: string | null
          middle_name: string | null
          password_hash: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          middle_name?: string | null
          password_hash?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          middle_name?: string | null
          password_hash?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookers: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount_paid: number | null
          assigned_at: string | null
          assigned_by: string | null
          assigned_talent_id: string | null
          booking_date: string
          booking_status: string | null
          booking_time: string
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          customer_id: string
          duration: string | null
          id: string
          payment_confirmed_at: string | null
          payment_confirmed_by: string | null
          selected_pricing: Json | null
          service_address: string
          service_rate: number | null
          service_type: string
          special_instructions: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_paid?: number | null
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_talent_id?: string | null
          booking_date: string
          booking_status?: string | null
          booking_time: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          customer_id: string
          duration?: string | null
          id?: string
          payment_confirmed_at?: string | null
          payment_confirmed_by?: string | null
          selected_pricing?: Json | null
          service_address: string
          service_rate?: number | null
          service_type: string
          special_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_paid?: number | null
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_talent_id?: string | null
          booking_date?: string
          booking_status?: string | null
          booking_time?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          customer_id?: string
          duration?: string | null
          id?: string
          payment_confirmed_at?: string | null
          payment_confirmed_by?: string | null
          selected_pricing?: Json | null
          service_address?: string
          service_rate?: number | null
          service_type?: string
          special_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_assigned_talent_id_fkey"
            columns: ["assigned_talent_id"]
            isOneToOne: false
            referencedRelation: "talents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          age: number | null
          birthdate: string | null
          birthplace: string | null
          city_municipality: string | null
          contact_number: string | null
          created_at: string
          email: string
          first_name: string | null
          has_assigned_booking: boolean
          id: string
          id_photo_link: string | null
          last_name: string | null
          middle_name: string | null
          payment_status: string | null
          status: string
          street_barangay: string | null
          total_amount_paid: number | null
          updated_at: string
          user_id: string
          valid_government_id: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          birthdate?: string | null
          birthplace?: string | null
          city_municipality?: string | null
          contact_number?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          has_assigned_booking?: boolean
          id?: string
          id_photo_link?: string | null
          last_name?: string | null
          middle_name?: string | null
          payment_status?: string | null
          status?: string
          street_barangay?: string | null
          total_amount_paid?: number | null
          updated_at?: string
          user_id: string
          valid_government_id?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          birthdate?: string | null
          birthplace?: string | null
          city_municipality?: string | null
          contact_number?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          has_assigned_booking?: boolean
          id?: string
          id_photo_link?: string | null
          last_name?: string | null
          middle_name?: string | null
          payment_status?: string | null
          status?: string
          street_barangay?: string | null
          total_amount_paid?: number | null
          updated_at?: string
          user_id?: string
          valid_government_id?: string | null
        }
        Relationships: []
      }
      enhanced_page_contents: {
        Row: {
          content_type: string
          content_value: string
          created_at: string | null
          display_order: number
          id: string
          meta_description: string | null
          page_id: string
          page_name: string
          page_title: string
          section_name: string
          updated_at: string | null
        }
        Insert: {
          content_type: string
          content_value: string
          created_at?: string | null
          display_order?: number
          id?: string
          meta_description?: string | null
          page_id: string
          page_name: string
          page_title: string
          section_name: string
          updated_at?: string | null
        }
        Update: {
          content_type?: string
          content_value?: string
          created_at?: string | null
          display_order?: number
          id?: string
          meta_description?: string | null
          page_id?: string
          page_name?: string
          page_title?: string
          section_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_contents: {
        Row: {
          content: string
          created_at: string
          id: string
          meta_description: string | null
          page_name: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          meta_description?: string | null
          page_name: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          meta_description?: string | null
          page_name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          booking_id: string
          created_at: string
          customer_id: string
          id: string
          rating: number
          review: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          customer_id: string
          id?: string
          rating: number
          review?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          rating?: number
          review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          color_class: string
          created_at: string
          description: string
          has_special_pricing: boolean | null
          icon_name: string
          id: string
          is_active: boolean
          price_range: string
          route: string
          sort_order: number
          special_pricing: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          color_class: string
          created_at?: string
          description: string
          has_special_pricing?: boolean | null
          icon_name: string
          id?: string
          is_active?: boolean
          price_range: string
          route: string
          sort_order?: number
          special_pricing?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          color_class?: string
          created_at?: string
          description?: string
          has_special_pricing?: boolean | null
          icon_name?: string
          id?: string
          is_active?: boolean
          price_range?: string
          route?: string
          sort_order?: number
          special_pricing?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      talents: {
        Row: {
          address: string
          age: number | null
          availability: string | null
          birthdate: string | null
          created_at: string
          description: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          experience: string | null
          full_name: string
          hourly_rate: string | null
          id: string
          is_available: boolean
          phone: string
          profile_photo_url: string | null
          services: string[]
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          age?: number | null
          availability?: string | null
          birthdate?: string | null
          created_at?: string
          description?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience?: string | null
          full_name: string
          hourly_rate?: string | null
          id?: string
          is_available?: boolean
          phone: string
          profile_photo_url?: string | null
          services: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          age?: number | null
          availability?: string | null
          birthdate?: string | null
          created_at?: string
          description?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience?: string | null
          full_name?: string
          hourly_rate?: string | null
          id?: string
          is_available?: boolean
          phone?: string
          profile_photo_url?: string | null
          services?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_total_earnings: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_bookings: number
          total_revenue: number
          total_commission: number
          confirmed_payments: number
          pending_payments: number
        }[]
      }
      get_suggested_talents: {
        Args: { customer_city: string; service_type: string }
        Returns: {
          talent_id: string
          full_name: string
          address: string
          services: string[]
          profile_photo_url: string
          hourly_rate: string
          experience: string
          match_score: number
        }[]
      }
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_admin_safe: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_booker: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
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
