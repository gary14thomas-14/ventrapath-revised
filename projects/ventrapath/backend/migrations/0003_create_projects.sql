-- up
-- Create top-level VentraPath project records.

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  raw_idea text not null,
  country text not null,
  region text null,
  currency_code text not null,
  hours_per_week integer null,
  status text not null,
  current_phase_number smallint not null default 0,
  latest_blueprint_version_number integer null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_current_phase_number_check check (current_phase_number >= 0 and current_phase_number <= 9),
  constraint projects_hours_per_week_check check (hours_per_week is null or (hours_per_week >= 1 and hours_per_week <= 168)),
  constraint projects_currency_code_length_check check (char_length(currency_code) = 3)
);

create index if not exists projects_user_id_idx
  on projects (user_id);

create index if not exists projects_user_updated_at_idx
  on projects (user_id, updated_at desc);
