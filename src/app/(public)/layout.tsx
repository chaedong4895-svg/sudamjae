import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import StickyCTA from '@/components/StickyCTA'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <StickyCTA />
    </>
  )
}
