# VentraPath Phase 9 Contract — Launch & Scale

## Purpose

Define what Phase 9 (Launch & Scale) should actually generate and store.

Phase 9 should turn the completed business setup into a controlled launch sequence and an early growth decision system.

It is not hype.
It is not endless startup scaling fantasy.
It should show how to go live, what to watch in the first window after launch, how to interpret early signals, and when to tighten, iterate, or expand.

## Phase goal

Turn the business into a managed launch and early-growth plan:
- what should happen before, during, and just after launch
- what launch sequence should be followed
- which early signals matter most
- how the business should respond to weak or strong traction
- what should be iterated first before scaling harder
- what growth moves are sensible versus premature

## Inputs required

Phase 9 should consume:
- approved Phase 0 blueprint
- latest Phase 1 Brand output
- latest Phase 2 Legal output
- latest Phase 3 Finance output
- latest Phase 4 Protection output
- latest Phase 5 Infrastructure output
- latest Phase 6 Marketing output
- latest Phase 7 Operations output
- latest Phase 8 Sales output
- project country
- project region/state where materially relevant
- project currency
- business model details
- delivery mode details
- founder time availability where available
- channel, conversion, and capacity assumptions

Minimum required source sections:
- Business
- Market
- Monetisation
- Execution
- Brand positioning and launch message
- Legal
- Finance
- Protection
- Infrastructure
- Marketing launch plan and measurement
- Operations workflow and capacity rules
- Sales pipeline and conversion metrics

## Hard rules

- location is mandatory because launch timing, local buying behaviour, market windows, logistics, compliance, and partnership opportunities can vary by market
- approved blueprint is mandatory
- prior Phase 1 through Phase 8 content are mandatory
- launch planning must stay tied to the actual business model, not a generic product-launch playbook
- the phase must focus on sequencing, signal reading, iteration, and growth decisions rather than repeating setup work
- launch actions must respect legal, protection, and operating limits already defined
- growth recommendations must reflect real demand evidence and delivery capacity, not optimism
- outputs must distinguish between launch-critical action, near-term optimisation, and later-stage scale experiments
- if the business is intentionally soft-launching or validating quietly, the phase should support that instead of forcing a large public launch

## Outputs Phase 9 should generate

### 1. Launch and scale summary
A short plain-English read on how this business should go live and make good early decisions.

This should answer:
- what kind of launch this should be
- what success or failure signals matter first
- what to improve before trying to scale harder
- where the main overreach risks sit

### 2. Launch mode definition
Define the right launch posture.

Recommended structure:
- launch mode
- why it fits
- launch scope
- customer access pattern
- risk posture
- success condition for this mode

Examples:
- quiet soft launch
- founding-customer intake launch
- local-area launch
- limited-capacity beta launch
- full public launch for simple self-serve offer

### 3. Launch readiness checklist
Define what must be true before go-live.

Each item should include:
- readiness item
- why it matters
- owner role
- required before launch or not
- verification method

This should pull from earlier phases but present it as a go-live gate list.

### 4. Launch sequence
Show the practical rollout order.

Recommended structure:
- step number
- launch action
- timing window
- dependency
- owner role
- success signal

This should usually cover:
- pre-launch checks
- launch-day actions
- first-week follow-up
- early post-launch review

### 5. Early signal dashboard starter
Define what should be read in the first days and weeks.

Recommended metrics:
- traffic or reach where relevant
- inquiry or lead volume
- booking or purchase count
- qualified lead rate
- close rate
- fulfilment reliability
- refund/cancellation rate
- customer response quality
- repeat interest or referral signal

Each item should include:
- signal
- why it matters
- review cadence
- what good looks like
- what weak signal means

### 6. Launch review questions
Define the core questions the user should ask after initial launch activity.

Recommended themes:
- are the right people arriving
- are they converting cleanly
- where is friction appearing
- is delivery holding up
- are price and promise aligned
- is demand repeatable enough to lean in

### 7. Iteration priorities
Define what should be changed first if early results are mixed.

Each item should include:
- iteration area
- likely symptom
- recommended adjustment
- why this comes before bigger change
- expected impact

Examples:
- tighten offer wording
- simplify landing page CTA
- speed up follow-up
- improve proof near close
- reduce fulfilment friction
- narrow channel focus

### 8. Growth decision framework
Show when and how the business should move from launch to early scale.

Recommended structure:
- decision area
- stay steady signal
- lean-in signal
- caution signal
- recommended response

Examples:
- increase marketing spend
- widen channel mix
- expand capacity
- add staff or contractors
- raise prices
- open a second offer
- enter adjacent geography

### 9. Scaling opportunities and constraints
Give a blunt view of where growth can come from and what may block it.

Recommended structure:
- opportunity
- why it is attractive
- prerequisite
- main constraint
- timing posture

### 10. Launch and scale risk snapshot
Short blunt summary of the biggest launch and growth risks.

Each item should include:
- risk
- severity
- why it matters now
- next step

Examples:
- launching before conversion path is stable
- demand arrives faster than delivery can handle
- weak early signals get misread as total failure
- premature spend increase without proof
- scaling an offer that still has objection friction

### 11. 30-day action plan starter
Define the immediate post-launch action rhythm.

Recommended structure:
- week
- focus
- key actions
- review checkpoint

### 12. Launch and scale action checklist
Produce concrete next actions the user can actually do.

This should directly drive the phase task list.

## What Phase 9 should not do

- do not turn into generic hustle advice
- do not repeat the full marketing or sales plans without showing launch sequencing and decision logic
- do not recommend scaling before initial conversion and delivery signals exist
- do not hide risk behind optimistic language
- do not invent enterprise growth systems for an MVP business
- do not ignore founder time, budget, or capacity constraints
- do not confuse activity volume with traction quality
- do not assume a public splash launch is the right choice for every business

## Quality rules

Phase 9 passes only if:
- the launch mode and sequence are clear and realistic
- early signals are defined well enough to guide decisions
- iteration priorities are concrete and not random
- growth choices are tied to evidence and capacity
- the user can tell what to do in the first 30 days after go-live

Phase 9 fails if:
- it reads like generic launch inspiration for any business
- the launch plan has no sequence or no readiness logic
- there is no clear way to interpret early traction
- growth advice is premature or detached from operating reality
- iteration priorities are vague or disconnected from symptoms

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "launchScaleSummary": "Launch with a controlled initial intake, watch conversion and fulfilment quality closely, fix friction fast, and only increase spend or capacity once the core offer proves repeatable.",
  "launchMode": {
    "launchMode": "Limited-capacity soft launch",
    "whyItFits": "Protects service quality while the business validates real demand and handoff flow.",
    "launchScope": "Initial release to a narrow audience segment or local area",
    "customerAccessPattern": "Invite or accept a capped number of early customers first",
    "riskPosture": "Measured",
    "successCondition": "The business attracts good-fit customers, converts them at a workable rate, and fulfils cleanly without overload."
  },
  "launchReadinessChecklist": [
    {
      "readinessItem": "Offer page, payment path, and response flow tested",
      "whyItMatters": "Traffic should not hit a broken launch path",
      "ownerRole": "Founder",
      "requiredBeforeLaunch": true,
      "verificationMethod": "Run a full test inquiry or purchase journey"
    }
  ],
  "launchSequence": [
    {
      "stepNumber": 1,
      "launchAction": "Complete final go-live checks across offer, sales path, and delivery readiness",
      "timingWindow": "48 to 24 hours before launch",
      "dependency": "Marketing, infrastructure, and operations checks complete",
      "ownerRole": "Founder",
      "successSignal": "All core launch paths tested with no blocking issue"
    }
  ],
  "earlySignalDashboard": [
    {
      "signal": "Qualified inquiries or purchases",
      "whyItMatters": "Shows whether the launch is attracting the right demand, not just attention",
      "reviewCadence": "daily in week 1, then weekly",
      "goodLooksLike": "A steady stream of good-fit demand relative to capacity and spend",
      "weakSignalMeaning": "The offer, message, targeting, or trust path may be misaligned"
    }
  ],
  "launchReviewQuestions": [
    "Are the leads or buyers arriving from the channels we expected?",
    "Where do people hesitate before committing?",
    "Is delivery quality holding up under real demand?"
  ],
  "iterationPriorities": [
    {
      "iterationArea": "Offer and landing-page clarity",
      "likelySymptom": "People show interest but do not take the next step",
      "recommendedAdjustment": "Tighten the promise, CTA, and proof near the decision point",
      "whyThisComesFirst": "Messaging and conversion friction are cheaper to fix than broad strategic changes",
      "expectedImpact": "Higher inquiry-to-booking or visit-to-purchase conversion"
    }
  ],
  "growthDecisionFramework": [
    {
      "decisionArea": "Increase marketing spend",
      "staySteadySignal": "Demand is arriving but conversion or fulfilment is still inconsistent",
      "leanInSignal": "Qualified demand converts reliably and delivery remains stable",
      "cautionSignal": "Cost is rising faster than close quality or capacity",
      "recommendedResponse": "Only raise spend in controlled steps after the conversion path and delivery quality prove stable"
    }
  ],
  "scalingOpportunities": [
    {
      "opportunity": "Expand the winning channel or audience segment",
      "whyItIsAttractive": "It builds from proven demand instead of guessing",
      "prerequisite": "Clear signal that the current offer converts and fulfils cleanly",
      "mainConstraint": "Founder or delivery capacity",
      "timingPosture": "after_initial_validation"
    }
  ],
  "launchScaleRisks": [
    {
      "risk": "Scaling attention before the close and fulfilment path are stable",
      "severity": "high",
      "why": "Growth can magnify weak conversion and delivery problems into cash and trust issues",
      "nextStep": "Hold spend increases until the first launch window shows repeatable conversion and reliable delivery"
    }
  ],
  "thirtyDayActionPlan": [
    {
      "week": 1,
      "focus": "Go live and watch signal quality closely",
      "keyActions": [
        "Monitor inquiries, bookings, or purchases daily",
        "Log objections and drop-off points",
        "Check delivery quality after every completed job or order"
      ],
      "reviewCheckpoint": "End-of-week traction and friction review"
    }
  ]
}
```

## Recommended task output for Phase 9

Phase 9 should create actionable tasks like:

1. confirm the launch mode and go-live sequence
2. complete the launch readiness checks
3. set up the early signal review dashboard
4. run the first launch window and log results
5. prioritise the first iteration based on real friction
6. decide which growth moves are safe versus premature

### Task shape
Each task should include:
- `title`
- `whatToDo`
- `howToDoIt`
- `executionReference`
- `isRequired`

### Required tasks
For MVP, these should usually be marked required:
- confirm the launch mode and sequence
- complete the must-have launch readiness checks
- define the early signals and review cadence
- conduct the first structured launch review
- choose the first iteration or hold-steady decision based on evidence

## Suggested API expectations

### Generate Phase 9
`POST /api/projects/:projectId/phases/9/generate`

### Get Phase 9
`GET /api/projects/:projectId/phases/9`

### Expected response payload shape

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 9,
      "title": "Launch & Scale",
      "state": "ready",
      "summary": "Define how the business goes live, reads early traction, iterates intelligently, and decides when growth moves are actually justified.",
      "content": {
        "launchScaleSummary": "...",
        "launchMode": {},
        "launchReadinessChecklist": [],
        "launchSequence": [],
        "earlySignalDashboard": [],
        "launchReviewQuestions": [],
        "iterationPriorities": [],
        "growthDecisionFramework": [],
        "scalingOpportunities": [],
        "launchScaleRisks": [],
        "thirtyDayActionPlan": []
      },
      "tasks": []
    }
  }
}
```

## Validation rules

Before Phase 9 can be saved as `ready`, backend should confirm:
- project country exists
- blueprint exists
- latest brand, legal, finance, protection, infrastructure, marketing, operations, and sales outputs exist
- launch and scale summary exists
- launch mode exists
- at least three launch readiness checklist items exist unless the business is unusually simple and the reason is explicit
- launch sequence exists
- at least three early signal dashboard items exist unless the business model is unusually narrow and the reason is explicit
- at least three launch review questions exist
- at least one iteration priority exists
- at least one growth decision framework item exists
- at least one 30-day action plan item exists
- at least one required task exists

Additional validation:
- launch sequencing should reflect the actual channel, sales, and delivery setup already defined
- growth recommendations should not exceed known finance or capacity limits without explanation
- location-sensitive launch timing or market advice should not appear without location data
- iteration priorities should map to symptoms or signals rather than random ideas
- launch tasks should reference concrete readiness checks, launch actions, review loops, or growth decisions rather than vague momentum language

## Agent routing recommendation

Default Phase 9 route should be:
- Bob
- Growth & Scale Specialist
- Marketing Strategist
- Sales Coach
- Operations Guru
- Finance Expert
- AI & Automation Engineer
- Legal Advisor (light, where launch claims, promos, or expansion constraints matter)

Why:
- launch and scale sits at the intersection of demand, conversion, delivery, cash discipline, and signal interpretation
- the phase needs cross-functional judgement more than single-discipline advice
- growth decisions only work when the earlier phases are integrated into one operating picture

## MVP success test

Phase 9 is successful when the user can answer:
- how they should launch this business and in what order
- what must be checked before going live
- which early signals matter most in the first days and weeks
- what should be iterated first if traction is weak or mixed
- what evidence would justify spending, hiring, or expanding further

If the user leaves with only generic advice to "launch and see what happens," it failed.

## Bottom line

Phase 9 should make launch and growth feel disciplined.

It should turn the finished business setup into a controlled go-live sequence, an evidence-based review loop, and a practical framework for deciding what to improve, when to push harder, and when not to.
