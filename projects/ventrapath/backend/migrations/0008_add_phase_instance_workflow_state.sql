-- up
-- Persist workflow-oriented phase state separately from generated content.

alter table phase_instances
  add column if not exists user_state jsonb not null default '{}'::jsonb,
  add column if not exists progress jsonb not null default '{}'::jsonb;
