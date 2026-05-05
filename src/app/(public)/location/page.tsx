import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '오시는 길 | 수담재',
}

const summaryItems = [
  { icon: '🚗', num: '1시간', desc: '서울 강남 기준' },
  { icon: '🛣', num: '10분', desc: '영동고속도로 여주IC 진출 후' },
  { icon: '🏛', num: '5~10분', desc: '세종대왕릉(영릉) 인근' },
]

const routes = [
  {
    num: '①',
    from: '서울 강남 출발',
    time: '약 1시간 ~ 1시간 10분',
    steps: [
      { name: '서울 강남', sub: '' },
      { name: '경부고속도로', sub: '신갈JC 방향' },
      { name: '영동고속도로', sub: '강릉 방향 진입' },
      { name: '여주IC 진출', sub: '세종대왕릉 방향' },
      { name: '왕대리 692-66 도착', sub: '' },
    ],
    tip: '영동고속도로 + 여주IC — 이것만 기억하세요. 여주IC에서 약 10분 거리입니다.',
    accent: 'bg-[#1C1C1C]',
  },
  {
    num: '②',
    from: '인천국제공항 출발',
    time: '약 1시간 30분',
    steps: [
      { name: '인천국제공항', sub: '' },
      { name: '공항고속도로', sub: '' },
      { name: '수도권 제1순환고속도로', sub: '일산/판교 방향' },
      { name: '영동고속도로', sub: '강릉 방향 진입' },
      { name: '여주IC 진출', sub: '세종대왕릉 방향' },
      { name: '왕대리 692-66 도착', sub: '' },
    ],
    tip: '중부내륙고속도로 → 서여주IC 이용 시 상황에 따라 5분 단축될 수 있습니다.',
    accent: 'bg-[#1C1C1C]',
  },
  {
    num: '③',
    from: '대중교통 이용',
    time: '약 1시간 30분 이상',
    steps: [
      { name: '강남 / 서울역', sub: '' },
      { name: '경강선 승차', sub: '판교 방향 → 여주 방향' },
      { name: '여주역 하차', sub: '' },
      { name: '버스 또는 택시', sub: '세종대왕릉 방향 이동' },
      { name: '왕대리 692-66 도착', sub: '' },
    ],
    tip: '자가용 이용을 권장드립니다. 대중교통 이용 시 픽업 가능 여부는 예약 시 문의해주세요.',
    accent: 'bg-[#4A5568]',
  },
]

const attractions = [
  { icon: '🏛', name: '세종대왕릉 (영릉)', desc: '한글 창제 세종대왕과 왕비의 합장릉. 넓은 숲길과 힐링 산책 코스.', dist: '차량 5~10분' },
  { icon: '⛩', name: '신륵사', desc: '남한강 절벽 위 사찰. 일몰과 강변 뷰가 아름다운 여주 명소.', dist: '차량 15분' },
  { icon: '🛍', name: '여주 프리미엄 아울렛', desc: '수도권 최대 규모의 프리미엄 아울렛. 가족 여행 코스 연계.', dist: '차량 15분' },
  { icon: '🌿', name: '여강길 / 남한강 자전거길', desc: '남한강을 따라 이어지는 자연형 트레킹 & 자전거 코스.', dist: '차량 10분' },
]

export default function LocationPage() {
  return (
    <>
      {/* ── 배너 ── */}
      <div className="relative mt-16 h-[300px] overflow-hidden">
        <Image src="/images/hanok_stay_pic_01.png" alt="한옥 스테이 전경" fill className="object-cover object-[center_30%]" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/15 flex items-center px-20">
          <div>
            <p className="text-[11px] tracking-[0.35em] text-white/65 uppercase mb-3">How to get here</p>
            <h1 className="font-serif text-[36px] font-light text-white leading-[1.5]">오시는 길</h1>
            <p className="mt-2 text-[14px] text-white/70 font-light">서울에서 단 1시간 · 영동고속도로 여주IC에서 10분</p>
          </div>
        </div>
      </div>

      {/* ── 요약 바 ── */}
      <div className="bg-[#1C1C1C] text-white">
        <div className="max-w-[1080px] mx-auto grid grid-cols-3">
          {summaryItems.map((item, i) => (
            <div key={i} className="flex items-center gap-5 px-10 py-8 border-r border-white/10 last:border-r-0">
              <span className="text-[28px]">{item.icon}</span>
              <div>
                <p className="font-serif text-[26px] font-light leading-none mb-1.5">{item.num}</p>
                <p className="text-[12px] text-white/55 tracking-wide">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 지도 섹션 ── */}
      <section className="py-20">
        <div className="max-w-[1080px] mx-auto px-12">
          <div className="grid md:grid-cols-[1fr_360px] border border-[#E5E0D8] overflow-hidden">
            {/* 지도 */}
            <div className="relative min-h-[460px]">
              <Image src="/images/hanok_stay_map_01.png" alt="위치 지도" fill className="object-cover opacity-85" />
              {/* 주소 뱃지 */}
              <div className="absolute top-5 left-5 bg-white/92 backdrop-blur-sm px-4 py-2.5 border border-[#E5E0D8] text-[12px] text-[#6B6B6B] tracking-wide">
                📍 경기도 여주시 왕대리 692-66
              </div>
              {/* 핀 — 지도상 여주 위치 */}
              <div className="absolute" style={{ top: '71%', left: '80%', transform: 'translate(-50%, -100%)' }}>
                <div className="flex flex-col items-center drop-shadow-lg">
                  <div className="bg-[#1C1C1C] text-white text-[11px] px-3 py-1.5 whitespace-nowrap tracking-wide rounded-sm">
                    수담재
                  </div>
                  <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-[#1C1C1C]" />
                </div>
              </div>
            </div>

            {/* 주소 패널 */}
            <div className="bg-white border-l border-[#E5E0D8] p-10 flex flex-col justify-between">
              <div>
                <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-3">Address</p>
                <h2 className="font-serif text-[18px] mb-2">수담재</h2>
                <p className="text-[13px] text-[#6B6B6B] leading-[1.8] mb-7">
                  경기도 여주시 왕대리 692-66<br />
                  세종대왕릉(영릉) 인근
                </p>
                <div className="flex flex-wrap gap-2 mb-7">
                  {['서울 1시간', '여주IC 10분', '세종대왕릉 인근'].map((tag) => (
                    <span key={tag} className="text-[11px] px-3.5 py-1 border border-[#E5E0D8] text-[#6B6B6B] tracking-wide">{tag}</span>
                  ))}
                </div>
                <div className="border-t border-[#E5E0D8] pt-6 flex flex-col gap-3 mb-7">
                  {[
                    { icon: '🚗', text: '강남 → 영동고속도로 →', strong: '여주IC → 10분' },
                    { icon: '✈️', text: '인천공항 → 수도권순환 →', strong: '영동고속도로 → 여주IC' },
                    { icon: '🚆', text: '경강선 →', strong: '여주역 → 버스/택시' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3 text-[13px]">
                      <div className="w-8 h-8 bg-[#FAFAF8] border border-[#E5E0D8] flex items-center justify-center text-[15px] shrink-0">{r.icon}</div>
                      <span className="text-[#6B6B6B] leading-[1.5]">{r.text} <strong className="text-[#1C1C1C]">{r.strong}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <a
                  href="https://map.naver.com/p/search/경기도 여주시 왕대리 692-66"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1C1C1C] text-white text-[13px] px-5 py-3.5 flex items-center gap-2.5 hover:bg-[#8B6914] transition-colors"
                >
                  <span>🟢</span> 네이버 지도로 길찾기
                </a>
                <a
                  href="https://map.kakao.com/link/search/경기도 여주시 왕대리 692-66"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-[#1C1C1C] text-[#1C1C1C] text-[13px] px-5 py-3.5 flex items-center gap-2.5 hover:bg-[#8B6914] hover:text-white hover:border-[#8B6914] transition-colors"
                >
                  <span>🟡</span> 카카오맵으로 길찾기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 경로별 상세 ── */}
      <section className="bg-white py-20">
        <div className="max-w-[1080px] mx-auto px-12">
          <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-3">Directions</p>
          <h2 className="font-serif text-[28px] font-light mb-2">경로별 안내</h2>
          <p className="text-[14px] text-[#6B6B6B] mb-12">출발지에 따라 가장 빠른 경로를 선택하세요.</p>

          <div className="grid md:grid-cols-3 gap-5">
            {routes.map((route) => (
              <div key={route.num} className="border border-[#E5E0D8] overflow-hidden">
                <div className={`${route.accent} text-white p-5 flex items-center gap-4`}>
                  <span className="font-serif text-[22px] font-light">{route.num}</span>
                  <div>
                    <p className="text-[14px] font-medium">{route.from}</p>
                    <p className="text-[11px] text-white/65 mt-0.5 tracking-wide">⏱ {route.time}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-0">
                    {route.steps.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="flex flex-col items-center shrink-0 pt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            i === 0 ? 'bg-[#8B6914]' : i === route.steps.length - 1 ? 'bg-[#1C1C1C]' : 'bg-[#E5E0D8]'
                          }`} />
                          {i < route.steps.length - 1 && <div className="w-px h-7 bg-[#E5E0D8] my-0.5" />}
                        </div>
                        <div className="pb-1">
                          <p className="text-[13px] font-medium">{step.name}</p>
                          {step.sub && <p className="text-[12px] text-[#6B6B6B]">{step.sub}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3.5 bg-[#FAFAF8] border-l-[3px] border-[#8B6914] text-[12px] text-[#6B6B6B] leading-[1.7]">
                    <strong className="text-[#8B6914]">💡 </strong>{route.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 주변 관광지 ── */}
      <section className="py-20">
        <div className="max-w-[1080px] mx-auto px-12">
          <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-3">Nearby</p>
          <h2 className="font-serif text-[28px] font-light mb-2">주변 관광지</h2>
          <p className="text-[14px] text-[#6B6B6B] mb-12">한옥 스테이 인근의 여주 대표 명소들을 함께 즐겨보세요.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {attractions.map((a) => (
              <div key={a.name} className="bg-white border border-[#E5E0D8]">
                <div className="h-24 bg-[#F0EDE6] flex items-center justify-center text-[36px]">{a.icon}</div>
                <div className="p-5">
                  <h3 className="font-serif text-[14px] mb-2">{a.name}</h3>
                  <p className="text-[12px] text-[#6B6B6B] leading-[1.75]">{a.desc}</p>
                  <p className="mt-3 text-[11px] text-[#8B6914] tracking-wide">📍 {a.dist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="bg-[#1C1C1C] text-white py-20 text-center">
        <p className="text-[11px] tracking-[0.35em] text-white/50 uppercase mb-4">Reservation</p>
        <h2 className="font-serif text-[28px] font-light text-white mb-8">지금 예약하고 특별한 하루를 계획하세요</h2>
        <Link
          href="/reserve"
          className="inline-block bg-white text-[#1C1C1C] text-sm px-[52px] py-[17px] tracking-[0.12em] hover:bg-[#8B6914] hover:text-white transition-colors"
        >
          예약하기 →
        </Link>
      </div>
    </>
  )
}
