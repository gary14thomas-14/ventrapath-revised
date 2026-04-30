# VentraPath test deploy (Render)

## Recommended setup

Use **one Render web service + one Render Postgres database**.

Why this setup wins:
- testers get **one URL**
- no cross-origin frontend/backend mess
- backend serves the built frontend directly
- persistence uses **Postgres**, not fragile JSON disk state

## What is already prepared

This repo now includes:
- `render.yaml` at repo root
- backend support for serving `frontend/dist`
- frontend production default of same-origin `/api`
- Render health check path: `/api/health`
- Render pre-deploy migrations via `npm run migrations:apply`

## Deploy steps

1. Push the latest repo state to GitHub.
2. In Render, choose **New +** → **Blueprint**.
3. Connect the VentraPath GitHub repo.
4. Render should detect `render.yaml` and propose:
   - web service: `ventrapath-test`
   - Postgres database: `ventrapath-test-db`
5. Create the stack.
6. Wait for the initial deploy and migration run to finish.
7. Open the web service URL.

That single Render URL is the tester URL.

## What testers use

Testers only need the web app URL, for example:
- `https://ventrapath-test.onrender.com`

They do **not** need a separate frontend/backend URL split.

## Notes

- This deploy path expects `PERSISTENCE_DRIVER=postgres` in Render.
- Local JSON persistence is still fine for machine-local development, but not for a proper shared test environment.
- If you rename the Render service, the public URL will change accordingly.
