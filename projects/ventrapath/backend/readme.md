# VentraPath Backend Scaffold

## Purpose

This is the first real backend skeleton for VentraPath.

It is intentionally small.
The job right now is not to build the whole product in one swing.
The job is to create a sane place for the first vertical slice to live.

## What exists right now

- minimal Node service scaffold
- environment loading
- health endpoint
- repository seam for `json` and `postgres` persistence drivers
- dev-only local JSON persistence for project CRUD + blueprint versioning
- local migration list/verify tooling
- first SQL migrations for:
  - bootstrap database
  - users
  - projects
  - agent runs
  - blueprint versions
- blueprint route shells
- migration folder aligned to `migration-plan.md`

## Why it looks this lean

There is no point pretending a framework decision is the product.

This scaffold is here to:
- prove backend shape
- lock file structure
- keep route ownership clear
- give the next implementation passes somewhere real to land

## Current folder layout

```txt
backend/
  .env.example
  .gitignore
  package.json
  README.md
  migrations/
    README.md
  src/
    app.js
    server.js
    config/
      env.js
    lib/
      http.js
    routes/
      blueprint.js
      health.js
      projects.js
```

## Current routes

### Live
- `GET /health`
- `GET /api/health`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `POST /api/projects/:projectId/blueprint/generate`
- `GET /api/projects/:projectId/blueprint`
- `GET /api/projects/:projectId/blueprint/versions`

These routes currently use the `json` persistence driver by default, backed by a dev-only local store under `.data/`.
That is deliberate: real endpoint behaviour now, Postgres adapter ready for the handoff.

Blueprint generation is currently a dev scaffold, not the real Bob-orchestrated system.
It persists versioned outputs and route shape now so the app loop is real before orchestration wiring lands.

## Next build passes

1. set `DATABASE_URL` to a real reachable Postgres instance
2. set `PERSISTENCE_DRIVER=postgres`
3. apply `0001`-`0005`
4. replace scaffolded blueprint generation with the real orchestration layer
5. add project updates when needed

## Ticket alignment

- `VP-BE-001` backend app skeleton
- `VP-BE-002` Postgres + migration system
- `VP-BE-005` project CRUD endpoints
- `VP-BE-007` blueprint generation handler
- `VP-BE-009` blueprint retrieval endpoints

## Run

```bash
npm run dev
```

or

```bash
npm start
```

## Migration commands

```bash
npm run migrations:list
npm run migrations:verify
npm run migrations:apply
```

`migrations:apply` is now real.

It requires:
- `DATABASE_URL` set
- reachable Postgres server

## Persistence driver switch

Default:

```bash
PERSISTENCE_DRIVER=json
```

Prepared but not yet installed:

Prepared for live use:

```bash
PERSISTENCE_DRIVER=postgres
DATABASE_URL=postgres://...
```

Important:
- the Postgres repository seam is wired
- the `pg` package is installed
- selecting `postgres` will still fail until the database itself is reachable

## Bottom line

This is the first non-handwave backend foothold for VentraPath.

Small, yes.
But now there is an actual place to build.
