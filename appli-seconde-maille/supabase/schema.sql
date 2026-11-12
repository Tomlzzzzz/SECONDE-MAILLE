-- =====================================================================
-- SECONDE MAILLE — base de données des comptes (Supabase)
-- À coller une fois dans Supabase : SQL Editor → New query → Run
-- =====================================================================

-- Sauvegarde complète de chaque membre (dépôts, parties, bons, profil…)
create table if not exists public.saves (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Profil public : pseudo + score (pour de vrais classements entre membres)
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  pseudo     text,
  color      text,
  member_id  text,
  points     integer not null default 0,
  grams      integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Sécurité : chacun ne lit et n'écrit QUE sa propre sauvegarde
alter table public.saves enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "lire ma sauvegarde" on public.saves;
drop policy if exists "créer ma sauvegarde" on public.saves;
drop policy if exists "modifier ma sauvegarde" on public.saves;
create policy "lire ma sauvegarde" on public.saves for select to authenticated using (auth.uid() = user_id);
create policy "créer ma sauvegarde" on public.saves for insert to authenticated with check (auth.uid() = user_id);
create policy "modifier ma sauvegarde" on public.saves for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Profils : lisibles par tous les membres connectés, modifiables par leur propriétaire
drop policy if exists "voir les profils" on public.profiles;
drop policy if exists "créer mon profil" on public.profiles;
drop policy if exists "modifier mon profil" on public.profiles;
create policy "voir les profils" on public.profiles for select to authenticated using (true);
create policy "créer mon profil" on public.profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "modifier mon profil" on public.profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
