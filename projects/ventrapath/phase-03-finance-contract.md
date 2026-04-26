# VentraPath Phase 3 Contract — Finance

## Purpose

Define what Phase 3 (Finance) should actually generate and store.

Phase 3 should turn the blueprint, brand, and legal setup into a first working financial model.

It should not be accountant theatre.
It should produce usable numbers and decisions.

## Phase goal

Turn the business into a financially legible operating plan:
- what it costs to start
- what it likely costs to run
- what pricing means in practice
- what early revenue assumptions look like
- what breakeven pressure exists
- where the business is financially fragile

## Inputs required

Phase 3 should consume:
- approved Phase 0 blueprint
- latest Phase 1 Brand output
- latest Phase 2 Legal output
- project location
- project currency
- business model details
- pricing logic from blueprint

Minimum required source sections:
- Business
- Monetisation
- Execution
- Legal
- Brand positioning where premium pricing affects assumptions

## Hard rules

- location is mandatory because costs, taxes, and pricing context depend on it
- currency is mandatory
- numbers must be commercially grounded, not fantasy spreadsheet fluff
- use directional assumptions honestly when exact data is unavailable
- keep it simple enough for MVP users to act on

## Outputs Phase 3 should generate

### 1. Financial model summary
A short plain-English read on how the business makes money and where pressure sits.

### 2. Startup cost estimate
A first-pass cost breakdown.

Recommended structure:
- low estimate
- likely estimate
- higher estimate
- biggest cost buckets

### 3. Monthly operating cost estimate
A realistic early monthly cost view.

Recommended buckets:
- software/tools
- rent/facility if relevant
- contractors/staff
- marketing
- insurance/compliance
- payment processing / transaction costs
- miscellaneous overhead

### 4. Revenue model breakdown
Translate the blueprint pricing into practical revenue logic.

Examples:
- number of subscriptions needed
- sessions per week needed
- average order value assumptions
- conversion sensitivity

### 5. Breakeven view
A simple breakeven estimate.

Recommended structure:
- monthly breakeven revenue
- what that means in units/customers/bookings/subscriptions
- what assumption is doing the most work

### 6. Pricing sanity check
Check whether the business pricing is:
- too weak
- realistic
- premium but justified
- fragile given delivery economics

### 7. Cash-flow pressure points
Call out where the user could run out of money or margin early.

Examples:
- long customer acquisition payback
- heavy inventory spend
- seasonality
- venue lease burden
- underpriced service delivery

### 8. Funding posture
Not full investment strategy.
Just first-pass funding reality.

Recommended structure:
- bootstrap-friendly?
- needs moderate upfront capital?
- capex-heavy / financing likely required?

### 9. Finance risk snapshot
Short blunt risk list.

### 10. Financial action checklist
Concrete next actions the user should take.

## What Phase 3 should not do

- do not produce fake precision
- do not build a five-year MBA model
- do not pretend tax/accounting certainty without location grounding
- do not ignore obvious operational costs
- do not let premium pricing survive if delivery economics are weak
- do not turn into generic startup advice

## Quality rules

Phase 3 passes only if:
- numbers are commercially plausible
- currency and geography are correct
- pricing is tied to the actual twist and business model
- the user can understand startup cost, monthly cost, and breakeven quickly
- the biggest risks are visible

Phase 3 fails if:
- numbers are obviously made up without explanation
- costs are missing major categories
- premium pricing is not defended
- breakeven is absent or useless
- it reads like motivational finance sludge

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "financialModelSummary": "This is a premium experience business with high upfront fitout costs and strong margin potential if repeat bookings and memberships land.",
  "startupCosts": {
    "low": 120000,
    "likely": 180000,
    "high": 280000,
    "currency": "AUD",
    "buckets": [
      {
        "label": "Fitout and equipment",
        "amount": 90000
      },
      {
        "label": "Software and systems",
        "amount": 12000
      }
    ]
  },
  "monthlyOperatingCosts": {
    "currency": "AUD",
    "buckets": [
      {
        "label": "Rent",
        "amount": 12000
      },
      {
        "label": "Staff",
        "amount": 18000
      }
    ],
    "estimatedTotal": 42000
  },
  "revenueModel": {
    "primaryDriver": "Ticketed sessions and private bookings",
    "supportingDrivers": ["memberships", "corporate events"],
    "keyAssumptions": [
      "Average booking value stays above AUD 400",
      "Weekend utilisation remains strong"
    ]
  },
  "breakevenView": {
    "monthlyRevenueRequired": 55000,
    "unitInterpretation": "Roughly 110 standard bookings at AUD 500 average booking value",
    "mainPressurePoint": "Venue utilisation"
  },
  "pricingSanityCheck": {
    "verdict": "premium_but_justified",
    "reason": "The differentiated experience and replayability support pricing above standard competitors"
  },
  "cashflowPressurePoints": [
    "High upfront fitout before customer traction",
    "Weak midweek utilisation could drag margins"
  ],
  "fundingPosture": {
    "type": "moderate_upfront_capital_required",
    "reason": "Venue setup and launch marketing are too large for a near-zero-cost bootstrap path"
  },
  "financeRisks": [
    {
      "risk": "Underestimating acquisition cost",
      "severity": "medium"
    }
  ]
}
```

## Recommended task output for Phase 3

Phase 3 should create actionable tasks like:

1. confirm startup budget range
2. review monthly operating cost assumptions
3. pressure-test pricing against delivery economics
4. estimate breakeven volume
5. decide bootstrap vs external funding posture
6. identify the top three financial risks to monitor

### Task shape
Each task should include:
- what to do
- how to do it
- execution reference
- whether it is required

## Suggested API expectations

### Generate Phase 3
`POST /api/projects/:projectId/phases/3/generate`

### Get Phase 3
`GET /api/projects/:projectId/phases/3`

### Expected response payload shape

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 3,
      "title": "Finance",
      "state": "ready",
      "summary": "Turn the blueprint into a first working financial model.",
      "content": {
        "financialModelSummary": "...",
        "startupCosts": {},
        "monthlyOperatingCosts": {},
        "revenueModel": {},
        "breakevenView": {},
        "pricingSanityCheck": {},
        "cashflowPressurePoints": [],
        "fundingPosture": {},
        "financeRisks": []
      },
      "tasks": []
    }
  }
}
```

## Agent routing recommendation

Default Phase 3 route should be:
- Bob
- Monetisation Architect
- Blueprint Architect
- Market Intelligence (light)
- Legal & Compliance Agent (light, only where cost/compliance materially affects finance)

Why:
- Finance must stay anchored to the real business model
- Monetisation owns pricing and revenue logic
- Market helps stop delusional demand assumptions
- Legal should only weigh in where regulatory cost matters

## MVP success test

Phase 3 is successful when the user can answer:
- how much this business might cost to start
- what it may cost to run each month
- what revenue has to happen for this to work
- where the business is financially fragile

If the user leaves with only vague confidence and no numbers, it failed.

## Bottom line

Phase 3 should make the business financially legible fast.

It should feel like a sharp first operating model, not a finance deck trying to look smarter than the business itself.
