# VentraPath Implementation Roadmap

## Purpose

Turn the current VentraPath design pack into a practical implementation sequence.

This is not a vague product roadmap.
It is the recommended build order for the MVP backend and frontend integration.

---

## Build objective

Ship a first usable VentraPath product that can:
- create a project
- generate and store a blueprint
- render the blueprint in the UI
- generate phases
- persist tasks and progress
- generate weekly plans
- support account + billing basics

---

## Guiding rules

- build vertical slices, not disconnected layers
- backend owns orchestration and persistence
- frontend is a shell, not the brain
- phase/task persistence matters more than fancy realtime
- ship the smallest useful end-to-end path first

---

## Phase A — Project + Blueprint vertical slice

### Goal
Get from idea input to stored/rendered blueprint.

### Scope
- user auth/session basics
- create project
- store project
- generate blueprint
- store blueprint version
- fetch blueprint
- render blueprint in v0 UI

### Done when
- a user can create a project from an idea
- backend can generate a Phase 0 blueprint
- blueprint is stored in `blueprint_versions`
- UI shows the 7 blueprint sections from backend data

### Main docs to implement from
- `frontend-backend-architecture.md`
- `mvp-api-contract.md`
- `database-schema.md`
- `master-build-map.md`

---

## Phase B — Phase engine vertical slice

### Goal
Get from blueprint into one working execution phase.

### Scope
- materialise phase overview
- implement phase progression state logic
- generate Phase 1 Brand
- store phase payload
- store tasks
- update task status
- render Phase 1 in UI

### Done when
- user can open the phase sidebar
- Brand phase can be generated from blueprint
- tasks appear and can be completed
- progress persists across reloads

### Main docs to implement from
- `phase-progression-rules.md`
- `phase-contract-pattern.md`
- `phase-01-brand-contract.md`

---

## Phase C — Repeatable phase generation engine

### Goal
Make the phase system reusable beyond Brand.

### Scope
- generic phase generation handler
- phase contract-driven validation
- Phase 2 Legal
- Phase 3 Finance
- task persistence across regenerations (basic version)

### Done when
- backend can generate multiple phases using the same engine shape
- Legal and Finance work through the same storage model
- frontend can render any phase from generic phase payloads + task list

### Main docs to implement from
- `phase-02-legal-contract.md`
- `phase-03-finance-contract.md`
- `phase-contract-pattern.md`

---

## Phase D — Weekly planning slice

### Goal
Turn time availability into usable weekly planning.

### Scope
- capture hours per week
- generate weekly plan
- store plan history
- render plan in UI

### Done when
- user can save hours/week
- backend creates a weekly plan
- plan is persisted and viewable later

### Main docs to implement from
- `mvp-api-contract.md`
- `database-schema.md`
- `system-description.md`

---

## Phase E — Middle execution ladder

### Goal
Extend the phase engine through Protection, Infrastructure, Marketing, Operations.

### Scope
- Phase 4 Protection
- Phase 5 Infrastructure
- Phase 6 Marketing
- Phase 7 Operations
- generic phase rendering hardening

### Done when
- backend can generate and store Phases 4-7
- UI can render them without phase-specific hacks
- tasks persist and progress rules still hold

### Main docs to implement from
- `phase-04-protection-contract.md`
- `phase-05-infrastructure-contract.md`
- `phase-06-marketing-contract.md`
- `phase-07-operations-contract.md`

---

## Phase F — Endgame execution ladder

### Goal
Finish the guided execution system.

### Scope
- Phase 8 Sales
- Phase 9 Launch & Scale
- launch readiness logic
- final phase navigation polish

### Done when
- full phase ladder is functional end-to-end
- user can move from blueprint to launch planning in one persistent system

### Main docs to implement from
- `phase-08-sales-contract.md`
- `phase-09-launch-scale-contract.md`

---

## Phase G — Billing + subscription gating

### Goal
Support paid product access.

### Scope
- subscription persistence
- checkout session creation
- billing webhook handling
- plan gating if needed

### Done when
- subscription state is stored and readable
- checkout flow works
- backend responds correctly to plan status

---

## Phase H — Operational hardening

### Goal
Make the MVP survivable.

### Scope
- audit events
- regeneration safety
- error handling + retries
- internal admin visibility
- basic observability
- object storage for generated files/exports

### Done when
- failures are traceable
- generation state is debuggable
- progress is not destroyed casually

---

## Recommended engineering order inside the codebase

1. auth/session setup
2. Postgres setup + migrations
3. `users`, `projects`, `agent_runs`
4. project CRUD endpoints
5. blueprint generation endpoint
6. blueprint storage + retrieval
7. v0 blueprint UI wiring
8. `phase_instances` + `tasks`
9. phase progression engine
10. Phase 1 implementation
11. generic phase renderer + generator
12. weekly planning
13. billing
14. hardening

---

## What not to do

- do not start with all 10 phases at once
- do not build frontend-only fake state first
- do not let phase outputs become bespoke one-off renderers
- do not skip persistence and rely on chat/session memory
- do not overbuild realtime before the core CRUD/generation loop works

---

## Recommended milestone checkpoints

### Milestone 1
Project creation + blueprint generation works end to end.

### Milestone 2
Brand phase works end to end with tasks.

### Milestone 3
Legal + Finance work through the generic phase engine.

### Milestone 4
Weekly planning works.

### Milestone 5
Phases 4-9 are all connected.

### Milestone 6
Billing and operational hardening land.

---

## Bottom line

VentraPath should be built in slices that prove the product loop early:

**idea -> blueprint -> phase -> tasks -> weekly plan -> progress**

That is the real backbone.
Everything else should support that, not distract from it.
