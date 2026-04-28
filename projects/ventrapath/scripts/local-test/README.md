# Local Test Scripts

## `backend-smoke.py`

Purpose:
- prove the current live backend loop works end-to-end

What it checks:
- health endpoint
- project create/get
- blueprint generate/get/list versions
- Phase 1 Brand generate/get
- Phase 2 Legal generate/get
- phase ladder states
- project progression to phase 2

Assumptions:
- backend is running on `http://127.0.0.1:4000`
- API base is `http://127.0.0.1:4000/api`
- current dev user ID is accepted

Run:

```bash
python scripts/local-test/backend-smoke.py
```

Use this before upstream pushes when the backend contract has changed.
