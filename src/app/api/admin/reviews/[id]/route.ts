import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ReviewStatus } from '@/types/database'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { status } = (await req.json()) as { status: ReviewStatus }

  const { error } = await supabase.from('reviews').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: '업데이트 실패' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
