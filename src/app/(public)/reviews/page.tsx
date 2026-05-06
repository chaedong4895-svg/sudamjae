import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: '후기 | 수담재',
  description: '수담재를 다녀가신 분들의 진솔한 이야기를 전합니다.',
}

type Review = {
  id: string
  reviewer_name: string | null
  rating: number
  content: string
  image_urls: string[] | null
  created_at: string
  users: { name: string } | null
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 's1',
    reviewer_name: '김 * *',
    rating: 5,
    content:
      '마당에 앉아 있으면 서울이 아득해지는 느낌이에요. 팔작지붕 아래서 마시는 아침 커피가 잊혀지지 않아요. 가족 모두가 "다시 오고 싶다"를 연발했던 2박이었습니다.',
    image_urls: ['/images/섹션1_hanok_front_hero.png'],
    created_at: '2026-04-10',
    users: null,
  },
  {
    id: 's2',
    reviewer_name: '이 * *',
    rating: 5,
    content:
      '스몰 웨딩으로 이용했는데, 하객들 모두 감동받으셨어요. 전면 마루에서 찍은 사진이 평생 기억에 남을 것 같아요. 공간 자체가 웨딩홀이었습니다.',
    image_urls: ['/images/섹션2_hanok_front_maru.png'],
    created_at: '2026-03-22',
    users: null,
  },
  {
    id: 's3',
    reviewer_name: '박 * *',
    rating: 5,
    content:
      '서울에서 1시간인데 이렇게 고요할 수 있다니. 복층에서 밤하늘 보다가 잠든 날이 정말 오랜만에 가장 깊이 잔 것 같습니다. 강력히 추천드려요.',
    image_urls: ['/images/섹션6_hanok_loft.png'],
    created_at: '2026-02-18',
    users: null,
  },
]

function starStr(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

function displayName(review: Review) {
  return review.reviewer_name ?? review.users?.name ?? '게스트'
}

function formatDate(iso: string) {
  return iso.slice(0, 7).replace('-', '.')
}

export default async function ReviewsPage() {
  let reviews: Review[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('reviews')
      .select('id, reviewer_name, rating, content, image_urls, created_at, users(name)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) reviews = data as unknown as Review[]
  } catch {
    // Supabase 미연결 시 샘플 데이터로 폴백
  }

  const displayed = reviews.length > 0 ? reviews : SAMPLE_REVIEWS

  return (
    <>
      {/* ── 배너 ── */}
      <div className="relative mt-16 h-[280px] overflow-hidden">
        <Image
          src="/images/hanok_stay_pic_02.jpg"
          alt="수담재 전경"
          fill
          className="object-cover object-[center_55%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/15 flex items-center px-20">
          <div>
            <p className="text-[11px] tracking-[0.35em] text-white/65 uppercase mb-3">Guest Reviews</p>
            <h1 className="font-serif text-[36px] font-light text-white leading-[1.5]">후기</h1>
            <p className="mt-2 text-[14px] text-white/70 font-light">수담재를 다녀가신 분들의 이야기</p>
          </div>
        </div>
      </div>

      {/* ── 후기 그리드 ── */}
      <section className="max-w-[1080px] mx-auto px-12 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {displayed.map((r) => (
            <article key={r.id} className="bg-white border border-[#E5E0D8] overflow-hidden">
              {/* 사진 */}
              {r.image_urls && r.image_urls[0] ? (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={r.image_urls[0]}
                    alt={`${displayName(r)} 후기 사진`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-[#F0EDE6] flex items-center justify-center text-[40px]">🏡</div>
              )}

              {/* 내용 */}
              <div className="p-7">
                <p className="text-[#8B6914] text-sm mb-3">{starStr(r.rating)}</p>
                <p className="font-serif text-[14px] text-[#1C1C1C] leading-[1.85] mb-5">
                  &ldquo;{r.content}&rdquo;
                </p>
                <div className="border-t border-[#E5E0D8] pt-4 flex items-center justify-between">
                  <p className="text-[12px] text-[#1C1C1C] tracking-wide font-medium">{displayName(r)}</p>
                  <p className="text-[11px] text-[#6B6B6B]">{formatDate(r.created_at)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="bg-[#1C1C1C] text-white py-20 text-center">
        <p className="text-[11px] tracking-[0.35em] text-white/50 uppercase mb-4">Reservation</p>
        <h2 className="font-serif text-[28px] font-light mb-8">다음 특별한 하루의 주인공이 되세요</h2>
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
