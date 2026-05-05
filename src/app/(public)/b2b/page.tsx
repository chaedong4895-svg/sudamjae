'use client'

import { useState } from 'react'
import Image from 'next/image'

const weddingTypes = ['스몰 웨딩', '포토 웨딩', '가족 결혼식', '기타']

export default function WeddingPage() {
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    headcount: '',
    purpose: '',
    requests: '',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/b2b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, headcount: Number(form.headcount) }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? '문의 등록에 실패했습니다.')
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  return (
    <>
      {/* ── 배너 ── */}
      <div className="relative mt-16 h-[320px] overflow-hidden">
        <Image
          src="/images/섹션2_hanok_front_maru.png"
          alt="수담재 웨딩 공간"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/20 flex items-center px-20">
          <div>
            <p className="text-[11px] tracking-[0.35em] text-white/65 uppercase mb-3">Wedding Reservation</p>
            <h1 className="font-serif text-[36px] font-light text-white leading-[1.5]">웨딩 예약 문의</h1>
            <p className="mt-2 text-[14px] text-white/70 font-light">스몰 웨딩 · 포토 웨딩 · 가족 결혼식 · 20명 이하 프라이빗</p>
          </div>
        </div>
      </div>

      <div className="max-w-[640px] mx-auto px-12 py-20">
        {done ? (
          <div className="bg-white border border-[#E5E0D8] p-12 text-center">
            <p className="text-[36px] mb-5">✓</p>
            <h2 className="font-serif text-[22px] font-light mb-3">상담 신청이 접수되었습니다</h2>
            <p className="text-[14px] text-[#6B6B6B] leading-[1.8]">
              담당자가 확인 후 이메일 또는 카카오톡으로 연락드리겠습니다.<br />
              보통 1~2 영업일 이내에 답변드립니다.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-3">Inquiry</p>
              <h2 className="font-serif text-[28px] font-light mb-3">웨딩 예약 상담 신청</h2>
              <p className="text-[14px] text-[#6B6B6B]">
                아래 정보를 입력하시면 담당자가 직접 연락드립니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D8] p-10 flex flex-col gap-5">
              {[
                { key: 'company_name', label: '희망 예식 날짜', type: 'text', placeholder: '예: 2026년 5월 중순' },
                { key: 'contact_name', label: '신청자 이름', type: 'text', placeholder: '홍길동' },
                { key: 'contact_email', label: '이메일', type: 'email', placeholder: 'email@example.com' },
                { key: 'contact_phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000' },
                { key: 'headcount', label: '예상 하객 수', type: 'number', placeholder: '10' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[12px] tracking-wide text-[#6B6B6B]">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => update(key, e.target.value)}
                    required
                    min={key === 'headcount' ? 1 : undefined}
                    placeholder={placeholder}
                    className="border border-[#E5E0D8] px-4 py-3 text-[14px] outline-none focus:border-[#1C1C1C] transition-colors"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] tracking-wide text-[#6B6B6B]">웨딩 유형</label>
                <select
                  value={form.purpose}
                  onChange={(e) => update('purpose', e.target.value)}
                  required
                  className="border border-[#E5E0D8] px-4 py-3 text-[14px] outline-none focus:border-[#1C1C1C] transition-colors bg-white"
                >
                  <option value="">선택해주세요</option>
                  {weddingTypes.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] tracking-wide text-[#6B6B6B]">요청사항 (선택)</label>
                <textarea
                  value={form.requests}
                  onChange={(e) => update('requests', e.target.value)}
                  rows={4}
                  placeholder="원하시는 스타일, 특별 요청, 궁금한 사항 등 자유롭게 작성해주세요."
                  className="border border-[#E5E0D8] px-4 py-3 text-[14px] outline-none focus:border-[#1C1C1C] transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-[13px] text-red-600 bg-red-50 px-4 py-3 border border-red-200">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#1C1C1C] text-white py-4 text-[14px] tracking-[0.1em] hover:bg-[#8B6914] transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? '제출 중...' : '상담 신청하기 →'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}
