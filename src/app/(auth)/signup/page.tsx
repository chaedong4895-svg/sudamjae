'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (authError || !data.user) {
      setError(authError?.message ?? '회원가입에 실패했습니다.')
      setLoading(false)
      return
    }

    // users 테이블에 프로필 저장
    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      name: form.name,
      phone: form.phone,
    })

    if (profileError) {
      setError('프로필 저장에 실패했습니다. 다시 시도해주세요.')
      setLoading(false)
      return
    }

    router.push('/mypage')
    router.refresh()
  }

  const fields = [
    { key: 'name', label: '이름', type: 'text', placeholder: '홍길동' },
    { key: 'phone', label: '전화번호', type: 'tel', placeholder: '010-0000-0000' },
    { key: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com' },
    { key: 'password', label: '비밀번호', type: 'password', placeholder: '8자 이상' },
    { key: 'confirm', label: '비밀번호 확인', type: 'password', placeholder: '비밀번호 재입력' },
  ] as const

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-xl tracking-wider text-[#1C1C1C]">
            수담재
          </Link>
          <p className="text-[13px] text-[#6B6B6B] mt-3">회원가입</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D8] p-10 flex flex-col gap-5">
          {fields.map(({ key, label, type, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-[12px] tracking-wide text-[#6B6B6B]">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                required
                minLength={key === 'password' || key === 'confirm' ? 8 : undefined}
                className="border border-[#E5E0D8] px-4 py-3 text-[14px] outline-none focus:border-[#1C1C1C] transition-colors"
                placeholder={placeholder}
              />
            </div>
          ))}

          {error && (
            <p className="text-[13px] text-red-600 bg-red-50 px-4 py-3 border border-red-200">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1C1C1C] text-white py-4 text-[14px] tracking-[0.1em] hover:bg-[#8B6914] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-[13px] text-[#6B6B6B] mt-6">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-[#1C1C1C] underline underline-offset-2 hover:text-[#8B6914]">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
