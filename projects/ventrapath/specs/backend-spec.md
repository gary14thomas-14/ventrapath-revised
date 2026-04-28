# VentraPath Backend Spec

Status: draft
Owner: Bob
Last updated: 2026-04-29

## Purpose

This file is the living backend contract for VentraPath.

Frontend files imply behaviour.
This spec decides what the backend actually guarantees right now, what is scaffolded, and what is still intentionally unfinished.

## Product scope

### In scope right now
- create and list user-owned projects
- store the raw business idea and project context
- generate a versioned Phase 0 blueprint with seven sections
- retrieve the latest blueprint and version history
- expose a phase ladder overview for a project
- generate and retrieve Phase 1 Brand
- generate and retrieve Phase 2 Legal
- reuse cached specialist-style outputs for blueprint generation
- support both local JSON persistence and Postgres persistence

### Explicitly out of scope right now
- real end-user auth flows
- multi-user collaboration
- payments/paywall enforcement
- production-grade Bob orchestration
- specialist agent execution through `agent_runs`
- phases 3 through 9 generation
- background queue workers
- external integrations beyond static provider links inside generated content

## Core actors

### Anonymous visitor
Not supported by the current backend contract.
Requests without a user identity fail with `401 UNAUTHENTICATED`.

### Authenticated user
Current contract uses `x-user-id` as the user identity input.
In development, the backend may fall back to the fixed dev UUID `11111111-1111-4111-8111-111111111111`.

Authenticated users can:
- create projects
- list their own projects
- fetch a project they own
- generate/retrieve blueprint data for their own project
- generate/retrieve implemented phases for their own project

### Internal/runtime actor
The current frontend acts as a thin client over the API.
The backend internally performs template/stub generation and cache reuse.
There is no separate runtime execution API yet.

## Domain entities

### User
Current persistence assumes a user record exists or can be created.

Fields used now:
- `id` — UUID primary key in Postgres
- `email`
- `name`
- `auth_provider`
- `auth_provider_user_id`

Notes:
- Postgres auto-creates a dev user record on demand for API usage.
- JSON mode does not maintain a separate users table.

### Project
Purpose: top-level container for a single business build.

Required fields:
- `id`
- `userId`
- `name`
- `rawIdea`
- `country`
- `currencyCode`
- `status`
- `currentPhaseNumber`
- `createdAt`
- `updatedAt`

Optional fields:
- `region`
- `hoursPerWeek`
- `latestBlueprintVersionNumber`

Validation rules:
- `idea` must be at least 3 characters on create
- `country` must be present
- `name` must be at least 2 characters when provided
- `currencyCode` must be a 3-letter ISO-style code when provided
- `hoursPerWeek` must be an integer between 1 and 168 when provided
- `currentPhaseNumber` must stay between 0 and 9

Default behaviour:
- `name` falls back to the submitted idea when omitted
- `currencyCode` is derived from country when possible, otherwise `USD`
- new projects start as:
  - `status = draft`
  - `currentPhaseNumber = 0`
  - `latestBlueprintVersionNumber = null`

### Blueprint version
Purpose: canonical stored snapshot of the Phase 0 blueprint.

Required fields:
- `id`
- `projectId`
- `version`
- `status`
- `sections.business`
- `sections.market`
- `sections.monetisation`
- `sections.execution`
- `sections.legal`
- `sections.website`
- `sections.risks`
- `meta.country`
- `meta.currencyCode`
- `createdAt`

Optional fields:
- `meta.region`

Rules:
- one project can have many blueprint versions
- version numbering is 1-based and increasing per project
- current implementation stores markdown/text strings per section
- storing a new blueprint updates the project to `status = blueprint_ready`

### Phase instance
Purpose: stored generated output for a numbered guided build phase.

Required fields:
- `id`
- `projectId`
- `phaseNumber`
- `title`
- `state`
- `summary`
- `generatedContent`
- `tasks`
- `generatedAt`
- `createdAt` or equivalent
- `updatedAt` in stores that track it

Rules:
- current implementation supports Phase 1 Brand and Phase 2 Legal only
- one stored record per project per phase number
- upsert behaviour replaces the existing phase instance for that phase
- generating a phase updates project status to `in_progress`
- generating a phase bumps `currentPhaseNumber` to at least that phase number

### Agent output cache
Purpose: reusable structured output cache for blueprint/specialist work.

Required fields:
- `id`
- `projectId`
- `agentId`
- `taskKind`
- `cacheKey`
- `model`
- `promptVersionHash`
- `normalizedInputHash`
- `dependencyHash`
- `status`
- `outputJson`
- `createdAt`
- `lastUsedAt`

Optional fields:
- `phaseNumber`
- `stepKey`
- `sourceMetaJson`
- `expiresAt`

Rules:
- `cacheKey` is unique
- expired entries must not be reused
- blueprint generation currently uses this cache for the assembled section output
- current cache identity is based on normalized project input plus dependency and prompt hashes

### Agent run
Purpose: planned audit trail for orchestration/generation runs.

Current status:
- table exists in Postgres migrations
- not yet actively written by the current route handlers

Expected fields from schema:
- `id`
- `project_id`
- `run_type`
- `phase_number`
- `status`
- `triggered_by_user_id`
- `input_json`
- `routing_json`
- `raw_output_json`
- `validated_output_json`
- `error_code`
- `error_message`
- `started_at`
- `finished_at`

## Relationships

- one user owns many projects
- one project owns many blueprint versions
- one project owns up to one current stored phase instance per phase number
- one project owns many cache entries
- one project may own many future `agent_runs`
- blueprint versions inherit jurisdiction and currency context from the project at generation time
- Phase 2 Legal depends on an existing Phase 1 Brand output

## Core workflows

### 1. Create project
Trigger: `POST /api/projects`

Input:
- `name` optional
- `idea` required
- `country` required
- `region` optional
- `currencyCode` optional
- `hoursPerWeek` optional

Backend steps:
1. authenticate user via `x-user-id` or development fallback
2. validate request body
3. derive `currencyCode` if omitted
4. create a project record with draft defaults
5. return the created project

Success result:
- `201 Created`
- response contains full `project`

Failure cases:
- `401 UNAUTHENTICATED`
- `400 INVALID_USER_ID`
- `400 INVALID_JSON`
- `400 INVALID_INPUT`

Persisted side effects:
- new project stored

### 2. List projects
Trigger: `GET /api/projects`

Backend steps:
1. authenticate user
2. fetch all owned projects ordered by most recently updated
3. return lightweight list items

Success result:
- `200 OK`
- `projects[]` with summary fields

### 3. Fetch project
Trigger: `GET /api/projects/:projectId`

Backend steps:
1. authenticate user
2. fetch owned project by ID
3. return full project or not-found

Success result:
- `200 OK`
- full `project`

Failure cases:
- `404 PROJECT_NOT_FOUND`

### 4. Generate blueprint
Trigger: `POST /api/projects/:projectId/blueprint/generate`

Input:
- `regenerate` boolean optional

Backend steps:
1. authenticate user
2. parse request JSON
3. if a latest blueprint exists and `regenerate` is false, reuse it immediately
4. fetch owned project
5. compute blueprint cache identity from normalized project context
6. try cache lookup
7. on cache miss, build current stub blueprint sections and upsert cache entry
8. create a new blueprint version for the project
9. return a completed run payload plus blueprint payload

Success result:
- `200 OK`
- `run`
- `blueprint`
- either `reusedExisting: true` or `cache.specialistSections = hit|miss`

Current generation rule:
- blueprint content is template/stub logic, not true multi-agent orchestration yet

Failure cases:
- `404 PROJECT_NOT_FOUND`
- `400 INVALID_JSON`
- auth/user errors as above

Persisted side effects:
- optional cache upsert
- new blueprint version
- project status update to `blueprint_ready`
- project `latestBlueprintVersionNumber` update

### 5. Retrieve latest blueprint
Trigger: `GET /api/projects/:projectId/blueprint`

Success result:
- latest stored blueprint version

Failure cases:
- `404 BLUEPRINT_NOT_FOUND` when the project exists but has no blueprint
- auth/user errors

### 6. List blueprint versions
Trigger: `GET /api/projects/:projectId/blueprint/versions`

Success result:
- newest-first list of versions with generation timestamps

Failure cases:
- `404 PROJECT_NOT_FOUND`

### 7. List phase ladder
Trigger: `GET /api/projects/:projectId/phases`

Backend steps:
1. authenticate user
2. fetch project
3. fetch current stored Phase 1 and Phase 2 instances if present
4. build a 9-phase overview response

Current state rules:
- if no blueprint exists, all phases are effectively locked
- if a blueprint exists, Phase 1 and Phase 2 become `available`
- phases 3 through 9 are currently locked
- stored phase instances override default title/state/summary/taskCount/progress

### 8. Generate Phase 1 Brand
Trigger: `POST /api/projects/:projectId/phases/1/generate`

Prerequisites:
- project must exist
- latest blueprint must exist

Backend steps:
1. authenticate user
2. fetch project
3. fetch latest blueprint
4. derive Brand phase content from project + blueprint
5. upsert phase instance
6. return completed run + phase payload

Failure cases:
- `400 BLUEPRINT_REQUIRED`
- `404 PROJECT_NOT_FOUND`

### 9. Generate Phase 2 Legal
Trigger: `POST /api/projects/:projectId/phases/2/generate`

Prerequisites:
- project must exist
- latest blueprint must exist
- Phase 1 Brand must already exist

Backend steps:
1. authenticate user
2. fetch project
3. fetch blueprint
4. fetch Brand phase
5. derive Legal phase content from project + blueprint + brand output
6. upsert phase instance
7. return completed run + phase payload

Failure cases:
- `400 BLUEPRINT_REQUIRED`
- `400 BRAND_REQUIRED`
- `404 PROJECT_NOT_FOUND`

### 10. Fetch phase instance
Trigger: `GET /api/projects/:projectId/phases/:phaseNumber`

Current contract:
- returns stored phase instance only
- does not auto-generate missing phases
- returns `404 PHASE_NOT_FOUND` when absent

## API surface

### Health
- `GET /health`
- `GET /api/health`
- returns:
  - `service`
  - `status`
  - `environment`
  - `baseUrl`
  - `now`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`

### Blueprint
- `POST /api/projects/:projectId/blueprint/generate`
- `GET /api/projects/:projectId/blueprint`
- `GET /api/projects/:projectId/blueprint/versions`

### Phases
- `GET /api/projects/:projectId/phases`
- `POST /api/projects/:projectId/phases/:phaseNumber/generate`
- `GET /api/projects/:projectId/phases/:phaseNumber`

### Response conventions
Success payloads are JSON objects wrapped by route-specific keys such as:
- `{ project: ... }`
- `{ projects: [...] }`
- `{ blueprint: ... }`
- `{ versions: [...] }`
- `{ phase: ... }`
- `{ phases: [...] }`
- `{ run: ... }`

Error payloads are JSON with route-level error codes/messages via the shared HTTP helpers.

## Auth and permissions

### Current auth model
- identity comes from `x-user-id`
- no session/token issuance is implemented here yet
- development mode may inject the fixed dev user

### Ownership rules
- every project lookup is user-scoped
- blueprint, phase, and cache operations are user-scoped through project ownership
- a user cannot access another user’s project through the supported store APIs

### Postgres-specific rule
- user IDs must be UUIDs in Postgres mode
- invalid IDs return `400 INVALID_USER_ID`

## Persistence model

### Supported drivers
- `json` — local dev storage in `backend/.data/projects.json`
- `postgres` — relational persistence via `pg`

### Current Postgres-backed persisted tables in use
- `users`
- `projects`
- `blueprint_versions`
- `agent_output_cache`

### Postgres-backed tables present but not yet actively used by routes
- `agent_runs`

### JSON store collections in use
- `projects`
- `blueprintVersions`
- `agentOutputCache`
- `phaseInstances`

### Important mismatch to resolve
The JSON store already supports `phaseInstances`.
The current Postgres store implementation shown in code does not yet implement `getPhaseInstanceForProject` or `upsertPhaseInstanceForProject`, which means Postgres parity for Phase 1/2 persistence is incomplete and needs closing before this contract can be called stable.

## Background processing

Not implemented yet.

Current generation is synchronous request/response work.
Returned `run` payloads are lightweight response metadata, not durable background job handles.

Future expectation:
- real blueprint and phase generation should eventually produce durable `agent_runs`
- long-running orchestration should move off direct request latency when needed

## Validation and error rules

### Shared validation
- invalid JSON body returns `400 INVALID_JSON`
- missing auth returns `401 UNAUTHENTICATED`
- invalid Postgres user ID returns `400 INVALID_USER_ID`

### Project creation validation
- invalid idea length returns `400 INVALID_INPUT`
- missing/short country returns `400 INVALID_INPUT`
- invalid currency code returns `400 INVALID_INPUT`
- invalid hours per week returns `400 INVALID_INPUT`

### Blueprint and phase dependency validation
- missing project returns `404 PROJECT_NOT_FOUND`
- missing blueprint on fetch returns `404 BLUEPRINT_NOT_FOUND`
- generating unsupported phase returns `400 PHASE_NOT_IMPLEMENTED`
- generating a phase without a blueprint returns `400 BLUEPRINT_REQUIRED`
- generating Phase 2 without Phase 1 Brand returns `400 BRAND_REQUIRED`
- fetching a missing stored phase returns `404 PHASE_NOT_FOUND`

## Current frontend expectations this spec must satisfy

The current frontend assumes:
- project creation immediately followed by blueprint generation
- a seven-section Phase 0 blueprint workspace:
  - business
  - market
  - monetisation
  - execution
  - legal
  - website
  - risks
- sidebar project list with summary status
- a phase ladder UI fed by `/phases`
- direct buttons for:
  - regenerate blueprint
  - generate Phase 1 Brand
  - generate Phase 2 Legal
- rich structured `generatedContent` payloads for Brand and Legal rendering
- locked future phases that still appear in the UI ladder

## Testing expectations

Minimum meaningful checks for this contract:
- backend boots successfully
- `GET /health` returns service metadata
- project create/list/get works for the active user
- blueprint generate/get/list versions works
- cache reuse path does not break blueprint generation
- Phase 1 Brand generation works after blueprint generation
- Phase 2 Legal generation requires Brand first
- phase ladder reflects stored/generated state accurately
- JSON and Postgres persistence should both satisfy the same route contract

## Open questions

- Should blueprint generation create durable `agent_runs` now or only after real orchestration lands?
- How should phase instances be represented in Postgres so parity with JSON mode is clean?
- When the real Bob/specialist runtime lands, does the cache stay at the section level or become agent-output granular by phase step?
- What exact auth model replaces `x-user-id` for production?
- When does the post-blueprint paywall enter the API contract?
- Which additional phases should be implemented next after Brand and Legal?

## Change log

- 2026-04-29: initial skeleton created to support repo-first build flow
- 2026-04-29: expanded into a concrete contract based on current frontend, routes, stores, and migrations
