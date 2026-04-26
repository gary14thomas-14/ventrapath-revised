# VentraPath Master Build Map

## Purpose

This is the single top-level build map for VentraPath.

It links:
- product definition
- blueprint system
- frontend/backend architecture
- API contract
- database schema
- phase progression rules
- full phase ladder contracts

The point of this file is simple:
**one place to see what exists, what depends on what, and what gets built next.**

---

## 1. Product north star

VentraPath is a structured, non-chat, AI-driven business-building platform.

It has two layers:
1. **Phase 0 Blueprint** — turn an idea into a differentiated business
2. **Phases 1-9** — guide the user through building and operating that business

Core product rules already locked:
- location-aware outputs are mandatory
- blueprint must fit the real UI structure
- blueprint must include a real embedded twist
- pricing should be concrete and location-appropriate
- premium pricing should reflect the strength and clarity of the twist
- phases are structured, persistent, and non-chat

Primary source:
- `projects/VentraPath/system-description.md`

---

## 2. Blueprint system status

### What is already locked
- agent architecture
- runtime prompt pack
- benchmark harness
- full benchmark learnings
- pricing logic improvements
- twist and anti-generic rules
- output/UI-fit rules

### Key blueprint docs
- `projects/VentraPath/agents.md`
- `projects/VentraPath/agent-contracts.md`
- `projects/VentraPath/runtime/agents.yaml`
- `projects/VentraPath/runtime/phase0-routing.yaml`
- `projects/VentraPath/runtime/prompts/`
- `projects/VentraPath/benchmark/`
- `projects/VentraPath/decisions.md`

### Current blueprint verdict
Blueprint MVP is now strong enough to move on from prompt fiddling and into application build design.

---

## 3. Application architecture status

### Frontend
Use v0-generated Next.js as the UI shell.

### Backend
Use a separate backend service as the product brain.

### Core rule
Frontend never calls agents directly.
Frontend calls backend APIs only.
Backend owns orchestration, validation, persistence, and billing.

Primary architecture doc:
- `projects/VentraPath/frontend-backend-architecture.md`

---

## 4. API layer status

The MVP API contract now exists.

Primary contract doc:
- `projects/VentraPath/mvp-api-contract.md`

### MVP endpoint families
- auth
- projects
- blueprint generation + retrieval
- phase generation + retrieval
- task updates
- weekly planning
- runs/status
- billing

This is the main contract between v0 UI and backend.

---

## 5. Database layer status

The MVP data model now exists.

Primary schema doc:
- `projects/VentraPath/database-schema.md`

### Core tables already mapped
- `users`
- `projects`
- `blueprint_versions`
- `phase_instances`
- `tasks`
- `weekly_plans`
- `agent_runs`
- `files`
- `subscriptions`
- `audit_events`

This is the persistence base for the entire app.

---

## 6. Phase system status

### Shared rules
- fixed phase order
- unlock-by-generation, not by total task completion
- tasks guide progress but do not hard-block navigation
- regeneration should not casually destroy user progress

Primary rule docs:
- `projects/VentraPath/phase-progression-rules.md`
- `projects/VentraPath/phase-contract-pattern.md`

### Full phase ladder now specified
- `projects/VentraPath/phase-01-brand-contract.md`
- `projects/VentraPath/phase-02-legal-contract.md`
- `projects/VentraPath/phase-03-finance-contract.md`
- `projects/VentraPath/phase-04-protection-contract.md`
- `projects/VentraPath/phase-05-infrastructure-contract.md`
- `projects/VentraPath/phase-06-marketing-contract.md`
- `projects/VentraPath/phase-07-operations-contract.md`
- `projects/VentraPath/phase-08-sales-contract.md`
- `projects/VentraPath/phase-09-launch-scale-contract.md`

This means the guided execution layer is now contract-defined end-to-end.

---

## 7. Build order

This is the recommended implementation order.

### Stage A — Foundation
1. Set up backend service skeleton
2. Set up Postgres
3. Implement auth
4. implement `users`, `projects`, `agent_runs`
5. implement project creation + fetch

### Stage B — Blueprint MVP
6. implement blueprint generation endpoint
7. implement blueprint persistence (`blueprint_versions`)
8. connect v0 blueprint page to backend
9. render 7 blueprint sections from stored data
10. add version history read support

### Stage C — Phase engine MVP
11. implement `phase_instances`
12. implement `tasks`
13. implement phase overview endpoint
14. implement phase generation endpoint pattern
15. implement task completion updates
16. implement phase progression logic

### Stage D — Weekly planning + execution continuity
17. implement `weekly_plans`
18. generate weekly plans from `hours_per_week`
19. render weekly plan UI
20. connect plan updates to project state

### Stage E — Billing + subscription gating
21. implement `subscriptions`
22. connect Stripe or equivalent
23. implement checkout + webhook flow
24. gate premium generation or advanced usage if needed

### Stage F — Quality / operational hardening
25. add audit trail usage
26. add file storage flows
27. add regeneration safeguards
28. add retry/error handling for agent runs
29. add admin/internal debug visibility if needed

---

## 8. Dependency map

### Product definition dependencies
- Everything depends on `system-description.md`
- Blueprint behavior depends on `decisions.md` + runtime prompts

### App dependencies
- frontend depends on `frontend-backend-architecture.md`
- backend API depends on `mvp-api-contract.md`
- persistence depends on `database-schema.md`
- phase engine depends on:
  - `phase-progression-rules.md`
  - `phase-contract-pattern.md`
  - all phase contract docs

### Practical dependency chain
`system-description` -> `blueprint rules/prompts` -> `frontend/backend architecture` -> `API contract` -> `database schema` -> `phase progression rules` -> `phase contracts` -> implementation tickets/code

---

## 9. What is already done vs not done

### Done
- blueprint engine design and hardening
- benchmarking and failure-mode learning
- pricing/twist logic refinement
- frontend/backend architecture
- MVP API contract
- database schema
- full phase ladder contracts
- phase progression logic

### Not done yet
- implementation ticket breakdown
- concrete JSON schemas / TS types
- actual backend code
- actual database migrations
- actual API handlers
- actual frontend integration
- auth/billing implementation
- QA/test plans for backend behavior

---

## 10. Recommended immediate next steps

### Best next move
Turn this design pack into **implementation tickets**.

Why:
- architecture is now broad enough
- phase specs are now detailed enough
- continued design without ticketing starts to loop

### Recommended sequence after this file
1. `implementation-roadmap.md`
2. `backend-ticket-breakdown.md`
3. `typescript-types.md` or JSON schema pack
4. first migration plan
5. first API implementation pass

---

## 11. Recommended implementation slices

### Slice 1 — Project + Blueprint vertical slice
Goal:
- create project
- generate blueprint
- persist blueprint
- render blueprint in v0 UI

This is the first meaningful end-to-end slice.

### Slice 2 — Phase engine vertical slice
Goal:
- show phase sidebar
- generate Phase 1 Brand
- persist tasks
- mark tasks complete

### Slice 3 — Weekly planning slice
Goal:
- capture hours/week
- generate weekly plan
- render timeline/workload view

### Slice 4 — Billing / subscription slice
Goal:
- checkout
- subscription state
- gated features if needed

---

## 12. Build risks to watch

### Risk 1
Frontend gets treated like the product brain.

Fix:
Keep orchestration and state in backend only.

### Risk 2
Phase outputs drift into essays instead of structured UI content.

Fix:
Validate against phase contract shapes.

### Risk 3
Regeneration destroys user progress.

Fix:
Keep runs, approved outputs, and task state separate.

### Risk 4
Location-awareness gets lost after blueprint.

Fix:
Keep country/region/currency in project record and require it across phases.

### Risk 5
Pricing loses grounding.

Fix:
Keep monetisation rules tied to location, comparables, and twist strength.

---

## 13. End-of-design milestone

VentraPath now has enough design specification to begin real backend implementation without guessing the product shape.

That does **not** mean every edge case is solved.
It means the system is now defined well enough to build sanely.

---

## Bottom line

This is the current VentraPath build stack:

- product definition locked
- blueprint system locked
- backend architecture locked
- API contract locked
- schema locked
- phase progression locked
- full phase ladder locked

Next move:
**convert this into implementation tickets and types, then start building the first vertical slice.**
