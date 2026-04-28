# VentraPath Current API Contract

Status: current live contract
Last updated: 2026-04-29

This file describes the live API shape the current frontend depends on.

## Shared rules

### Base URL
- frontend default: `http://localhost:3000/api`
- backend default app base: `http://localhost:4000`
- practical backend API base during local backend use: `http://localhost:4000/api`

### Auth
- current identity header: `x-user-id`
- development fallback user ID: `11111111-1111-4111-8111-111111111111`
- Postgres mode requires a UUID-shaped user ID

### Response envelope
Success:

```json
{
  "ok": true,
  "data": {}
}
```

Failure:

```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Health

### `GET /health`
### `GET /api/health`

Returns:

```json
{
  "ok": true,
  "data": {
    "service": "ventrapath-backend",
    "status": "ok",
    "environment": "development",
    "baseUrl": "http://localhost:4000",
    "now": "2026-04-28T22:04:36.988Z"
  }
}
```

## Projects

### `GET /api/projects`

Returns summary list items only.

```json
{
  "ok": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "Phase Parity Test",
        "country": "Australia",
        "region": "Western Australia",
        "status": "in_progress",
        "currentPhaseNumber": 2,
        "updatedAt": "2026-04-28T22:04:42.435Z"
      }
    ]
  }
}
```

### `POST /api/projects`

Request body:

```json
{
  "name": "Phase Parity Test",
  "idea": "A guided business builder for regulated local services",
  "country": "Australia",
  "region": "Western Australia",
  "currencyCode": "AUD",
  "hoursPerWeek": 10
}
```

Rules:
- `idea` required, minimum 3 chars
- `country` required
- `name` optional, minimum 2 chars if provided
- `region` optional
- `currencyCode` optional, must be 3 uppercase letters if provided
- `hoursPerWeek` optional, integer `1..168`
- if `name` is omitted, backend uses `idea`
- if `currencyCode` is omitted, backend derives it from `country` or falls back to `USD`

Response:

```json
{
  "ok": true,
  "data": {
    "project": {
      "id": "uuid",
      "userId": "uuid",
      "name": "Phase Parity Test",
      "rawIdea": "A guided business builder for regulated local services",
      "country": "Australia",
      "region": "Western Australia",
      "currencyCode": "AUD",
      "hoursPerWeek": 10,
      "status": "draft",
      "currentPhaseNumber": 0,
      "latestBlueprintVersionNumber": null,
      "createdAt": "2026-04-28T22:04:42.435Z",
      "updatedAt": "2026-04-28T22:04:42.435Z"
    }
  }
}
```

### `GET /api/projects/:projectId`

Returns the full stored project record.

## Blueprint

### `POST /api/projects/:projectId/blueprint/generate`

Request body:

```json
{
  "regenerate": false
}
```

Notes:
- empty object is allowed
- if a blueprint already exists and `regenerate` is false, backend returns the existing blueprint with `reusedExisting: true`
- otherwise backend may reuse a cached specialist-output payload and create a fresh blueprint version

Fresh-generation response shape:

```json
{
  "ok": true,
  "data": {
    "run": {
      "id": "uuid",
      "type": "blueprint_generation",
      "status": "completed"
    },
    "blueprint": {
      "id": "uuid",
      "projectId": "uuid",
      "version": 1,
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
        "country": "Australia",
        "region": "Western Australia",
        "currencyCode": "AUD",
        "generatedAt": "2026-04-28T22:04:42.435Z"
      },
      "createdAt": "2026-04-28T22:04:42.435Z"
    },
    "cache": {
      "specialistSections": "miss"
    }
  }
}
```

Reuse response shape:

```json
{
  "ok": true,
  "data": {
    "run": {
      "id": "uuid",
      "type": "blueprint_generation",
      "status": "completed"
    },
    "blueprint": {},
    "reusedExisting": true
  }
}
```

### `GET /api/projects/:projectId/blueprint`

Returns the latest blueprint version.

### `GET /api/projects/:projectId/blueprint/versions`

Returns newest-first version summaries:

```json
{
  "ok": true,
  "data": {
    "versions": [
      {
        "version": 1,
        "generatedAt": "2026-04-28T22:04:42.435Z"
      }
    ]
  }
}
```

## Phases

### `GET /api/projects/:projectId/phases`

Returns a 9-phase overview.

Current behaviour:
- before blueprint: everything effectively locked
- after blueprint: Phases 1 and 2 available, 3+ locked
- stored Phase 1/2 records override the default overview data

Overview item shape:

```json
{
  "number": 1,
  "title": "Brand",
  "state": "ready",
  "summary": "Turn the blueprint into a usable external identity with a name, positioning, visual direction, domain path, and social handle set.",
  "progress": {
    "totalSteps": 5,
    "completedSteps": 0
  },
  "taskCount": 5
}
```

### `POST /api/projects/:projectId/phases/1/generate`

Prerequisite:
- latest blueprint must exist

Response:

```json
{
  "ok": true,
  "data": {
    "run": {
      "id": "uuid",
      "type": "phase_generation",
      "status": "completed",
      "phaseNumber": 1
    },
    "phase": {
      "id": "uuid",
      "projectId": "uuid",
      "phaseNumber": 1,
      "title": "Brand",
      "state": "ready",
      "summary": "...",
      "generatedContent": {
        "progress": {
          "totalSteps": 5,
          "completedSteps": 0
        },
        "steps": [],
        "brandLayer": {}
      },
      "tasks": [],
      "generatedAt": "2026-04-28T22:04:42.435Z",
      "createdAt": "2026-04-28T22:04:42.435Z",
      "updatedAt": "2026-04-28T22:04:42.435Z"
    }
  }
}
```

### `POST /api/projects/:projectId/phases/2/generate`

Prerequisites:
- latest blueprint must exist
- Phase 1 Brand must already exist

Response shape matches Phase 1, with:
- `phaseNumber: 2`
- `title: "Legal"`
- `generatedContent.steps`
- `generatedContent.legalLayer`

### `GET /api/projects/:projectId/phases/:phaseNumber`

Returns the stored phase instance for that phase.

Current implementation notes:
- only generated phases can be fetched
- fetch does not auto-generate
- unsupported generation requests fail before fetch comes into play

## Known live error codes

- `UNAUTHENTICATED`
- `INVALID_USER_ID`
- `INVALID_JSON`
- `INVALID_INPUT`
- `PROJECT_NOT_FOUND`
- `BLUEPRINT_NOT_FOUND`
- `BLUEPRINT_REQUIRED`
- `BRAND_REQUIRED`
- `PHASE_NOT_IMPLEMENTED`
- `PHASE_NOT_FOUND`
