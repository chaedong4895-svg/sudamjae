import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendReservationPending } from '@/lib/notifications'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const PRICE_PER_NIGHT = 1_000_000

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { checkIn, checkOut, nights, guests, name, phone, email } = body as {
    checkIn: string; checkOut: string; nights: number; guests: number
    name: string; phone: string; email: string
  }

  if (!checkIn || !checkOut || nights < 1 || nights > 3 || guests < 1 || !name || !phone || !email) {
    return NextResponse.json({ error: '잘못된 예약 정보입니다.' }, { status: 400 })
  }

  // 날짜 중복 체크 (unavailable_dates 뷰 활용)
  const supabase = await createClient()
  const { data: unavailable } = await supabase.from('unavailable_dates').select('date')
  const taken = new Set((unavailable ?? []).map((r: { date: string }) => r.date))
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

  try {
    await sendReservationPending({
      to: email,
      userName: name,
      checkIn: format(new Date(checkIn), 'yyyy.MM.dd (eee)', { locale: ko }),
      checkOut: format(new Date(checkOut), 'yyyy.MM.dd (eee)', { locale: ko }),
      nights,
      guests,
      totalPrice,
      phone,
    })
  } catch {
    // 이메일 실패는 예약 실패로 처리하지 않음
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
