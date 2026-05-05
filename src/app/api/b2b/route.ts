import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()

  const { company_name, contact_name, contact_email, contact_phone, headcount, purpose, requests } = body

  if (!company_name || !contact_name || !contact_email || !contact_phone || !headcount || !purpose) {
    return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 })
  }

  const { error } = await supabase.from('b2b_inquiries').insert({
    company_name, contact_name, contact_email, contact_phone,
    headcount: Number(headcount), purpose, requests: requests || null,
  })

  if (error) return NextResponse.json({ error: '문의 등록에 실패했습니다.' }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 201 })
}
