# VentraPath tester deploy - canonical v0 frontend

## Decision

Use the extracted `projects/ventrapath/v0-frontend/` Next app as the tester-facing UI.

Do **not** use the fallback `projects/ventrapath/frontend/` Vite app for tester signoff.

## Current wiring

The v0 frontend now has a real VentraPath API client and no longer depends on hardcoded mock pages for the main generated flow:

- `/input` stores the idea + country for the current tester session
- `/generating` creates the project and generates the blueprint
- blueprint routes load real blueprint sections from the backend
- phase routes load and/or generate real backend phases 1-9
- `next.config.mjs` rewrites `/api/*` to `BACKEND_URL/api/*`

That means the clean deploy shape is:

- **Frontend:** Vercel hosting `projects/ventrapath/v0-frontend`
- **Backend/API:** Render or equivalent Node service for `projects/ventrapath/backend`
- **Database:** Postgres once the backend bootstrap path is fixed
- **Short-term local/dev fallback:** JSON mode remains acceptable while Postgres is broken

## Environment

### Frontend (`v0-frontend`)

Required/expected:

- `BACKEND_URL=https://<your-backend-host>`

Optional:

- `NEXT_PUBLIC_API_BASE_URL=/api`
  - normally leave this unset and use the Next rewrite/proxy

### Backend

Use the existing backend env/config. For tester deploys, point it at Postgres when ready.

## Local run

### Backend

From `projects/ventrapath/backend`:

```powershell
npm run dev
```

### Frontend

From `projects/ventrapath/v0-frontend`:

```powershell
npm install
npm run dev -- --hostname 127.0.0.1 --port 3001
```

With local defaults, the frontend proxy targets `http://127.0.0.1:4000`.

## Verification used

The existing smoke test was run through the Next frontend proxy, not directly against the backend:

```powershell
$env:VENTRAPATH_BASE='http://127.0.0.1:3001/api'
python scripts\local-test\backend-smoke.py
```

This passed for:

- health
- project creation
- blueprint generation/fetch
- phases 1-9 generation/fetch
- phase ladder progression
- project progress state

## Important caveat

The v0 export is still a prototype shell in places. The main business flow is now wired to the real backend, but further polish may still be needed page-by-page if testers want tighter parity with every original mock detail.
