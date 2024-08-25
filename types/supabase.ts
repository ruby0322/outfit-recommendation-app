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
      item: {
        Row: {
          color: string | null
          embedding: string | null
          id: string
          image_url: string
          label_string: string | null
        }
        Insert: {
          color?: string | null
          embedding?: string | null
          id?: string
          image_url: string
          label_string?: string | null
        }
        Update: {
          color?: string | null
          embedding?: string | null
          id?: string
          image_url?: string
          label_string?: string | null
        }
        Relationships: []
      }
      item_old: {
        Row: {
          embedding: string | null
          id: number
          image_url: string | null
          label_string: string | null
        }
        Insert: {
          embedding?: string | null
          id?: number
          image_url?: string | null
          label_string?: string | null
        }
        Update: {
          embedding?: string | null
          id?: number
          image_url?: string | null
          label_string?: string | null
        }
        Relationships: []
      }
      item_to_series: {
        Row: {
          item_id: string
          series_id: string
        }
        Insert: {
          item_id?: string
          series_id?: string
        }
        Update: {
          item_id?: string
          series_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_to_series_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_to_series_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      param: {
        Row: {
          clothing_type: Database["public"]["Enums"]["clothing_type"] | null
          created_at: string
          gender: Database["public"]["Enums"]["gender"] | null
          height: number | null
          id: number
          style_preferences: string | null
          weight: number | null
        }
        Insert: {
          clothing_type?: Database["public"]["Enums"]["clothing_type"] | null
          created_at?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          height?: number | null
          id?: number
          style_preferences?: string | null
          weight?: number | null
        }
        Update: {
          clothing_type?: Database["public"]["Enums"]["clothing_type"] | null
          created_at?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          height?: number | null
          id?: number
          style_preferences?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      recommendation: {
        Row: {
          created_at: string
          id: number
          param_id: number | null
          upload_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          param_id?: number | null
          upload_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          param_id?: number | null
          upload_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_param_id_fkey"
            columns: ["param_id"]
            isOneToOne: false
            referencedRelation: "param"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "upload"
            referencedColumns: ["id"]
          },
        ]
      }
      result: {
        Row: {
          created_at: string
          distance: number | null
          id: number
          item_id: string | null
          suggestion_id: number | null
        }
        Insert: {
          created_at?: string
          distance?: number | null
          id?: number
          item_id?: string | null
          suggestion_id?: number | null
        }
        Update: {
          created_at?: string
          distance?: number | null
          id?: number
          item_id?: string | null
          suggestion_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "result_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "result_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestion"
            referencedColumns: ["id"]
          },
        ]
      }
      series: {
        Row: {
          clothing_type: string | null
          external_link: string | null
          gender: string | null
          id: string
          price: string | null
          provider: string | null
          title: string | null
        }
        Insert: {
          clothing_type?: string | null
          external_link?: string | null
          gender?: string | null
          id: string
          price?: string | null
          provider?: string | null
          title?: string | null
        }
        Update: {
          clothing_type?: string | null
          external_link?: string | null
          gender?: string | null
          id?: string
          price?: string | null
          provider?: string | null
          title?: string | null
        }
        Relationships: []
      }
      suggestion: {
        Row: {
          created_at: string
          id: number
          label_string: string | null
          recommendation_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          label_string?: string | null
          recommendation_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          label_string?: string | null
          recommendation_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendation"
            referencedColumns: ["id"]
          },
        ]
      }
      upload: {
        Row: {
          created_at: string
          id: number
          image_url: string | null
          label_string: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          image_url?: string | null
          label_string?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string | null
          label_string?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      query_similar_items:
        | {
            Args: Record<PropertyKey, never>
            Returns: {
              created_at: string
              id: number
              image_url: string | null
              label_string: string | null
              user_id: number | null
            }[]
          }
        | {
            Args: {
              input_embedding: string
              match_threshold: number
            }
            Returns: {
              embedding: string | null
              id: number
              image_url: string | null
              label_string: string | null
            }[]
          }
        | {
            Args: {
              query_embedding: string
              match_threshold: number
              max_item_count: number
            }
            Returns: {
              color: string | null
              embedding: string | null
              id: string
              image_url: string
              label_string: string | null
            }[]
          }
      test: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: number
          image_url: string | null
          label_string: string | null
          user_id: number | null
        }[]
      }
    }
    Enums: {
      clothing_type: "top" | "bottom"
      gender: "male" | "female"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
