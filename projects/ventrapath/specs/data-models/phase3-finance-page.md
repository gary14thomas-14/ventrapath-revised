# Phase 3 Finance Page Schema

Status: confirmed from frontend code
Source file: `app/phase3/finance/page.tsx`
Last updated: 2026-04-29

## Confidence

This schema is confirmed from the provided frontend code fragments for the Finance page.

What is confirmed:
- the Finance page is a guided interactive workflow page
- the Finance page contains 6 steps
- each step uses a typed content mode (`providers`, `accounting`, `bookkeeping`, `tax`, `pricing`, `tracking`)
- the page uses local progress/completion state
- the page contains concrete interactive selection/checklist behaviour
- the page ends with a strong phase-complete transition into Operations

What is **not fully confirmed** yet:
- no major structural gaps remain from the provided fragments
- minor presentation details could still exist outside the pasted snippets, but they do not materially change the schema

## Page role

This page represents **Phase 3: Finance** in the guided sequence between:
- previous: `/phase2/legal`
- next: `/phase4/operations`

It is not a passive finance article.
It is a hands-on setup workflow for payments, accounting, bookkeeping, tax, pricing, and financial tracking.

## Confirmed workflow structure

The page contains 6 steps:
1. Payment Processing
2. Accounting Software
3. Basic Bookkeeping Structure
4. Tax Setup
5. Pricing Structure Implementation
6. Financial Tracking

## Confirmed step metadata shape

```ts
type FinanceStep = {
  id: number
  title: string
  description: string
  icon: unknown
  howTo: string[]
  example: {
    title: string
    content: string
  }
  content: 'providers' | 'accounting' | 'bookkeeping' | 'tax' | 'pricing' | 'tracking'
}
```

## Confirmed supporting data models

### Payment providers

```ts
type PaymentProvider = {
  name: string
  logo: string
  bestFor: string
  fees: string
  features: string[]
  recommended?: boolean
}
```

### Accounting software

```ts
type AccountingSoftwareOption = {
  name: string
  bestFor: string
  price: string
  features: string[]
  recommended?: boolean
}
```

### Tax registrations

```ts
type TaxRegistration = {
  name: string
  required: boolean
  link: string
  description: string
}
```

### Bookkeeping categories

```ts
type FinanceCategorySets = {
  incomeCategories: string[]
  expenseCategories: string[]
}
```

## Confirmed page-level interactive state

```ts
type FinancePageState = {
  expandedStep: number
  completedSteps: number[]
  showHow: number | null
  showExample: number | null
  selectedProvider: string | null
  selectedAccounting: string | null
  checkedCategories: string[]
  checkedTax: string[]
}
```

Confirmed derived state:

```ts
type FinanceProgressState = {
  progressPercent: number
}
```

## Confirmed page-level navigation contract

```ts
type FinancePageNavigation = {
  backHref: '/phase2/legal'
  backLabel: 'Phase 2'
  nextHref: '/phase4/operations'
  nextLabel: 'Continue to Phase 4'
}
```

The footer also includes a phase-complete framing block:

```ts
type FinanceCompletionCallout = {
  badge: 'Phase 3 Complete'
  title: 'Ready for Operations'
  description: string
}
```

This is a strong continuation design, not a neutral page footer.

## Confirmed UX/interaction model

The page includes:
- sticky header with prior-phase navigation
- phase number display (`Phase 3 of 10`)
- progress block with percent and completed count
- accordion step cards
- per-step completion toggles
- expandable `How to do this` and `Example` panels
- step-specific interactive content modules
- phase completion transition block into Operations

That means the Finance phase is a real guided setup experience, not a backend report renderer.

## Confirmed per-step interaction schema

### Step 1 — Payment Processing

```ts
type FinanceStep1 = {
  providers: PaymentProvider[]
  selectedProvider: string | null
}
```

Confirmed behaviour:
- selectable provider cards
- recommended badge
- pricing/fees display
- features display
- CTA to set up the selected provider

### Step 2 — Accounting Software

```ts
type FinanceStep2 = {
  accountingOptions: AccountingSoftwareOption[]
  selectedAccounting: string | null
}
```

Confirmed behaviour:
- selectable accounting software cards
- recommended badge
- pricing and features display

### Step 3 — Basic Bookkeeping Structure

```ts
type FinanceStep3 = {
  incomeCategories: string[]
  expenseCategories: string[]
  checkedCategories: string[]
}
```

Confirmed behaviour:
- checkbox-style category selection
- both income and expense categories use the same checked set
- intended to help the user establish a bookkeeping structure

### Step 4 — Tax Setup

```ts
type FinanceStep4 = {
  disclaimer: string
  taxRegistrations: TaxRegistration[]
  checkedTax: string[]
}
```

Confirmed behaviour:
- explicit disclaimer banner
- jurisdiction-specific tax registrations list (Australia in current file)
- required badge support
- external authority links
- completion toggles per tax registration item

Important note:
- this page includes financial/tax disclaimers inline, reinforcing the earlier legal-carefulness rule

### Step 5 — Pricing Structure Implementation

```ts
type FinanceStep5 = {
  tiers: Array<{
    name: 'Basic' | 'Pro' | 'Premium'
    price: number
    billingUnit: string
    highlighted?: boolean
    features: string[]
  }>
}
```

Confirmed behaviour:
- 3 pricing tier cards
- `Pro` highlighted as most popular
- clearly presentation-oriented example pricing structure
- customizable framing rather than fixed persisted user input in current snippet

### Step 6 — Financial Tracking

```ts
type FinanceStep6 = {
  dashboard: {
    revenue: number
    expenses: number
    profit: number
    periodLabel: string
  }
  weeklyTrackingTasks: string[]
}
```

Confirmed behaviour:
- lightweight financial dashboard cards
- weekly ritual checklist
- instructional financial habit-building UI

## Backend match vs mismatch

## What the current backend gets roughly right
- Finance exists as a distinct phase
- step-oriented guidance is directionally correct
- pricing and finance planning already existed as conceptual backend concerns
- practical action sequencing matches the product intent

## What the current backend is still missing
- explicit workflow-state persistence for the page
- step completion persistence
- selection persistence for provider/accounting choices
- bookkeeping category selections
- tax registration completion tracking
- a clear distinction between:
  - reference options
  - example guidance content
  - user selections/progress
- continuation-oriented UI contract for the transition into Operations

## Recommended backend direction

The Finance phase backend should evolve from:
- generated finance guidance only

toward:
- workflow-ready finance setup data + user progress state + careful guidance

Recommended conceptual model:

```ts
type FinancePhaseRecord = {
  generated: {
    steps: FinanceStep[]
    paymentProviders: PaymentProvider[]
    accountingOptions: AccountingSoftwareOption[]
    incomeCategories: string[]
    expenseCategories: string[]
    taxRegistrations: TaxRegistration[]
    pricingTemplate?: FinanceStep5['tiers']
    trackingTemplate?: FinanceStep6
    disclaimers?: string[]
  }
  userState: {
    completedStepIds?: number[]
    selectedProvider?: string
    selectedAccounting?: string
    checkedCategories?: string[]
    checkedTax?: string[]
  }
}
```

## Product implication

This page continues the pattern already seen in Brand and Legal:
- generated structure is only one layer
- the frontend expects user-owned interaction and progress

Also, the footer transition confirms something important about the product tone:
- every phase is meant to feel like forward momentum
- the user should feel completion, progress, and readiness for the next step

That aligns strongly with the earlier conversion principle established for Blueprint.

## Practical takeaway

This Finance page confirms that Phase 3 is a workflow application page with:
- structured setup options
- interactive choices
- progress state
- guidance panels
- a continuation-focused completion block

That means the backend Phase 3 model should be treated as a workflow-backed phase, not just a generated finance summary.
