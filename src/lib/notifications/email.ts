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
      <p><strong>입금 기한: ${payload.depositDeadline}</strong></p>
      <p>계좌 정보: (관리자가 별도 안내 예정)</p>
      <p>입금 확인 후 예약이 최종 확정됩니다.</p>
    `,
  })
  // 관리자 알림
  if (ADMIN) {
    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `[관리자] 새 예약 신청 — ${payload.userName}`,
      html: `<p>${payload.userName} 님이 ${payload.checkIn} 예약을 신청했습니다. 관리자 대시보드를 확인하세요.</p>`,
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
