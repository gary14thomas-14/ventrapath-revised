# VentraPath Backend Ticket Breakdown

## Purpose

Break the MVP build into concrete implementation tickets.

This is the first-pass backend-heavy ticket list, written to match the current design pack.

---

## Ticket format

Each ticket includes:
- ID
- title
- goal
- dependencies
- done condition

---

# Slice 1 — Project + Blueprint

## VP-BE-001 — Set up backend app skeleton
**Goal:** Create the backend service structure, config loading, environment handling, and base routing.

**Dependencies:** none

**Done when:**
- backend app boots locally
- env config loads safely
- health route works

## VP-BE-002 — Set up Postgres connection and migration system
**Goal:** Establish database connectivity and migration workflow.

**Dependencies:** VP-BE-001

**Done when:**
- Postgres connects successfully
- migrations can be applied locally
- migration process is documented

## VP-BE-003 — Create core auth/session integration
**Goal:** Support authenticated app users in backend requests.

**Dependencies:** VP-BE-001

**Done when:**
- authenticated user identity is available in request context
- unauthenticated access is rejected where required

## VP-BE-004 — Implement `users` and `projects` tables
**Goal:** Create the initial persistence layer for users and projects.

**Dependencies:** VP-BE-002

**Done when:**
- migrations exist for `users` and `projects`
- records can be inserted and queried

## VP-BE-005 — Implement project create/list/get endpoints
**Goal:** Support `POST /api/projects`, `GET /api/projects`, and `GET /api/projects/:projectId`.

**Dependencies:** VP-BE-003, VP-BE-004

**Done when:**
- project create works with country and idea required
- project list returns current user projects
- project detail returns one project safely

## VP-BE-006 — Implement `agent_runs` table and run tracking
**Goal:** Track orchestration jobs and generation history.

**Dependencies:** VP-BE-002, VP-BE-004

**Done when:**
- `agent_runs` migration exists
- run records can be created, updated, and queried

## VP-BE-007 — Implement blueprint generation orchestrator handler
**Goal:** Receive blueprint requests, create a run, call orchestration, validate output, and store results.

**Dependencies:** VP-BE-005, VP-BE-006

**Done when:**
- blueprint generation request creates a run
- output is validated against required sections
- failures are stored cleanly

## VP-BE-008 — Implement `blueprint_versions` table
**Goal:** Store canonical user-facing blueprint versions.

**Dependencies:** VP-BE-002, VP-BE-006

**Done when:**
- migration exists
- multiple blueprint versions can be stored per project
- version numbering is enforced

## VP-BE-009 — Implement blueprint store/retrieve endpoints
**Goal:** Support `GET /api/projects/:projectId/blueprint` and version history.

**Dependencies:** VP-BE-007, VP-BE-008

**Done when:**
- latest blueprint fetch works
- version list works
- location/currency metadata is returned

## VP-FE-001 — Wire v0 blueprint page to backend blueprint endpoints
**Goal:** Replace static/mock blueprint data with real backend data.

**Dependencies:** VP-BE-009

**Done when:**
- user can create a project and see returned blueprint in UI
- 7 blueprint sections render from backend response

---

# Slice 2 — Phase Engine + Brand

## VP-BE-010 — Implement `phase_instances` table
**Goal:** Persist project phases and generation state.

**Dependencies:** VP-BE-002, VP-BE-004

**Done when:**
- migration exists
- project phases can be inserted and updated

## VP-BE-011 — Implement `tasks` table
**Goal:** Persist phase tasks and task status.

**Dependencies:** VP-BE-002, VP-BE-010

**Done when:**
- migration exists
- tasks can be created and updated per phase

## VP-BE-012 — Implement phase progression engine
**Goal:** Apply the phase state rules from the progression doc.

**Dependencies:** VP-BE-010, VP-BE-011

**Done when:**
- phases unlock correctly
- locked phases reject generation
- regeneration rules are respected at a basic level

## VP-BE-013 — Implement phases overview endpoint
**Goal:** Support `GET /api/projects/:projectId/phases`.

**Dependencies:** VP-BE-012

**Done when:**
- full phase ladder is returned
- state, unlock, and task counts are included

## VP-BE-014 — Implement generic phase generation handler
**Goal:** Build the reusable backend path for phase generation.

**Dependencies:** VP-BE-006, VP-BE-010, VP-BE-012

**Done when:**
- generation requests create a run
- phase output is validated
- content and tasks are persisted

## VP-BE-015 — Implement Phase 1 Brand generation
**Goal:** Support `POST /api/projects/:projectId/phases/1/generate` and `GET /api/projects/:projectId/phases/1`.

**Dependencies:** VP-BE-014

**Done when:**
- Brand output matches contract shape
- Brand tasks are created
- phase state becomes ready

## VP-BE-016 — Implement task update endpoint
**Goal:** Support `PATCH /api/tasks/:taskId`.

**Dependencies:** VP-BE-011

**Done when:**
- task status updates persist
- completion timestamps behave correctly

## VP-FE-002 — Render phase sidebar and Brand phase UI from backend
**Goal:** Make the first guided execution phase usable in the frontend.

**Dependencies:** VP-BE-013, VP-BE-015, VP-BE-016

**Done when:**
- sidebar shows real phase states
- Brand content renders
- task completion updates in UI and persists

---

# Slice 3 — Legal + Finance generic phase extension

## VP-BE-017 — Implement Phase 2 Legal generation
**Goal:** Add Legal phase using the generic phase engine.

**Dependencies:** VP-BE-014

**Done when:**
- Legal content matches contract shape
- location rules are enforced
- Legal tasks persist

## VP-BE-018 — Implement Phase 3 Finance generation
**Goal:** Add Finance phase using the generic phase engine.

**Dependencies:** VP-BE-014

**Done when:**
- Finance content matches contract shape
- currency is enforced
- numbers are stored cleanly

## VP-FE-003 — Support generic phase rendering for Brand, Legal, Finance
**Goal:** Reduce bespoke per-phase UI hacks.

**Dependencies:** VP-BE-017, VP-BE-018

**Done when:**
- one generic phase renderer can display multiple phases with phase-specific content blocks

---

# Slice 4 — Weekly Planning

## VP-BE-019 — Implement `weekly_plans` table
**Goal:** Persist weekly plan outputs.

**Dependencies:** VP-BE-002, VP-BE-004, VP-BE-006

**Done when:**
- migration exists
- multiple plans can be stored historically

## VP-BE-020 — Implement weekly plan generation endpoint
**Goal:** Support `POST /api/projects/:projectId/weekly-plan`.

**Dependencies:** VP-BE-019

**Done when:**
- hours per week input is accepted
- plan is generated and stored

## VP-BE-021 — Implement weekly plan retrieval endpoint
**Goal:** Support `GET /api/projects/:projectId/weekly-plan`.

**Dependencies:** VP-BE-019

**Done when:**
- latest weekly plan returns correctly

## VP-FE-004 — Render weekly plan UI
**Goal:** Make time-aware execution visible to the user.

**Dependencies:** VP-BE-020, VP-BE-021

**Done when:**
- hours/week can be entered
- weekly plan renders from backend response

---

# Slice 5 — Remaining phase ladder

## VP-BE-022 — Implement Phase 4 Protection generation
## VP-BE-023 — Implement Phase 5 Infrastructure generation
## VP-BE-024 — Implement Phase 6 Marketing generation
## VP-BE-025 — Implement Phase 7 Operations generation
## VP-BE-026 — Implement Phase 8 Sales generation
## VP-BE-027 — Implement Phase 9 Launch & Scale generation

**Goal:** Complete the guided execution ladder using the generic phase engine.

**Dependencies:** VP-BE-014

**Done when:**
- each phase generates/stores content and tasks matching its contract
- frontend can render all phases cleanly

---

# Slice 6 — Billing + hardening

## VP-BE-028 — Implement `subscriptions` table and billing state persistence
**Goal:** Persist billing/subscription state.

## VP-BE-029 — Implement checkout session endpoint
**Goal:** Support `POST /api/billing/checkout`.

## VP-BE-030 — Implement billing webhook handler
**Goal:** Sync provider subscription state into backend.

## VP-BE-031 — Implement audit events table + write hooks
**Goal:** Capture important project and generation events.

## VP-BE-032 — Add regeneration safety rules for tasks/phases
**Goal:** Prevent user progress from being casually destroyed.

## VP-BE-033 — Add file/object storage integration
**Goal:** Support exports and uploaded/reference files.

## VP-BE-034 — Add internal run/error visibility
**Goal:** Make agent run failures debuggable.

---

## Recommended first implementation sprint

Best first sprint:
- VP-BE-001
- VP-BE-002
- VP-BE-003
- VP-BE-004
- VP-BE-005
- VP-BE-006
- VP-BE-007
- VP-BE-008
- VP-BE-009
- VP-FE-001

That gives the first real product loop:
**create project -> generate blueprint -> store blueprint -> render blueprint**

---

## Recommended second sprint

- VP-BE-010
- VP-BE-011
- VP-BE-012
- VP-BE-013
- VP-BE-014
- VP-BE-015
- VP-BE-016
- VP-FE-002

That gives the first guided execution loop.

---

## Bottom line

These tickets are the first real bridge from design to implementation.

If this list starts getting executed, VentraPath stops being a system we described and starts becoming a system we actually built.
