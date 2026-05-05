// 알림 추상화 레이어 — 채널 교체 시 이 파일만 수정
// 현재: 이메일(Resend) / 추후: 카카오 알림톡으로 교체 가능
export {
  sendReservationPending,
  sendReservationConfirmed,
  sendReservationCancelled,
  type NotificationPayload,
} from './email'
