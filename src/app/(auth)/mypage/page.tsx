import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { ReservationStatus, ReviewStatus, Database } from '@/types/database'

type ReservationRow = Database['public']['Tables']['reservations']['Row']
type ReviewRow = Database['public']['Tables']['reviews']['Row']

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: '신청완료', awaiting_payment: '입금대기', payment_received: '입금완료',
  confirmed: '예약확정', cancelled: '취소',
}
const STATUS_COLOR: Record<ReservationStatus, string> = {
  pending: 'text-gray-500 bg-gray-50', awaiting_payment: 'text-yellow-700 bg-yellow-50',
  payment_received: 'text-blue-700 bg-blue-50', confirmed: 'text-green-700 bg-green-50',
  cancelled: 'text-red-500 bg-red-50',
}
const REVIEW_LABEL: Record<ReviewStatus, string> = {
  registered: '등록됨', reviewing: '검토중', approved: '승인됨', hidden: '비공개',
}

export default async function MypagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mypage')

  const { data: profileRaw } = await supabase.from('users').select('name, phone').eq('id', user.id).single()
  const { data: reservationsRaw } = await supabase.from('reservations').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  const { data: reviewsRaw } = await supabase.from('reviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

  const profile = profileRaw as { name: string; phone: string } | null
  const reservations = reservationsRaw as ReservationRow[] | null
  const reviews = reviewsRaw as ReviewRow[] | null

  // 후기 작성 가능한 확정 예약 (후기 미작성)
  const reviewedIds = new Set((reviews ?? []).map((r) => r.reservation_id))
  const writableReservations = (reservations ?? []).filter(
    (r) => r.status === 'confirmed' && !reviewedIds.has(r.id),
  )

  return (
    <div className="min-h-screen bg-[#FAFAF8] mt-16">
      <div className="max-w-[800px] mx-auto px-12 py-16">
        {/* 헤더 */}
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-2">My Page</p>
          <h1 className="font-serif text-[28px] font-light">마이페이지</h1>
          <p className="text-[14px] text-[#6B6B6B] mt-2">{profile?.name ?? user.email} 님</p>
        </div>

        {/* 예약 내역 */}
        <section className="mb-12">
          <h2 className="font-serif text-[18px] font-light mb-5">예약 내역</h2>
          <div className="flex flex-col gap-4">
            {(reservations ?? []).map((r) => (
              <div key={r.id} className="bg-white border border-[#E5E0D8] p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[15px] font-medium">
                      {format(new Date(r.check_in_date), 'yyyy.MM.dd (eee)', { locale: ko })}
                      {' '}&nbsp;~&nbsp;{' '}
                      {format(new Date(r.check_out_date), 'MM.dd (eee)', { locale: ko })}
                    </p>
                    <p className="text-[13px] text-[#6B6B6B] mt-1">{r.nights}박 · {r.guests}명 · {r.total_price.toLocaleString()}원</p>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full ${STATUS_COLOR[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>
                {r.status === 'awaiting_payment' && r.deposit_deadline && (
                  <div className="mt-3 p-3 bg-[#FFF8E8] border-l-[3px] border-[#8B6914] text-[12px] text-[#6B6B6B]">
                    ⏱ 입금 기한: {format(new Date(r.deposit_deadline), 'yyyy.MM.dd HH:mm')}까지<br />
                    입금 완료 후 이메일로 예약 확정 안내를 보내드립니다.
                  </div>
                )}
              </div>
            ))}
            {(reservations ?? []).length === 0 && (
              <div className="bg-white border border-[#E5E0D8] py-12 text-center text-[14px] text-[#6B6B6B]">
                예약 내역이 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* 후기 작성 가능 */}
        {writableReservations.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-[18px] font-light mb-5">후기 작성 가능</h2>
            <div className="flex flex-col gap-3">
              {writableReservations.map((r) => (
                <div key={r.id} className="bg-white border border-[#E5E0D8] p-5 flex justify-between items-center">
                  <p className="text-[14px]">
                    {format(new Date(r.check_in_date), 'yyyy.MM.dd (eee)', { locale: ko })} 숙박
                  </p>
                  <a
                    href={`/reviews/write?reservationId=${r.id}`}
                    className="text-[13px] bg-[#1C1C1C] text-white px-4 py-2 hover:bg-[#8B6914] transition-colors"
                  >
                    후기 작성
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 내 후기 */}
        <section>
          <h2 className="font-serif text-[18px] font-light mb-5">내 후기</h2>
          <div className="flex flex-col gap-4">
            {(reviews ?? []).map((r) => (
              <div key={r.id} className="bg-white border border-[#E5E0D8] p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[#8B6914]">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                  <span className="text-[11px] px-2.5 py-1 bg-[#FAFAF8] border border-[#E5E0D8] text-[#6B6B6B]">
                    {REVIEW_LABEL[r.status]}
                  </span>
                </div>
                <p className="text-[14px] text-[#6B6B6B] leading-[1.8]">{r.content}</p>
                <p className="text-[12px] text-[#6B6B6B] mt-3">{format(new Date(r.created_at), 'yyyy.MM.dd')}</p>
              </div>
            ))}
            {(reviews ?? []).length === 0 && (
              <div className="bg-white border border-[#E5E0D8] py-12 text-center text-[14px] text-[#6B6B6B]">
                작성한 후기가 없습니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
