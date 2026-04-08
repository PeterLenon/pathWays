-- Migration: 001_initial
-- Creates the two tables needed for the save-and-revisit feature.
-- Both tables use Row Level Security so users can only access their own data.
--
-- Run against your Supabase project via the SQL editor or:
--   supabase db push

-- ── user_profiles ────────────────────────────────────────────────────────────
-- Stores the intake form answers for each authenticated user.
-- One row per user (upserted on each submission).

create table if not exists public.user_profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  intake_data jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint user_profiles_user_id_unique unique (user_id)
);

-- Keep updated_at current automatically
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- RLS: each user sees only their own profile
alter table public.user_profiles enable row level security;

create policy "Users read own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "Users insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users update own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);


-- ── saved_results ─────────────────────────────────────────────────────────────
-- Stores the full PathwayAnalysisResult JSON for each analysis a user saves.
-- Multiple rows per user (one per save action).

create table if not exists public.saved_results (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  pathway_results jsonb not null,
  -- Denormalized summary for fast display on the profile dashboard
  -- without deserializing the full JSON blob.
  pathway_count   smallint not null default 0,
  created_at      timestamptz not null default now()
);

create index saved_results_user_id_idx on public.saved_results (user_id, created_at desc);

-- RLS: each user sees only their own saved results
alter table public.saved_results enable row level security;

create policy "Users read own saved results"
  on public.saved_results for select
  using (auth.uid() = user_id);

create policy "Users insert own saved results"
  on public.saved_results for insert
  with check (auth.uid() = user_id);

create policy "Users delete own saved results"
  on public.saved_results for delete
  using (auth.uid() = user_id);
