import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendReservationConfirmed } from '@/lib/notifications'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { ReservationStatus } from '@/types/database'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { status } = (await req.json()) as { status: ReservationStatus }

  const updateData: Record<string, unknown> = { status }
  if (status === 'cancelled') {
    updateData.cancelled_at = new Date().toISOString()
    updateData.cancel_reason = '관리자 취소'
  }

  const { data: reservation, error } = await supabase
    .from('reservations')
    .update(updateData)
    .eq('id', id)
    .select('*, users(name, phone)')
    .single()

  if (error || !reservation) return NextResponse.json({ error: '업데이트 실패' }, { status: 500 })

  // 예약 확정 시 고객에게 이메일 발송
  if (status === 'confirmed') {
    const { data: authUser } = await supabase.auth.admin.getUserById(reservation.user_id)
    if (authUser?.user?.email) {
      try {
        await sendReservationConfirmed({
          to: authUser.user.email,
          userName: (reservation.users as { name: string } | null)?.name ?? '고객',
          checkIn: format(new Date(reservation.check_in_date), 'yyyy.MM.dd (eee)', { locale: ko }),
          checkOut: format(new Date(reservation.check_out_date), 'yyyy.MM.dd (eee)', { locale: ko }),
          nights: reservation.nights,
          guests: reservation.guests,
          totalPrice: reservation.total_price,
        })
      } catch {}
    }
  }

  return NextResponse.json({ ok: true })
}
