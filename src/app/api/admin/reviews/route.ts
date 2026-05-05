import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { reviewer_name, rating, content, image_urls } = await req.json()

  const { error } = await supabase.from('reviews').insert({
    user_id: user.id,
    reservation_id: null,
    reviewer_name: reviewer_name || null,
    rating,
    content,
    image_urls: image_urls ?? [],
    status: 'approved',
  })

  if (error) return NextResponse.json({ error: '등록 실패' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
