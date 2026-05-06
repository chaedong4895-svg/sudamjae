import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { sendReservationCancelled } from '@/lib/notifications'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

// Vercel Cron이 10분마다 호출 — 미입금 예약 자동 취소
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // 입금 기한이 지난 awaiting_payment 예약 조회
  const { data: expired, error } = await supabase
    .from('reservations')
    .select('id, user_id, check_in_date, deposit_deadline, users(name, phone)')
    .eq('status', 'awaiting_payment')
    .lt('deposit_deadline', new Date().toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!expired || expired.length === 0) {
    return NextResponse.json({ cancelled: 0 })
  }

  const ids = expired.map((r) => r.id)

  await supabase
    .from('reservations')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), cancel_reason: '입금 기한 초과 자동 취소' })
    .in('id', ids)

  // 취소 이메일 발송 (사용자 이메일은 auth에서 조회)
  for (const r of expired) {
    const { data: authUser } = await supabase.auth.admin.getUserById(r.user_id)
    if (authUser?.user?.email) {
      try {
        await sendReservationCancelled({
          to: authUser.user.email,
          userName: (r.users as unknown as { name: string } | null)?.name ?? '고객',
          checkIn: format(new Date(r.check_in_date), 'yyyy.MM.dd (eee)', { locale: ko }),
        })
      } catch {}
    }
  }

  return NextResponse.json({ cancelled: ids.length })
}
