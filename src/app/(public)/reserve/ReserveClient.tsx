'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DayPicker, type DateRange } from 'react-day-picker'
import { format, differenceInDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import 'react-day-picker/style.css'

const PRICE = 1_000_000
const MAX_NIGHTS = 3

interface Props {
  unavailableDates: Date[]
}

const steps = ['① 날짜 & 인원', '② 예약자 정보', '③ 예약 완료']

export default function ReserveClient({ unavailableDates }: Props) {
  const [step, setStep] = useState(0)
  const [range, setRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(2)
  const [contact, setContact] = useState({ name: '', phone: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const nights = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0
  const totalPrice = nights * PRICE

  function handleRangeSelect(r: DateRange | undefined) {
    if (!r) { setRange(undefined); return }
    if (r.from && r.to && differenceInDays(r.to, r.from) > MAX_NIGHTS) {
      const capped = new Date(r.from)
      capped.setDate(capped.getDate() + MAX_NIGHTS)
      setRange({ from: r.from, to: capped })
      return
    }
    setRange(r)
  }

  async function handleSubmit() {
    if (!range?.from || !range?.to || nights < 1) return
    if (!contact.name || !contact.phone || !contact.email) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkIn: format(range.from, 'yyyy-MM-dd'),
        checkOut: format(range.to, 'yyyy-MM-dd'),
        nights,
        guests,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? '예약 신청에 실패했습니다.')
      setLoading(false)
      return
    }

    setStep(2)
    setLoading(false)
  }

  return (
    <>
      {/* Page Header */}
      <div className="mt-16 bg-white border-b border-[#E5E0D8]">
        <div className="max-w-[1080px] mx-auto px-12 pt-10 pb-0">
          <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-3">Reservation</p>
          <h1 className="font-serif text-[26px] font-light mb-8">예약 신청</h1>
          <div className="flex gap-10">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => i < step && setStep(i)}
                className={`pb-3.5 text-[13px] border-b-2 transition-colors ${
                  i === step
                    ? 'text-[#1C1C1C] border-[#1C1C1C] font-medium'
                    : 'text-[#6B6B6B] border-transparent'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto px-12 py-12 grid md:grid-cols-[1fr_360px] gap-10 items-start">

        {/* ── LEFT ── */}
        <div className="flex flex-col gap-4">

          {/* Step 0: 날짜 + 인원 */}
          {step === 0 && (
            <>
              <div className="bg-white border border-[#E5E0D8] p-8">
                <h2 className="font-serif text-[17px] mb-7">날짜 선택</h2>
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={handleRangeSelect}
                  locale={ko}
                  disabled={[{ before: tomorrow() }, ...unavailableDates]}
                  numberOfMonths={1}
                  classNames={{
                    root: 'rdp-custom',
                    day_selected: '!bg-[#1C1C1C] !text-white',
                    day_range_middle: '!bg-[#F0EDE6]',
                    day_today: '!text-[#8B6914] font-semibold',
                  }}
                />
                {range?.from && range?.to && (
                  <div className="mt-5 flex justify-between text-[13px] bg-[#FAFAF8] border border-[#E5E0D8] px-5 py-4 text-[#6B6B6B]">
                    <span>체크인 <strong className="text-[#1C1C1C]">{format(range.from, 'yyyy.MM.dd (eee)', { locale: ko })}</strong></span>
                    <span className="text-[#E5E0D8]">|</span>
                    <span>체크아웃 <strong className="text-[#1C1C1C]">{format(range.to, 'yyyy.MM.dd (eee)', { locale: ko })}</strong></span>
                    <span><strong className="text-[#1C1C1C]">{nights}박</strong></span>
                  </div>
                )}
                <div className="flex gap-5 mt-4 text-[11px] text-[#6B6B6B]">
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 bg-[#1C1C1C] rounded-sm" />체크인/체크아웃</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 bg-[#F0EDE6] border border-[#E5E0D8] rounded-sm" />숙박 기간</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 bg-[#FAFAF8] border border-[#E5E0D8] rounded-sm line-through" />예약 불가</span>
                </div>
              </div>

              <div className="bg-white border border-[#E5E0D8] p-8">
                <h2 className="font-serif text-[17px] mb-6">인원 선택</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-medium">숙박 인원</p>
                    <p className="text-[12px] text-[#6B6B6B] mt-1">최소 1명 · 인원 제한 없음</p>
                  </div>
                  <div className="flex items-center gap-5">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-9 h-9 border border-[#E5E0D8] flex items-center justify-center text-lg hover:border-[#1C1C1C] transition-colors">−</button>
                    <span className="text-[22px] font-light min-w-[28px] text-center">{guests}</span>
                    <button onClick={() => setGuests(guests + 1)} className="w-9 h-9 border border-[#E5E0D8] flex items-center justify-center text-lg hover:border-[#1C1C1C] transition-colors">+</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 1: 예약자 정보 */}
          {step === 1 && (
            <div className="bg-white border border-[#E5E0D8] p-8">
              <h2 className="font-serif text-[17px] mb-7">예약자 정보</h2>
              <div className="flex flex-col gap-5">
                {[
                  { key: 'name', label: '이름', type: 'text', placeholder: '홍길동' },
                  { key: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000' },
                  { key: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-[12px] tracking-wide text-[#6B6B6B]">{label}</label>
                    <input
                      type={type}
                      value={contact[key as keyof typeof contact]}
                      onChange={(e) => setContact(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="border border-[#E5E0D8] px-4 py-3 text-[14px] outline-none focus:border-[#1C1C1C] transition-colors"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[12px] text-[#6B6B6B] bg-[#FAFAF8] border border-[#E5E0D8] px-4 py-3">
                예약 확인 및 안내 사항은 입력하신 이메일로 발송됩니다.
              </p>
            </div>
          )}

          {/* Step 2: 완료 */}
          {step === 2 && (
            <div className="bg-white border border-[#E5E0D8] p-10">
              <div className="text-center mb-8">
                <p className="text-[32px] mb-4">✓</p>
                <h2 className="font-serif text-[22px] font-light mb-2">예약 신청이 완료되었습니다</h2>
                <p className="text-[14px] text-[#6B6B6B]">입력하신 이메일로 안내 사항을 발송했습니다.</p>
              </div>
              <div className="bg-[#FFF8E8] border-l-4 border-[#8B6914] p-6">
                <p className="text-[14px] font-medium text-[#8B6914] mb-3">⏱ 입금 기한: 신청 후 2시간 이내</p>
                <p className="text-[13px] text-[#6B6B6B] leading-[1.8]">
                  계좌 정보 및 상세 안내는 <strong>입력하신 이메일</strong>로 발송되었습니다.<br />
                  2시간 이내에 입금하시면 관리자 확인 후 예약이 최종 확정됩니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: 요약 사이드바 ── */}
        <div className="sticky top-6 bg-white border border-[#E5E0D8] p-8">
          <Image
            src="/images/hanok_stay_pic_01.png"
            alt="한옥 스테이"
            width={360}
            height={202}
            className="w-full aspect-video object-cover object-[center_40%] mb-6"
          />
          <p className="font-serif text-[15px] mb-1">수담재</p>
          <p className="text-[12px] text-[#6B6B6B] mb-6">경기도 여주시 왕대리 692-66</p>

          <div className="border-t border-[#E5E0D8] pt-5 flex flex-col gap-3.5">
            <SummaryRow label="체크인" value={range?.from ? format(range.from, 'yyyy.MM.dd (eee) 15:00', { locale: ko }) : '—'} />
            <SummaryRow label="체크아웃" value={range?.to ? format(range.to, 'yyyy.MM.dd (eee) 11:00', { locale: ko }) : '—'} />
            <SummaryRow label="숙박" value={nights > 0 ? `${nights}박` : '—'} />
            <SummaryRow label="인원" value={`${guests}명`} />
            {nights > 0 && (
              <SummaryRow label={`${PRICE.toLocaleString()}원 × ${nights}박`} value={`${totalPrice.toLocaleString()}원`} />
            )}
          </div>

          <div className="flex justify-between items-center border-t border-[#1C1C1C] mt-4 pt-5 mb-6">
            <span className="text-[14px] font-medium">합계</span>
            <span className="font-serif text-[26px] font-light">
              {nights > 0 ? `${totalPrice.toLocaleString()}원` : '—'}
            </span>
          </div>

          {error && (
            <p className="text-[13px] text-red-600 bg-red-50 px-4 py-3 border border-red-200 mb-4">{error}</p>
          )}

          {step === 0 && (
            <button
              onClick={() => nights >= 1 ? setStep(1) : null}
              disabled={nights < 1}
              className="w-full bg-[#1C1C1C] text-white py-[18px] text-[14px] tracking-[0.1em] hover:bg-[#8B6914] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음 →
            </button>
          )}

          {step === 1 && (
            <button
              onClick={handleSubmit}
              disabled={loading || !contact.name || !contact.phone || !contact.email}
              className="w-full bg-[#1C1C1C] text-white py-[18px] text-[14px] tracking-[0.1em] hover:bg-[#8B6914] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? '신청 중...' : '예약 신청하기 →'}
            </button>
          )}

          <div className="mt-4 px-4 py-4 bg-[#FFF8E8] border-l-[3px] border-[#8B6914] text-[12px] text-[#6B6B6B] leading-[1.75]">
            <strong className="text-[#8B6914]">⏱ 입금 기한: 신청 후 2시간 이내</strong><br />
            입금 확인 후 예약이 최종 확정됩니다.
          </div>

          <div className="mt-4 pt-4 border-t border-[#E5E0D8] text-[12px] text-[#6B6B6B] leading-[1.85]">
            <strong className="text-[#1C1C1C] block mb-1">취소 및 환불 정책</strong>
            체크인 7일 전 이상: 100% 환불<br />
            체크인 2~6일 전: 50% 환불<br />
            체크인 1일 전 ~ 당일: 환불 불가
          </div>
        </div>
      </div>
    </>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-[#6B6B6B]">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  )
}

function tomorrow() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
