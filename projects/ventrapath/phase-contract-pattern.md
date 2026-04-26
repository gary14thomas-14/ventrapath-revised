# VentraPath Phase Contract Pattern

## Purpose

Define the reusable pattern for Phases 1-9 so the backend and UI do not turn into nine unrelated mini-products.

This is the common contract shape the remaining phase docs should follow.

## Core rule

Every phase contract should answer four things:

1. **What is this phase for?**
2. **What inputs does it require?**
3. **What structured output does it generate?**
4. **What actionable tasks should the user get?**

If a phase cannot answer those cleanly, it is under-specified.

---

## Required sections in every phase contract

### 1. Purpose
Plain statement of why the phase exists.

### 2. Phase goal
What changed should be true after the phase is complete.

### 3. Inputs required
Which prior phase outputs and project metadata must exist.

This should always state:
- whether location is required
- whether the approved blueprint is required
- whether prior phase content is required

### 4. Outputs the phase should generate
List the structured blocks that phase returns.

These should be product-shaped, not essay-shaped.

### 5. What the phase should not do
Guardrails against drift.

### 6. Quality rules
Clear pass/fail logic for the phase output.

### 7. Recommended data shape for `phase_instances.generated_content_json`
A realistic JSON shape for backend storage.

### 8. Recommended task output
The concrete tasks the UI should display.

Each task should always include:
- `title`
- `whatToDo`
- `howToDoIt`
- `executionReference`
- `isRequired`

### 9. Suggested API expectations
At minimum:
- generate endpoint
- get endpoint
- expected response shape

### 10. Agent routing recommendation
Which agents should normally be involved.

### 11. MVP success test
What would make this phase genuinely useful in product.

### 12. Bottom line
Short blunt summary of what the phase should feel like.

---

## Shared output design rules

Across all phases:
- outputs should be structured for a non-chat UI
- outputs should be concise but actionable
- outputs should avoid generic consultancy language
- outputs should preserve the twist from Phase 0 where relevant
- outputs should stay location-aware where relevant
- outputs should create tasks the user can actually do

## Shared task design rules

Tasks should be:
- specific
- concrete
- completion-trackable
- useful without a live chat

Tasks should not be:
- vague encouragement
- fluffy planning statements
- duplicated across phases without reason

### Minimum task fields

```json
{
  "title": "Choose final name",
  "whatToDo": "Select the strongest recommended business name.",
  "howToDoIt": "Review the three options, test fit against your market and legal checks, then lock one.",
  "executionReference": "Use the recommended name rationale in this phase output.",
  "isRequired": true
}
```

---

## Shared validation rules

A phase response should be rejected by backend validation if:
- required inputs were missing
- output structure is incomplete
- tasks are missing or unusable
- content is generic enough to fit any business
- location-dependent guidance is given without location
- the phase drifts into another phase's job

---

## Shared API response pattern

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 3,
      "title": "Finance",
      "state": "ready",
      "summary": "Set up the financial model and first working numbers.",
      "content": {},
      "tasks": []
    }
  }
}
```

---

## Shared storage rule

- rigid phase metadata stays relational in `phase_instances`
- evolving phase payload stays in `generated_content_json`
- user task state stays in `tasks`
- raw generation history stays in `agent_runs`

Do not blur these together.

---

## Recommended remaining phase order with contract intent

### Phase 1 — Brand
Identity, tone, messaging, homepage-ready positioning.

### Phase 2 — Legal
Location-aware legal setup path and risk map.

### Phase 3 — Finance
Startup numbers, pricing sanity, costs, breakeven logic, first financial model.

### Phase 4 — Protection
Insurance, risk protection, safeguards, fallback planning.

### Phase 5 — Infrastructure
Tools, systems, stack, workflows, accounts, operational setup.

### Phase 6 — Marketing
Channels, offers, launch messaging, first acquisition plan.

### Phase 7 — Operations
How the business runs day to day.

### Phase 8 — Sales
Pipeline, conversion flow, sales assets, close process.

### Phase 9 — Launch & Scale
Initial launch plan, momentum tracking, growth decisions.

---

## Bottom line

VentraPath phases should feel like a single guided system.

This pattern exists to stop the backend, API, and UI from turning into a bag of disconnected outputs with different logic every time.
