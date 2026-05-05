import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '이용 안내 | 수담재',
}

const guides = [
  {
    icon: '🌙',
    title: '야간 이용 안내',
    lines: [
      '주변 민가와의 조화를 위해 저녁 10시 이후 야외 정원 이용은 자제 부탁드립니다.',
      '늦은 시간에는 실내에서도 소음 발생에 유의해주시기 바랍니다.',
    ],
    full: false,
  },
  {
    icon: '🔇',
    title: '소음 관련 안내',
    lines: [
      '고성방가, 과도한 음주 및 소란 행위는 금지되어 있습니다.',
      '조용한 휴식을 위한 공간이므로, 차분한 분위기 유지를 부탁드립니다.',
    ],
    full: false,
  },
  {
    icon: '🚗',
    title: '주차 안내',
    lines: [
      '차량은 지정된 주차 구역에만 주차해주시기 바랍니다.',
      '인근 주민 및 차량 통행에 방해가 되지 않도록 협조 부탁드립니다.',
    ],
    full: false,
  },
  {
    icon: '♻️',
    title: '쓰레기 처리 안내',
    lines: [
      '쾌적한 환경 유지를 위해 쓰레기는 분리 배출해주시기 바랍니다.',
      '지정된 분리수거 공간을 이용해 주세요.',
    ],
    full: false,
  },
  {
    icon: '🚨',
    title: '비상 상황 안내',
    lines: [
      '응급 상황 또는 긴급한 도움이 필요하실 경우, 안내된 비상 연락망으로 즉시 연락해주시기 바랍니다.',
    ],
    full: true,
  },
]

export default function GuidePage() {
  return (
    <>
      {/* ── 배너 ── */}
      <div className="relative mt-16 h-[280px] overflow-hidden">
        <Image
          src="/images/hanok_stay_pic_02.jpg"
          alt="한옥 담장"
          fill
          className="object-cover object-[center_55%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/15 flex items-center px-20">
          <div>
            <p className="text-[11px] tracking-[0.35em] text-white/65 uppercase mb-3">Guide &amp; Policy</p>
            <h1 className="font-serif text-[36px] font-light text-white leading-[1.5]">이용 안내</h1>
            <p className="mt-2 text-[14px] text-white/70 font-light">편안하고 조용한 휴식을 위한 안내입니다</p>
          </div>
        </div>
      </div>

      {/* ── 인트로 ── */}
      <div className="max-w-[720px] mx-auto px-12 text-center pt-16 pb-0">
        <p className="text-[15px] text-[#6B6B6B] leading-[1.95] font-light">
          편안하고 조용한 휴식을 위해 아래 이용 수칙을 안내드립니다.<br />
          모든 이용객이 함께하는 공간인 만큼, 서로를 배려하는 마음으로 협조 부탁드립니다.
        </p>
        <div className="w-10 h-px bg-[#8B6914] mx-auto mt-8" />
      </div>

      {/* ── 가이드 카드 ── */}
      <section className="max-w-[1080px] mx-auto px-12 py-16">
        <div className="grid md:grid-cols-2 gap-5">
          {guides.map((g) => (
            <div
              key={g.title}
              className={`bg-white border border-[#E5E0D8] p-9 flex gap-6 items-start hover:shadow-md transition-shadow ${
                g.full ? 'md:col-span-2' : ''
              }`}
            >
              <div className="w-12 h-12 bg-[#FAFAF8] border border-[#E5E0D8] flex items-center justify-center text-[22px] shrink-0">
                {g.icon}
              </div>
              <div>
                <h2 className="font-serif text-[16px] font-normal mb-3">{g.title}</h2>
                <div className="text-[14px] text-[#6B6B6B] leading-[1.9] font-light space-y-2">
                  {g.lines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 클로징 ── */}
      <div className="bg-[#1C1C1C] text-white py-20 text-center">
        <div className="max-w-[560px] mx-auto px-12">
          <p className="text-[28px] mb-5">🙏</p>
          <h2 className="font-serif text-[22px] font-light leading-[1.6] mb-5">함께 만드는 공간</h2>
          <p className="text-[14px] text-white/65 leading-[1.95] font-light">
            이곳은 자연과 이웃, 그리고 다음 방문객을 위해<br />
            함께 만들어가는 공간입니다.<br />
            작은 배려가 더 큰 쉼을 만듭니다.
          </p>
          <div className="w-10 h-px bg-white/25 mx-auto my-7" />
          <p className="text-[15px] text-white/50 font-light">감사합니다.</p>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-20 text-center">
        <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-4">Reservation</p>
        <h2 className="font-serif text-[28px] font-light mb-8">지금 예약하고 특별한 하루를 계획하세요</h2>
        <Link
          href="/reserve"
          className="inline-block bg-[#1C1C1C] text-white text-sm px-[52px] py-[17px] tracking-[0.12em] hover:bg-[#8B6914] transition-colors"
        >
          예약하기 →
        </Link>
      </div>
    </>
  )
}
