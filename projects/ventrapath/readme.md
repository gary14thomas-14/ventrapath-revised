# VentraPath

VentraPath is being built as a repo-first product.

The core loop is simple:
- frontend shows intended product behaviour
- specs turn that behaviour into an explicit contract
- backend implements the contract
- local testing checks reality before anything gets pushed

## Working build loop

```text
v0 frontend
↓
GitHub repo / exported code
↓
OpenClaw reads real files
↓
derive + maintain specs/backend-spec.md
↓
OpenClaw builds backend against the spec
↓
test locally
↓
refine spec/code if reality disagrees
↓
push back to GitHub
```

## Repo layout

```text
ventrapath/
├─ frontend/                  # UI app / exported frontend code
├─ backend/                   # API, persistence, migrations, tests
├─ specs/                     # backend contract and supporting spec docs
├─ scripts/                   # local helper scripts for ingestion/testing/sync
├─ docs/                      # architecture, setup, decisions, process docs
├─ runtime/                   # agent/runtime configuration and prompts
├─ benchmark/                 # benchmark cases and results
├─ README.md
└─ plan.md
```

## Folder roles

- `frontend/` — real UI files, flows, components, assets
- `backend/` — implementation scaffold and production backend work
- `specs/` — source-of-truth backend contract and flow notes
- `scripts/` — repeatable local tooling
- `docs/` — human-readable design and setup docs
- `runtime/` — VentraPath agent system configuration
- `benchmark/` — latency and quality validation work

## Key rules

- Frontend is evidence, not gospel.
- `specs/backend-spec.md` is the living backend contract.
- Do not let implementation drift away from the spec.
- Test locally before pushing.
- If work matters, write it down and checkpoint it.

## Good starting files

- `build-workflow.md`
- `specs/backend-spec.md`
- `docs/architecture.md`
- `docs/setup.md`
- `plan.md`
- `decisions.md`
- `todo.md`

## Current state

This repo already contains meaningful frontend, backend, benchmark, and runtime work.
The skeleton added here is meant to make the structure clearer and give the next passes an obvious place to land.
