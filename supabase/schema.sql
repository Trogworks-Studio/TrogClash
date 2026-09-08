-- Trog Clash / Trogworks Studyo — Supabase schema
-- Run this in the Supabase SQL editor for your project.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  level integer not null default 1,
  xp integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone signed in can read all profiles (needed for the public leaderboard).
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- A user can only create their own profile row.
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- A user can only update their own profile row.
-- NOTE: this is a client-authoritative MVP — the client reports match
-- results directly. Good enough for a single-player-vs-bot prototype;
-- once real PvP ships, move XP updates to a server-side function backed
-- by a match ledger so results can't be spoofed from the browser.
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Handy view for the leaderboard page: top players by level then xp.
create or replace view public.leaderboard as
  select username, level, xp, wins, losses
  from public.profiles
  order by level desc, xp desc, wins desc
  limit 100;
