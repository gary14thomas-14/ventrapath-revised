-- up
-- Store canonical approved blueprint versions.

create table if not exists blueprint_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  version_number integer not null,
  status text not null default 'ready',
  business_md text not null,
  market_md text not null,
  monetisation_md text not null,
  execution_md text not null,
  legal_md text not null,
  website_md text not null,
  risks_md text not null,
  country text not null,
  region text null,
  currency_code text not null,
  created_by_run_id uuid null references agent_runs(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint blueprint_versions_project_version_unique unique (project_id, version_number),
  constraint blueprint_versions_version_number_check check (version_number >= 1),
  constraint blueprint_versions_currency_code_length_check check (char_length(currency_code) = 3)
);

create index if not exists blueprint_versions_project_created_at_idx
  on blueprint_versions (project_id, created_at desc);
