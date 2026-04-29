# Phase 2 Legal Page Schema

Status: partially confirmed from frontend code
Source file: `app/phase2/legal/page.tsx`
Last updated: 2026-04-29

## Confidence

This schema is derived from multiple frontend code fragments provided from the Legal page.

What is confirmed:
- the Legal page is a guided multi-step workflow page
- the Legal page is driven by jurisdiction-specific configuration data
- the Legal page uses local editable and selection state
- the Legal page tracks completion progress across 6 steps
- the Legal page supports expandable guidance sections (`howTo` and `example`)
- the Legal page includes footer navigation from Brand to Finance

What is **not fully confirmed** yet:
- some mid-file rendering fragments were truncated in chat
- the exact full JSX for Steps 2-4 is not completely visible in the provided fragments
- whether extra helper functions or validation exist outside the shown snippets
- whether any persistence logic exists outside the shown code

Even so, the workflow/data structure is clear enough to derive a useful schema.

## Page role

This page represents **Phase 2: Legal** in the guided sequence between:
- previous: `/phase1/brand`
- next: `/phase3/finance`

It is not a static legal memo.
It is a jurisdiction-aware setup workflow intended to help the user establish the business legally and operationally.

## Confirmed workflow structure

The page contains 6 steps:
1. Choose Business Structure
2. Register Your Business
3. Get Your Tax ID
4. Set Up Taxes
5. Business Bank Account
6. Basic Legal Protection

## Confirmed step metadata shape

```ts
type LegalStepMeta = {
  id: number
  title: string
  description: string
  howTo: string
  example: string
  completed: boolean
}
```

This is confirmed by the `Step` interface and `initialSteps` data.

## Confirmed jurisdiction config model

The page is driven by a country-specific configuration object.

```ts
type LegalCountryData = {
  country: string
  countryCode: string
  structures: Array<{
    name: string
    description: string
    pros: string[]
    cons: string[]
    recommended: boolean
  }>
  registrationAuthority: string
  registrationUrl: string
  taxId: string
  taxAuthority: string
  taxUrl: string
  salesTax: string
  salesTaxThreshold: string
  salesTaxRate: string
  salesTaxUrl: string
  banks: Array<{
    name: string
    note: string
    url: string
  }>
  legalTemplates: Array<{
    name: string
    description: string
    url: string
  }>
}
```

Confirmed example in current file:
- country: Australia
- countryCode: AU

This is one of the most important findings from the Legal page.
It means Legal is not just generated text — it depends on a structured jurisdiction data layer.

## Confirmed page-level interactive state

```ts
type LegalPageState = {
  steps: LegalStepMeta[]
  expandedStep: number | null
  expandedSection: Record<number, 'howTo' | 'example' | null>
  selectedStructure: string | null
  businessName: string
  taxId: string
  selectedBank: string | null
}
```

Confirmed derived state:

```ts
type LegalProgressState = {
  completedCount: number
  progressPercent: number
}
```

## Confirmed page-level navigation contract

```ts
type LegalPageNavigation = {
  backHref: '/phase1/brand'
  nextHref: '/phase3/finance'
  nextLabel: 'Continue to Phase 3: Finance'
}
```

## Confirmed UX/interaction model

The page includes:
- page header showing `Phase 2 of 10`
- country notice banner
- progress bar based on completed steps
- expandable/collapsible step cards
- per-step completion toggles
- expandable `How to do this` and `Example` subpanels

That means the Legal phase is a true user workflow with both instructional content and task-tracking behaviour.

## Confirmed per-step interaction schema

### Step 1 — Choose Business Structure

```ts
type LegalStep1 = {
  structures: Array<{
    name: string
    description: string
    pros: string[]
    cons: string[]
    recommended: boolean
  }>
  selectedStructure: string | null
}
```

Confirmed behaviour:
- selectable structure cards
- recommended badge support
- pros/cons comparison view

### Step 2 — Register Your Business

```ts
type LegalStep2 = {
  businessName: string
  registrationAuthority: string
  registrationUrl: string
}
```

Confirmed behaviour:
- editable business name input
- registration authority guidance is confirmed from `countryData`
- step intent is registration of the business name with the local authority

Rendering details are partially truncated, but the structural purpose is clear.

### Step 3 — Get Your Tax ID

```ts
type LegalStep3 = {
  taxIdLabel: string
  taxAuthority: string
  taxAuthorityUrl: string
  enteredTaxId: string
}
```

Confirmed behaviour:
- `taxId` local state exists
- step metadata clearly describes application for local tax identifier
- jurisdiction-specific authority and identifier naming are driven from `countryData`

Exact JSX for the field block was not fully visible, but the state/data contract is strongly indicated.

### Step 4 — Set Up Taxes

```ts
type LegalStep4 = {
  salesTaxName: string
  salesTaxThreshold: string
  salesTaxRate: string
  salesTaxUrl: string
}
```

Confirmed behaviour:
- instructional tax setup step
- threshold, rate, and authority-specific guidance come from `countryData`

Exact interactive controls were not fully visible in the provided fragments.

### Step 5 — Business Bank Account

```ts
type LegalStep5 = {
  banks: Array<{
    name: string
    note: string
    url: string
  }>
  selectedBank: string | null
}
```

Confirmed behaviour:
- selectable recommended bank cards
- external links to bank sites
- jurisdiction-specific recommended providers

### Step 6 — Basic Legal Protection

```ts
type LegalStep6 = {
  legalTemplates: Array<{
    name: string
    description: string
    url: string
  }>
  checklist: {
    termsCreated: boolean
    privacyCreated: boolean
    serviceAgreementReady: boolean
  }
}
```

Confirmed behaviour:
- legal template resource cards
- checkboxes for legal protection completion
- template retrieval is link-based, not generated inline in this page

## Backend match vs mismatch

## What the current backend gets roughly right
- Legal exists as a distinct phase
- step-oriented instructional guidance is directionally correct
- warnings/disclaimers are already considered important
- jurisdiction-specific shaping had already been suspected, and this page confirms it

## What the current backend is still missing
- a first-class jurisdiction configuration model
- clear storage for user legal workflow state
- persisted completion state for legal tasks
- saved selections such as chosen structure and bank
- saved legal setup inputs such as business name / tax ID
- a clear separation between:
  - jurisdiction reference data
  - generated guidance text
  - user-entered legal progress state

## Recommended backend direction

The Legal phase backend should evolve from:
- generic generated legal guidance

toward:
- jurisdiction-configured workflow state + careful guidance + user progress tracking

Recommended conceptual model:

```ts
type LegalPhaseRecord = {
  jurisdiction: LegalCountryData
  generated: {
    steps: LegalStepMeta[]
    disclaimers: string[]
    guidance?: {
      setupNotes?: string[]
      warnings?: string[]
    }
  }
  userState: {
    selectedStructure?: string
    businessName?: string
    taxId?: string
    selectedBank?: string
    completedStepIds?: number[]
    legalChecklist?: {
      termsCreated?: boolean
      privacyCreated?: boolean
      serviceAgreementReady?: boolean
    }
  }
}
```

## Legal safety rule

This page is clearly practical and country-specific, but it still must remain careful.
It should help the user act, while making it clear that:
- guidance is informational
- local official authorities should be checked
- professional advice may be needed for specific circumstances

So the page should be actionable without pretending to replace a lawyer, accountant, or regulator.

## Practical takeaway

This Legal page confirms that Phase 2 is a jurisdiction-aware setup workflow, not just a generated article.

That means the current backend Legal model needs to evolve toward:
- country-aware reference/config data
- editable saved workflow state
- completion tracking
- careful disclaimers layered over practical action steps
