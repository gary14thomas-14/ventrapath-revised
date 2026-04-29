# VentraPath Frontend ↔ Backend Alignment

Status: current repo alignment review
Last updated: 2026-04-29

## Purpose

This file maps what the current frontend actually does to what the backend currently supports.

The goal is simple:
- stop UI/backend drift early
- identify fake affordances
- make the next implementation passes obvious

## High-level verdict

The current frontend and backend are aligned enough for a real local loop.
That is good.

But the alignment is still **narrow and fragile**.
A lot of the UI is currently a structured viewer for generated data, not a true saveable workflow yet.

Bluntly:
- the app looks richer than the backend contract actually is
- Phase 0, Brand, and Legal are real enough to demo locally
- most deeper interaction is still presentation, not persisted product behaviour

## Current working loop

### Frontend flow
1. User fills in project form
2. Frontend creates project via `POST /api/projects`
3. Frontend immediately generates blueprint via `POST /api/projects/:id/blueprint/generate`
4. Frontend loads:
   - project list
   - latest blueprint
   - phase ladder
   - stored Brand phase if it exists
   - stored Legal phase if it exists
5. User can:
   - switch blueprint sections locally in UI
   - regenerate blueprint
   - generate Phase 1 Brand
   - generate Phase 2 Legal
   - switch between blueprint/brand/legal views

### Backend support
The backend supports that loop cleanly now:
- project create/list/get
- blueprint generate/get/list versions
- phase ladder get
- Phase 1 Brand generate/get
- Phase 2 Legal generate/get
- phase persistence in JSON and Postgres

## Frontend → backend mapping

## 1. Project creation form

### Frontend fields
From `frontend/src/App.jsx`:
- `name`
- `rawIdea`
- `country`
- `region`
- `currencyCode`
- `hoursPerWeek`

### Actual request sent
Frontend currently sends:
- `name`
- `idea`
- `country`
- `region`
- `hoursPerWeek`

Important mismatch:
- the form contains `currencyCode`
- but `handleCreateProject()` currently does **not** send `currencyCode`

### Backend behaviour
Backend accepts:
- `name`
- `idea`
- `country`
- `region`
- `currencyCode`
- `hoursPerWeek`

Current effect:
- user can type a currency in the form
- backend ignores that input because frontend does not send it
- backend derives currency from country instead

### Recommendation
Short-term:
- fix the frontend to actually send `currencyCode`

Reason:
- the field is visible now, so silently ignoring it is bullshit UX

## 2. Project list

### Frontend expectation
Sidebar wants:
- `id`
- `name`
- `country`
- `region`
- `status`
- project count

### Backend support
`GET /api/projects` returns exactly what the sidebar needs.

### Verdict
Aligned.

## 3. Blueprint workspace

### Frontend expectation
The blueprint viewer expects a latest blueprint with:
- `version`
- `createdAt`
- `sections.business`
- `sections.market`
- `sections.monetisation`
- `sections.execution`
- `sections.legal`
- `sections.website`
- `sections.risks`

Section switching is UI-local only.
No per-section save exists.

### Backend support
Backend returns exactly that shape from:
- `POST /blueprint/generate`
- `GET /blueprint`

### Verdict
Aligned.

## 4. Blueprint regeneration

### Frontend expectation
Regenerate button sends:
- `POST /api/projects/:id/blueprint/generate`
- `{ regenerate: true }`

### Backend support
Supported.
Creates a new blueprint version rather than silently reusing the latest stored one.

### Verdict
Aligned.

## 5. Phase ladder

### Frontend expectation
Sidebar displays phases with:
- `number`
- `title`
- `state`
- `summary`

For rendered cards it also consumes:
- `progress`
- `taskCount`

The UI visually implies a 10-phase journey, but currently renders 9 numbered phases from backend definitions.
The sidebar header says `10`, while the backend overview currently covers phases 1 through 9.

### Backend support
`GET /phases` returns a 9-phase overview.
Default state logic:
- before blueprint: locked
- after blueprint: 1 and 2 available, 3+ locked
- stored Phase 1/2 instances override defaults

### Important mismatch
There is a product-language mismatch:
- UI copy says “Phase 1 of 10” / “Phase 2 of 10”
- sidebar badge shows `10`
- backend currently models 9 phases after blueprint, with Phase 0 implicitly separate

This is defensible if:
- the product counts Blueprint as Phase 0
- and the ladder is meant to show 1..9 only

But it should be made explicit in docs/UI copy, otherwise it feels inconsistent.

### Recommendation
Pick one and stick to it:
- **Option A (recommended):** keep Blueprint as Phase 0 and present ladder as phases 1..9 after it
- **Option B:** model a true 10-item returned ladder including Blueprint

Right now the repo is half-speaking both languages.

## 6. Brand phase viewer

### Frontend expectation
Brand view expects rich structured content:
- `generatedContent.progress`
- `generatedContent.steps[]`
- `generatedContent.brandLayer`
- nested helper cards
- name suggestions
- fields
- palette/font options
- provider cards
- social handle cards

Important detail:
- most inputs in Brand view are currently `defaultValue` only
- there is no save action
- user edits are not persisted

### Backend support
Backend returns the structured Brand payload required for rendering.
It does **not** support saving user-edited Brand step data yet.

### Verdict
Aligned for read/generate.
Not aligned for editable workflow persistence.

### Recommendation
Document Brand view honestly as:
- generated guidance/view model now
- persistent step completion/editing later

## 7. Legal phase viewer

### Frontend expectation
Legal view expects structured data for:
- jurisdiction banner
- disclaimer
- `steps[]`
- options
- tax summary
- providers
- documents
- checklist
- `legalLayer` risk/compliance cards

Like Brand, the UI mostly renders content and placeholders.
It is not a completed transactional workflow yet.

### Backend support
Backend returns a rich structured Legal payload and persists it.
It does not support saving per-step user inputs/checklist state yet.

### Verdict
Aligned for read/generate.
Not aligned for step-state persistence.

## 8. Loading behaviour

### Frontend behaviour
On active project change, frontend loads in parallel or sequence:
- latest blueprint
- phase ladder
- Brand phase if present
- Legal phase if present

### Backend support
All required endpoints exist.
404s are tolerated in frontend for missing Brand/Legal phases.

### Verdict
Aligned.

## 9. Error handling

### Frontend behaviour
Frontend surfaces backend error messages into one `error-banner` string.

### Backend support
Backend returns reasonably clean error codes/messages.

### Verdict
Good enough for now.
Not yet granular.

### Recommendation
Later:
- map common error codes to nicer UI messages
- especially for:
  - `BLUEPRINT_REQUIRED`
  - `BRAND_REQUIRED`
  - `PHASE_NOT_IMPLEMENTED`
  - auth issues

## 10. Persistence reality check

### What is truly persisted now
- projects
- blueprint versions
- blueprint cache outputs
- phase instances for Brand and Legal

### What only looks interactive but is not truly persisted yet
- Brand textareas/inputs in the rendered steps
- Legal step input fields
- checklist completion state
- phase step completion progress updates
- selected blueprint section
- current view mode

This is the biggest practical truth gap in the product right now.

The UI is already shaped like a guided builder.
The backend is still mostly a generated-content store with a project shell around it.

That is fine for this stage, but it should be acknowledged explicitly.

## Current gap list

## Gap 1 — currency field is shown but not sent
Severity: medium

Why it matters:
- visible input that does nothing is trust-eroding

Recommended fix:
- include `currencyCode` in frontend project create payload

## Gap 2 — phase workflow is render-only after generation
Severity: high

Why it matters:
- Brand and Legal look editable, but edits are not saved
- users may assume progress is being captured when it is not

Recommended fix:
- either add persistence for phase step state
- or visibly frame the current phase UI as generated guidance only

## Gap 3 — phase count language is inconsistent
Severity: low to medium

Why it matters:
- “of 10” language and 9-step ladder can confuse product logic

Recommended fix:
- standardise whether Blueprint is counted as Phase 0 outside the ladder, or included in the ladder

## Gap 4 — no paywall transition in current app flow
Severity: strategic

Why it matters:
- product decision already exists, but app flow still goes straight from blueprint into phases

Recommended fix:
- define and implement the explicit post-blueprint paywall contract before expanding deeper guided phases

## Gap 5 — frontend default API base differs from backend default port
Severity: low but annoying

Reality:
- frontend defaults to `http://localhost:3000/api`
- backend defaults to `http://localhost:4000`

This is only fine if Vite proxy/env wiring covers it.
If not, local setup becomes confusing.

Recommended fix:
- document the expected local dev API base clearly
- or standardise via Vite proxy/env example

## Best next moves

### 1. Fix the currency field bug
Small, clean, worth doing.

### 2. Decide whether Brand/Legal are:
- guidance viewers for now
- or true editable workflows now

That decision should drive the next backend work.

### 3. Standardise the phase-count language
Pick one product truth and stop half-implying two.

### 4. Write the post-blueprint paywall contract
This is the next major product-flow alignment task.

## My recommendation

Do these next, in order:
1. currency field fix
2. clarify Brand/Legal as guidance-vs-persistent workflow
3. paywall transition contract

That order gives the best ratio of clarity to effort.
