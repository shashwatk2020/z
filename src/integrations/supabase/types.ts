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
      admin_users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          password_hash: string
          role: string | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          password_hash: string
          role?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          password_hash?: string
          role?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      api_configs: {
        Row: {
          api_key: string | null
          api_secret: string | null
          config: Json | null
          created_at: string
          endpoint_url: string | null
          id: string
          is_active: boolean | null
          service_name: string
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          config?: Json | null
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          service_name: string
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          config?: Json | null
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: Json
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: Json
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: Json
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          parent_id: string | null
          sort_order: number | null
          target: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          parent_id?: string | null
          sort_order?: number | null
          target?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          parent_id?: string | null
          sort_order?: number | null
          target?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string
          expires_at: string | null
          file_size: number | null
          file_url: string | null
          id: string
          original_filename: string
          processed_filename: string | null
          processing_status: string | null
          tool_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          original_filename: string
          processed_filename?: string | null
          processing_status?: string | null
          tool_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          original_filename?: string
          processed_filename?: string | null
          processing_status?: string | null
          tool_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          api_config: Json | null
          api_dependent: boolean | null
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          path: string
          requires_auth: boolean | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          api_config?: Json | null
          api_dependent?: boolean | null
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          path: string
          requires_auth?: boolean | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          api_config?: Json | null
          api_dependent?: boolean | null
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          path?: string
          requires_auth?: boolean | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      verify_admin_login: {
        Args: { username_input: string; password_input: string }
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
