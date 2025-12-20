export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agency_settings: {
        Row: {
          agency_name: string
          branding_text: string | null
          branding_url: string | null
          created_at: string
          custom_domain: string | null
          id: string
          logo_url: string | null
          notification_email: string | null
          updated_at: string
          user_id: string
          webhook_url: string | null
          widget_limit: number
          widgets_used: number
        }
        Insert: {
          agency_name: string
          branding_text?: string | null
          branding_url?: string | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          notification_email?: string | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
          widget_limit?: number
          widgets_used?: number
        }
        Update: {
          agency_name?: string
          branding_text?: string | null
          branding_url?: string | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          notification_email?: string | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
          widget_limit?: number
          widgets_used?: number
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      showcase_samples: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          title: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          title: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          admin_email: string | null
          branding_text: string
          branding_url: string
          created_at: string
          demo_video_url: string | null
          hero_subtitle: string
          hero_title: string
          id: string
          logo_url: string | null
          price_amount: number
          price_currency: string
          pricing_enabled: boolean
          smtp_from: string | null
          smtp_host: string | null
          smtp_port: number | null
          smtp_user: string | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          admin_email?: string | null
          branding_text?: string
          branding_url?: string
          created_at?: string
          demo_video_url?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: string
          logo_url?: string | null
          price_amount?: number
          price_currency?: string
          pricing_enabled?: boolean
          smtp_from?: string | null
          smtp_host?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          admin_email?: string | null
          branding_text?: string
          branding_url?: string
          created_at?: string
          demo_video_url?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: string
          logo_url?: string | null
          price_amount?: number
          price_currency?: string
          pricing_enabled?: boolean
          smtp_from?: string | null
          smtp_host?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          quote: string
          rating: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          quote: string
          rating?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          quote?: string
          rating?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      widget_analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          page_url: string | null
          user_agent: string | null
          visitor_id: string | null
          widget_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          page_url?: string | null
          user_agent?: string | null
          visitor_id?: string | null
          widget_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          page_url?: string | null
          user_agent?: string | null
          visitor_id?: string | null
          widget_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "widget_analytics_widget_id_fkey"
            columns: ["widget_id"]
            isOneToOne: false
            referencedRelation: "public_widgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "widget_analytics_widget_id_fkey"
            columns: ["widget_id"]
            isOneToOne: false
            referencedRelation: "widgets"
            referencedColumns: ["id"]
          },
        ]
      }
      widgets: {
        Row: {
          agency_id: string | null
          analytics_password: string | null
          analytics_token: string | null
          animation: string | null
          background_color: string | null
          border_radius: number | null
          client_id: string | null
          created_at: string
          cta_color: string | null
          cta_text: string | null
          cta_url: string | null
          custom_css: string | null
          id: string
          name: string
          person_avatar: string | null
          person_name: string | null
          person_title: string | null
          position: Database["public"]["Enums"]["widget_position"]
          price_per_month: number | null
          primary_color: string | null
          status: Database["public"]["Enums"]["widget_status"]
          stripe_subscription_id: string | null
          text_color: string | null
          trigger_type: Database["public"]["Enums"]["widget_trigger"]
          trigger_value: number | null
          updated_at: string
          video_orientation: string
          video_type: string
          video_url: string
        }
        Insert: {
          agency_id?: string | null
          analytics_password?: string | null
          analytics_token?: string | null
          animation?: string | null
          background_color?: string | null
          border_radius?: number | null
          client_id?: string | null
          created_at?: string
          cta_color?: string | null
          cta_text?: string | null
          cta_url?: string | null
          custom_css?: string | null
          id?: string
          name: string
          person_avatar?: string | null
          person_name?: string | null
          person_title?: string | null
          position?: Database["public"]["Enums"]["widget_position"]
          price_per_month?: number | null
          primary_color?: string | null
          status?: Database["public"]["Enums"]["widget_status"]
          stripe_subscription_id?: string | null
          text_color?: string | null
          trigger_type?: Database["public"]["Enums"]["widget_trigger"]
          trigger_value?: number | null
          updated_at?: string
          video_orientation?: string
          video_type?: string
          video_url: string
        }
        Update: {
          agency_id?: string | null
          analytics_password?: string | null
          analytics_token?: string | null
          animation?: string | null
          background_color?: string | null
          border_radius?: number | null
          client_id?: string | null
          created_at?: string
          cta_color?: string | null
          cta_text?: string | null
          cta_url?: string | null
          custom_css?: string | null
          id?: string
          name?: string
          person_avatar?: string | null
          person_name?: string | null
          person_title?: string | null
          position?: Database["public"]["Enums"]["widget_position"]
          price_per_month?: number | null
          primary_color?: string | null
          status?: Database["public"]["Enums"]["widget_status"]
          stripe_subscription_id?: string | null
          text_color?: string | null
          trigger_type?: Database["public"]["Enums"]["widget_trigger"]
          trigger_value?: number | null
          updated_at?: string
          video_orientation?: string
          video_type?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "widgets_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agency_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "widgets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_site_settings: {
        Row: {
          branding_text: string | null
          branding_url: string | null
          demo_video_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string | null
          logo_url: string | null
          price_amount: number | null
          price_currency: string | null
          pricing_enabled: boolean | null
        }
        Insert: {
          branding_text?: string | null
          branding_url?: string | null
          demo_video_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string | null
          logo_url?: string | null
          price_amount?: number | null
          price_currency?: string | null
          pricing_enabled?: boolean | null
        }
        Update: {
          branding_text?: string | null
          branding_url?: string | null
          demo_video_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string | null
          logo_url?: string | null
          price_amount?: number | null
          price_currency?: string | null
          pricing_enabled?: boolean | null
        }
        Relationships: []
      }
      public_widgets: {
        Row: {
          animation: string | null
          background_color: string | null
          border_radius: number | null
          cta_color: string | null
          cta_text: string | null
          cta_url: string | null
          custom_css: string | null
          id: string | null
          name: string | null
          person_avatar: string | null
          person_name: string | null
          person_title: string | null
          position: Database["public"]["Enums"]["widget_position"] | null
          primary_color: string | null
          status: Database["public"]["Enums"]["widget_status"] | null
          text_color: string | null
          trigger_type: Database["public"]["Enums"]["widget_trigger"] | null
          trigger_value: number | null
          video_orientation: string | null
          video_type: string | null
          video_url: string | null
        }
        Insert: {
          animation?: string | null
          background_color?: string | null
          border_radius?: number | null
          cta_color?: string | null
          cta_text?: string | null
          cta_url?: string | null
          custom_css?: string | null
          id?: string | null
          name?: string | null
          person_avatar?: string | null
          person_name?: string | null
          person_title?: string | null
          position?: Database["public"]["Enums"]["widget_position"] | null
          primary_color?: string | null
          status?: Database["public"]["Enums"]["widget_status"] | null
          text_color?: string | null
          trigger_type?: Database["public"]["Enums"]["widget_trigger"] | null
          trigger_value?: number | null
          video_orientation?: string | null
          video_type?: string | null
          video_url?: string | null
        }
        Update: {
          animation?: string | null
          background_color?: string | null
          border_radius?: number | null
          cta_color?: string | null
          cta_text?: string | null
          cta_url?: string | null
          custom_css?: string | null
          id?: string | null
          name?: string | null
          person_avatar?: string | null
          person_name?: string | null
          person_title?: string | null
          position?: Database["public"]["Enums"]["widget_position"] | null
          primary_color?: string | null
          status?: Database["public"]["Enums"]["widget_status"] | null
          text_color?: string | null
          trigger_type?: Database["public"]["Enums"]["widget_trigger"] | null
          trigger_value?: number | null
          video_orientation?: string | null
          video_type?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "agency"
      widget_position: "bottom-left" | "bottom-right"
      widget_status: "active" | "paused" | "draft"
      widget_trigger: "time" | "scroll" | "exit_intent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "agency"],
      widget_position: ["bottom-left", "bottom-right"],
      widget_status: ["active", "paused", "draft"],
      widget_trigger: ["time", "scroll", "exit_intent"],
    },
  },
} as const
