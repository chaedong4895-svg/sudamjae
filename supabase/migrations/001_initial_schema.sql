-- ──────────────────────────────────────────────
-- 1. ENUM 타입
-- ──────────────────────────────────────────────
create type reservation_status as enum (
  'pending',            -- 신청완료
  'awaiting_payment',   -- 입금대기
  'payment_received',   -- 입금완료
  'confirmed',          -- 예약확정
  'cancelled'           -- 취소
);

create type review_status as enum (
  'registered',  -- 등록됨
  'reviewing',   -- 검토중
  'approved',    -- 승인됨
  'hidden'       -- 비공개
);

create type b2b_status as enum (
  'new',
  'in_progress',
  'completed'
);

-- ──────────────────────────────────────────────
-- 2. users (Supabase Auth 연동)
-- ──────────────────────────────────────────────
create table public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  phone      text not null,
  is_admin   boolean not null default false,
  created_at timestamptz not null default now()
);

-- ──────────────────────────────────────────────
-- 3. blocked_dates (관리자 날짜 차단)
-- ──────────────────────────────────────────────
create table public.blocked_dates (
  id         uuid primary key default gen_random_uuid(),
  date       date not null unique,
  reason     text,
  created_at timestamptz not null default now()
);

-- ──────────────────────────────────────────────
-- 4. reservations
-- ──────────────────────────────────────────────
create table public.reservations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  check_in_date    date not null,
  check_out_date   date not null,
  nights           int not null check (nights between 1 and 3),
  guests           int not null check (guests >= 1),
  total_price      int not null check (total_price > 0),
  status           reservation_status not null default 'pending',
  deposit_deadline timestamptz,           -- created_at + 2시간, 앱 레이어에서 설정
  cancelled_at     timestamptz,
  cancel_reason    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint valid_dates check (check_out_date > check_in_date)
);

-- updated_at 자동 갱신 트리거
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger reservations_updated_at
  before update on public.reservations
  for each row execute function update_updated_at();

-- ──────────────────────────────────────────────
-- 5. reviews
-- ──────────────────────────────────────────────
create table public.reviews (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  reservation_id uuid unique references public.reservations(id) on delete cascade,  -- nullable: 관리자 직접 등록 허용
  reviewer_name  text,                                                               -- 관리자 등록 시 표시 이름 (예: 김**)
  rating         int not null check (rating between 1 and 5),
  content        text not null,
  image_urls     text[],
  status         review_status not null default 'registered',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger reviews_updated_at
  before update on public.reviews
  for each row execute function update_updated_at();

-- ──────────────────────────────────────────────
-- 6. b2b_inquiries
-- ──────────────────────────────────────────────
create table public.b2b_inquiries (
  id            uuid primary key default gen_random_uuid(),
  company_name  text not null,
  contact_name  text not null,
  contact_email text not null,
  contact_phone text not null,
  headcount     int not null check (headcount >= 1),
  purpose       text not null,
  requests      text,
  status        b2b_status not null default 'new',
  created_at    timestamptz not null default now()
);

-- ──────────────────────────────────────────────
-- 7. Row Level Security (RLS)
-- ──────────────────────────────────────────────
alter table public.users enable row level security;
alter table public.reservations enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.reviews enable row level security;
alter table public.b2b_inquiries enable row level security;

-- users
create policy "본인 프로필 조회" on public.users for select using (auth.uid() = id);
create policy "본인 프로필 수정" on public.users for update using (auth.uid() = id);
create policy "관리자 전체 조회" on public.users for select using (
  exists (select 1 from public.users where id = auth.uid() and is_admin = true)
);

-- reservations
create policy "본인 예약 조회" on public.reservations for select using (auth.uid() = user_id);
create policy "본인 예약 신청" on public.reservations for insert with check (auth.uid() = user_id);
create policy "관리자 전체 예약 접근" on public.reservations for all using (
  exists (select 1 from public.users where id = auth.uid() and is_admin = true)
);

-- blocked_dates: 누구나 읽기, 관리자만 쓰기
create policy "누구나 차단 날짜 조회" on public.blocked_dates for select using (true);
create policy "관리자 차단 날짜 관리" on public.blocked_dates for all using (
  exists (select 1 from public.users where id = auth.uid() and is_admin = true)
);

-- reviews: 승인된 것은 누구나, 본인 것은 본인만
create policy "승인된 후기 공개 조회" on public.reviews for select using (status = 'approved');
create policy "본인 후기 조회" on public.reviews for select using (auth.uid() = user_id);
create policy "본인 후기 작성" on public.reviews for insert with check (auth.uid() = user_id);
create policy "관리자 후기 전체 접근" on public.reviews for all using (
  exists (select 1 from public.users where id = auth.uid() and is_admin = true)
);

-- b2b_inquiries: 누구나 등록, 관리자만 조회
create policy "누구나 B2B 문의 등록" on public.b2b_inquiries for insert with check (true);
create policy "관리자 B2B 전체 접근" on public.b2b_inquiries for all using (
  exists (select 1 from public.users where id = auth.uid() and is_admin = true)
);

-- ──────────────────────────────────────────────
-- 8. 유용한 뷰: 예약 가능 날짜 확인용
-- ──────────────────────────────────────────────
create or replace view public.unavailable_dates as
  -- 예약확정 또는 입금대기 중인 날짜
  select generate_series(check_in_date, check_out_date - 1, '1 day'::interval)::date as date
  from public.reservations
  where status in ('confirmed', 'awaiting_payment')
  union
  -- 관리자 차단 날짜
  select date from public.blocked_dates;
