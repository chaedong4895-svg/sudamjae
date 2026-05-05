import Link from 'next/link'

const navLinks = [
  { href: '/space', label: '공간 소개' },
  { href: '/guide', label: '이용 안내' },
  { href: '/reserve', label: '예약' },
  { href: '/reviews', label: '후기' },
  { href: '/b2b', label: '웨딩 예약' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white/50 text-sm">
      <div className="max-w-[1080px] mx-auto px-12 py-16 flex flex-col md:flex-row justify-between gap-10">
        <div>
          <p className="font-serif text-lg text-white mb-3">수담재</p>
          <address className="not-italic leading-8">
            경기도 여주시 왕대리 692-66<br />
            세종대왕릉(영릉) 인근<br />
            문의: 이메일 · 카카오톡
          </address>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3">
          <ul className="flex flex-wrap gap-4">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-white/30 text-xs">© 2026 수담재. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
