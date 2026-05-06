export type ReservationStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'payment_received'
  | 'confirmed'
  | 'cancelled'

export type ReviewStatus = 'registered' | 'reviewing' | 'approved' | 'hidden'
export type B2bStatus = 'new' | 'in_progress' | 'completed'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          phone: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          phone: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          is_admin?: boolean
        }
        Relationships: []
      }
      reservations: {
        Row: {
          id: string
          user_id: string
          check_in_date: string
          check_out_date: string
          nights: number
          guests: number
          total_price: number
          status: ReservationStatus
          deposit_deadline: string | null
          cancelled_at: string | null
          cancel_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          check_in_date: string
          check_out_date: string
          nights: number
          guests: number
          total_price: number
          status: ReservationStatus
          deposit_deadline?: string | null
          cancelled_at?: string | null
          cancel_reason?: string | null
        }
        Update: {
          user_id?: string
          check_in_date?: string
          check_out_date?: string
          nights?: number
          guests?: number
          total_price?: number
          status?: ReservationStatus
          deposit_deadline?: string | null
          cancelled_at?: string | null
          cancel_reason?: string | null
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          id: string
          date: string
          reason: string | null
          created_at: string
        }
        Insert: {
          date: string
          reason?: string | null
        }
        Update: {
          date?: string
          reason?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          reservation_id: string | null
          reviewer_name: string | null
          rating: number
          content: string
          image_urls: string[] | null
          status: ReviewStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          reservation_id?: string | null
          reviewer_name?: string | null
          rating: number
          content: string
          image_urls?: string[] | null
          status?: ReviewStatus
        }
        Update: {
          user_id?: string
          reservation_id?: string | null
          reviewer_name?: string | null
          rating?: number
          content?: string
          image_urls?: string[] | null
          status?: ReviewStatus
        }
        Relationships: []
      }
      b2b_inquiries: {
        Row: {
          id: string
          company_name: string
          contact_name: string
          contact_email: string
          contact_phone: string
          headcount: number
          purpose: string
          requests: string | null
          status: B2bStatus
          created_at: string
        }
        Insert: {
          company_name: string
          contact_name: string
          contact_email: string
          contact_phone: string
          headcount: number
          purpose: string
          requests?: string | null
          status?: B2bStatus
        }
        Update: {
          company_name?: string
          contact_name?: string
          contact_email?: string
          contact_phone?: string
          headcount?: number
          purpose?: string
          requests?: string | null
          status?: B2bStatus
        }
        Relationships: []
      }
    }
    Views: {
      unavailable_dates: {
        Row: { date: string }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: {
      reservation_status: 'pending' | 'awaiting_payment' | 'payment_received' | 'confirmed' | 'cancelled'
      review_status: 'registered' | 'reviewing' | 'approved' | 'hidden'
      b2b_status: 'new' | 'in_progress' | 'completed'
    }
    CompositeTypes: Record<string, never>
  }
}
