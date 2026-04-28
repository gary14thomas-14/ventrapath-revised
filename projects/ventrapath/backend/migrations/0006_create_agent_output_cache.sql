-- up
-- Cache structured agent outputs for reuse across blueprint and phase generation.

create table if not exists agent_output_cache (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  phase_number smallint null,
  step_key text null,
  agent_id text not null,
  task_kind text not null,
  cache_key text not null,
  model text not null,
  prompt_version_hash text not null,
  normalized_input_hash text not null,
  dependency_hash text not null,
  status text not null default 'ready',
  output_json jsonb not null,
  source_meta_json jsonb null,
  expires_at timestamptz null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now(),
  constraint agent_output_cache_cache_key_unique unique (cache_key),
  constraint agent_output_cache_phase_number_check check (phase_number is null or (phase_number >= 0 and phase_number <= 9))
);

create index if not exists agent_output_cache_project_phase_idx
  on agent_output_cache (project_id, phase_number);

create index if not exists agent_output_cache_agent_created_at_idx
  on agent_output_cache (agent_id, created_at desc);

create index if not exists agent_output_cache_expires_at_idx
  on agent_output_cache (expires_at);
