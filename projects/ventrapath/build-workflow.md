# VentraPath Build Workflow

## Recommended build loop

```text
v0 frontend
↓
GitHub repo / exported code
↓
OpenClaw reads real files
↓
derive + maintain backend-spec.md
↓
OpenClaw builds backend against the spec
↓
test locally
↓
refine spec/code if reality disagrees
↓
push back to GitHub
```

## Source-of-truth rule

Once created, `backend-spec.md` becomes the living backend contract.

That means:
- the exported frontend is an input, not the sole authority
- OpenClaw should inspect real UI code, flows, forms, states, and data assumptions
- ambiguous behaviour gets resolved into the spec explicitly
- backend work should follow the spec, not vague inference from scattered frontend files

## Why this is the better path

This flow is smoother because it keeps the work grounded in real artifacts:
- **frontend export** shows what the product is trying to do
- **real repo files** expose actual structure and implementation assumptions
- **`backend-spec.md`** turns UI intent into a concrete contract
- **local testing** catches fake certainty before code gets pushed upstream

It also gives a cleaner iteration loop than building from chat alone.

## Practical operating rules

### 1. Frontend is evidence, not gospel

Use the exported frontend to infer:
- entities
- screens
- actions
- state transitions
- required APIs
- auth assumptions
- validation rules
- role differences

But do **not** assume the frontend is internally consistent. UI exports often contain:
- placeholder data models
- duplicate ideas
- missing edge cases
- implied behaviour that is never actually defined

That is exactly why `backend-spec.md` needs to exist.

### 2. `backend-spec.md` is the contract

The spec should define, as explicitly as possible:
- core domain entities
- relationships
- business rules
- API surface
- auth model
- permissions
- validation
- failure cases
- background jobs
- integrations
- event flows
- test expectations

If the frontend and the spec disagree, do not silently code around it.
Update the spec or the frontend deliberately.

### 3. Build from the spec, not from vibes

Once the spec is good enough, backend generation/build work should map directly to it:
- routes
- controllers/handlers
- services
- schemas
- DB models
- migrations
- tests
- fixtures

If something is missing from the spec, fix the spec first unless the omission is tiny and obvious.

### 4. Local test before push

Never trust a generated backend just because it compiles.
Run the smallest meaningful local proof:
- app boots
- DB migrates
- key endpoints respond
- core user flows work
- obvious mismatches between frontend expectations and backend output are surfaced

### 5. Keep the loop bidirectional

The real loop is not one-way.

In practice it should be:
1. inspect frontend files
2. update `backend-spec.md`
3. build or revise backend
4. test locally
5. feed discoveries back into the spec
6. push once reality and intent are aligned

## Recommended repo structure

```text
VentraPath/
├─ frontend/
│  ├─ src/
│  ├─ public/
│  └─ ...
├─ backend/
│  ├─ src/
│  ├─ tests/
│  ├─ migrations/
│  └─ ...
├─ specs/
│  ├─ backend-spec.md
│  ├─ api-contracts/
│  ├─ data-models/
│  └─ flow-notes/
├─ prompts/
│  ├─ backend-generation/
│  ├─ spec-refinement/
│  └─ test-generation/
├─ scripts/
│  ├─ export-ingest/
│  ├─ local-test/
│  └─ repo-sync/
├─ docs/
│  ├─ architecture.md
│  ├─ decisions.md
│  └─ setup.md
├─ .github/
│  └─ workflows/
├─ README.md
└─ plan.md
```

## What each part is for

- `frontend/` — the actual UI/exported app code
- `backend/` — generated and refined backend implementation
- `specs/backend-spec.md` — the main backend contract
- `specs/api-contracts/` — endpoint-level detail if the main spec gets too large
- `specs/data-models/` — entity and schema notes
- `specs/flow-notes/` — user-flow-to-backend mapping notes
- `prompts/` — reusable generation/refinement prompts if we operationalise the workflow
- `scripts/` — helpers for ingestion, testing, syncing, and automation
- `docs/` — human-readable architecture and decision history

## Recommended OpenClaw responsibilities

OpenClaw should be responsible for:
- reading the real exported frontend files
- identifying missing backend assumptions
- deriving and maintaining `backend-spec.md`
- generating backend code from the spec
- running local checks/tests
- reporting mismatches clearly
- preparing clean commits back to the repo

## Guardrails

- Do not treat mock data as production schema truth.
- Do not infer security rules unless the UI clearly supports them or the spec states them.
- Do not push before a local sanity check.
- Do not let backend implementation drift away from `backend-spec.md`.
- Do not let `backend-spec.md` become hand-wavy; if it gets vague, the backend will rot fast.

## My recommendation

Use this workflow.

It is more grounded, more recoverable, and much easier to iterate safely than trying to build the backend straight from chat context or loose screenshots.

The key rule is simple:
**frontend suggests, spec decides, tests verify.**
