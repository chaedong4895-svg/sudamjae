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
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
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
        Insert: Omit<
          Database['public']['Tables']['reservations']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['reservations']['Insert']>
      }
      blocked_dates: {
        Row: {
          id: string
          date: string
          reason: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['blocked_dates']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['blocked_dates']['Insert']>
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
        Insert: Omit<
          Database['public']['Tables']['reviews']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['b2b_inquiries']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['b2b_inquiries']['Insert']>
      }
    }
    Views: {
      unavailable_dates: {
        Row: { date: string }
      }
    }
  }
}
