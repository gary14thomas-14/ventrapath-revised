# VentraPath MVP API Contract

## Purpose

Define the first real backend API contract that the v0-generated frontend can call.

This is the MVP contract, not the forever contract.

## Principles

- frontend calls backend only
- backend owns Bob + specialist orchestration
- responses should map cleanly into the VentraPath UI
- every project is location-aware
- blueprint outputs are versioned
- phase and task progress are persistent

## Auth model

Assume authenticated app users.

Each request is associated with:
- `userId`
- `projectId` where relevant

## Standard response shape

### Success

```json
{
  "ok": true,
  "data": {}
}
```

### Error

```json
{
  "ok": false,
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

---

# 1. Create project

## `POST /api/projects`

Create a new VentraPath project from raw user input.

### Request

```json
{
  "idea": "AI indoor go-karting centre in New York",
  "country": "United States",
  "region": "New York",
  "hoursPerWeek": 10
}
```

### Response

```json
{
  "ok": true,
  "data": {
    "project": {
      "id": "proj_123",
      "name": "AI indoor go-karting centre in New York",
      "idea": "AI indoor go-karting centre in New York",
      "country": "United States",
      "region": "New York",
      "hoursPerWeek": 10,
      "status": "draft"
    }
  }
}
```

---

# 2. List projects

## `GET /api/projects`

### Response

```json
{
  "ok": true,
  "data": {
    "projects": [
      {
        "id": "proj_123",
        "name": "AI indoor go-karting centre in New York",
        "country": "United States",
        "region": "New York",
        "status": "blueprint_ready",
        "currentPhase": 0,
        "updatedAt": "2026-04-26T13:00:00Z"
      }
    ]
  }
}
```

---

# 3. Get project

## `GET /api/projects/:projectId`

### Response

```json
{
  "ok": true,
  "data": {
    "project": {
      "id": "proj_123",
      "name": "AI indoor go-karting centre in New York",
      "idea": "AI indoor go-karting centre in New York",
      "country": "United States",
      "region": "New York",
      "hoursPerWeek": 10,
      "status": "blueprint_ready",
      "currentPhase": 0,
      "createdAt": "2026-04-26T12:00:00Z",
      "updatedAt": "2026-04-26T13:00:00Z"
    }
  }
}
```

---

# 4. Generate blueprint

## `POST /api/projects/:projectId/blueprint/generate`

Start Phase 0 generation.

### Request

```json
{
  "regenerate": false
}
```

### Response

```json
{
  "ok": true,
  "data": {
    "run": {
      "id": "run_001",
      "type": "blueprint_generation",
      "status": "running"
    }
  }
}
```

---

# 5. Get blueprint

## `GET /api/projects/:projectId/blueprint`

Returns the latest blueprint version.

### Response

```json
{
  "ok": true,
  "data": {
    "blueprint": {
      "version": 3,
      "status": "ready",
      "sections": {
        "business": "...",
        "market": "...",
        "monetisation": "...",
        "execution": "...",
        "legal": "...",
        "website": "...",
        "risks": "..."
      },
      "meta": {
        "country": "United States",
        "region": "New York",
        "generatedAt": "2026-04-26T13:04:00Z"
      }
    }
  }
}
```

---

# 6. Get blueprint versions

## `GET /api/projects/:projectId/blueprint/versions`

### Response

```json
{
  "ok": true,
  "data": {
    "versions": [
      {
        "version": 1,
        "generatedAt": "2026-04-26T12:10:00Z"
      },
      {
        "version": 2,
        "generatedAt": "2026-04-26T12:40:00Z"
      }
    ]
  }
}
```

---

# 7. Get phases overview

## `GET /api/projects/:projectId/phases`

### Response

```json
{
  "ok": true,
  "data": {
    "phases": [
      { "number": 0, "title": "Blueprint", "state": "complete" },
      { "number": 1, "title": "Brand", "state": "available" },
      { "number": 2, "title": "Legal", "state": "locked" },
      { "number": 3, "title": "Finance", "state": "locked" }
    ]
  }
}
```

---

# 8. Generate phase content

## `POST /api/projects/:projectId/phases/:phaseNumber/generate`

### Request

```json
{
  "regenerate": false
}
```

### Response

```json
{
  "ok": true,
  "data": {
    "run": {
      "id": "run_phase_001",
      "type": "phase_generation",
      "phase": 1,
      "status": "running"
    }
  }
}
```

---

# 9. Get phase detail

## `GET /api/projects/:projectId/phases/:phaseNumber`

### Response

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 1,
      "title": "Brand",
      "state": "ready",
      "summary": "Create the identity, message, and external presentation of the business.",
      "tasks": [
        {
          "id": "task_001",
          "title": "Choose brand direction",
          "whatToDo": "Pick the strongest brand angle.",
          "howToDoIt": "Compare 3 naming and positioning options.",
          "executionReference": "Review the recommended naming board.",
          "status": "open"
        }
      ]
    }
  }
}
```

---

# 10. Update task status

## `PATCH /api/tasks/:taskId`

### Request

```json
{
  "status": "complete"
}
```

### Response

```json
{
  "ok": true,
  "data": {
    "task": {
      "id": "task_001",
      "status": "complete",
      "completedAt": "2026-04-26T13:15:00Z"
    }
  }
}
```

---

# 11. Get weekly plan

## `GET /api/projects/:projectId/weekly-plan`

### Response

```json
{
  "ok": true,
  "data": {
    "weeklyPlan": {
      "hoursPerWeek": 10,
      "plan": [
        {
          "week": 1,
          "focus": "Brand basics",
          "tasks": [
            "Choose name",
            "Lock value proposition",
            "Draft homepage hero"
          ]
        }
      ]
    }
  }
}
```

---

# 12. Generate or refresh weekly plan

## `POST /api/projects/:projectId/weekly-plan`

### Request

```json
{
  "hoursPerWeek": 6
}
```

### Response

```json
{
  "ok": true,
  "data": {
    "weeklyPlan": {
      "hoursPerWeek": 6,
      "status": "ready"
    }
  }
}
```

---

# 13. Get active runs

## `GET /api/projects/:projectId/runs`

### Response

```json
{
  "ok": true,
  "data": {
    "runs": [
      {
        "id": "run_001",
        "type": "blueprint_generation",
        "status": "completed",
        "startedAt": "2026-04-26T13:00:00Z",
        "finishedAt": "2026-04-26T13:02:00Z"
      }
    ]
  }
}
```

---

# 14. Billing status

## `GET /api/billing/subscription`

### Response

```json
{
  "ok": true,
  "data": {
    "subscription": {
      "plan": "pro",
      "status": "active",
      "renewalDate": "2026-05-26"
    }
  }
}
```

---

# 15. Create checkout session

## `POST /api/billing/checkout`

### Request

```json
{
  "plan": "pro"
}
```

### Response

```json
{
  "ok": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/..."
  }
}
```

---

## Internal orchestration notes

The frontend should never see raw specialist output.

The backend should:
- store raw specialist output internally if needed
- store final Bob-approved output as the user-facing canonical version
- version all blueprint generations
- keep phase/task state separate from generation runs

## MVP validation rules

Before returning blueprint content, backend should confirm:
- country exists
- business section exists
- market section exists
- monetisation section exists
- execution section exists
- legal section exists
- website section exists
- risks section exists

Before returning pricing-heavy Monetisation, backend should confirm:
- currency matches project location
- price points are present when estimable
- pricing is not vague if comparables are available

## Best build order

1. `POST /api/projects`
2. `POST /api/projects/:projectId/blueprint/generate`
3. `GET /api/projects/:projectId/blueprint`
4. `GET /api/projects/:projectId/phases`
5. `GET /api/projects/:projectId/phases/:phaseNumber`
6. `PATCH /api/tasks/:taskId`
7. weekly plan endpoints
8. billing endpoints

## Bottom line

This is the minimum viable API surface to turn the v0-generated UI into a real VentraPath product shell backed by persistence, orchestration, and structured progress.
