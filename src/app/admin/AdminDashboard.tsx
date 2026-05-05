'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { ReservationStatus, ReviewStatus, B2bStatus } from '@/types/database'

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: '신청완료',
  awaiting_payment: '입금대기',
  payment_received: '입금완료',
  confirmed: '예약확정',
  cancelled: '취소',
}

const STATUS_COLOR: Record<ReservationStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  awaiting_payment: 'bg-yellow-50 text-yellow-700',
  payment_received: 'bg-blue-50 text-blue-700',
  confirmed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-500',
}

const REVIEW_LABEL: Record<ReviewStatus, string> = {
  registered: '등록됨', reviewing: '검토중', approved: '승인됨', hidden: '비공개',
}

type Reservation = {
  id: string; check_in_date: string; check_out_date: string; nights: number
  guests: number; total_price: number; status: ReservationStatus; created_at: string
  users: { name: string; phone: string } | null
}
type Review = {
  id: string; content: string; rating: number; status: ReviewStatus; created_at: string
  users: { name: string } | null
}
type B2b = {
  id: string; company_name: string; contact_name: string; contact_email: string
  contact_phone: string; headcount: number; purpose: string; requests: string | null
  status: B2bStatus; created_at: string
}

interface Props {
  reservations: Reservation[]
  reviews: Review[]
  b2bInquiries: B2b[]
}

type Tab = 'reservations' | 'reviews' | 'b2b' | 'post_review'

export default function AdminDashboard({ reservations, reviews, b2bInquiries }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('reservations')
  const [loading, setLoading] = useState<string | null>(null)

  // 후기 등록 폼 상태
  const [reviewForm, setReviewForm] = useState({
    reviewer_name: '', rating: 5, content: '',
  })
  const [reviewFile, setReviewFile] = useState<File | null>(null)
  const [reviewPreview, setReviewPreview] = useState<string | null>(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewDone, setReviewDone] = useState(false)
  const [reviewError, setReviewError] = useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setReviewFile(file)
    if (file) setReviewPreview(URL.createObjectURL(file))
    else setReviewPreview(null)
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    setReviewLoading(true)
    setReviewError('')

    let imageUrl: string | null = null
    if (reviewFile) {
      const fd = new FormData()
      fd.append('file', reviewFile)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        setReviewError('이미지 업로드에 실패했습니다.')
        setReviewLoading(false)
        return
      }
      const data = await res.json()
      imageUrl = data.url
    }

    const res = await fetch('/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: reviewForm.reviewer_name,
        rating: reviewForm.rating,
        content: reviewForm.content,
        image_urls: imageUrl ? [imageUrl] : [],
      }),
    })

    if (!res.ok) {
      setReviewError('후기 등록에 실패했습니다.')
      setReviewLoading(false)
      return
    }

    setReviewDone(true)
    setReviewLoading(false)
    router.refresh()
  }

  async function updateReservationStatus(id: string, status: ReservationStatus) {
    setLoading(id + status)
    await fetch(`/api/admin/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    router.refresh()
  }

  async function updateReviewStatus(id: string, status: ReviewStatus) {
    setLoading(id + status)
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    router.refresh()
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'reservations', label: '예약 관리', count: reservations.length },
    { key: 'reviews', label: '후기 관리', count: reviews.filter(r => r.status === 'reviewing').length },
    { key: 'b2b', label: '웨딩 문의', count: b2bInquiries.filter(b => b.status === 'new').length },
    { key: 'post_review', label: '후기 등록', count: 0 },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#1C1C1C] text-white px-12 py-5 flex items-center justify-between">
        <div>
          <p className="font-serif text-lg">수담재</p>
          <p className="text-[12px] text-white/50 mt-0.5">관리자 대시보드</p>
        </div>
        <a href="/" className="text-[13px] text-white/60 hover:text-white transition-colors">← 사이트로 돌아가기</a>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E5E0D8] px-12">
        <div className="flex gap-0">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-6 py-4 text-[13px] border-b-2 transition-colors flex items-center gap-2 ${
                tab === key ? 'border-[#1C1C1C] text-[#1C1C1C] font-medium' : 'border-transparent text-[#6B6B6B]'
              }`}
            >
              {label}
              {count > 0 && (
                <span className="bg-[#8B6914] text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-12 py-10">

        {/* ── 예약 관리 ── */}
        {tab === 'reservations' && (
          <div className="bg-white border border-[#E5E0D8] overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-[#FAFAF8] border-b border-[#E5E0D8]">
                <tr>
                  {['이름 / 연락처', '날짜', '인원', '금액', '상태', '신청일', '액션'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[#6B6B6B] font-normal tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-[#E5E0D8] hover:bg-[#FAFAF8]">
                    <td className="px-5 py-4">
                      <p className="font-medium">{r.users?.name ?? '—'}</p>
                      <p className="text-[#6B6B6B]">{r.users?.phone ?? '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p>{format(new Date(r.check_in_date), 'MM/dd (eee)', { locale: ko })}</p>
                      <p className="text-[#6B6B6B]">~ {format(new Date(r.check_out_date), 'MM/dd')} · {r.nights}박</p>
                    </td>
                    <td className="px-5 py-4">{r.guests}명</td>
                    <td className="px-5 py-4">{r.total_price.toLocaleString()}원</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full ${STATUS_COLOR[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#6B6B6B]">{format(new Date(r.created_at), 'MM/dd HH:mm')}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {r.status === 'awaiting_payment' && (
                          <ActionBtn
                            label="입금확인"
                            loading={loading === r.id + 'payment_received'}
                            onClick={() => updateReservationStatus(r.id, 'payment_received')}
                          />
                        )}
                        {r.status === 'payment_received' && (
                          <ActionBtn
                            label="예약확정"
                            loading={loading === r.id + 'confirmed'}
                            onClick={() => updateReservationStatus(r.id, 'confirmed')}
                            primary
                          />
                        )}
                        {!['cancelled', 'confirmed'].includes(r.status) && (
                          <ActionBtn
                            label="취소"
                            loading={loading === r.id + 'cancelled'}
                            onClick={() => updateReservationStatus(r.id, 'cancelled')}
                            danger
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-16 text-[#6B6B6B]">예약이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── 후기 관리 ── */}
        {tab === 'reviews' && (
          <div className="bg-white border border-[#E5E0D8] overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-[#FAFAF8] border-b border-[#E5E0D8]">
                <tr>
                  {['작성자', '별점', '내용', '상태', '작성일', '액션'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[#6B6B6B] font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} className="border-b border-[#E5E0D8] hover:bg-[#FAFAF8]">
                    <td className="px-5 py-4 font-medium">{r.users?.name ?? '—'}</td>
                    <td className="px-5 py-4 text-[#8B6914]">{'★'.repeat(r.rating)}</td>
                    <td className="px-5 py-4 max-w-[300px]">
                      <p className="line-clamp-2 text-[#6B6B6B]">{r.content}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px] px-2.5 py-1 bg-[#FAFAF8] border border-[#E5E0D8]">
                        {REVIEW_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#6B6B6B]">{format(new Date(r.created_at), 'MM/dd')}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        {r.status !== 'approved' && (
                          <ActionBtn label="승인" loading={loading === r.id + 'approved'} onClick={() => updateReviewStatus(r.id, 'approved')} primary />
                        )}
                        {r.status !== 'hidden' && (
                          <ActionBtn label="비공개" loading={loading === r.id + 'hidden'} onClick={() => updateReviewStatus(r.id, 'hidden')} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-16 text-[#6B6B6B]">후기가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── 후기 등록 ── */}
        {tab === 'post_review' && (
          <div className="max-w-[560px]">
            {reviewDone ? (
              <div className="bg-white border border-[#E5E0D8] p-12 text-center">
                <p className="text-[36px] mb-4">✓</p>
                <p className="font-serif text-[20px] font-light mb-2">후기가 등록되었습니다</p>
                <p className="text-[13px] text-[#6B6B6B] mb-6">후기 페이지에 바로 공개됩니다.</p>
                <button
                  onClick={() => { setReviewDone(false); setReviewForm({ reviewer_name: '', rating: 5, content: '' }); setReviewFile(null); setReviewPreview(null) }}
                  className="text-[13px] border border-[#E5E0D8] px-6 py-2.5 hover:border-[#1C1C1C] transition-colors"
                >
                  추가 등록하기
                </button>
              </div>
            ) : (
              <form onSubmit={submitReview} className="bg-white border border-[#E5E0D8] p-8 flex flex-col gap-5">
                <h2 className="font-serif text-[18px] font-light border-b border-[#E5E0D8] pb-4">새 후기 등록</h2>

                {/* 사진 업로드 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] tracking-wide text-[#6B6B6B]">후기 사진</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-[13px] text-[#6B6B6B] file:mr-4 file:py-2 file:px-4 file:border file:border-[#E5E0D8] file:bg-[#FAFAF8] file:text-[12px] file:text-[#1C1C1C] hover:file:bg-[#F0EDE6] file:cursor-pointer"
                  />
                  {reviewPreview && (
                    <div className="relative aspect-video mt-2 overflow-hidden border border-[#E5E0D8]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={reviewPreview} alt="미리보기" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* 고객명 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] tracking-wide text-[#6B6B6B]">고객명 (표시 이름)</label>
                  <input
                    type="text"
                    placeholder="예: 김 * *"
                    value={reviewForm.reviewer_name}
                    onChange={(e) => setReviewForm(p => ({ ...p, reviewer_name: e.target.value }))}
                    className="border border-[#E5E0D8] px-4 py-3 text-[14px] outline-none focus:border-[#1C1C1C] transition-colors"
                  />
                </div>

                {/* 별점 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] tracking-wide text-[#6B6B6B]">별점</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewForm(p => ({ ...p, rating: n }))}
                        className={`text-[28px] transition-colors ${n <= reviewForm.rating ? 'text-[#8B6914]' : 'text-[#E5E0D8]'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-[13px] text-[#6B6B6B] self-center">{reviewForm.rating}점</span>
                  </div>
                </div>

                {/* 후기 내용 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] tracking-wide text-[#6B6B6B]">고객 후기 내용</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="고객이 남긴 후기 내용을 입력해주세요."
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm(p => ({ ...p, content: e.target.value }))}
                    className="border border-[#E5E0D8] px-4 py-3 text-[14px] outline-none focus:border-[#1C1C1C] transition-colors resize-none"
                  />
                </div>

                {reviewError && (
                  <p className="text-[13px] text-red-600 bg-red-50 px-4 py-3 border border-red-200">{reviewError}</p>
                )}

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="bg-[#1C1C1C] text-white py-3.5 text-[14px] tracking-[0.1em] hover:bg-[#8B6914] transition-colors disabled:opacity-50"
                >
                  {reviewLoading ? '등록 중...' : '후기 등록하기 →'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── 웨딩 문의 ── */}
        {tab === 'b2b' && (
          <div className="grid gap-4">
            {b2bInquiries.map((b) => (
              <div key={b.id} className="bg-white border border-[#E5E0D8] p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium text-[15px]">{b.company_name}</p>
                    <p className="text-[13px] text-[#6B6B6B] mt-0.5">{b.contact_name} · {b.contact_phone} · {b.contact_email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] px-2.5 py-1 bg-[#FAFAF8] border border-[#E5E0D8] text-[#6B6B6B]">
                      {b.status === 'new' ? '신규' : b.status === 'in_progress' ? '진행중' : '완료'}
                    </span>
                    <span className="text-[12px] text-[#6B6B6B]">{format(new Date(b.created_at), 'MM/dd HH:mm')}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[13px] text-[#6B6B6B] mb-4">
                  <p>인원: <strong className="text-[#1C1C1C]">{b.headcount}명</strong></p>
                  <p>목적: <strong className="text-[#1C1C1C]">{b.purpose}</strong></p>
                </div>
                {b.requests && (
                  <p className="text-[13px] text-[#6B6B6B] bg-[#FAFAF8] p-4 border border-[#E5E0D8]">{b.requests}</p>
                )}
              </div>
            ))}
            {b2bInquiries.length === 0 && (
              <div className="bg-white border border-[#E5E0D8] py-16 text-center text-[#6B6B6B]">B2B 문의가 없습니다.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ActionBtn({ label, onClick, loading, primary, danger }: {
  label: string; onClick: () => void; loading: boolean; primary?: boolean; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`text-[11px] px-3 py-1.5 transition-colors disabled:opacity-50 ${
        primary
          ? 'bg-[#1C1C1C] text-white hover:bg-[#8B6914]'
          : danger
          ? 'border border-red-300 text-red-500 hover:bg-red-50'
          : 'border border-[#E5E0D8] text-[#6B6B6B] hover:border-[#1C1C1C] hover:text-[#1C1C1C]'
      }`}
    >
      {loading ? '...' : label}
    </button>
  )
}
