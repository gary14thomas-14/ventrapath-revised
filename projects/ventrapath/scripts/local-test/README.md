# Local Test Scripts

## `backend-smoke.py`

Purpose:
- prove the current local/live backend loop works end-to-end

What it checks:
- health endpoint
- project create/get
- blueprint generate/get/list versions
- phases 1-9 generate/get
- phase ladder states
- project progression to phase 9

Assumptions:
- backend is running on `http://127.0.0.1:4000`
- API base is `http://127.0.0.1:4000/api`
- current dev user ID is accepted

Run:

```bash
python scripts/local-test/backend-smoke.py
```

Use this before upstream pushes when the backend contract has changed.

## `phase-persistence-smoke.py`

Purpose:
- prove Phase 3-9 progress and rich step state persist against a fresh backend-backed project

What it checks:
- health endpoint
- fresh project + blueprint generation
- phases 3-9 generate successfully
- `PATCH /projects/:id/phases/:phaseNumber` persists `completedStepIds`, `richStepState`, and `progress`
- subsequent `GET /phases/:phaseNumber` returns the saved state
- repeat `POST /phases/:phaseNumber/generate` does not wipe saved state
- phase ladder progress reflects the saved completion counts

Assumptions:
- backend is running on `http://127.0.0.1:4000`
- API base is `http://127.0.0.1:4000/api`
- current dev user ID is accepted

Run:

```bash
python scripts/local-test/phase-persistence-smoke.py
```

Use this when phase save/load logic, persistence, or progress handling changes.

## `frontend-phase-flow-smoke.js`

Purpose:
- prove the real frontend Phase 3+ flow works against the backend, not just the API contract in isolation

What it checks:
- fresh project + blueprint generation through the backend
- `/phase3/finance` auto-loads with stored project context
- phase ladder navigation between Finance and Protection works
- notes + checklist state persist through frontend save flow
- the saved state survives navigation and full page reload

Assumptions:
- backend is running on `http://127.0.0.1:4000`
- frontend is running on `http://127.0.0.1:3000`
- Playwright chromium is installed (`npx playwright install chromium`)
- `playwright` is available in local `node_modules` for the workspace run

Run:

```bash
node scripts/local-test/frontend-phase-flow-smoke.js
```

Optional overrides:

```bash
VENTRAPATH_BASE=http://127.0.0.1:4000/api VENTRAPATH_FRONTEND_BASE=http://127.0.0.1:3000 node scripts/local-test/frontend-phase-flow-smoke.js
```

Use this when frontend phase persistence, navigation, or backend-backed phase loading changes.

## `production-smoke.py`

Purpose:
- prove the actual production backend is using the real OpenAI path, not the fallback template path

What it checks:
- production health endpoint
- fresh project creation on production
- fresh blueprint generation on production
- `meta.sourceMeta.provider == "openai"`
- `meta.sourceMeta.writer == "openai-direct-blueprint-v1"`
- fallback-template text is absent
- raw prompt dump text is absent

Default target:
- `https://ventrapath-backend-live.vercel.app/api`

Run:

```bash
python scripts/local-test/production-smoke.py
```

Optional override:

```bash
VENTRAPATH_BASE=https://ventrapath-backend-live.vercel.app/api python scripts/local-test/production-smoke.py
```

Use this immediately after production backend deploys. If this fails, do not trust the deploy.
