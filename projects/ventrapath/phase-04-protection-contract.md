# VentraPath Phase 4 Contract — Protection

## Purpose

Define what Phase 4 (Protection) should actually generate and store.

Phase 4 should turn the blueprint, legal setup, and financial reality into a practical protection layer around the business.

It is not a fear dump.
It is not a generic insurance article.
It should help the user reduce avoidable damage before launch.

## Phase goal

Turn the business into a protected operating setup:
- what risks could materially hurt the business early
- what protections should be put in place first
- what insurance or safeguards are likely worth having
- what fallback planning is needed if things go wrong
- what customer, asset, data, or continuity exposures need attention

## Inputs required

Phase 4 should consume:
- approved Phase 0 blueprint
- latest Phase 2 Legal output
- latest Phase 3 Finance output
- project country
- project region/state where materially relevant
- business model details
- delivery model details
- whether the business is remote, home-based, mobile, online, physical-site, or multi-site

Minimum required source sections:
- Business
- Market where customer exposure affects protection needs
- Monetisation
- Execution
- Legal
- Finance

## Hard rules

- location is mandatory because insurance norms, liability exposure, and regulatory protection expectations vary by jurisdiction
- approved blueprint is mandatory
- prior Phase 2 Legal and Phase 3 Finance content are mandatory
- protection recommendations must fit the actual business model, not a generic SMB template
- every recommendation must distinguish between critical-now and later-stage nice-to-have
- if a risk depends on unresolved facts, label the uncertainty instead of pretending certainty

## Outputs Phase 4 should generate

### 1. Protection strategy summary
A short plain-English read on how the business should protect itself in the first operating stage.

This should answer:
- where the business is most exposed
- what needs immediate protection
- what can wait until scale

### 2. Risk exposure map
A structured list of the business's main risk categories.

Recommended categories:
- customer harm or service failure
- property or equipment damage
- professional/advisory liability
- cyber/data/privacy exposure
- staff or contractor exposure
- cashflow interruption
- supplier/dependency failure
- reputation or public-trust damage

Each item should include:
- risk area
- why it applies to this business
- severity
- likelihood
- immediate mitigation direction

### 3. Insurance recommendation starter
A practical first-pass insurance view.

Recommended structure:
- cover type
- status: `likely_required`, `strongly_recommended`, `optional_for_now`, or `not_likely`
- why it matters
- who/what it protects
- trigger conditions or business facts that make it more necessary

Examples:
- public liability
- professional indemnity
- product liability
- workers compensation / employer cover
- cyber liability
- commercial property / equipment cover
- business interruption
- vehicle cover for mobile operations

### 4. Non-insurance safeguards
List protections that do not depend on buying a policy.

Examples:
- waivers or informed consent
- clear refund/cancellation rules
- incident logging
- backups and access controls
- supplier agreements
- quality-control checks
- equipment maintenance routines
- payment and fraud controls

### 5. Continuity and fallback plan starter
Define what the user should do if operations are disrupted.

Recommended structure:
- disruption scenario
- likely impact
- fallback response
- owner or responsible role
- recovery priority

Examples:
- founder unavailable
- payment system outage
- venue access lost
- key software failure
- supplier failure
- customer complaint escalation

### 6. Protection cost posture
Connect protection choices back to finance.

Recommended structure:
- essential protection costs to budget now
- protection items that can wait until revenue threshold or team growth
- where under-protection creates false savings

### 7. Protection risk snapshot
Short blunt summary of the biggest uncovered or fragile areas.

Each item should include:
- risk
- severity
- why it matters now
- next step

### 8. Required evidence and policy checklist
List the documents, records, or proof points the business should maintain.

Examples:
- insurance certificates
- signed waivers
- incident procedure
- data backup process
- contractor certificates
- equipment inspection records
- emergency contacts

### 9. Protection action checklist
Produce concrete next actions the user can actually do.

This should directly drive the phase task list.

## What Phase 4 should not do

- do not act like an insurance broker application form
- do not recommend every possible policy just to look thorough
- do not duplicate Phase 2 legal setup output
- do not drift into Phase 7 operational SOP design except where safeguards need a first-pass control
- do not use scare tactics
- do not ignore cost pressure from Phase 3
- do not provide location-free protection advice

## Quality rules

Phase 4 passes only if:
- the main business risks are clearly visible
- protection priorities are ranked realistically
- insurance guidance is tied to the business model and location
- non-insurance safeguards are included, not just policy suggestions
- the user leaves knowing what to put in place now versus later

Phase 4 fails if:
- it reads like a generic insurance checklist
- it recommends policies without explaining why
- it misses obvious protection gaps for the delivery model
- it ignores finance tradeoffs
- the tasks are vague or not execution-ready

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "protectionStrategySummary": "This business needs strong customer-liability and continuity protection early because live service delivery, customer data capture, and founder dependence create concentrated risk.",
  "riskExposureMap": [
    {
      "riskArea": "Customer injury during on-site sessions",
      "whyItApplies": "Customers attend in person and interact with equipment and staff guidance.",
      "severity": "high",
      "likelihood": "medium",
      "immediateMitigation": "Confirm safe operating procedures, incident logging, and public liability cover before launch."
    }
  ],
  "insuranceRecommendations": [
    {
      "coverType": "Public liability insurance",
      "status": "strongly_recommended",
      "whyItMatters": "Protects against third-party injury or property-damage claims.",
      "protects": "Business, founder, and venue exposure",
      "triggerConditions": ["In-person customer attendance", "Physical site or events"]
    }
  ],
  "nonInsuranceSafeguards": [
    {
      "title": "Incident logging workflow",
      "whyItMatters": "Creates evidence and faster response when problems happen.",
      "priority": "high"
    }
  ],
  "continuityPlanStarter": [
    {
      "scenario": "Booking software outage",
      "impact": "Lost bookings and manual customer confusion",
      "fallbackResponse": "Keep offline contact list, alternate payment method, and manual booking script ready.",
      "owner": "Founder",
      "recoveryPriority": "high"
    }
  ],
  "protectionCostPosture": {
    "budgetNow": [
      "Core liability cover",
      "Basic cyber protection",
      "Emergency data backup setup"
    ],
    "budgetLater": [
      "Higher-limit interruption cover after revenue stabilises"
    ],
    "falseSavingsWarning": "Skipping early liability or data safeguards may save little upfront but create launch-ending downside if something goes wrong."
  },
  "protectionRisks": [
    {
      "risk": "Founder dependency with no fallback owner",
      "severity": "high",
      "why": "Service continuity collapses if the founder becomes unavailable.",
      "nextStep": "Create a minimum viable handover and customer-communication fallback plan."
    }
  ],
  "requiredEvidence": [
    "Insurance certificates",
    "Signed waivers or service acknowledgements",
    "Incident reporting template"
  ]
}
```

## Recommended task output for Phase 4

Phase 4 should create actionable tasks like:

1. confirm top three business risks
2. identify which insurance covers are needed now
3. put non-insurance safeguards in place
4. create a basic continuity fallback plan
5. budget for critical protection costs
6. collect and store required protection documents

### Task shape
Each task should include:
- `title`
- `whatToDo`
- `howToDoIt`
- `executionReference`
- `isRequired`

### Required tasks
For MVP, these should usually be marked required:
- confirm the highest-priority risk exposures
- review essential insurance needs
- implement at least one critical non-insurance safeguard
- create a continuity fallback for the most likely disruption

## Suggested API expectations

### Generate Phase 4
`POST /api/projects/:projectId/phases/4/generate`

### Get Phase 4
`GET /api/projects/:projectId/phases/4`

### Expected response payload shape

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 4,
      "title": "Protection",
      "state": "ready",
      "summary": "Protect the business against the most likely early risks, losses, and disruptions.",
      "content": {
        "protectionStrategySummary": "...",
        "riskExposureMap": [],
        "insuranceRecommendations": [],
        "nonInsuranceSafeguards": [],
        "continuityPlanStarter": [],
        "protectionCostPosture": {},
        "protectionRisks": [],
        "requiredEvidence": []
      },
      "tasks": []
    }
  }
}
```

## Validation rules

Before Phase 4 can be saved as `ready`, backend should confirm:
- project country exists
- blueprint exists
- latest legal output exists
- latest finance output exists
- protection strategy summary exists
- at least three risk exposure items exist unless the business is unusually low-complexity and the reason is explicit
- at least one insurance recommendation exists, even if marked low priority
- at least one non-insurance safeguard exists
- at least one continuity scenario exists
- at least one required task exists

Additional validation:
- recommendations must use language that maps to the actual delivery model
- cost posture must not conflict with known finance constraints without explanation
- location-sensitive covers or employer obligations should not be asserted without location data

## Agent routing recommendation

Default Phase 4 route should be:
- Bob
- Legal Advisor
- Finance Expert
- Operations Guru
- AI & Automation Engineer (light, where cyber/data safeguards matter)

Why:
- protection sits across legal exposure, financial downside, and operational resilience
- the system needs more than insurance suggestions
- cyber/data and continuity controls matter for modern businesses even at MVP scale

## MVP success test

Phase 4 is successful when the user can answer:
- what could hurt this business most in the first year
- what protection they need to put in place before launch
- which risks need insurance versus process controls
- what they would do if a key disruption happened

If the user leaves with only a generic list of policies, it failed.

## Bottom line

Phase 4 should make the business feel protected on purpose.

It should translate risk into concrete safeguards, sensible cover decisions, and fallback actions the user can actually implement before trouble arrives.
