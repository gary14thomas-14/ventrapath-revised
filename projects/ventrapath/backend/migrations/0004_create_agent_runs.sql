-- up
-- Track orchestration and generation runs.

create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  run_type text not null,
  phase_number smallint null,
  status text not null,
  triggered_by_user_id uuid null references users(id) on delete set null,
  input_json jsonb not null,
  routing_json jsonb null,
  raw_output_json jsonb null,
  validated_output_json jsonb null,
  error_code text null,
  error_message text null,
  started_at timestamptz not null default now(),
  finished_at timestamptz null,
  constraint agent_runs_phase_number_check check (phase_number is null or (phase_number >= 0 and phase_number <= 9))
);

create index if not exists agent_runs_project_id_idx
  on agent_runs (project_id);

create index if not exists agent_runs_project_started_at_idx
  on agent_runs (project_id, started_at desc);

create index if not exists agent_runs_project_status_idx
  on agent_runs (project_id, status);
