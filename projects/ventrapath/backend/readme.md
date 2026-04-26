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
- placeholder API route shells for:
  - projects
  - blueprint
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

### Scaffolded placeholders
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `POST /api/projects/:projectId/blueprint/generate`
- `GET /api/projects/:projectId/blueprint`

Placeholder routes currently return `501 Not Implemented` on purpose.

That is better than fake success.

## Next build passes

1. wire migration tooling
2. implement `users`, `projects`, `agent_runs`
3. make `POST /api/projects` real
4. make `GET /api/projects` real
5. wire blueprint generation + persistence

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

## Bottom line

This is the first non-handwave backend foothold for VentraPath.

Small, yes.
But now there is an actual place to build.
