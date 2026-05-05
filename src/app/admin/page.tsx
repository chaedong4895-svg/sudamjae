import { createClient } from '@/lib/supabase/server'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ data: reservations }, { data: reviews }, { data: b2b }] = await Promise.all([
    supabase
      .from('reservations')
      .select('*, users(name, phone)')
      .order('created_at', { ascending: false }),
    supabase
      .from('reviews')
      .select('*, users(name)')
      .order('created_at', { ascending: false }),
    supabase
      .from('b2b_inquiries')
      .select('*')
      .order('created_at', { ascending: false }),
  ])

  return (
    <AdminDashboard
      reservations={reservations ?? []}
      reviews={reviews ?? []}
      b2bInquiries={b2b ?? []}
    />
  )
}
