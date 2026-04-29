# Blueprint Business Page Schema

Status: confirmed from frontend code
Source file: `app/(blueprint)/blueprint/page.tsx`
Last updated: 2026-04-29

## Confidence

This schema is confirmed from actual frontend page code provided from v0.

What is confirmed:
- the page-level data shape used by the current Blueprint Business page
- the visible labels/sections rendered by that page
- the fact that the page is currently driven by mock data, not API wiring

What is **not** yet confirmed from this file alone:
- the full Phase 0 / blueprint container shape
- shared blueprint layout/navigation
- how this page is loaded in the app shell
- how the data is fetched or passed in real runtime
- the schemas for the other blueprint sections/pages

## Page role

This file represents a Blueprint page focused on **The Business**.

Visible rendered areas:
1. Header
2. Summary card
3. What / How / Why grid
4. Target Audience section
5. Unique Value Proposition section

## Confirmed page-level data shape

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

## Field breakdown

### `businessName`
- type: `string`
- usage: primary page title (`<h1>`)
- example: `"PetConnect"`

### `tagline`
- type: `string`
- usage: subtitle under business name
- example: `"Trusted pet care, whenever you need it"`

### `summary`
- type: `string`
- usage: large summary card block
- expected style: concise but fuller paragraph

### `what`
- type: `string`
- usage: "What" card in a three-card explanatory grid

### `how`
- type: `string`
- usage: "How" card in a three-card explanatory grid

### `why`
- type: `string`
- usage: "Why" card in a three-card explanatory grid

### `targetAudience`
- type: `string[]`
- usage: repeated audience cards with numbered bullets
- expected shape: list of audience segments or personas

### `uniqueValue`
- type: `string[]`
- usage: repeated unique value / differentiator cards
- expected shape: short punchy value bullets

## Confirmed semantic structure

The page is not rendering one generic markdown blob.
It is rendering a structured business narrative with these semantic layers:
- brand/business identity
- concise value framing
- explanatory business logic
- audience segmentation
- unique differentiators

That means the frontend expectation here is richer than a plain `business` text section.

## Recommended backend mapping direction

For the current backend, the old coarse `business` string should be treated as a temporary scaffold only.

Recommended direction:

```ts
type BlueprintPhase0 = {
  business: BlueprintBusinessPage
  // market: unknown yet
  // monetisation: unknown yet
  // execution: unknown yet
  // legal: unknown yet
  // website: unknown yet
  // risks: unknown yet
}
```

## Important constraint

Do **not** extrapolate the whole Phase 0 schema from this file alone.

This file is enough to lock:
- the Business page schema

This file is **not** enough to lock:
- the full blueprint schema
- the full app-level blueprint object

## Immediate next source files needed

To continue Phase 0 schema derivation safely, obtain the full code for:
- the Market blueprint page
- the Monetisation blueprint page
- the Execution blueprint page
- the Legal blueprint page
- the Website blueprint page
- the Risks blueprint page
- any shared blueprint layout/navigation wrapper

## Practical takeaway

This page confirms that the Blueprint Business section should evolve from:
- plain text blob

to:
- explicit structured object with business identity, explanation layers, audience list, and unique value bullets.
