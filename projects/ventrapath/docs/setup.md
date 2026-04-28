# VentraPath Setup

## Repo orientation

Main folders:
- `frontend/`
- `backend/`
- `specs/`
- `scripts/`
- `docs/`
- `runtime/`
- `benchmark/`

## Frontend

Install and run from `frontend/` using that package's scripts.

## Backend

Install and run from `backend/` using that package's scripts.

Typical commands are documented in `backend/readme.md`.

## Migrations

Migration files live under `backend/migrations/`.

Use the backend migration commands to:
- list
- verify
- apply

## Spec workflow

Before major backend changes:
1. inspect the relevant frontend flow/files
2. update `specs/backend-spec.md`
3. implement the backend change
4. test locally
5. record any architecture/decision fallout in docs

## Checkpointing

Before risky work:
1. review `git status`
2. checkpoint the repo
3. proceed with the change
