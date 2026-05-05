import Image from 'next/image'
import Link from 'next/link'

const infoItems = [
  { num: '1,000,000', label: '원 / 1박 전체 대여' },
  { num: '최대 3박', label: '연속 숙박 가능' },
  { num: '15:00', label: '체크인 / 11:00 체크아웃' },
  { num: '독채', label: '프라이빗 전체 대여' },
]

const locationBadges = [
  { icon: '🚗', text: '서울 강남에서', strong: '약 1시간' },
  { icon: '🛣', text: '영동고속도로 여주IC →', strong: '10분' },
  { icon: '🏛', text: '세종대왕릉(영릉) 인근', strong: '5~10분' },
]

const b2bTags = ['스몰 웨딩', '포토 웨딩', '가족 결혼식', '20명 이하', '프라이빗 독채']

const reviews = [
  {
    stars: 5,
    text: '"한옥의 고요함이 이런 것이구나 싶었습니다. 아침 햇살이 마당으로 들어오는 순간이 잊혀지지 않아요."',
    author: '김 * *',
    date: '2025.04',
  },
  {
    stars: 5,
    text: '"세종대왕릉 산책 후 돌아와 마루에 앉아 있으니 시간이 멈춘 것 같았습니다. 팀 워크숍으로 완벽한 선택이었어요."',
    author: '이 * *',
    date: '2025.03',
  },
  {
    stars: 4,
    text: '"서울에서 이렇게 가까운 곳에 이런 공간이 있다니. 아이들과 함께한 1박이 평생 기억에 남을 것 같습니다."',
    author: '박 * *',
    date: '2025.02',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-screen overflow-hidden">
        <Image
          src="/images/hanok_stay_pic_02.jpg"
          alt="수담재 전경"
          fill
          priority
          className="object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/30 to-black/65 flex flex-col items-center justify-end pb-[10vh] text-center px-6">
          <p className="text-[11px] tracking-[0.35em] text-white/65 uppercase mb-5">
            Yeoju Hanok Stay &nbsp;·&nbsp; 경기도 여주
          </p>
          <h1 className="font-serif text-4xl md:text-[44px] font-light text-white leading-[1.55] mb-4">
            서울에서 단 1시간,<br />세종대왕의 숲에서 머무는 하루
          </h1>
          <p className="text-[15px] text-white/70 font-light mb-11">
            영동고속도로 여주 IC에서 10분 · 세종대왕릉 인근 프라이빗 한옥
          </p>
          <Link
            href="/reserve"
            className="bg-white text-[#1C1C1C] px-[52px] py-[17px] text-sm tracking-[0.12em] hover:bg-[#8B6914] hover:text-white transition-all"
          >
            예약하기 →
          </Link>
        </div>
      </section>

      {/* ── 공간 소개 ── */}
      <section className="bg-white py-24">
        <div className="max-w-[1080px] mx-auto px-12 grid md:grid-cols-2 gap-20 items-center">
          <Image
            src="/images/hanok_stay_pic_03.jpg"
            alt="한옥 담장과 외관"
            width={520}
            height={293}
            className="w-full aspect-video object-cover"
          />
          <div>
            <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-4">Our Space</p>
            <h2 className="font-serif text-[32px] font-light leading-[1.55] mb-4">
              자연과 전통이<br />공존하는 공간
            </h2>
            <p className="text-[15px] text-[#6B6B6B] leading-[1.95] font-light">
              고즈넉한 솟을대문을 지나면 펼쳐지는 프라이빗 한옥.<br />
              조선의 건축미와 현대적 편의시설이 조화를 이루는<br />
              오직 하나의 팀만을 위한 독채 공간입니다.
            </p>
            <Link
              href="/space"
              className="inline-block mt-8 text-[13px] text-[#8B6914] border-b border-[#8B6914] pb-0.5 tracking-wide hover:opacity-70 transition-opacity"
            >
              공간 자세히 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 숫자 인포 바 ── */}
      <div className="bg-[#1C1C1C] text-white">
        <div className="max-w-[1080px] mx-auto grid grid-cols-2 md:grid-cols-4">
          {infoItems.map((item, i) => (
            <div
              key={i}
              className="text-center py-10 px-4 border-r border-white/10 last:border-r-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r"
            >
              <p className="font-serif text-[30px] font-light mb-2">{item.num}</p>
              <p className="text-[12px] text-white/55 tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 오시는 길 요약 ── */}
      <section className="py-24">
        <div className="max-w-[1080px] mx-auto px-12 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/hanok_stay_map_01.png"
              alt="위치 지도"
              fill
              className="object-cover opacity-85"
            />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-4">Location</p>
            <h2 className="font-serif text-[32px] font-light leading-[1.55] mb-3">오시는 길</h2>
            <p className="text-[14px] text-[#6B6B6B] mb-8">경기도 여주시 왕대리 692-66</p>
            <div className="flex flex-col gap-4 mb-8">
              {locationBadges.map((b, i) => (
                <div key={i} className="flex items-center gap-4 text-sm">
                  <div className="w-9 h-9 bg-[#1C1C1C] text-white flex items-center justify-center text-base shrink-0">
                    {b.icon}
                  </div>
                  <span className="text-[#6B6B6B]">
                    {b.text} <strong className="text-[#1C1C1C]">{b.strong}</strong>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Link
                href="/location"
                className="bg-[#1C1C1C] text-white text-[13px] px-6 py-3 tracking-wide hover:bg-[#8B6914] transition-colors"
              >
                오시는 길 자세히
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── B2B 섹션 ── */}
      <section className="bg-[#F5F0E8] py-24">
        <div className="max-w-[620px] mx-auto px-12 text-center">
          <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-4">Wedding Reservation</p>
          <h2 className="font-serif text-[32px] font-light leading-[1.55] mb-8">
            한옥 스몰 웨딩
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {b2bTags.map((tag) => (
              <span key={tag} className="text-[11px] px-4 py-1.5 border border-black/20 text-[#6B6B6B] tracking-wide">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-[15px] text-[#6B6B6B] leading-[1.95] font-light mb-10">
            전통 한옥의 품격 위에서 오직 당신만을 위한 하루.<br />
            세상에 단 하나뿐인 웨딩을 수담재에서 완성하세요.
          </p>
          <Link
            href="/b2b"
            className="inline-block bg-[#1C1C1C] text-white text-sm px-[52px] py-[17px] tracking-[0.1em] hover:bg-[#8B6914] transition-colors"
          >
            웨딩 예약 상담하기 →
          </Link>
        </div>
      </section>

      {/* ── 후기 ── */}
      <section className="bg-white py-24">
        <div className="max-w-[1080px] mx-auto px-12">
          <p className="text-[11px] tracking-[0.35em] text-[#8B6914] uppercase mb-4">Guest Review</p>
          <h2 className="font-serif text-[32px] font-light leading-[1.55] mb-12">
            다녀가신 분들의 이야기
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="border border-[#E5E0D8] p-7">
                <p className="text-[#8B6914] text-sm mb-3">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</p>
                <p className="text-[14px] text-[#6B6B6B] leading-[1.8] mb-4">{r.text}</p>
                <p className="text-[12px] text-[#1C1C1C] tracking-wide">
                  {r.author} &nbsp;·&nbsp; {r.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
