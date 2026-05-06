import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? 'noreply@hanokstay.com'
const ADMIN = process.env.ADMIN_EMAIL ?? ''

export type NotificationPayload = {
  to: string
  userName: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  totalPrice: number
  depositDeadline?: string
  phone?: string
}

export async function sendReservationPending(payload: NotificationPayload) {
  await resend.emails.send({
    from: FROM,
    to: payload.to,
    subject: '[수담재] 예약 신청이 완료되었습니다',
    html: `
      <p>${payload.userName}님, 예약 신청이 접수되었습니다.</p>
      <p>체크인: ${payload.checkIn} / 체크아웃: ${payload.checkOut} (${payload.nights}박)</p>
      <p>인원: ${payload.guests}명 / 금액: ${payload.totalPrice.toLocaleString()}원</p>
      <hr/>
      <p><strong>입금 기한: 신청 후 2시간 이내</strong></p>
      <p>계좌 정보는 담당자가 별도로 안내드립니다.</p>
      <p>입금 확인 후 예약이 최종 확정됩니다.</p>
    `,
  })
  if (ADMIN) {
    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `[관리자] 새 예약 신청 — ${payload.userName}`,
      html: `
        <p><strong>${payload.userName}</strong> 님이 예약을 신청했습니다.</p>
        <ul>
          <li>체크인: ${payload.checkIn}</li>
          <li>체크아웃: ${payload.checkOut} (${payload.nights}박)</li>
          <li>인원: ${payload.guests}명</li>
          <li>금액: ${payload.totalPrice.toLocaleString()}원</li>
          <li>연락처: ${payload.phone ?? '—'}</li>
          <li>이메일: ${payload.to}</li>
        </ul>
      `,
    })
  }
}

export async function sendReservationConfirmed(payload: NotificationPayload) {
  await resend.emails.send({
    from: FROM,
    to: payload.to,
    subject: '[수담재] 예약이 확정되었습니다 🎉',
    html: `
      <p>${payload.userName}님, 예약이 확정되었습니다!</p>
      <p>체크인: ${payload.checkIn} 15:00 / 체크아웃: ${payload.checkOut} 11:00</p>
      <p>주소: 경기도 여주시 왕대리 692-66</p>
      <p>문의사항은 이메일 또는 카카오톡으로 연락해주세요.</p>
    `,
  })
}

export async function sendReservationCancelled(payload: Pick<NotificationPayload, 'to' | 'userName' | 'checkIn'>) {
  await resend.emails.send({
    from: FROM,
    to: payload.to,
    subject: '[수담재] 예약이 취소되었습니다',
    html: `
      <p>${payload.userName}님, ${payload.checkIn} 예약이 취소되었습니다.</p>
      <p>입금 기한 내 입금이 확인되지 않아 자동 취소 처리되었습니다.</p>
      <p>다시 예약을 원하시면 예약 페이지를 이용해주세요.</p>
    `,
  })
}
