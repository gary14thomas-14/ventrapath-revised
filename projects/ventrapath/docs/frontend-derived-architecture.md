# Frontend-Derived Architecture (Current Implemented Scope)

Status: confirmed from current frontend code provided from v0
Last updated: 2026-04-29

## Purpose

This document consolidates what the **currently implemented frontend** actually proves about VentraPath's product structure and data architecture.

It exists to stop backend shaping from drifting away from the real frontend.

## Confirmed current frontend scope

The currently implemented frontend scope is:
- Blueprint (`app/(blueprint)/blueprint/page.tsx`)
- Phase 1 Brand (`app/phase1/brand/page.tsx`)
- Phase 2 Legal (`app/phase2/legal/page.tsx`)
- Phase 3 Finance (`app/phase3/finance/page.tsx`)

Important constraint:
- later phases are **not implemented yet**
- do not infer detailed structures for Phase 4+ as if they are already confirmed

## High-level product truth

The frontend is not structured like:
- one generated report followed by generic forms

It is structured like:
- an emotionally engaging conversion blueprint
- followed by guided workflow phases
- each phase designed to feel like forward progress

That distinction matters.

## Core product pattern

## 1. Blueprint is a conversion surface, not just a summary

The Blueprint exists to:
- make the business feel real
- make the business feel exciting
- surface the unique twist early
- create emotional momentum into the next step
- support the paywall transition immediately after the user feels that momentum

The Blueprint Business page confirms a structured presentation model, not a text blob.

Confirmed Business page schema:

```ts
type BlueprintBusinessPage = {
  businessName: string
  tagline: string
  summary: string
  what: string
  how: string
  why: string
  targetAudience: string[]
  uniqueValue: string[]
}
```

Critical content rule:
- the **unique twist must appear in the first section describing the company**
- it is not decorative copy
- it is the emotional ignition point for conversion

## 2. Guided phases are workflow apps, not content dumps

Brand, Legal, and Finance all confirm the same fundamental structure:
- each phase is interactive
- each phase contains progress/completion behaviour
- each phase contains expandable instructional content
- each phase contains user-owned selections or inputs
- each phase is designed to move the user cleanly into the next phase

That means the frontend expects **workflow-backed phases**, not just generated summaries.

## 3. Each implemented phase has three layers

Across Brand, Legal, and Finance, the same architecture repeats.

Each phase needs:

### A. Reference / option / config data
Examples:
- Brand color palettes, font options, social platforms
- Legal jurisdiction data, banks, legal templates
- Finance payment providers, accounting options, tax registrations, category lists

### B. Instructional or generated guidance content
Examples:
- step descriptions
- `howTo` guidance
- examples
- recommendations
- warnings/disclaimers

### C. User-owned workflow state
Examples:
- selected business structure
- entered business name
- chosen bank
- selected accounting platform
- checked bookkeeping categories
- completed steps
- expanded step state
- selected fonts/colors/handles

This three-layer pattern is the most important architectural finding from the current frontend.

## Confirmed phase-by-phase summary

## Blueprint

Role:
- free conversion experience
- premium presentation layer
- emotionally engaging reveal

Confirmed traits:
- structured business narrative
- strong presentation emphasis
- unique value / differentiator is central
- not yet API-wired in the provided file

Backend implication:
- Blueprint should evolve toward structured presentation-ready objects
- not a single coarse `business` string

## Phase 1 — Brand

Role:
- guided brand setup workflow

Confirmed traits:
- 5 steps
- editable inputs
- domain suggestion behaviour
- positioning fields
- logo/visual identity choices
- social handle fields
- navigation from Risks to Legal

Backend implication:
- Brand needs generated defaults + saved workflow state
- not just generated content output

## Phase 2 — Legal

Role:
- guided legal setup workflow
- jurisdiction-aware business setup

Confirmed traits:
- 6 steps
- country-specific config object
- structure selection
- business registration flow
- tax ID flow
- bank selection
- legal template resources
- completion and progress state

Backend implication:
- Legal needs jurisdiction config + guidance + saved progress state
- strong disclaimers still required

## Phase 3 — Finance

Role:
- guided financial operations setup workflow

Confirmed traits:
- 6 steps
- typed content modes
- payment provider selection
- accounting software selection
- bookkeeping category selection
- tax registration checklist
- pricing structure display
- tracking dashboard/ritual
- strong completion handoff into next phase

Backend implication:
- Finance needs workflow-state support, not just generated advice

## Cross-phase UX truth

The frontend is trying to create a feeling of:
- progress
- competence
- momentum
- readiness for the next step

This shows up in:
- phase numbering
- completion counters
- progress bars
- expandable guided steps
- recommendation badges
- clear next-phase CTAs
- completion callouts like `Ready for Operations`

So backend payloads should eventually support not just correctness, but **momentum-preserving UX**.

## Corrected backend direction

The backend should not be modeled as only:
- `project -> generated phase text`

It should move toward:
- `project -> phase record`
- where each phase record contains:
  1. generated/reference content
  2. user-editable workflow state
  3. progress/completion state

Recommended conceptual shape:

```ts
type PhaseRecord<TGenerated, TUserState> = {
  generated: TGenerated
  userState: TUserState
  progress?: {
    completedStepIds?: number[]
    currentStepId?: number | null
  }
  meta?: {
    phaseNumber?: number
    phaseLabel?: string
    status?: 'not_started' | 'in_progress' | 'completed'
  }
}
```

## Current backend mismatch

The current backend scaffold is useful, but still too biased toward:
- generated content payloads
- backend-defined step summaries

The frontend evidence shows we also need first-class support for:
- saved selections
- saved form state
- saved checklist state
- saved step completion
- reference/config datasets
- jurisdiction-aware configuration where required

## What should stay provisional

Do **not** lock these yet as confirmed:
- detailed schema for Phase 4+
- exact full phase ladder UX after Finance
- paywall implementation details in code
- persistence/event model for unfinished phases
- whether all future phases will use the exact same accordion pattern

We can say the current pattern is strong.
We should not pretend the unbuilt phases are already proven.

## Build implications right now

Based on the implemented frontend, the safest next backend/spec direction is:

1. Treat Blueprint as structured presentation content
2. Treat Brand/Legal/Finance as workflow-backed phases
3. Split phase data into:
   - generated/reference content
   - userState
   - progress
4. Preserve legal/tax disclaimers where the frontend implies risk-sensitive guidance
5. Keep later-phase contracts marked provisional until those pages exist

## Bottom line

The current frontend proves that VentraPath is not a report generator with a few forms attached.

It is:
- a conversion-first Blueprint experience
- followed by guided workflow phases
- where progress, choice, and user ownership matter as much as generated content

That should now be treated as the authoritative direction for backend adaptation within the current implemented scope.
