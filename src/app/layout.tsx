import type { Metadata } from 'next'
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '수담재 | 세종대왕릉 인근 프라이빗 한옥',
  description:
    '서울에서 단 1시간, 세종대왕의 숲에서 머무는 하루. 영동고속도로 여주IC에서 10분, 경기도 여주시 왕대리 프라이빗 한옥 스테이.',
  keywords: ['여주 한옥', '한옥 스테이', '여주 숙소', '세종대왕릉 숙소', '경기도 한옥'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${notoSerifKR.variable}`}>
      <body>{children}</body>
    </html>
  )
}
