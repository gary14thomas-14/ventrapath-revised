# Phase 1 Brand Page Schema

Status: partially confirmed from frontend code
Source file: `app/phase1/brand/page.tsx`
Last updated: 2026-04-29

## Confidence

This schema is derived from multiple frontend code fragments provided from the Brand page.

What is confirmed:
- the Brand page is a guided multi-step workflow page
- the Brand page uses local editable state
- the Brand page has 5 concrete steps
- the Brand page includes footer navigation from Risks to Legal
- several step-specific interactive elements are confirmed from code

What is **not fully confirmed** yet:
- the exact full top-of-file state declarations
- the full component wrapper/layout code above the provided fragments
- whether any hidden helper data or subcomponents exist outside the shown snippets
- whether the current file contains additional save/progress logic outside the pasted sections

Even so, the interactive structure is clear enough to derive a useful schema.

## Page role

This page represents **Phase 1: Brand** as a guided workflow between:
- previous: `/risks`
- next: `/phase2/legal`

It is not just a static read-only render.
It is a stateful page where the user can edit branding inputs and move through steps.

## Confirmed workflow structure

The page contains 5 steps:
1. Business Name
2. Brand Positioning
3. Logo & Visual Identity
4. Domain & Email
5. Social Handles

## Confirmed step metadata shape

```ts
type BrandStepMeta = {
  id: number
  title: string
  description: string
  howTo: string
  example: string
  completed: boolean
}
```

This is confirmed by the `Step` interface and `initialSteps` usage in the file fragments.

## Confirmed page-level interactive state

Based on code fragments, the page clearly uses or implies local state for:

```ts
type BrandPageState = {
  steps: BrandStepMeta[]
  businessName: string
  positioning: string
  socialHandles: {
    instagram: string
    tiktok: string
    twitter: string
    linkedin: string
  }
  colorPalette: Array<{
    name: string
    colors: string[]
  }>
}
```

Notes:
- `businessName` is confirmed from Step 1 input usage
- `positioning` is confirmed from Step 2 textarea usage
- `socialHandles` is confirmed from Step 5 input usage
- `colorPalette` is confirmed from Step 3 palette rendering
- font options are confirmed visually in code but currently hard-coded inline as `['Inter', 'Poppins', 'Space Grotesk']`

## Confirmed per-step interaction schema

### Step 1 — Business Name

```ts
type BrandStep1 = {
  businessName: string
  generatedDomains: Array<{
    domain: string
    label?: string
    isPrimary?: boolean
  }>
}
```

Confirmed behaviour:
- editable business name input
- domain suggestions derived from the entered name
- availability-check CTA
- `.com` and `.co.uk` examples shown in snippet

### Step 2 — Brand Positioning

```ts
type BrandStep2 = {
  whatDoesBusinessDo: string
  whoIsItFor: string
  whatMakesItDifferent: string
}
```

Confirmed behaviour:
- textareas for core brand positioning
- explicit unique-differentiator prompt

Important product connection:
- this is a key place where the **unique twist** must surface clearly

### Step 3 — Logo & Visual Identity

```ts
type BrandStep3 = {
  logoMode: 'upload' | 'ai-generate' | null
  colorPalettes: Array<{
    name: string
    colors: string[]
  }>
  selectedColors?: string[]
  fontOptions: string[]
  selectedFont?: string
}
```

Confirmed behaviour:
- logo upload option
- AI logo generation option
- palette selection buttons
- font style buttons

### Step 4 — Domain & Email

```ts
type BrandStep4 = {
  providers: Array<{
    name: string
    url: string
    note: string
  }>
}
```

Confirmed behaviour:
- provider recommendation cards
- external links
- informational guidance rather than data entry

### Step 5 — Social Handles

```ts
type BrandStep5 = {
  socialHandles: {
    instagram: string
    tiktok: string
    twitter: string
    linkedin: string
  }
}
```

Confirmed behaviour:
- editable handle fields
- one CTA to check handle availability

## Confirmed page-level navigation contract

Footer navigation:

```ts
type BrandPageNavigation = {
  backHref: '/risks'
  nextHref: '/phase2/legal'
  nextLabel: 'Continue to Phase 2: Legal'
}
```

This matters because it confirms the frontend expects the Brand phase to exist inside a guided sequential flow, not as an isolated generated document.

## Backend match vs mismatch

## What the current backend gets roughly right
- Phase 1 Brand exists as a distinct phase
- phase summary + generated content concept is directionally correct
- the backend already returns a step-based Brand payload shape
- the backend already includes helper text, suggestions, palettes, providers, and platform suggestions

## What the current backend is still missing
- explicit editable workflow state persistence
- saved step completion state
- user-entered overrides for business name / positioning / handles
- selected palette / selected font persistence
- a clear distinction between:
  - generated defaults
  - user-edited values
  - derived suggestions

## Recommended backend direction

The Brand phase backend should evolve from:
- generated read-model only

toward:
- generated defaults + editable saved workflow state

Recommended conceptual model:

```ts
type BrandPhaseRecord = {
  generated: {
    steps: BrandStepMeta[]
    defaults: {
      businessName?: string
      positioning?: Partial<BrandStep2>
      domainProviders?: BrandStep4['providers']
      paletteOptions?: BrandStep3['colorPalettes']
      fontOptions?: BrandStep3['fontOptions']
      socialSuggestions?: Partial<BrandStep5['socialHandles']>
    }
  }
  userState: {
    businessName?: string
    positioning?: BrandStep2
    socialHandles?: BrandStep5['socialHandles']
    selectedFont?: string
    selectedColors?: string[]
    completedStepIds?: number[]
  }
}
```

## Important product rule

Because Phase 0 creates excitement and the unique twist is the emotional ignition point, the Brand phase should preserve that energy.

That means Step 2 (`what makes it different`) should not become bland generic copy.
It should carry forward the unique twist explicitly.

## Practical takeaway

This Brand page confirms the frontend wants more than a generated document.
It wants a guided editable workflow with generated defaults and user-owned progress.

That means the current backend Phase 1 model is a decent scaffold, but not the final structural shape.
