'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type SectionId = 'overview' | 'sec1' | 'sec2' | 'sec3' | 'sec4' | 'sec5' | 'sec6'

const navItems: { id: SectionId; label: string }[] = [
  { id: 'overview', label: '개요' },
  { id: 'sec1', label: '외관' },
  { id: 'sec2', label: '전면 마루' },
  { id: 'sec3', label: '거실' },
  { id: 'sec4', label: '객실' },
  { id: 'sec5', label: '후면 마루' },
  { id: 'sec6', label: '복층' },
]


function SectionNum({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-serif text-[11px] tracking-[0.3em] text-[#C8AA6E] mb-2.5">
      {children}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-[22px] font-medium text-[#2C2520] leading-[1.5] mb-1.5">
      {children}
    </h2>
  )
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-light text-[#8B7355] tracking-[0.05em] mb-8">
      {children}
    </p>
  )
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] font-light text-[#3D3028] leading-[2] mb-7">
      {children}
    </p>
  )
}

function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#2C2520] px-7 py-6 mb-7 border-l-[3px] border-[#C8AA6E]">
      {children}
    </div>
  )
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-[11px] text-[#8B6914] bg-[#C8AA6E]/15 border border-[#C8AA6E]/40 px-[14px] py-[5px] tracking-[0.08em]"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default function SpaceClient() {
  const [active, setActive] = useState<SectionId>('overview')

  return (
    <div style={{ background: '#F5F0E8', color: '#2C2520' }}>
      {/* ── Hero ── */}
      <div
        className="relative mt-16 flex flex-col items-center justify-center px-10 pt-[60px] pb-20 overflow-hidden min-h-[520px]"
        style={{ background: '#1A1410' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(200,170,110,0.06) 39px, rgba(200,170,110,0.06) 40px)',
              'repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(200,170,110,0.06) 39px, rgba(200,170,110,0.06) 40px)',
            ].join(','),
          }}
        />
        <div
          className="w-20 h-0.5 mb-7 relative"
          style={{ background: 'linear-gradient(90deg, transparent, #C8AA6E, transparent)' }}
        />
        <span className="relative font-serif text-[12px] tracking-[0.3em] uppercase text-[#C8AA6E] mb-5">
          Hanok Private Stay · 공간 소개
        </span>
        <h1 className="relative font-serif text-[28px] font-medium text-[#F5F0E8] text-center leading-[1.6] max-w-[520px] mb-7">
          전통 한옥의 품격 위에,<br />
          머무는 순간의 <em className="not-italic text-[#C8AA6E]">감동</em>을 더한 공간
        </h1>
        <p className="relative text-[13px] font-light text-center max-w-[480px] leading-[1.9] text-[#F5F0E8]/65">
          팔작지붕의 아름다운 선, 마루를 따라 흐르는 바람, 육송의 깊은 결이 살아 있는 실내까지.
          하루의 기억을 특별한 장면으로 남겨주는 한옥입니다.
        </p>
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #C8AA6E 30%, #8B6914 60%, transparent 100%)' }}
        />
      </div>

      {/* ── 탭 네비게이션 ── */}
      <nav className="flex justify-center overflow-x-auto bg-[#2C2520]">
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`text-[11px] px-[18px] py-[14px] whitespace-nowrap border-b-2 tracking-[0.1em] transition-colors duration-200 ${
              active === id
                ? 'text-[#C8AA6E] border-[#C8AA6E]'
                : 'text-[#F5F0E8]/50 border-transparent hover:text-[#C8AA6E]'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── 개요 ── */}
      {active === 'overview' && (
        <div className="px-10 py-12 bg-[#EDE7D9]">
          <div className="max-w-[680px] mx-auto">
            <SectionNum>OVERVIEW · 전체 개요</SectionNum>
            <SectionTitle>머무름이 기억이 되는 공간</SectionTitle>
            <SectionSubtitle>스몰 웨딩 · 가족 모임 · 프라이빗 기념일까지</SectionSubtitle>
            <p className="font-serif text-[14px] font-light text-[#3D3028] leading-[2.1]">
              조용한 휴식은 물론, 스몰 웨딩과 가족 모임, 프라이빗한 기념일까지 품격 있게 담아낼 수
              있도록 구성된 공간입니다. 전통 건축의 구조미와 현대적 편안함이 자연스럽게 어우러져,
              어떤 목적으로 오시더라도 오래 남는 하루를 선사합니다.
            </p>
            <div
              className="grid grid-cols-3 mt-12"
              style={{ border: '0.5px solid rgba(200,170,110,0.3)' }}
            >
              {[
                { num: '6', label: '공간 구성' },
                { num: '全棟', label: '독채 단독 이용' },
                { num: '多目的', label: '웨딩·모임·숙박' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center py-6 px-5"
                  style={{ borderRight: i < 2 ? '0.5px solid rgba(200,170,110,0.3)' : 'none' }}
                >
                  <span className="block font-serif text-[22px] text-[#C8AA6E] mb-1">{item.num}</span>
                  <span className="text-[11px] tracking-[0.1em] text-[#8B7355]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 외관 ── */}
      {active === 'sec1' && (
        <div className="px-10 py-16">
          <div className="max-w-[680px] mx-auto">
            <SectionNum>SECTION 01 · 외관</SectionNum>
            <SectionTitle>
              첫인상부터 깊게 남는<br />전통 한옥의 존재감
            </SectionTitle>
            <SectionSubtitle>팔작지붕의 유려한 선 · 전통 석등 · 넓은 마당</SectionSubtitle>
            <Image
              src="/images/섹션1_hanok_front_hero.png"
              alt="한옥 외관 전경"
              width={680}
              height={383}
              className="w-full aspect-video object-cover mb-8"
            />
            <HighlightBox>
              <p className="font-serif text-[14px] font-light leading-[1.9] text-[#F5F0E8]/85">
                유려한{' '}
                <strong className="font-medium text-[#C8AA6E]">팔작지붕</strong>과 단정한 비례가
                만들어내는 외관은 도착하는 순간부터 특별한 분위기를 완성합니다.
              </p>
            </HighlightBox>
            <SectionBody>
              넓게 펼쳐진 전면은 사진 한 장만으로도 공간의 품격을 전달하며, 낮에는 고즈넉한
              아름다움으로, 해질 무렵에는 더욱 깊은 감성으로 다가옵니다.
            </SectionBody>
            <Tags tags={['팔작지붕', '해치 석상', '잔디 마당', '디딤돌 통로']} />
          </div>
        </div>
      )}

      {/* ── 전면 마루 ── */}
      {active === 'sec2' && (
        <div className="px-10 py-16">
          <div className="max-w-[680px] mx-auto">
            <SectionNum>SECTION 02 · 전면 마루</SectionNum>
            <SectionTitle>
              머무는 시간이<br />풍경이 되는 한식 마루
            </SectionTitle>
            <SectionSubtitle>바람과 햇살 · 차 한 잔의 여유 · 웰컴 포토 존</SectionSubtitle>
            <Image
              src="/images/섹션2_hanok_front_maru.png"
              alt="한옥 전면 마루"
              width={680}
              height={383}
              className="w-full aspect-video object-cover mb-8"
            />
            <SectionBody>
              전면 마루는 단순한 출입 공간이 아니라, 바람과 햇살을 가장 가까이에서 느끼는 휴식의
              자리입니다. 신선한 공기와 함께 차 한 잔이 어울리는 힐링 스폿이며, 웨딩 고객에게는
              하객 맞이와 스냅 촬영, 웰컴 포토 존으로도 손색없는 장면을 만들어줍니다.
            </SectionBody>
            <Tags tags={['숙박 힐링존', '웨딩 포토', '하객 맞이', '육송 마루']} />
          </div>
        </div>
      )}

      {/* ── 거실 ── */}
      {active === 'sec3' && (
        <div className="px-10 py-16">
          <div className="max-w-[680px] mx-auto">
            <SectionNum>SECTION 03 · 거실</SectionNum>
            <SectionTitle>
              한옥의 구조미가<br />살아 있는 메인 라운지
            </SectionTitle>
            <SectionSubtitle>높게 트인 천장 · 보와 서까래 · 따뜻한 목재 마감</SectionSubtitle>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <Image
                src="/images/섹션3_hanok_livingroom.png"
                alt="한옥 거실 천장"
                width={334}
                height={251}
                className="w-full aspect-[4/3] object-cover"
              />
              <Image
                src="/images/섹션4-1_hanok_livingroom.png"
                alt="한옥 거실 전경"
                width={334}
                height={251}
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <HighlightBox>
              <p className="font-serif text-[14px] font-light leading-[1.9] text-[#F5F0E8]/85">
                높게 트인 천장과 오픈된{' '}
                <strong className="font-medium text-[#C8AA6E]">보·서까래</strong>가 만드는 거실은
                이 한옥의 심장부입니다. 복층과 연결된 탁 트인 구조가 공간감을 극대화합니다.
              </p>
            </HighlightBox>
            <SectionBody>
              목재의 따뜻함과 밝은 톤의 마감이 어우러져 편안하면서도 품격 있는 분위기를 만들며,
              가족 모임이나 작은 리셉션, 프라이빗한 다이닝에도 자연스럽게 어울립니다.
            </SectionBody>
            <Tags tags={['오픈 천장', '복층 연결', '프라이빗 다이닝', '리셉션']} />
          </div>
        </div>
      )}

      {/* ── 객실 ── */}
      {active === 'sec4' && (
        <div className="px-10 py-16">
          <div className="max-w-[680px] mx-auto">
            <SectionNum>SECTION 04 · 객실</SectionNum>
            <SectionTitle>
              창 너머의 풍경까지<br />머무름이 되는 방
            </SectionTitle>
            <SectionSubtitle>3면 창호 · 한옥 디테일 · 플랫폼 침대</SectionSubtitle>
            <Image
              src="/images/섹션4-2_hanok_livingroom.png"
              alt="한옥 객실"
              width={680}
              height={383}
              className="w-full aspect-video object-cover mb-8"
            />
            <SectionBody>
              3면 창호가 주는 개방감과 한옥 고유의 디테일이 살아 있는 객실은 단순한 잠자리 이상의
              경험을 전합니다. 차분한 휴식, 독서, 다도, 아침 햇살을 누리는 시간까지, 머무는 모든
              순간이 느긋하고 깊게 남도록 설계된 공간입니다.
            </SectionBody>
            <Tags tags={['3면 창호', '플랫폼 침대', '다도 공간', '자연채광']} />
          </div>
        </div>
      )}

      {/* ── 후면 마루 ── */}
      {active === 'sec5' && (
        <div className="px-10 py-16">
          <div className="max-w-[680px] mx-auto">
            <SectionNum>SECTION 05 · 후면 마루</SectionNum>
            <SectionTitle>
              조용히 숨겨둔<br />가장 사적인 쉼의 공간
            </SectionTitle>
            <SectionSubtitle>주방 연결 · 프라이빗 뷰 · 신랑신부 전용 포토존</SectionSubtitle>
            <Image
              src="/images/섹션5_hanok_secret_maru.png"
              alt="한옥 후면 마루"
              width={680}
              height={383}
              className="w-full aspect-video object-cover mb-8"
            />
            <HighlightBox>
              <p className="font-serif text-[14px] font-light leading-[1.9] text-[#F5F0E8]/85">
                주방 옆으로 이어지는 후면 마루는 이 한옥만의{' '}
                <strong className="font-medium text-[#C8AA6E]">가장 인상적인 포인트</strong>입니다.
                외부와 이어지면서도 은근한 프라이버시를 지닌 특별한 장소입니다.
              </p>
            </HighlightBox>
            <SectionBody>
              연인 또는 가족이 오롯이 쉬기 좋으며, 스몰 웨딩에서는 신랑신부만의 포토 타임이나
              대기 공간으로도 아름답게 활용할 수 있습니다.
            </SectionBody>
            <Tags tags={['프라이빗 공간', '신랑신부 포토', '주방 연결', '숲 조망']} />
          </div>
        </div>
      )}

      {/* ── 복층 ── */}
      {active === 'sec6' && (
        <div className="px-10 py-16">
          <div className="max-w-[680px] mx-auto">
            <SectionNum>SECTION 06 · 복층</SectionNum>
            <SectionTitle>
              머무는 방식에 따라<br />달라지는 특별한 공간
            </SectionTitle>
            <SectionSubtitle>육송 서까래 천장 · 유연한 다목적 활용 · 한옥 구조 체험</SectionSubtitle>
            <Image
              src="/images/섹션6_hanok_loft.png"
              alt="한옥 복층"
              width={680}
              height={383}
              className="w-full aspect-video object-cover mb-8"
            />
            <SectionBody>
              복층은 휴식, 놀이, 대화, 소규모 모임 등 다양한 방식으로 활용 가능한 유연한
              공간입니다. 천장 가까이에서 한옥 구조를 더욱 가까이 느낄 수 있어, 이 집의 매력을
              가장 깊게 체험할 수 있는 장소이기도 합니다.
            </SectionBody>
            <Tags tags={['육송 서까래', '다목적 활용', '소규모 모임', '한옥 구조 체험']} />
          </div>
        </div>
      )}

      {/* ── 구분선 ── */}
      <div
        className="mx-10 h-px opacity-40"
        style={{ background: 'linear-gradient(90deg, #C8AA6E, transparent)' }}
      />

      {/* ── CTA 푸터 ── */}
      <div className="py-10 text-center px-10 bg-[#1A1410]">
        <p className="font-serif text-[18px] font-light text-[#F5F0E8] mb-3">
          특별한 하루를 이곳에서
        </p>
        <p className="text-[12px] tracking-[0.15em] text-[#F5F0E8]/45 mb-7">
          숙박 · 스몰 웨딩 · 가족 모임 · 프라이빗 기념일
        </p>
        <Link
          href="/reserve"
          className="inline-block text-[12px] tracking-[0.2em] px-9 py-3 text-[#C8AA6E] transition-colors hover:bg-[#C8AA6E] hover:text-[#1A1410]"
          style={{ border: '0.5px solid #C8AA6E' }}
        >
          예약하기 →
        </Link>
      </div>
    </div>
  )
}
