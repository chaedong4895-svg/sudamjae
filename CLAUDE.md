# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 프로젝트 개요

**여주 한옥 스테이 예약 플랫폼** — 경기도 여주시 왕대리 692-66 소재 한옥 숙소의 예약·관리 웹사이트.

핵심 컨셉: "숙소 예약 사이트가 아닌, 머무는 경험을 설계하는 플랫폼"
타겟: B2C (30~50대 가족/커플) + B2B (기업 세미나/워크숍 담당자)

---

## 기술 스택

- **Frontend**: Next.js (App Router) + Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL)
- **배포**: Vercel
- **자동 취소 크론**: Vercel Cron Jobs + Next.js API Route
- **알림**: 이메일 (MVP) → 카카오 알림톡 (추후 교체 가능하도록 추상화)
- **지도**: Google Maps 또는 Naver Map (길찾기 외부 링크: 네이버/카카오 지도)

---

## 개발 명령어

> 프로젝트 초기화 후 이 섹션을 업데이트할 것.

```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run lint      # ESLint
```

---

## 아키텍처

### 디렉토리 구조 (예정)

```
/app
  /(public)         # 비회원 접근 가능
    /               # 메인 페이지
    /space          # 공간 소개
    /guide          # 이용 안내
    /location       # 오시는 길
    /reviews        # 후기 (승인된 것만 공개)
    /b2b            # 기업 예약 상담 폼
  /(auth)           # 회원 전용
    /reserve        # 예약 페이지
    /mypage         # 마이페이지
  /admin            # 관리자 전용 (단일 관리자)
/lib
  /notifications
    index.ts        # 단일 진입점 (전략 패턴으로 채널 교체 가능)
    email.ts        # 현재 사용
    kakao.ts        # 추후 교체용
  /supabase         # DB 클라이언트
/api
  /cron
    cancel-expired  # Vercel Cron: 2시간 미입금 자동 취소 (매 10분 실행)
```

### 알림 추상화 원칙

`/lib/notifications/index.ts`를 단일 진입점으로 유지. 이메일 → 카카오 전환 시 `index.ts`만 수정.

---

## Supabase DB 스키마

### `users`
```sql
id          uuid  PK  -- Supabase auth.users 참조
name        text  NOT NULL
phone       text  NOT NULL
is_admin    bool  DEFAULT false
created_at  timestamptz
```

### `reservations`
```sql
id                uuid  PK
user_id           uuid  FK → users
check_in_date     date  NOT NULL
check_out_date    date  NOT NULL
nights            int   NOT NULL   -- 1~3박
guests            int   NOT NULL
total_price       int   NOT NULL   -- 원 단위
status            enum  ('pending' | 'awaiting_payment' | 'payment_received' | 'confirmed' | 'cancelled')
deposit_deadline  timestamptz      -- created_at + 2시간
cancelled_at      timestamptz  NULL
cancel_reason     text  NULL
created_at        timestamptz
updated_at        timestamptz
```

### `blocked_dates`
```sql
id          uuid  PK
date        date  UNIQUE NOT NULL
reason      text  NULL
created_at  timestamptz
```

### `reviews`
```sql
id              uuid  PK
user_id         uuid  FK → users
reservation_id  uuid  FK → reservations  UNIQUE
rating          int   CHECK (1~5)
content         text  NOT NULL
image_urls      text[]  NULL
status          enum  ('registered' | 'reviewing' | 'approved' | 'hidden')
created_at      timestamptz
updated_at      timestamptz
```

### `b2b_inquiries`
```sql
id            uuid  PK
company_name  text  NOT NULL
contact_name  text  NOT NULL
contact_email text  NOT NULL
contact_phone text  NOT NULL
headcount     int   NOT NULL
purpose       text  NOT NULL   -- 세미나/워크숍/리트릿 등
requests      text  NULL
status        enum  ('new' | 'in_progress' | 'completed')
created_at    timestamptz
```

---

## 핵심 비즈니스 로직

### 예약 상태 흐름
```
신청완료(pending) → 입금대기(awaiting_payment) → 입금완료(payment_received) → 예약확정(confirmed)
                                                                            → 취소(cancelled)
```

### 자동 취소 로직 (Vercel Cron, 매 10분)
- `status = 'awaiting_payment'` AND `deposit_deadline < NOW()` → `cancelled` 로 변경
- 취소 이메일 발송

### 날짜 가용성 체크
예약 가능 = `blocked_dates`에 없음 + `reservations`에서 해당 날짜에 `confirmed` 또는 `awaiting_payment` 상태 없음

### 후기 공개 정책
- 비회원 포함 모든 방문자: `status = 'approved'` 후기만 열람 가능
- 작성자: 본인 후기 작성 및 상태 확인만 가능 (타인 후기 관리 불가)

### 관리자
- 단일 관리자: `users.is_admin = true` 로 구분
- RLS: `is_admin = true` 계정만 모든 테이블 full access

### 환불 정책
| 취소 시점 | 환불율 |
|---|---|
| 체크인 7일 전 이상 | 100% |
| 체크인 2~6일 전 | 50% |
| 체크인 1일 전 ~ 당일 | 0% |

---

## 예약 조건

- 가격: 1박 1,000,000원 (파일럿 기준, 세부 정책 추후 확정)
- 최소 숙박: 1박 / 최대 숙박: 3박
- 입금 기한: 예약 신청 후 2시간
- 회원가입 필수 (비회원 예약 불가)

---

## 오시는 길 페이지 콘텐츠

**주소**: 경기도 여주시 왕대리 692-66
**핵심 요약**: "서울에서 단 1시간, 세종대왕의 숲에서 머무는 하루"
**랜드마크**: 세종대왕릉(영릉) 인근 (차량 5~10분)

### 경로 안내
| 출발지 | 경로 | 소요 시간 |
|---|---|---|
| 인천국제공항 | 공항고속도로 → 수도권순환고속도로 → 영동고속도로 → **여주IC** → 10분 | 약 1시간 30분 |
| 서울 강남 | 경부고속도로 → 신갈JC → 영동고속도로 → **여주IC** → 10분 | 약 1시간~1시간 10분 |
| 대중교통 | 경강선 → 여주역 → 버스/택시 | 1시간 30분+ |

**핵심 포인트**: 영동고속도로 + 여주IC → 세종대왕릉 방향 → 한옥 (3단계)

### 지도 섹션 UI 구성
- Google Maps 핀 삽입
- 3줄 요약: 서울 1시간 / 여주IC 10분 / 세종대왕릉 인근
- CTA: "길찾기 바로가기" (네이버 지도 + 카카오 지도 외부 링크)

### 주변 관광지 (홈페이지 콘텐츠용)
1. **세종대왕릉(영릉)** — 한글 창제 세종대왕 합장릉, 숲길 산책
2. **신륵사** — 남한강 절벽 사찰, 일몰/강변 뷰
3. **여주 프리미엄 아울렛** — 수도권 최대 아울렛
4. **여강길/남한강 자전거길** — 자연 트레킹

---

## UX/UI 원칙

- 디자인 컨셉: "조용한 고급스러움 + 자연 + 여백"
- 이미지 70% / 텍스트 30%
- 예약 CTA 항상 노출 (Sticky)
- 모바일 퍼스트
- Hero 문구: "서울에서 단 1시간, 세종대왕의 숲에서 머무는 하루"

---

## 페이지별 콘텐츠 (확정 문구)

### 이용 안내 페이지

인트로:
> 편안하고 조용한 휴식을 위해 아래 이용 수칙을 안내드립니다.
> 모든 이용객이 함께하는 공간인 만큼, 서로를 배려하는 마음으로 협조 부탁드립니다.

| 항목 | 내용 |
|---|---|
| 🌙 야간 이용 | 저녁 10시 이후 야외 정원 이용 자제. 실내 소음 유의. |
| 🔇 소음 | 고성방가·과도한 음주·소란 금지. 차분한 분위기 유지. |
| 🚗 주차 | 지정 주차 구역만 이용. 인근 주민 통행 배려. |
| ♻️ 쓰레기 | 분리 배출. 지정 분리수거 공간 이용. |
| 🚨 비상 상황 | 응급 시 안내된 비상 연락망으로 즉시 연락. |

클로징 메시지:
> 🙏 함께 만드는 공간
> 이곳은 자연과 이웃, 그리고 다음 방문객을 위해 함께 만들어가는 공간입니다.
> 작은 배려가 더 큰 쉼을 만듭니다. 감사합니다.

---

## MVP 개발 순서

```
1단계 (MVP)
├── Next.js 프로젝트 생성 + Supabase 연결
├── DB 스키마 마이그레이션
├── 이메일 인증 회원가입/로그인
├── 메인 + 공간소개 + 오시는 길 (정적 페이지)
├── 예약 캘린더 + 신청 폼
├── Vercel Cron 자동 취소
├── 이메일 알림
└── 관리자 대시보드

2단계
├── 후기 시스템
├── 마이페이지
└── B2B 상담 폼

3단계
└── 카카오 알림톡 연동 (/lib/notifications/kakao.ts 교체)
```
