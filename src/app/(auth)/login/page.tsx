'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') ?? '/mypage'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D8] p-10 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] tracking-wide text-[#6B6B6B]">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-[#E5E0D8] px-4 py-3 text-[14px] outline-none focus:border-[#1C1C1C] transition-colors"
          placeholder="email@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] tracking-wide text-[#6B6B6B]">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-[#E5E0D8] px-4 py-3 text-[14px] outline-none focus:border-[#1C1C1C] transition-colors"
          placeholder="비밀번호 입력"
        />
      </div>

      {error && (
        <p className="text-[13px] text-red-600 bg-red-50 px-4 py-3 border border-red-200">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#1C1C1C] text-white py-4 text-[14px] tracking-[0.1em] hover:bg-[#8B6914] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-xl tracking-wider text-[#1C1C1C]">
            수담재
          </Link>
          <p className="text-[13px] text-[#6B6B6B] mt-3">로그인</p>
        </div>

        <Suspense fallback={<div className="bg-white border border-[#E5E0D8] p-10 h-[280px]" />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-[13px] text-[#6B6B6B] mt-6">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-[#1C1C1C] underline underline-offset-2 hover:text-[#8B6914]">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
