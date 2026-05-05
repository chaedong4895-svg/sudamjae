import { createClient } from '@/lib/supabase/server'
import ReserveClient from './ReserveClient'

export default async function ReservePage() {
  const supabase = await createClient()

  const { data: unavailable } = await supabase.from('unavailable_dates').select('date')
  const unavailableDates = (unavailable ?? []).map((r) => new Date(r.date))

  return <ReserveClient unavailableDates={unavailableDates} />
}
