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

Required production envs for the real blueprint path:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- database envs / `PERSISTENCE_DRIVER` as appropriate

If `OPENAI_API_KEY` is missing in production, the live backend can silently degrade to the fallback blueprint writer. Treat that as a broken deploy, not an acceptable partial state.

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

## Production verification checklist

After every backend production deploy:

1. verify the backend project has the required production envs, especially `OPENAI_API_KEY`
2. redeploy the actual backend project, not just the frontend
3. run:

```powershell
python scripts\local-test\production-smoke.py
```

4. confirm the response reports:
   - `provider: openai`
   - `writer: openai-direct-blueprint-v1`
5. only then trust tester-facing blueprint quality checks in the frontend

This matters because a deploy can be "green" while the live generation path is still wrong.

## Important caveat

The v0 export is still a prototype shell in places. The main business flow is now wired to the real backend, but further polish may still be needed page-by-page if testers want tighter parity with every original mock detail.
