# Phase Instance Persistence Model

Status: current implementation
Last updated: 2026-04-29

This file captures the persisted shape for guided phase outputs.

## Purpose

`phase_instances` stores the current generated output for a project/phase pair.

The current live use is:
- Phase 1 Brand
- Phase 2 Legal

## Postgres table

Migration: `backend/migrations/0007_create_phase_instances.sql`

Columns:
- `id uuid primary key`
- `project_id uuid not null references projects(id) on delete cascade`
- `phase_number smallint not null`
- `title text not null`
- `state text not null`
- `summary text not null`
- `generated_content jsonb not null`
- `tasks jsonb not null default '[]'::jsonb`
- `latest_run_id uuid null references agent_runs(id) on delete set null`
- `generated_at timestamptz not null default now()`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:
- unique `(project_id, phase_number)`
- `phase_number` must be between `1` and `9`

Indexes:
- `(project_id, phase_number)`
- `(project_id, updated_at desc)`

## JSON store equivalent

JSON mode stores phase instances in:
- `backend/.data/projects.json`
- collection key: `phaseInstances`

The record shape mirrors the API shape closely.

## Current upsert rules

On generation:
- insert a new phase instance if none exists for the project/phase
- otherwise replace the stored phase instance for that project/phase
- preserve one current record per phase number
- update the parent project to:
  - `status = in_progress`
  - `currentPhaseNumber = max(existing, phaseNumber)`

## Current API-facing shape

```json
{
  "id": "uuid",
  "projectId": "uuid",
  "phaseNumber": 1,
  "title": "Brand",
  "state": "ready",
  "summary": "...",
  "generatedContent": {},
  "tasks": [],
  "latestRunId": "uuid-or-null",
  "generatedAt": "2026-04-28T22:04:42.435Z",
  "createdAt": "2026-04-28T22:04:42.435Z",
  "updatedAt": "2026-04-28T22:04:42.435Z"
}
```

## Notes

- `latestRunId` is stored now, but durable `agent_runs` population is still not wired for current route handlers.
- `generatedContent` differs by phase and is intentionally phase-specific.
- `tasks` is a structured JSON array, not markdown.
