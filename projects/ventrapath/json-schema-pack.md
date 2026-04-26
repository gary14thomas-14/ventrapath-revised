# VentraPath JSON Schema Pack

## Purpose

Define the first validation schema set for the VentraPath MVP.

These schemas are the runtime safety rails for:
- request validation
- response validation
- orchestration output validation
- phase payload validation

TypeScript types are nice.
Schemas are what stop garbage getting into storage.

---

## Recommended rule

Use:
- **TypeScript types** for developer ergonomics
- **JSON Schema** for runtime validation

Do not rely on types alone.
The agents and API edges need hard validation.

---

## Schema naming convention

Recommended IDs:

- `project.create.request`
- `project.response`
- `blueprint.sections`
- `blueprint.version`
- `task.item`
- `phase.overview.item`
- `phase.brand.content`
- `phase.legal.content`
- `phase.finance.content`
- `weekly-plan.request`
- `weekly-plan.response`

---

## 1. Create project request

```json
{
  "$id": "project.create.request",
  "type": "object",
  "additionalProperties": false,
  "required": ["idea", "country"],
  "properties": {
    "idea": {
      "type": "string",
      "minLength": 3,
      "maxLength": 500
    },
    "country": {
      "type": "string",
      "minLength": 2,
      "maxLength": 100
    },
    "region": {
      "type": "string",
      "maxLength": 100
    },
    "hoursPerWeek": {
      "type": "integer",
      "minimum": 1,
      "maximum": 168
    }
  }
}
```

---

## 2. Project response shape

```json
{
  "$id": "project.response",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "id",
    "name",
    "rawIdea",
    "country",
    "currencyCode",
    "status",
    "currentPhaseNumber",
    "createdAt",
    "updatedAt"
  ],
  "properties": {
    "id": { "type": "string" },
    "userId": { "type": "string" },
    "name": { "type": "string" },
    "rawIdea": { "type": "string" },
    "country": { "type": "string" },
    "region": { "type": ["string", "null"] },
    "currencyCode": { "type": "string", "minLength": 3, "maxLength": 3 },
    "hoursPerWeek": { "type": ["integer", "null"] },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "blueprint_generating",
        "blueprint_ready",
        "in_progress",
        "archived"
      ]
    },
    "currentPhaseNumber": { "type": "integer", "minimum": 0, "maximum": 9 },
    "latestBlueprintVersionNumber": { "type": ["integer", "null"] },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  }
}
```

---

## 3. Blueprint sections schema

```json
{
  "$id": "blueprint.sections",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "business",
    "market",
    "monetisation",
    "execution",
    "legal",
    "website",
    "risks"
  ],
  "properties": {
    "business": { "type": "string", "minLength": 20 },
    "market": { "type": "string", "minLength": 20 },
    "monetisation": { "type": "string", "minLength": 20 },
    "execution": { "type": "string", "minLength": 10 },
    "legal": { "type": "string", "minLength": 10 },
    "website": { "type": "string", "minLength": 10 },
    "risks": { "type": "string", "minLength": 10 }
  }
}
```

### Validation note

This schema only checks structural presence and minimum content size.
It does **not** prove the blueprint is actually good.
That judgment still belongs to the orchestration rules.

---

## 4. Blueprint version schema

```json
{
  "$id": "blueprint.version",
  "type": "object",
  "additionalProperties": false,
  "required": ["version", "status", "sections", "meta"],
  "properties": {
    "version": { "type": "integer", "minimum": 1 },
    "status": { "type": "string", "enum": ["ready"] },
    "sections": { "$ref": "blueprint.sections" },
    "meta": {
      "type": "object",
      "additionalProperties": false,
      "required": ["country", "generatedAt"],
      "properties": {
        "country": { "type": "string" },
        "region": { "type": ["string", "null"] },
        "currencyCode": { "type": ["string", "null"] },
        "generatedAt": { "type": "string", "format": "date-time" }
      }
    }
  }
}
```

---

## 5. Task item schema

```json
{
  "$id": "task.item",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "title",
    "whatToDo",
    "howToDoIt",
    "executionReference",
    "isRequired"
  ],
  "properties": {
    "title": { "type": "string", "minLength": 3, "maxLength": 140 },
    "whatToDo": { "type": "string", "minLength": 10 },
    "howToDoIt": { "type": "string", "minLength": 10 },
    "executionReference": { "type": "string", "minLength": 3 },
    "isRequired": { "type": "boolean" },
    "status": {
      "type": "string",
      "enum": ["open", "in_progress", "complete", "skipped"]
    }
  }
}
```

---

## 6. Phase overview item schema

```json
{
  "$id": "phase.overview.item",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "number",
    "title",
    "state",
    "isUnlocked",
    "isGenerated",
    "taskCounts"
  ],
  "properties": {
    "number": { "type": "integer", "minimum": 1, "maximum": 9 },
    "title": { "type": "string" },
    "state": {
      "type": "string",
      "enum": ["locked", "available", "generating", "ready", "complete"]
    },
    "isUnlocked": { "type": "boolean" },
    "isGenerated": { "type": "boolean" },
    "taskCounts": {
      "type": "object",
      "additionalProperties": false,
      "required": ["total", "complete", "required", "requiredComplete"],
      "properties": {
        "total": { "type": "integer", "minimum": 0 },
        "complete": { "type": "integer", "minimum": 0 },
        "required": { "type": "integer", "minimum": 0 },
        "requiredComplete": { "type": "integer", "minimum": 0 }
      }
    }
  }
}
```

---

## 7. Brand phase content schema

```json
{
  "$id": "phase.brand.content",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "brandDirection",
    "nameOptions",
    "recommendedName",
    "tagline",
    "corePromise",
    "brandVoice",
    "messagingPillars",
    "homepageHero",
    "visualDirection",
    "brandRisks"
  ],
  "properties": {
    "brandDirection": { "type": "string", "minLength": 20 },
    "nameOptions": {
      "type": "array",
      "minItems": 2,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["name", "rationale"],
        "properties": {
          "name": { "type": "string" },
          "rationale": { "type": "string" }
        }
      }
    },
    "recommendedName": {
      "type": "object",
      "additionalProperties": false,
      "required": ["name", "rationale"],
      "properties": {
        "name": { "type": "string" },
        "rationale": { "type": "string" }
      }
    },
    "tagline": { "type": "string" },
    "corePromise": { "type": "string" },
    "brandVoice": { "type": "array", "minItems": 3, "items": { "type": "string" } },
    "messagingPillars": { "type": "array", "minItems": 3, "items": { "type": "string" } },
    "homepageHero": {
      "type": "object",
      "additionalProperties": false,
      "required": ["headline", "subheadline", "cta"],
      "properties": {
        "headline": { "type": "string" },
        "subheadline": { "type": "string" },
        "cta": { "type": "string" }
      }
    },
    "visualDirection": {
      "type": "object",
      "additionalProperties": false,
      "required": ["mood", "avoid"],
      "properties": {
        "mood": { "type": "string" },
        "avoid": { "type": "array", "items": { "type": "string" } }
      }
    },
    "brandRisks": { "type": "array", "items": { "type": "string" } }
  }
}
```

---

## 8. Legal phase content schema

```json
{
  "$id": "phase.legal.content",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "recommendedStructure",
    "registrationPath",
    "licensingChecks",
    "complianceObligations",
    "brandAndTrademarkChecks",
    "marketingClaimWarnings",
    "legalRisks",
    "requiredDocuments"
  ],
  "properties": {
    "recommendedStructure": {
      "type": "object",
      "additionalProperties": false,
      "required": ["type", "rationale"],
      "properties": {
        "type": { "type": "string" },
        "rationale": { "type": "string" },
        "upgradeLater": { "type": "string" }
      }
    },
    "registrationPath": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["step", "authority", "timing", "reason"],
        "properties": {
          "step": { "type": "string" },
          "authority": { "type": "string" },
          "timing": { "type": "string" },
          "reason": { "type": "string" }
        }
      }
    },
    "licensingChecks": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["area", "status", "reason"],
        "properties": {
          "area": { "type": "string" },
          "status": {
            "type": "string",
            "enum": ["likely_required", "may_apply", "not_likely"]
          },
          "reason": { "type": "string" },
          "followUp": { "type": "string" }
        }
      }
    },
    "complianceObligations": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["title", "whyItMatters"],
        "properties": {
          "title": { "type": "string" },
          "whyItMatters": { "type": "string" }
        }
      }
    },
    "brandAndTrademarkChecks": {
      "type": "object",
      "additionalProperties": false,
      "required": ["businessNameCheck", "trademarkCheck", "domainCheck"],
      "properties": {
        "businessNameCheck": { "type": "string" },
        "trademarkCheck": { "type": "string" },
        "domainCheck": { "type": "string" }
      }
    },
    "marketingClaimWarnings": { "type": "array", "items": { "type": "string" } },
    "legalRisks": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["risk", "severity", "why", "nextStep"],
        "properties": {
          "risk": { "type": "string" },
          "severity": { "type": "string", "enum": ["low", "medium", "high"] },
          "why": { "type": "string" },
          "nextStep": { "type": "string" }
        }
      }
    },
    "requiredDocuments": { "type": "array", "items": { "type": "string" } }
  }
}
```

---

## 9. Finance phase content schema

```json
{
  "$id": "phase.finance.content",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "financialModelSummary",
    "startupCosts",
    "monthlyOperatingCosts",
    "revenueModel",
    "breakevenView",
    "pricingSanityCheck",
    "cashflowPressurePoints",
    "fundingPosture",
    "financeRisks"
  ],
  "properties": {
    "financialModelSummary": { "type": "string" },
    "startupCosts": {
      "type": "object",
      "additionalProperties": false,
      "required": ["low", "likely", "high", "currency", "buckets"],
      "properties": {
        "low": { "type": "number", "minimum": 0 },
        "likely": { "type": "number", "minimum": 0 },
        "high": { "type": "number", "minimum": 0 },
        "currency": { "type": "string" },
        "buckets": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["label", "amount"],
            "properties": {
              "label": { "type": "string" },
              "amount": { "type": "number", "minimum": 0 }
            }
          }
        }
      }
    },
    "monthlyOperatingCosts": {
      "type": "object",
      "additionalProperties": false,
      "required": ["currency", "buckets", "estimatedTotal"],
      "properties": {
        "currency": { "type": "string" },
        "buckets": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["label", "amount"],
            "properties": {
              "label": { "type": "string" },
              "amount": { "type": "number", "minimum": 0 }
            }
          }
        },
        "estimatedTotal": { "type": "number", "minimum": 0 }
      }
    },
    "revenueModel": {
      "type": "object",
      "additionalProperties": false,
      "required": ["primaryDriver", "supportingDrivers", "keyAssumptions"],
      "properties": {
        "primaryDriver": { "type": "string" },
        "supportingDrivers": { "type": "array", "items": { "type": "string" } },
        "keyAssumptions": { "type": "array", "items": { "type": "string" } }
      }
    },
    "breakevenView": {
      "type": "object",
      "additionalProperties": false,
      "required": ["monthlyRevenueRequired", "unitInterpretation", "mainPressurePoint"],
      "properties": {
        "monthlyRevenueRequired": { "type": "number", "minimum": 0 },
        "unitInterpretation": { "type": "string" },
        "mainPressurePoint": { "type": "string" }
      }
    },
    "pricingSanityCheck": {
      "type": "object",
      "additionalProperties": false,
      "required": ["verdict", "reason"],
      "properties": {
        "verdict": { "type": "string" },
        "reason": { "type": "string" }
      }
    },
    "cashflowPressurePoints": { "type": "array", "items": { "type": "string" } },
    "fundingPosture": {
      "type": "object",
      "additionalProperties": false,
      "required": ["type", "reason"],
      "properties": {
        "type": { "type": "string" },
        "reason": { "type": "string" }
      }
    },
    "financeRisks": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["risk", "severity"],
        "properties": {
          "risk": { "type": "string" },
          "severity": { "type": "string", "enum": ["low", "medium", "high"] }
        }
      }
    }
  }
}
```

---

## 10. Weekly plan request/response schemas

```json
{
  "$id": "weekly-plan.request",
  "type": "object",
  "additionalProperties": false,
  "required": ["hoursPerWeek"],
  "properties": {
    "hoursPerWeek": {
      "type": "integer",
      "minimum": 1,
      "maximum": 168
    }
  }
}
```

```json
{
  "$id": "weekly-plan.response",
  "type": "object",
  "additionalProperties": false,
  "required": ["weeklyPlan"],
  "properties": {
    "weeklyPlan": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "projectId", "hoursPerWeek", "plan", "createdAt"],
      "properties": {
        "id": { "type": "string" },
        "projectId": { "type": "string" },
        "hoursPerWeek": { "type": "integer" },
        "plan": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["week", "focus", "tasks"],
            "properties": {
              "week": { "type": "integer", "minimum": 1 },
              "focus": { "type": "string" },
              "tasks": {
                "type": "array",
                "items": { "type": "string" }
              }
            }
          }
        },
        "createdAt": { "type": "string", "format": "date-time" }
      }
    }
  }
}
```

---

## 11. Validation strategy by layer

### Request edge
Validate:
- create project
- generate blueprint
- generate phase
- update task
- generate weekly plan
- billing checkout

### Orchestration output edge
Validate:
- blueprint sections
- phase content payloads
- task arrays

### Persistence edge
Validate before write:
- approved blueprint payload
- phase generated content JSON
- weekly plan JSON

### Read edge
Optional but smart:
- validate serialized payloads before returning them to frontend
- fail loudly if stored shape is corrupted

---

## 12. What should be strict vs loose

### Strict now
- request schemas
- blueprint section presence
- task shape
- phase overview shape
- early phase payloads (Brand, Legal, Finance)

### Loose for MVP
- later phase deep shapes if code is not consuming every nested field yet
- internal routing metadata
- raw agent outputs

Do not make late-phase schemas so rigid that implementation slows to a crawl for no gain.

---

## 13. Recommended file layout in code

```txt
/shared/schemas/project.ts
/shared/schemas/blueprint.ts
/shared/schemas/task.ts
/shared/schemas/phase-overview.ts
/shared/schemas/phases/brand.ts
/shared/schemas/phases/legal.ts
/shared/schemas/phases/finance.ts
/shared/schemas/weekly-plan.ts
```

If using Zod instead of raw JSON Schema, mirror the same structure and export JSON Schema only if needed.

---

## Bottom line

Types make the code pleasant.
Schemas make the product trustworthy.

VentraPath needs both.
