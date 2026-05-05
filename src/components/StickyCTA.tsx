'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function StickyCTA() {
  const pathname = usePathname()
  if (pathname === '/reserve') return null

  return (
    <Link
      href="/reserve"
      className="fixed bottom-9 right-11 z-40 bg-[#1C1C1C] text-white text-sm px-9 py-4 tracking-widest shadow-[0_6px_28px_rgba(0,0,0,0.22)] hover:bg-[#8B6914] transition-colors"
    >
      예약하기 →
    </Link>
  )
}
