-- =========================================================================
-- JARDINS DE BALI MARRAKECH MENARA — SUPABASE CLOUD SCHEMA (PostgreSQL)
-- Exécutez ce script une seule fois dans : Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. Table des comptes Acquéreurs, Prospects & Promoteur
create table if not exists public.jdb_accounts (
  id text primary key,
  email text unique not null,
  password text not null,
  name text not null,
  phone text not null default '',
  role text not null default 'client' check (role in ('client', 'admin')),
  assigned_lot_id text,
  financial_profile jsonb not null default '{"totalPrice":0,"payments":[]}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Table des rendez-vous Visite Privée & Visite Chantier
create table if not exists public.jdb_visits (
  id text primary key,
  user_id text not null references public.jdb_accounts(id) on delete cascade,
  client_name text not null,
  client_phone text not null default '',
  date text not null,
  time_slot text not null,
  lot_interest text not null default '',
  status text not null default 'En attente' check (status in ('En attente', 'Confirmé', 'Terminé')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

-- 3. Table de suivi chantier global (ligne unique id = 1)
create table if not exists public.jdb_chantier (
  id int primary key default 1 check (id = 1),
  progress_percent int not null default 68 check (progress_percent >= 0 and progress_percent <= 100),
  current_phase text not null default 'Gros œuvre & Façades',
  last_update text not null default '23/11/2026'
);

insert into public.jdb_chantier (id, progress_percent, current_phase, last_update)
values (1, 68, 'Gros œuvre & Façades', '23/11/2026')
on conflict (id) do nothing;

-- 4. Politiques Row Level Security (RLS)
alter table public.jdb_accounts enable row level security;
alter table public.jdb_visits enable row level security;
alter table public.jdb_chantier enable row level security;

drop policy if exists "jdb_accounts_all" on public.jdb_accounts;
create policy "jdb_accounts_all" on public.jdb_accounts
  for all using (true) with check (true);

drop policy if exists "jdb_visits_all" on public.jdb_visits;
create policy "jdb_visits_all" on public.jdb_visits
  for all using (true) with check (true);

drop policy if exists "jdb_chantier_all" on public.jdb_chantier;
create policy "jdb_chantier_all" on public.jdb_chantier
  for all using (true) with check (true);

-- 5. Activer Realtime pour synchronisation instantanée Client <-> Admin
alter publication supabase_realtime add table public.jdb_accounts;
alter publication supabase_realtime add table public.jdb_visits;
alter publication supabase_realtime add table public.jdb_chantier;
