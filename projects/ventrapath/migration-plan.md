# VentraPath Migration Plan

## Purpose

Turn the schema design into an actual migration sequence.

This is the database rollout plan for the MVP.
It answers:
- what tables land first
- what depends on what
- what should be nullable early vs strict later
- what indexes and constraints matter now
- how to avoid painting the build into a stupid corner

---

## Core rule

Migrations should follow the first vertical slices, not theoretical completeness.

That means:
1. create the minimum schema for **Project + Blueprint**
2. then add **Phase Engine + Tasks**
3. then add **Weekly Planning**
4. then add **Billing / Files / Audit**

Do not dump the whole schema in one giant migration unless you enjoy debugging avoidable mess.

---

## Database choice

- **Postgres**

Recommended conventions:
- UUID primary keys
- `TIMESTAMPTZ` for all timestamps
- snake_case in DB
- app-level camelCase mapping in TypeScript
- JSONB only where payload shape will evolve during MVP

---

## Migration stages

### Stage 0 — Migration tooling + baseline extensions

**Goal:** make migrations repeatable before real schema lands.

### Migration 0001 — bootstrap database
Create:
- UUID support extension if needed (`pgcrypto` or equivalent)
- migration metadata table if the migration tool requires one

**Notes:**
- choose one UUID strategy early and stick to it
- document local/dev/prod migration command flow here, not later

---

## Stage 1 — Users, Projects, Runs

This supports the first real product slice.

### Migration 0002 — create `users`
Columns:
- `id`
- `email`
- `name`
- `auth_provider`
- `auth_provider_user_id`
- `created_at`
- `updated_at`

Indexes / constraints:
- PK on `id`
- UNIQUE on `email`
- optional composite index on (`auth_provider`, `auth_provider_user_id`) if auth provider lookup is used heavily

### Migration 0003 — create `projects`
Columns:
- `id`
- `user_id`
- `name`
- `raw_idea`
- `country`
- `region`
- `currency_code`
- `hours_per_week`
- `status`
- `current_phase_number`
- `latest_blueprint_version_number`
- `created_at`
- `updated_at`

Indexes / constraints:
- PK on `id`
- FK `user_id -> users.id`
- index on `user_id`
- index on (`user_id`, `updated_at desc`)
- check `current_phase_number >= 0 and current_phase_number <= 9`

### Migration 0004 — create `agent_runs`
Columns:
- `id`
- `project_id`
- `run_type`
- `phase_number`
- `status`
- `triggered_by_user_id`
- `input_json`
- `routing_json`
- `raw_output_json`
- `validated_output_json`
- `error_code`
- `error_message`
- `started_at`
- `finished_at`

Indexes / constraints:
- PK on `id`
- FK `project_id -> projects.id`
- FK `triggered_by_user_id -> users.id`
- index on `project_id`
- index on (`project_id`, `started_at desc`)
- index on (`project_id`, `status`)
- check `phase_number is null or (phase_number >= 0 and phase_number <= 9)`

**Why this stage first:**
Without users, projects, and runs, nothing meaningful can happen.

---

## Stage 2 — Blueprint persistence

This completes the first vertical slice.

### Migration 0005 — create `blueprint_versions`
Columns:
- `id`
- `project_id`
- `version_number`
- `status`
- `business_md`
- `market_md`
- `monetisation_md`
- `execution_md`
- `legal_md`
- `website_md`
- `risks_md`
- `country`
- `region`
- `currency_code`
- `created_by_run_id`
- `created_at`

Indexes / constraints:
- PK on `id`
- FK `project_id -> projects.id`
- FK `created_by_run_id -> agent_runs.id`
- UNIQUE (`project_id`, `version_number`)
- index on (`project_id`, `created_at desc`)

### Migration 0006 — tighten project linkage to latest blueprint
Optional early, but recommended once the blueprint path works.

Changes:
- add FK from `projects.latest_blueprint_version_number` only if you model latest via number safely
- or better: leave number only and resolve latest from `blueprint_versions`

**Recommendation:**
For MVP, do **not** use a fragile composite FK here.
Keep `latest_blueprint_version_number` as a convenience field updated by app logic.
It is simpler and less annoying.

---

## Stage 3 — Phase engine

This unlocks the guided execution system.

### Migration 0007 — create `phase_instances`
Columns:
- `id`
- `project_id`
- `phase_number`
- `title`
- `state`
- `summary_md`
- `generated_content_json`
- `latest_run_id`
- `generated_at`
- `created_at`
- `updated_at`

Indexes / constraints:
- PK on `id`
- FK `project_id -> projects.id`
- FK `latest_run_id -> agent_runs.id`
- UNIQUE (`project_id`, `phase_number`)
- index on `project_id`
- check `phase_number >= 1 and phase_number <= 9`

### Migration 0008 — seed default phase rows
Create one row per phase number 1-9 for each existing project.

Recommended initial states:
- phase 1 = `available` if blueprint exists
- phases 2-9 = `locked`

**Recommendation:**
Do this with an idempotent backfill script or migration-safe SQL.
Do not rely on hand-created rows later.

### Migration 0009 — create `tasks`
Columns:
- `id`
- `project_id`
- `phase_instance_id`
- `sort_order`
- `title`
- `what_to_do_md`
- `how_to_do_it_md`
- `execution_reference_md`
- `status`
- `is_required`
- `completed_at`
- `created_at`
- `updated_at`

Indexes / constraints:
- PK on `id`
- FK `project_id -> projects.id`
- FK `phase_instance_id -> phase_instances.id`
- index on `phase_instance_id`
- index on (`project_id`, `phase_instance_id`, `sort_order`)
- index on (`project_id`, `status`)

**Important note:**
Do not add hard uniqueness on task title.
Regeneration and repeated task patterns will make that annoying fast.

---

## Stage 4 — Weekly planning

### Migration 0010 — create `weekly_plans`
Columns:
- `id`
- `project_id`
- `hours_per_week`
- `plan_json`
- `created_by_run_id`
- `created_at`

Indexes / constraints:
- PK on `id`
- FK `project_id -> projects.id`
- FK `created_by_run_id -> agent_runs.id`
- index on (`project_id`, `created_at desc`)

**Why separate:**
Weekly planning is useful, but it is not needed to prove the first blueprint or first phase slices.

---

## Stage 5 — Files, Billing, Audit

These are real needs, just not first-slice needs.

### Migration 0011 — create `files`
Recommended columns:
- `id`
- `project_id`
- `storage_provider`
- `storage_key`
- `original_filename`
- `mime_type`
- `size_bytes`
- `kind`
- `created_at`

Indexes:
- index on `project_id`
- index on (`project_id`, `kind`)

### Migration 0012 — create `subscriptions`
Recommended columns:
- `id`
- `user_id`
- `provider`
- `provider_customer_id`
- `provider_subscription_id`
- `plan_code`
- `status`
- `current_period_end`
- `created_at`
- `updated_at`

Indexes / constraints:
- FK `user_id -> users.id`
- index on `user_id`
- UNIQUE on `provider_subscription_id` where not null

### Migration 0013 — create `audit_events`
Recommended columns:
- `id`
- `user_id`
- `project_id`
- `event_type`
- `payload_json`
- `created_at`

Indexes:
- index on `project_id`
- index on (`project_id`, `created_at desc`)
- index on (`user_id`, `created_at desc`)

---

## Recommended enum strategy

For MVP, use **TEXT + app validation + DB CHECK constraints**.

Do **not** rush into Postgres enum types unless there is a strong reason.
Why:
- changing Postgres enums later is more annoying than people pretend
- MVP state values may still evolve

Recommended checked fields:
- `projects.status`
- `phase_instances.state`
- `tasks.status`
- `agent_runs.run_type`
- `agent_runs.status`
- `subscriptions.status`

---

## Recommended nullability strategy

### Strict from the start
Keep NOT NULL on:
- foreign keys that define ownership
- markdown sections for approved blueprints
- task core fields
- timestamps
- project location core (`country`, `currency_code`)

### Nullable early on purpose
Allow NULL for:
- `projects.hours_per_week`
- `projects.latest_blueprint_version_number`
- `phase_instances.summary_md`
- `phase_instances.generated_content_json` before first generation
- `phase_instances.latest_run_id`
- `phase_instances.generated_at`
- `tasks.execution_reference_md`
- `weekly_plans.created_by_run_id`
- `agent_runs.phase_number`
- `agent_runs.finished_at`
- billing external ids before checkout completes

This avoids fake defaults that smell tidy but mean nothing.

---

## Recommended indexes that actually matter

### Must-have now
- `projects(user_id, updated_at desc)`
- `blueprint_versions(project_id, created_at desc)`
- `phase_instances(project_id, phase_number)` unique
- `tasks(phase_instance_id)`
- `tasks(project_id, status)`
- `weekly_plans(project_id, created_at desc)`
- `agent_runs(project_id, started_at desc)`

### Nice later if needed
- GIN on JSONB fields if query patterns justify it
- partial index on incomplete tasks
- partial index on running agent runs

Do not spray indexes everywhere on day one. That’s how you get slow writes for no payoff.

---

## Backfill rules

### When adding phase system to existing projects
Backfill:
- `phase_instances` rows 1-9
- phase 1 available only if blueprint exists
- later phases locked

### When adding weekly plans later
No backfill required unless the product wants retro-history.

### When adding billing later
Keep existing users accessible under a sensible default access rule until billing is wired.
Do not accidentally lock out the whole app because a Stripe table arrived.

---

## Regeneration safety notes

This matters early.

Recommended MVP rule:
- `blueprint_versions` are append-only
- `agent_runs` are append-only
- `phase_instances` are current-state records
- `tasks` should be replaceable with care, not blindly deleted

Recommended future improvement:
- add `superseded_at` or `generation_version` to tasks once regeneration semantics get more complex

For now, keep the first migration simple and let app logic own safe replacement.

---

## Recommended migration order summary

1. `0001_bootstrap_database`
2. `0002_create_users`
3. `0003_create_projects`
4. `0004_create_agent_runs`
5. `0005_create_blueprint_versions`
6. `0006_project_blueprint_link_cleanup`
7. `0007_create_phase_instances`
8. `0008_seed_phase_instances`
9. `0009_create_tasks`
10. `0010_create_weekly_plans`
11. `0011_create_files`
12. `0012_create_subscriptions`
13. `0013_create_audit_events`

---

## Recommended first implementation pairings

### Sprint 1 migrations
- `0001`
- `0002`
- `0003`
- `0004`
- `0005`

Supports:
- project creation
- run tracking
- blueprint persistence

### Sprint 2 migrations
- `0007`
- `0008`
- `0009`

Supports:
- phase engine
- Brand phase
- tasks

### Sprint 3 migrations
- `0010`

Supports:
- weekly planning

### Sprint 4 migrations
- `0011`
- `0012`
- `0013`

Supports:
- billing
- files
- auditability

---

## What should not be in the first migration

Do not put these into the first DB pass:
- overbuilt analytics tables
- notification tables you are not yet using
- realtime/session presence junk
- deep reporting materializations
- huge JSONB search indexes with no query need

That stuff can wait. The product loop cannot.

---

## Bottom line

VentraPath migration order should mirror the product spine:

**users -> projects -> runs -> blueprints -> phases -> tasks -> weekly plans -> billing/files/audit**

That gets the database moving in the same order the product becomes real.
