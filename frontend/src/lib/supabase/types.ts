export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: string
          name: Json
          description: Json
          category: string
          tags: string[]
          quantity: number
          image_url: string | null
          storage_details: Json | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: Json
          description: Json
          category: string
          tags?: string[]
          quantity?: number
          image_url?: string | null
          storage_details?: Json | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: Json
          description?: Json
          category?: string
          tags?: string[]
          quantity?: number
          image_url?: string | null
          storage_details?: Json | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          item_id: string
          user_id: string
          start_date: string
          end_date: string
          status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_id: string
          user_id: string
          start_date: string
          end_date: string
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          user_id?: string
          start_date?: string
          end_date?: string
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      booking_locks: {
        Row: {
          id: string
          key: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          expires_at?: string
          created_at?: string
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          id: string
          to_email: string
          subject: string
          html: string
          retry_count: number
          created_at: string
          last_retry_at: string | null
          status: 'pending' | 'sent' | 'failed'
        }
        Insert: {
          id?: string
          to_email: string
          subject: string
          html: string
          retry_count?: number
          created_at?: string
          last_retry_at?: string | null
          status?: 'pending' | 'sent' | 'failed'
        }
        Update: {
          id?: string
          to_email?: string
          subject?: string
          html?: string
          retry_count?: number
          created_at?: string
          last_retry_at?: string | null
          status?: 'pending' | 'sent' | 'failed'
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          action: string
          entity_type: string
          entity_id: string
          user_id: string
          details: Json
          timestamp: string
        }
        Insert: {
          id?: string
          action: string
          entity_type: string
          entity_id: string
          user_id: string
          details?: Json
          timestamp?: string
        }
        Update: {
          id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          user_id?: string
          details?: Json
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 