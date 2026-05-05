import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendReservationPending } from '@/lib/notifications'
import { format, addHours } from 'date-fns'
import { ko } from 'date-fns/locale'

const PRICE_PER_NIGHT = 1_000_000

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const body = await req.json()
  const { checkIn, checkOut, nights, guests } = body as {
    checkIn: string
    checkOut: string
    nights: number
    guests: number
  }

  // 날짜 유효성
  if (!checkIn || !checkOut || nights < 1 || nights > 3 || guests < 1) {
    return NextResponse.json({ error: '잘못된 예약 정보입니다.' }, { status: 400 })
  }

  // 날짜 중복 체크 (unavailable_dates 뷰 활용)
  const { data: unavailable } = await supabase
    .from('unavailable_dates')
    .select('date')

  const taken = new Set((unavailable ?? []).map((r) => r.date))
  const checkInDate = new Date(checkIn)
  for (let i = 0; i < nights; i++) {
    const d = new Date(checkInDate)
    d.setDate(d.getDate() + i)
    const key = format(d, 'yyyy-MM-dd')
    if (taken.has(key)) {
      return NextResponse.json({ error: '선택한 날짜는 이미 예약된 날짜입니다.' }, { status: 409 })
    }
  }

  const totalPrice = PRICE_PER_NIGHT * nights
  const depositDeadline = addHours(new Date(), 2).toISOString()

  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      user_id: user.id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      nights,
      guests,
      total_price: totalPrice,
      status: 'awaiting_payment',
      deposit_deadline: depositDeadline,
    })
    .select()
    .single()

  if (error || !reservation) {
    return NextResponse.json({ error: '예약 신청에 실패했습니다.' }, { status: 500 })
  }

  // 회원 정보 조회 후 이메일 발송
  const { data: profile } = await supabase.from('users').select('name, phone').eq('id', user.id).single()

  try {
    await sendReservationPending({
      to: user.email!,
      userName: profile?.name ?? '고객',
      checkIn: format(new Date(checkIn), 'yyyy.MM.dd (eee)', { locale: ko }),
      checkOut: format(new Date(checkOut), 'yyyy.MM.dd (eee)', { locale: ko }),
      nights,
      guests,
      totalPrice,
      depositDeadline: format(new Date(depositDeadline), 'yyyy.MM.dd HH:mm', { locale: ko }),
    })
  } catch {
    // 이메일 실패는 예약 실패로 처리하지 않음
  }

  return NextResponse.json({ id: reservation.id }, { status: 201 })
}
