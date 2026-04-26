# VentraPath Database Schema

## Purpose

Define the MVP database schema that supports:
- location-aware projects
- versioned blueprints
- phase generation
- task persistence
- weekly planning
- agent runs
- billing state

This is the operational schema behind the MVP API contract.

## Recommended database

- **Postgres**

Why:
- strong relational integrity
- JSON support where useful
- easy indexing
- good fit for versioned content + workflow state

## Core design rules

- relational first, JSON where structure may evolve
- user-facing outputs are versioned
- raw agent runs are stored separately from approved outputs
- project is the top-level business container
- phase/task state must survive regenerations
- location and currency are first-class data, not hidden metadata

---

## Main entities

1. users
2. projects
3. blueprint_versions
4. phase_instances
5. tasks
6. weekly_plans
7. agent_runs
8. files
9. subscriptions
10. audit_events

---

## 1) users

### Purpose
Application account owner.

### Columns
- `id` UUID PK
- `email` TEXT UNIQUE NOT NULL
- `name` TEXT NULL
- `auth_provider` TEXT NOT NULL
- `auth_provider_user_id` TEXT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Notes
Keep auth simple in MVP. Do not scatter user identity across project tables.

---

## 2) projects

### Purpose
Top-level VentraPath business/project record.

### Columns
- `id` UUID PK
- `user_id` UUID NOT NULL FK -> users.id
- `name` TEXT NOT NULL
- `raw_idea` TEXT NOT NULL
- `country` TEXT NOT NULL
- `region` TEXT NULL
- `currency_code` TEXT NOT NULL
- `hours_per_week` INTEGER NULL
- `status` TEXT NOT NULL
- `current_phase_number` SMALLINT NOT NULL DEFAULT 0
- `latest_blueprint_version_number` INTEGER NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Suggested enum values for `status`
- `draft`
- `blueprint_generating`
- `blueprint_ready`
- `in_progress`
- `archived`

### Notes
`currency_code` should be derived from location input unless explicitly overridden later.

---

## 3) blueprint_versions

### Purpose
Canonical user-facing Phase 0 outputs.

### Columns
- `id` UUID PK
- `project_id` UUID NOT NULL FK -> projects.id
- `version_number` INTEGER NOT NULL
- `status` TEXT NOT NULL DEFAULT 'ready'
- `business_md` TEXT NOT NULL
- `market_md` TEXT NOT NULL
- `monetisation_md` TEXT NOT NULL
- `execution_md` TEXT NOT NULL
- `legal_md` TEXT NOT NULL
- `website_md` TEXT NOT NULL
- `risks_md` TEXT NOT NULL
- `country` TEXT NOT NULL
- `region` TEXT NULL
- `currency_code` TEXT NOT NULL
- `created_by_run_id` UUID NULL FK -> agent_runs.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Constraints
- UNIQUE (`project_id`, `version_number`)

### Notes
Store rendered user-facing markdown/text here. Keep this clean and final.

---

## 4) phase_instances

### Purpose
Per-project phase records for Phases 1-9 plus Phase 0 state if useful.

### Columns
- `id` UUID PK
- `project_id` UUID NOT NULL FK -> projects.id
- `phase_number` SMALLINT NOT NULL
- `title` TEXT NOT NULL
- `state` TEXT NOT NULL
- `summary_md` TEXT NULL
- `generated_content_json` JSONB NULL
- `latest_run_id` UUID NULL FK -> agent_runs.id
- `generated_at` TIMESTAMPTZ NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Suggested enum values for `state`
- `locked`
- `available`
- `generating`
- `ready`
- `complete`

### Constraints
- UNIQUE (`project_id`, `phase_number`)

### Notes
Use `generated_content_json` for structured phase payloads that may evolve during MVP.

---

## 5) tasks

### Purpose
Actionable tasks inside a phase.

### Columns
- `id` UUID PK
- `project_id` UUID NOT NULL FK -> projects.id
- `phase_instance_id` UUID NOT NULL FK -> phase_instances.id
- `sort_order` INTEGER NOT NULL DEFAULT 0
- `title` TEXT NOT NULL
- `what_to_do_md` TEXT NOT NULL
- `how_to_do_it_md` TEXT NOT NULL
- `execution_reference_md` TEXT NULL
- `status` TEXT NOT NULL DEFAULT 'open'
- `is_required` BOOLEAN NOT NULL DEFAULT false
- `completed_at` TIMESTAMPTZ NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Suggested enum values for `status`
- `open`
- `in_progress`
- `complete`
- `skipped`

### Notes
Do not delete tasks on regeneration unless the product deliberately supports that. Prefer version-aware replacement or soft transitions later.

---

## 6) weekly_plans

### Purpose
Time-aware execution plans based on user availability.

### Columns
- `id` UUID PK
- `project_id` UUID NOT NULL FK -> projects.id
- `hours_per_week` INTEGER NOT NULL
- `plan_json` JSONB NOT NULL
- `created_by_run_id` UUID NULL FK -> agent_runs.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Notes
Multiple plans can exist historically. Frontend usually reads the latest one.

---

## 7) agent_runs

### Purpose
Track backend orchestration jobs and generation history.

### Columns
- `id` UUID PK
- `project_id` UUID NOT NULL FK -> projects.id
- `run_type` TEXT NOT NULL
- `phase_number` SMALLINT NULL
- `status` TEXT NOT NULL
- `triggered_by_user_id` UUID NULL FK -> users.id
- `input_json` JSONB NOT NULL
- `routing_json` JSONB NULL
- `raw_output_json` JSONB NULL
- `validated_output_json` JSONB NULL
- `error_code` TEXT NULL
- `error_message` TEXT NULL
- `started_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `finished_at` TIMESTAMPTZ NULL

### Suggested enum values for `run_type`
- `blueprint_generation`
- `phase_generation`
- `weekly_plan_generation`
- `blueprint_regeneration`

### Suggested enum values for `status`
- `queued`
- `running`
- `completed`
- `failed`
- `cancelled`

### Notes
This table is for orchestration truth, not direct UI rendering.

---

## 8) files

### Purpose
Track uploaded or generated artifacts stored in object storage.

### Columns
- `id` UUID PK
- `project_id` UUID NOT NULL FK -> projects.id
- `uploaded_by_user_id` UUID NULL FK -> users.id
- `kind` TEXT NOT NULL
- `storage_key` TEXT NOT NULL
- `filename` TEXT NOT NULL
- `mime_type` TEXT NOT NULL
- `size_bytes` BIGINT NULL
- `metadata_json` JSONB NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example `kind` values
- `export`
- `attachment`
- `screenshot`
- `reference`

---

## 9) subscriptions

### Purpose
Track SaaS billing state.

### Columns
- `id` UUID PK
- `user_id` UUID NOT NULL FK -> users.id
- `provider` TEXT NOT NULL
- `provider_customer_id` TEXT NOT NULL
- `provider_subscription_id` TEXT NULL
- `plan_code` TEXT NOT NULL
- `status` TEXT NOT NULL
- `current_period_end` TIMESTAMPTZ NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Suggested enum values for `status`
- `trialing`
- `active`
- `past_due`
- `cancelled`

---

## 10) audit_events

### Purpose
Cheap operational trail for important state changes.

### Columns
- `id` UUID PK
- `project_id` UUID NULL FK -> projects.id
- `user_id` UUID NULL FK -> users.id
- `event_type` TEXT NOT NULL
- `payload_json` JSONB NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example `event_type` values
- `project.created`
- `blueprint.generated`
- `task.completed`
- `phase.generated`
- `weekly_plan.created`

---

## Relationships

### users -> projects
- one user has many projects

### projects -> blueprint_versions
- one project has many blueprint versions

### projects -> phase_instances
- one project has many phase instances

### phase_instances -> tasks
- one phase instance has many tasks

### projects -> weekly_plans
- one project has many weekly plans

### projects -> agent_runs
- one project has many agent runs

### users -> subscriptions
- one user usually has one active subscription

---

## Required indexes

### projects
- INDEX (`user_id`, `updated_at` DESC)
- INDEX (`status`)

### blueprint_versions
- UNIQUE (`project_id`, `version_number`)
- INDEX (`project_id`, `created_at` DESC)

### phase_instances
- UNIQUE (`project_id`, `phase_number`)
- INDEX (`project_id`, `state`)

### tasks
- INDEX (`phase_instance_id`, `sort_order`)
- INDEX (`project_id`, `status`)

### weekly_plans
- INDEX (`project_id`, `created_at` DESC)

### agent_runs
- INDEX (`project_id`, `started_at` DESC)
- INDEX (`status`)
- INDEX (`run_type`)

### subscriptions
- UNIQUE (`provider`, `provider_customer_id`)
- INDEX (`user_id`, `status`)

### audit_events
- INDEX (`project_id`, `created_at` DESC)

---

## Validation rules worth enforcing in backend

### project creation
- `country` required
- `currency_code` required
- `raw_idea` required

### blueprint save
- all seven blueprint sections required
- location fields required
- version number must increment cleanly

### task completion
- task must belong to the project user is editing
- completion timestamps only when status becomes `complete`

### weekly plan creation
- `hours_per_week` must be positive and realistic

---

## Schema choice notes

### Why store blueprint sections as columns instead of one big JSON blob?
Because:
- UI sections are fixed and important
- validation is cleaner
- querying is easier
- future per-section editing is easier

### Why store phase content as JSONB?
Because phase structures may evolve during MVP.
Keep the rigid bits relational, the evolving phase payload flexible.

### Why store raw agent output separately from blueprint_versions?
Because raw specialist/orchestration output is internal working state.
The blueprint version is the approved user-facing artifact.
Mixing them will get messy.

---

## Example Postgres DDL starter

```sql
create table users (
  id uuid primary key,
  email text not null unique,
  name text,
  auth_provider text not null,
  auth_provider_user_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key,
  user_id uuid not null references users(id),
  name text not null,
  raw_idea text not null,
  country text not null,
  region text,
  currency_code text not null,
  hours_per_week integer,
  status text not null,
  current_phase_number smallint not null default 0,
  latest_blueprint_version_number integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table agent_runs (
  id uuid primary key,
  project_id uuid not null references projects(id),
  run_type text not null,
  phase_number smallint,
  status text not null,
  triggered_by_user_id uuid references users(id),
  input_json jsonb not null,
  routing_json jsonb,
  raw_output_json jsonb,
  validated_output_json jsonb,
  error_code text,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table blueprint_versions (
  id uuid primary key,
  project_id uuid not null references projects(id),
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
  region text,
  currency_code text not null,
  created_by_run_id uuid references agent_runs(id),
  created_at timestamptz not null default now(),
  unique (project_id, version_number)
);

create table phase_instances (
  id uuid primary key,
  project_id uuid not null references projects(id),
  phase_number smallint not null,
  title text not null,
  state text not null,
  summary_md text,
  generated_content_json jsonb,
  latest_run_id uuid references agent_runs(id),
  generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, phase_number)
);

create table tasks (
  id uuid primary key,
  project_id uuid not null references projects(id),
  phase_instance_id uuid not null references phase_instances(id),
  sort_order integer not null default 0,
  title text not null,
  what_to_do_md text not null,
  how_to_do_it_md text not null,
  execution_reference_md text,
  status text not null default 'open',
  is_required boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table weekly_plans (
  id uuid primary key,
  project_id uuid not null references projects(id),
  hours_per_week integer not null,
  plan_json jsonb not null,
  created_by_run_id uuid references agent_runs(id),
  created_at timestamptz not null default now()
);

create table files (
  id uuid primary key,
  project_id uuid not null references projects(id),
  uploaded_by_user_id uuid references users(id),
  kind text not null,
  storage_key text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint,
  metadata_json jsonb,
  created_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key,
  user_id uuid not null references users(id),
  provider text not null,
  provider_customer_id text not null,
  provider_subscription_id text,
  plan_code text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audit_events (
  id uuid primary key,
  project_id uuid references projects(id),
  user_id uuid references users(id),
  event_type text not null,
  payload_json jsonb,
  created_at timestamptz not null default now()
);
```

---

## Bottom line

This schema is enough to build the real MVP backend without jamming product state into the frontend.

It gives VentraPath:
- durable project state
- versioned blueprint storage
- phase/task persistence
- weekly planning
- run tracking
- clean billing hooks
