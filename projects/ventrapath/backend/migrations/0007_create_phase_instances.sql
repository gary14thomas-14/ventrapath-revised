-- up
-- Store generated phase outputs with one current record per project/phase.

create table if not exists phase_instances (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  phase_number smallint not null,
  title text not null,
  state text not null,
  summary text not null,
  generated_content jsonb not null,
  tasks jsonb not null default '[]'::jsonb,
  latest_run_id uuid null references agent_runs(id) on delete set null,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint phase_instances_project_phase_unique unique (project_id, phase_number),
  constraint phase_instances_phase_number_check check (phase_number >= 1 and phase_number <= 9)
);

create index if not exists phase_instances_project_phase_idx
  on phase_instances (project_id, phase_number);

create index if not exists phase_instances_project_updated_at_idx
  on phase_instances (project_id, updated_at desc);
