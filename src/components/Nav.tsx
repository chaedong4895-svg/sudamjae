'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/space', label: '공간 소개' },
  { href: '/guide', label: '이용 안내' },
  { href: '/location', label: '오시는 길' },
  { href: '/reviews', label: '후기' },
  { href: '/b2b', label: '웨딩 예약' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isTransparent = isHome && !scrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-12 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent border-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-[#E5E0D8]'
      }`}
    >
      <Link
        href="/"
        className={`font-serif text-lg tracking-wider transition-colors ${
          isTransparent ? 'text-white' : 'text-[#1C1C1C]'
        }`}
      >
        수담재
      </Link>

      <ul className="hidden md:flex items-center gap-9">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`text-sm tracking-wide transition-colors ${
                pathname === href
                  ? isTransparent
                    ? 'text-white font-medium'
                    : 'text-[#1C1C1C] font-medium'
                  : isTransparent
                  ? 'text-white/75 hover:text-white'
                  : 'text-[#6B6B6B] hover:text-[#1C1C1C]'
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/reserve"
        className={`hidden md:block text-sm px-6 py-2.5 tracking-widest transition-all ${
          isTransparent
            ? 'bg-white text-[#1C1C1C] hover:bg-[#8B6914] hover:text-white'
            : 'bg-[#1C1C1C] text-white hover:bg-[#8B6914]'
        }`}
      >
        예약하기
      </Link>
    </nav>
  )
}
