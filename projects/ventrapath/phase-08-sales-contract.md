# VentraPath Phase 8 Contract — Sales

## Purpose

Define what Phase 8 (Sales) should actually generate and store.

Phase 8 should turn the offer, marketing flow, operating reality, and business constraints into a practical system for converting real opportunities into paying customers.

It is not generic confidence coaching.
It is not broad business development theory.
It should show how leads are qualified, progressed, followed up, and closed.

## Phase goal

Turn the business into a workable sales engine:
- what sales motion fits this business
- how leads should move from inquiry to close
- what qualification logic should be used
- what sales assets and scripts need to exist
- how follow-up and objections should be handled
- what close mechanics and deal signals should be watched

## Inputs required

Phase 8 should consume:
- approved Phase 0 blueprint
- latest Phase 1 Brand output
- latest Phase 2 Legal output
- latest Phase 3 Finance output
- latest Phase 4 Protection output
- latest Phase 5 Infrastructure output
- latest Phase 6 Marketing output
- latest Phase 7 Operations output
- project country
- project region/state where materially relevant
- project currency
- business model details
- delivery mode details
- lead offer and channel mix
- operating capacity assumptions

Minimum required source sections:
- Business
- Market
- Monetisation
- Execution
- Brand positioning and messaging
- Legal
- Finance
- Protection
- Infrastructure
- Marketing funnel and offer
- Operations workflow and capacity rules

## Hard rules

- location is mandatory because trust expectations, sales norms, payment practices, contract expectations, and buyer behaviour can vary by market
- approved blueprint is mandatory
- prior Phase 1 through Phase 7 content are mandatory
- sales design must fit the real buying behaviour of this business, not a generic high-ticket closer template
- the phase must stay focused on lead movement, qualification, conversion, and close mechanics
- sales recommendations must respect legal claims, refund, privacy, and contract constraints from earlier phases
- close process must reflect real delivery capacity and not encourage overselling beyond operations limits
- outputs must distinguish between launch-critical sales process and later optimisation
- if the business is mostly self-serve, the sales system should stay lightweight instead of inventing unnecessary calls or proposal stages

## Outputs Phase 8 should generate

### 1. Sales strategy summary
A short plain-English read on how this business should convert demand into revenue.

This should answer:
- what sales motion fits best
- what a qualified lead looks like
- where deals are most likely to stall
- what close behaviour matters most early

### 2. Sales model definition
Define the core sales approach the business should use.

Recommended structure:
- sales model
- deal type
- typical customer decision path
- expected sales cycle length
- primary conversion event
- why this model fits now

Examples:
- self-serve checkout
- consultative founder-led sale
- quote to acceptance flow
- discovery call to proposal to close
- partnership or referral-led close

### 3. Lead qualification framework
Define how the business should tell which leads deserve attention first.

Each item should include:
- qualification criterion
- why it matters
- signal source
- priority level
- disqualifier or caution note

Examples:
- budget fit
- urgency
- geography or service area fit
- use-case fit
- authority to buy
- timing alignment
- fulfilment fit

### 4. Pipeline stage design
Show the minimum viable sales pipeline.

Recommended structure:
- stage order
- stage name
- stage purpose
- entry condition
- exit condition
- owner role
- system used
- risk if stalled

Example stages:
- new inquiry
- qualified
- discovery or needs review
- quote or proposal sent
- follow-up active
- verbally agreed
- paid or signed
- closed lost

### 5. Contact and follow-up rules
Define how and when sales follow-up should happen.

Recommended structure:
- trigger
- follow-up action
- channel
- timing expectation
- owner role
- stop condition

This should cover:
- first response
- post-call follow-up
- quote follow-up
- reactivation of warm leads
- no-response handling

### 6. Sales conversation guide
Produce the core structure for the sales interaction.

Recommended structure:
- opening goal
- discovery questions
- qualification checks
- value framing points
- transition to offer
- close prompt
- follow-up note

This should be usable for calls, messages, consults, DMs, or in-person selling depending on the business.

### 7. Objection handling starter
Define the likely objections and how to respond.

Each item should include:
- objection
- what it usually means
- response approach
- proof or reassurance needed
- when to walk away

Examples:
- price hesitation
- timing hesitation
- trust uncertainty
- decision-maker delay
- comparison shopping
- unclear scope

### 8. Proposal, quote, or checkout guidance
Make the close mechanics explicit.

Recommended structure:
- close method
- what the customer must receive
- what must be confirmed before closing
- payment or deposit expectation
- contract or approval note
- friction point to remove

### 9. Sales asset checklist
Define what tools or materials the seller needs.

Examples:
- sales call guide
- FAQ sheet
- proposal template
- pricing sheet
- case-study or proof pack
- follow-up message templates
- CRM pipeline setup
- payment link or checkout flow

Each item should include:
- asset
- purpose
- required before launch or not
- owner role
- dependency

### 10. Conversion metric starter
Show what should be tracked early.

Recommended metrics:
- inquiry response time
- qualified lead rate
- call booking rate
- proposal or quote conversion rate
- close rate
- average deal value
- sales cycle length
- lost-deal reasons

Each item should include:
- metric
- why it matters
- review cadence
- action trigger

### 11. Sales risk snapshot
Short blunt summary of the biggest conversion weaknesses.

Each item should include:
- risk
- severity
- why it matters now
- next step

Examples:
- slow response to new inquiries
- poor qualification leading to wasted time
- weak proof at close point
- unclear next step after discovery
- price objections caused by weak framing
- selling beyond delivery capacity

### 12. Sales action checklist
Produce concrete next actions the user can actually do.

This should directly drive the phase task list.

## What Phase 8 should not do

- do not turn into generic motivational sales advice
- do not assume every business needs a multi-call consultative close
- do not duplicate marketing channel strategy without showing how leads convert after arrival
- do not recommend aggressive tactics that conflict with brand, legal, or protection constraints
- do not ignore founder time limits or operational capacity
- do not drift into Phase 9 growth experimentation and scaling decisions
- do not create unnecessary CRM complexity for a simple business
- do not treat all leads as equal if qualification clearly matters

## Quality rules

Phase 8 passes only if:
- the business has a clear sales motion that matches how customers buy
- qualification logic is explicit enough to prioritise leads
- the pipeline stages are trackable in a backend and UI
- follow-up and close mechanics are concrete enough to run
- sales assets and metrics support real conversion improvement

Phase 8 fails if:
- it reads like generic selling advice for any business
- the pipeline is vague or missing stage logic
- follow-up expectations are unclear
- objections are listed without a usable response approach
- the close path ignores contracts, payments, or real capacity limits

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "salesStrategySummary": "Use a tight founder-led conversion flow with fast response, simple qualification, a clear next step after inquiry, and a low-friction close path matched to delivery capacity.",
  "salesModel": {
    "salesModel": "Consultative founder-led sale",
    "dealType": "Service package close after short discovery",
    "customerDecisionPath": "Inquiry to qualification to short call to proposal or payment link",
    "expectedSalesCycleLength": "3 to 10 days",
    "primaryConversionEvent": "Customer pays deposit or signs service agreement",
    "whyThisFitsNow": "The offer needs some trust-building and tailoring, but the sales path should still stay lean at MVP stage."
  },
  "leadQualificationFramework": [
    {
      "qualificationCriterion": "Problem and offer fit",
      "whyItMatters": "Prevents time being spent on leads the business cannot help well.",
      "signalSource": "Inquiry details or first conversation",
      "priorityLevel": "high",
      "cautionNote": "Disqualify if the request falls outside core delivery scope."
    }
  ],
  "pipelineStages": [
    {
      "stageOrder": 1,
      "stageName": "New inquiry",
      "stagePurpose": "Capture and acknowledge incoming interest quickly",
      "entryCondition": "Lead submits a form, DM, call, or referral intro",
      "exitCondition": "Lead is either qualified for next step or marked unfit",
      "ownerRole": "Founder",
      "systemUsed": "CRM, inbox, or booking system",
      "stallRisk": "Slow first response lowers conversion odds"
    }
  ],
  "followUpRules": [
    {
      "trigger": "New qualified inquiry",
      "followUpAction": "Respond with next-step invitation and qualification confirmation",
      "channel": "Email or direct message",
      "timingExpectation": "Within one business day",
      "ownerRole": "Founder",
      "stopCondition": "Lead books the next step or is marked inactive"
    }
  ],
  "salesConversationGuide": {
    "openingGoal": "Confirm fit and establish the outcome the lead wants",
    "discoveryQuestions": [
      "What result are you trying to achieve?",
      "What has already been tried?"
    ],
    "qualificationChecks": [
      "Budget fit",
      "Timing fit",
      "Scope fit"
    ],
    "valueFramingPoints": [
      "Explain the specific outcome and process",
      "Link the offer to speed, clarity, or reduced risk"
    ],
    "transitionToOffer": "Recommend the most suitable starting package or next step",
    "closePrompt": "Confirm whether they want to proceed and send the payment or agreement link now",
    "followUpNote": "Log objections and next step immediately after the conversation"
  },
  "objectionHandling": [
    {
      "objection": "The price feels high",
      "whatItUsuallyMeans": "The value or scope is not yet clear enough relative to the spend",
      "responseApproach": "Reframe around outcome, included work, and cost of delay or lower-quality alternatives",
      "proofNeeded": "Clear deliverables, process clarity, and relevant proof points",
      "walkAwayCondition": "Do not discount into a loss-making or brand-damaging close"
    }
  ],
  "closeGuidance": {
    "closeMethod": "Proposal or payment link after qualification",
    "customerMustReceive": "Clear scope, price, timeline, and next-step instructions",
    "mustConfirmBeforeClosing": [
      "Fit with service scope",
      "Start timing",
      "Payment expectation"
    ],
    "paymentExpectation": "Deposit or full payment depending on offer type",
    "contractApprovalNote": "Use approved terms or agreement structure from earlier legal work",
    "frictionToRemove": "Do not leave the lead without a clear next action or payment path"
  },
  "salesAssets": [
    {
      "asset": "Sales pipeline in CRM or tracker",
      "purpose": "Track lead stage, follow-up, and close status",
      "requiredBeforeLaunch": true,
      "ownerRole": "Founder",
      "dependency": "Infrastructure customer-record system"
    }
  ],
  "conversionMetrics": [
    {
      "metric": "Inquiry response time",
      "whyItMatters": "Fast response strongly affects early conversion",
      "reviewCadence": "weekly",
      "actionTrigger": "Tighten alerts or ownership if response slips beyond target"
    }
  ],
  "salesRisks": [
    {
      "risk": "Leads enter the system but are not followed up consistently",
      "severity": "high",
      "why": "Conversion drops quickly when early demand is not actively progressed",
      "nextStep": "Set a same-day or next-business-day response standard and track it"
    }
  ]
}
```

## Recommended task output for Phase 8

Phase 8 should create actionable tasks like:

1. define the minimum viable sales pipeline
2. lock the qualification criteria for good-fit leads
3. implement the first-response and follow-up rules
4. prepare the core sales script and objection responses
5. make the close path friction-light with payment or agreement ready
6. start tracking the main conversion metrics

### Task shape
Each task should include:
- `title`
- `whatToDo`
- `howToDoIt`
- `executionReference`
- `isRequired`

### Required tasks
For MVP, these should usually be marked required:
- confirm the pipeline stages used from inquiry to close
- implement at least one qualification rule set for lead triage
- implement the first-response standard and follow-up sequence
- prepare the core close asset set needed to take payment or agreement
- define how conversion performance will be reviewed

## Suggested API expectations

### Generate Phase 8
`POST /api/projects/:projectId/phases/8/generate`

### Get Phase 8
`GET /api/projects/:projectId/phases/8`

### Expected response payload shape

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 8,
      "title": "Sales",
      "state": "ready",
      "summary": "Define how leads are qualified, progressed, followed up, and closed so demand turns into revenue cleanly.",
      "content": {
        "salesStrategySummary": "...",
        "salesModel": {},
        "leadQualificationFramework": [],
        "pipelineStages": [],
        "followUpRules": [],
        "salesConversationGuide": {},
        "objectionHandling": [],
        "closeGuidance": {},
        "salesAssets": [],
        "conversionMetrics": [],
        "salesRisks": []
      },
      "tasks": []
    }
  }
}
```

## Validation rules

Before Phase 8 can be saved as `ready`, backend should confirm:
- project country exists
- blueprint exists
- latest brand, legal, finance, protection, infrastructure, marketing, and operations outputs exist
- sales strategy summary exists
- sales model exists
- at least three pipeline stages exist unless the business is unusually self-serve and the reason is explicit
- at least one qualification framework item exists
- at least one follow-up rule exists
- sales conversation guide exists unless the business is fully self-serve and the reason is explicit
- close guidance exists
- at least one sales asset exists
- at least one conversion metric exists
- at least one required task exists

Additional validation:
- sales stages should match the actual offer and buying behaviour
- close mechanics should not conflict with legal terms, payment setup, or operations capacity
- location-sensitive sales or contract guidance should not appear without location data
- qualification logic should not contradict the target audience defined in the blueprint and marketing phases
- sales tasks should reference concrete stages, scripts, assets, or response rules rather than generic selling effort

## Agent routing recommendation

Default Phase 8 route should be:
- Bob
- Sales Coach
- Marketing Strategist
- Operations Guru
- Finance Expert
- Legal Advisor (light, where close mechanics or agreement structure matter)
- AI & Automation Engineer (light, where CRM tracking or follow-up automation matters)

Why:
- sales sits between demand creation, commercial conversion, legal clarity, and delivery capacity
- the phase needs real pipeline logic more than abstract persuasion theory
- early conversion improvement usually depends on both process design and fast operational follow-through

## MVP success test

Phase 8 is successful when the user can answer:
- what a qualified lead looks like
- which stages a lead moves through before buying
- how fast and through which channel they should follow up
- what they should say in the core sales interaction
- what closes the deal and what signals show conversion is weak

If the user leaves with only generic advice to "follow up more," it failed.

## Bottom line

Phase 8 should make sales feel controllable.

It should turn interest into a clear, trackable pipeline with usable qualification rules, practical follow-up, and close mechanics the user can actually run.
