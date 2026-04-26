# VentraPath Frontend ↔ Backend Architecture

## Purpose

Define how the real VentraPath backend should connect to the v0-generated frontend.

## Core principle

v0 is the **frontend shell**, not the product brain.

The real VentraPath application should be split like this:

- **Frontend (v0 / Next.js UI)**
  - rendering
  - navigation
  - forms
  - dashboards
  - phase views
  - task views
  - blueprint display
  - progress UI
- **Backend (real product brain)**
  - auth
  - project persistence
  - blueprint generation
  - phase generation
  - agent orchestration
  - billing
  - file/document storage
  - progress tracking
  - weekly plan generation
  - audit / logs

This keeps the UI replaceable and the backend durable.

## Recommended deployment shape

### 1. Frontend app

Use the v0-generated app as the VentraPath web client.

Recommended stack:
- Next.js frontend
- typed API client
- server-side auth/session handling where useful
- websocket / realtime only if needed later

### 2. Backend app

Run a separate backend service for product logic.

Recommended backend responsibilities:
- authenticate users
- manage organisations / accounts / workspaces
- store ideas, blueprints, phases, and task progress
- call Bob + specialist agents
- assemble final structured outputs
- enforce phase rules and sequencing logic
- generate weekly plans from user time availability
- store outputs and retrieval history
- manage payments / subscriptions

### 3. Database

Use a real database as the system of record.

Core records:
- users
- businesses / projects
- location / country
- time availability
- blueprint versions
- phase data
- tasks
- task completion state
- weekly plans
- agent runs
- billing/subscription state

### 4. File / object storage

Use object storage for:
- generated documents
- exports
- uploaded assets
- attachments
- screenshots / supporting files

## How frontend talks to backend

The v0 frontend should talk to the backend over normal application APIs.

Recommended pattern:
- **REST endpoints for most CRUD and workflow actions**
- optional websockets / SSE later for long-running generation progress

### Key frontend flows

#### A. Start blueprint
Frontend sends:
- idea text
- country / region
- user/session id

Backend does:
- validate input
- create business/project record
- create blueprint job
- route to Bob orchestration
- store structured result
- return job status + final blueprint

#### B. View blueprint
Frontend requests:
- project by id
- latest blueprint version

Backend returns:
- Business
- Market
- Monetisation
- Execution
- Legal
- Website
- Risks
- metadata (location, version, timestamps)

#### C. Move into phases
Frontend sends:
- selected project id
- phase navigation action

Backend returns:
- phase overview
- tasks
- task states
- generated guidance
- completion rules

#### D. Mark task complete
Frontend sends:
- task id
- completion state

Backend updates:
- task status
- phase progress
- overall business progress

#### E. Weekly execution planning
Frontend sends:
- user time available per week

Backend does:
- generate realistic pace
- store plan
- attach plan to phase/task state

## Recommended API surface

### Auth
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`

### Projects / businesses
- `POST /projects`
- `GET /projects`
- `GET /projects/:projectId`
- `PATCH /projects/:projectId`

### Blueprint
- `POST /projects/:projectId/blueprint/generate`
- `GET /projects/:projectId/blueprint`
- `GET /projects/:projectId/blueprint/versions`

### Phases
- `GET /projects/:projectId/phases`
- `GET /projects/:projectId/phases/:phaseId`
- `POST /projects/:projectId/phases/:phaseId/generate`

### Tasks
- `PATCH /tasks/:taskId`
- `POST /tasks/:taskId/complete`
- `POST /tasks/:taskId/reopen`

### Weekly plan
- `POST /projects/:projectId/weekly-plan`
- `GET /projects/:projectId/weekly-plan`

### Billing
- `GET /billing/subscription`
- `POST /billing/checkout`
- `POST /billing/webhook`

## Agent orchestration layer

The backend should contain a dedicated orchestration layer.

### Internal flow
1. receive generation request
2. validate required inputs
3. create run record
4. call Bob orchestrator
5. Bob routes to required specialists only
6. specialist outputs return in structured form
7. Bob synthesises final output
8. backend validates structure
9. backend stores final output by section + version
10. frontend reads the stored result

### Important rule

The frontend should **never** call specialist agents directly.

It should only call the backend.

The backend owns:
- routing
- timeouts
- retries
- result validation
- versioning
- logging

## Data model recommendation

### `projects`
- id
- user_id
- name
- raw_idea
- country
- region
- status
- created_at
- updated_at

### `blueprint_versions`
- id
- project_id
- version_number
- business
- market
- monetisation
- execution
- legal
- website
- risks
- created_by_run_id
- created_at

### `phases`
- id
- project_id
- phase_number
- title
- state
- generated_content_json
- updated_at

### `tasks`
- id
- project_id
- phase_id
- title
- description
- how_to
- execution_reference
- status
- completed_at

### `agent_runs`
- id
- project_id
- run_type
- input_json
- output_json
- status
- started_at
- finished_at

### `weekly_plans`
- id
- project_id
- hours_per_week
- plan_json
- created_at

## Recommended UI integration pattern in v0

Use v0 to build these pages/components:
- onboarding form
- blueprint page
- phase navigation sidebar
- phase detail page
- task accordion/cards
- weekly plan panel
- billing/settings pages

Then wire those components to the backend with:
- typed fetch client
- loading states
- error states
- optimistic task completion where safe

## Best MVP architecture choice

For VentraPath MVP:

- **Frontend:** v0-generated Next.js app
- **Backend:** separate API/orchestrator service
- **Database:** Postgres
- **Storage:** object storage
- **Auth:** standard SaaS auth
- **Billing:** Stripe or equivalent

## Why separate backend is better than stuffing everything into the v0 app

Because VentraPath is not a brochure site.
It has:
- long-lived state
- phase logic
- versioned outputs
- agent orchestration
- billing
- persistence
- location-aware generation
- time-aware planning

If all of that gets jammed directly into the v0 codebase, the frontend becomes the product brain by accident.
That will get messy fast.

## Recommended real build sequence

1. Freeze the current blueprint contract
2. Define backend API contracts
3. Define database schema
4. Build project + blueprint persistence first
5. Connect v0 blueprint screen to real backend
6. Add phase state and task persistence
7. Add weekly planning
8. Add billing/auth hardening
9. Add realtime progress only if needed

## Bottom line

Use **v0 for the face**.
Use a **separate backend for the brain**.

The connection point is not "v0.dev" itself.
The connection point is the **code exported from v0**, which should call your real backend APIs like any other production frontend.
