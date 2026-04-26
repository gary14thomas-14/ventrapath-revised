# VentraPath Phase 7 Contract — Operations

## Purpose

Define what Phase 7 (Operations) should actually generate and store.

Phase 7 should turn the blueprint, legal setup, financial model, protection layer, infrastructure stack, and marketing motion into the practical day-to-day operating system of the business.

It is not vague productivity advice.
It is not a pile of SOP theatre.
It should show how work gets delivered, controlled, checked, and repeated once real customers start arriving.

## Phase goal

Turn the business into a runnable operating model:
- how work moves from customer commitment to delivery
- what daily and weekly operating routines must happen
- who owns what
- what quality controls keep delivery reliable
- what bottlenecks or failure points need a plan
- what minimum operating cadence is enough to run cleanly

## Inputs required

Phase 7 should consume:
- approved Phase 0 blueprint
- latest Phase 2 Legal output
- latest Phase 3 Finance output
- latest Phase 4 Protection output
- latest Phase 5 Infrastructure output
- latest Phase 6 Marketing output
- project country
- project region/state where materially relevant
- business model details
- delivery mode details
- operating capacity assumptions
- founder time availability where available

Minimum required source sections:
- Business
- Market where demand shape affects staffing or service timing
- Monetisation
- Execution
- Legal
- Finance
- Protection
- Infrastructure
- Marketing funnel and lead offer

## Hard rules

- location is mandatory because service windows, staffing norms, supplier realities, local compliance, transport, and customer expectation patterns can vary by market
- approved blueprint is mandatory
- prior Phase 2 through Phase 6 content are mandatory
- operations must reflect the real delivery model, not a generic small-business workflow template
- the phase must stay focused on actual work execution, not high-level mindset advice
- operating design must respect finance constraints and founder capacity
- controls should distinguish between launch-critical routines and later-stage refinements
- if the business is founder-led, that dependency must be made explicit instead of hidden

## Outputs Phase 7 should generate

### 1. Operations summary
A short plain-English read on how this business should run day to day.

This should answer:
- what the core operating rhythm is
- where delivery can break down
- what routines matter most before scale

### 2. Service or fulfilment workflow
Map the core delivery flow from confirmed customer to completed outcome.

Recommended structure:
- trigger event
- action step
- owner role
- system or tool used
- output created
- time expectation
- failure point to watch

Examples:
- booking confirmed to prep to delivery to follow-up
- order received to pick/pack to dispatch to confirmation
- retained client onboarded to recurring service cycle to reporting

### 3. Operating cadence
Define the repeatable routines that keep the business under control.

Recommended categories:
- daily checks
- weekly review
- monthly admin
- service-day prep
- end-of-day wrap-up

Each item should include:
- cadence
- routine
- why it matters
- owner role
- must happen or recommended

### 4. Role and responsibility map
Show who owns what, even if the founder owns most items initially.

Recommended structure:
- function area
- primary owner
- backup owner or fallback
- current stage note

Examples:
- delivery
- customer communication
- bookings/orders
- finance admin
- stock/supplies
- incident handling
- quality review

### 5. Capacity and workload rules
Turn delivery into practical operating limits.

Recommended structure:
- capacity unit
- safe operating limit
- warning threshold
- what happens when capacity is exceeded
- assumption note

Examples:
- clients per week
- sessions per day
- orders per dispatch window
- support tickets per founder per day

### 6. Quality control checklist
Define the minimum checks that protect delivery quality.

Each item should include:
- checkpoint
- when it happens
- what is being checked
- owner role
- what to do if it fails

Examples:
- pre-service checklist
- order accuracy check
- final review before customer handoff
- follow-up quality check
- complaint escalation trigger

### 7. Exception and issue handling starter
List the most likely operational problems and the first response.

Recommended structure:
- issue type
- likely impact
- first response
- escalation point
- customer communication note

Examples:
- late delivery
- no-show client
- stock shortage
- staff/contractor unavailable
- broken equipment
- payment mismatch
- complaint or rework request

### 8. Supplier, inventory, or dependency controls
Include this where relevant to the business model.

Recommended structure:
- dependency
- why it matters
- minimum control
- reorder/review trigger
- fallback option

This can include suppliers, contractors, software dependencies, venue access, or transport logistics.

### 9. Admin and compliance routine starter
Define the recurring admin work that keeps the business legitimate and stable.

Examples:
- invoicing cadence
- reconciliation cadence
- recordkeeping
- contract/document storage
- incident log review
- tax/admin deadlines
- data retention routines

### 10. Operations metric starter
Show what should be watched to keep operations healthy.

Recommended metrics:
- jobs/orders delivered on time
- utilisation or booked capacity
- no-show/cancellation rate
- fulfilment error rate
- average turnaround time
- complaint or rework count
- admin backlog

Each item should include:
- metric
- why it matters
- review cadence
- action trigger if off track

### 11. Operations risk snapshot
Short blunt summary of the biggest day-to-day execution weaknesses.

Each item should include:
- risk
- severity
- why it matters now
- next step

Examples:
- founder bottleneck
- no backup for service interruption
- overbooking risk
- unclear handoff between systems and delivery
- admin falling behind trading activity

### 12. Operations action checklist
Produce concrete next actions the user can actually do.

This should directly drive the phase task list.

## What Phase 7 should not do

- do not turn into a generic productivity lecture
- do not write enterprise SOPs for a tiny MVP business
- do not ignore the actual customer journey or delivery mechanics
- do not duplicate infrastructure setup without showing how systems are used operationally
- do not drift into full sales process design that belongs in Phase 8
- do not prescribe staffing complexity the business cannot yet support
- do not pretend unlimited founder capacity
- do not give location-free operating guidance where local timing, logistics, staffing, or compliance materially changes the advice

## Quality rules

Phase 7 passes only if:
- the day-to-day delivery flow is visible and usable
- recurring routines are clear enough for a UI task system
- ownership and bottlenecks are explicit
- quality and issue handling are included, not assumed
- the operating model fits the business stage and delivery reality

Phase 7 fails if:
- it reads like abstract advice instead of an operating system
- there is no clear fulfilment or service workflow
- capacity limits are missing or unrealistic
- quality control is absent
- routines are too vague to execute or track

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "operationsSummary": "Run on a tight founder-led rhythm with one clean fulfilment flow, explicit daily checks, and clear capacity limits so customer demand does not outrun delivery quality.",
  "fulfilmentWorkflow": [
    {
      "triggerEvent": "Customer booking confirmed",
      "actionStep": "Review booking details and prepare required materials",
      "ownerRole": "Founder",
      "systemUsed": "Booking platform and internal checklist",
      "outputCreated": "Delivery-ready job entry",
      "timeExpectation": "Within 4 business hours of booking",
      "failurePoint": "Missed prep if confirmations are not reviewed daily"
    }
  ],
  "operatingCadence": [
    {
      "cadence": "daily",
      "routine": "Check new bookings, payments, and customer messages",
      "whyItMatters": "Prevents missed work and slow response times",
      "ownerRole": "Founder",
      "mustHappen": true
    }
  ],
  "responsibilityMap": [
    {
      "functionArea": "Customer delivery",
      "primaryOwner": "Founder",
      "backupOwner": "Contractor or documented fallback later",
      "stageNote": "Founder-led at MVP stage"
    }
  ],
  "capacityRules": [
    {
      "capacityUnit": "Client sessions per day",
      "safeOperatingLimit": "4",
      "warningThreshold": "5",
      "overflowResponse": "Pause new availability or extend lead time before quality slips",
      "assumptionNote": "Assumes admin and travel are also founder-handled"
    }
  ],
  "qualityControlChecklist": [
    {
      "checkpoint": "Pre-delivery confirmation check",
      "whenItHappens": "Day before service",
      "whatIsChecked": "Customer details, scope, timing, and materials",
      "ownerRole": "Founder",
      "failureAction": "Contact the customer immediately and correct the plan before delivery"
    }
  ],
  "issueHandling": [
    {
      "issueType": "Last-minute cancellation",
      "likelyImpact": "Lost revenue slot and schedule disruption",
      "firstResponse": "Apply cancellation policy and offer a reschedule path if appropriate",
      "escalationPoint": "Founder decision",
      "customerCommunicationNote": "Respond quickly and consistently using the published policy"
    }
  ],
  "dependencyControls": [
    {
      "dependency": "Primary supplier or key software",
      "whyItMatters": "If it fails, delivery stalls",
      "minimumControl": "Keep backup option and contact path ready",
      "reviewTrigger": "Review monthly or after any service issue",
      "fallbackOption": "Manual workaround or secondary provider"
    }
  ],
  "adminComplianceRoutines": [
    {
      "routine": "Weekly invoicing and payment reconciliation",
      "whyItMatters": "Protects cashflow accuracy and tax records",
      "cadence": "weekly",
      "ownerRole": "Founder"
    }
  ],
  "operationsMetrics": [
    {
      "metric": "On-time delivery rate",
      "whyItMatters": "Shows whether the operating flow is reliable",
      "reviewCadence": "weekly",
      "actionTrigger": "Investigate immediately if service misses become repeated"
    }
  ],
  "operationsRisks": [
    {
      "risk": "Founder is a single point of failure across delivery and admin",
      "severity": "high",
      "why": "A short disruption can stop both customer fulfilment and business follow-up",
      "nextStep": "Document the minimum fallback workflow and customer communication response"
    }
  ]
}
```

## Recommended task output for Phase 7

Phase 7 should create actionable tasks like:

1. define the end-to-end fulfilment workflow
2. lock the recurring operating cadence
3. assign owners and backup coverage for critical functions
4. set safe capacity limits before taking more demand
5. create the minimum quality-control and issue-response checks
6. establish the recurring admin and compliance routines

### Task shape
Each task should include:
- `title`
- `whatToDo`
- `howToDoIt`
- `executionReference`
- `isRequired`

### Required tasks
For MVP, these should usually be marked required:
- confirm the primary service or fulfilment workflow
- implement the must-happen daily or weekly operating routines
- define at least one capacity limit and overflow response
- implement at least one critical quality-control step
- define first-response handling for the most likely operational issue

## Suggested API expectations

### Generate Phase 7
`POST /api/projects/:projectId/phases/7/generate`

### Get Phase 7
`GET /api/projects/:projectId/phases/7`

### Expected response payload shape

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 7,
      "title": "Operations",
      "state": "ready",
      "summary": "Define how the business runs day to day, delivers reliably, and stays under control as customers come in.",
      "content": {
        "operationsSummary": "...",
        "fulfilmentWorkflow": [],
        "operatingCadence": [],
        "responsibilityMap": [],
        "capacityRules": [],
        "qualityControlChecklist": [],
        "issueHandling": [],
        "dependencyControls": [],
        "adminComplianceRoutines": [],
        "operationsMetrics": [],
        "operationsRisks": []
      },
      "tasks": []
    }
  }
}
```

## Validation rules

Before Phase 7 can be saved as `ready`, backend should confirm:
- project country exists
- blueprint exists
- latest legal, finance, protection, infrastructure, and marketing outputs exist
- operations summary exists
- fulfilment workflow exists for at least one end-to-end operating path
- at least three operating cadence items exist unless the business is unusually simple and the reason is explicit
- responsibility map exists
- at least one capacity rule exists
- at least one quality-control item exists
- at least one issue-handling item exists
- at least one admin/compliance routine exists
- at least one required task exists

Additional validation:
- workflow steps should match the monetisation and delivery model
- operating cadence should not exceed known founder time availability without explanation
- compliance or logistics guidance should not be location-sensitive without location data
- capacity assumptions should not conflict with finance or marketing demand posture without explanation
- operations tasks should reference concrete routines, checks, or handoffs rather than general discipline language

## Agent routing recommendation

Default Phase 7 route should be:
- Bob
- Operations Guru
- Finance Expert
- Legal Advisor (light, where recurring compliance routines matter)
- AI & Automation Engineer
- Marketing Strategist (light, where demand/capacity coordination matters)

Why:
- operations sits at the intersection of delivery, risk control, time capacity, and system handoffs
- the phase needs execution realism more than abstract optimisation
- demand created in marketing must not outrun operating capacity

## MVP success test

Phase 7 is successful when the user can answer:
- how a customer moves through delivery once they commit
- what routines must happen daily, weekly, and monthly
- who owns each critical function
- what capacity limits or quality checks keep the business stable
- what happens first when an operational issue appears

If the user leaves with only vague advice to "stay organised," it failed.

## Bottom line

Phase 7 should make the business feel runnable.

It should turn the idea and setup work into a practical operating rhythm with real workflows, clear ownership, sensible limits, and day-to-day controls the user can actually follow.