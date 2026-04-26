# VentraPath Phase 6 Contract — Marketing

## Purpose

Define what Phase 6 (Marketing) should actually generate and store.

Phase 6 should turn the blueprint, financial reality, protection limits, and infrastructure stack into a practical first acquisition plan.

It is not brand fluff.
It is not broad "awareness" theory.
It should tell the user what to offer, where to show up, what to say, and what to launch first.

## Phase goal

Turn the business into a market-facing acquisition setup:
- what offer should lead the market entry
- which channels are worth using first
- what launch messaging should be used
- what campaign assets need to exist
- what first marketing actions should happen in sequence
- what should be measured so the user can tell if marketing is working

## Inputs required

Phase 6 should consume:
- approved Phase 0 blueprint
- latest Phase 1 Brand output
- latest Phase 2 Legal output
- latest Phase 3 Finance output
- latest Phase 4 Protection output
- latest Phase 5 Infrastructure output
- project country
- project region/state where materially relevant
- project currency
- business model details
- delivery mode details
- channel constraints and customer touchpoints

Minimum required source sections:
- Business
- Market
- Monetisation
- Execution
- Legal
- Finance
- Protection
- Infrastructure
- Brand positioning and messaging

## Hard rules

- location is mandatory because channel fit, platform norms, local trust signals, compliance rules, seasonality, and launch messaging context vary by market
- approved blueprint is mandatory
- prior Phase 1 through Phase 5 content are mandatory
- marketing must stay tied to the actual business model and customer behaviour, not generic online-marketing templates
- the phase must prioritise channels the user can realistically operate at MVP stage
- the lead offer must match the financial model and delivery capacity
- messaging should inherit the brand direction but focus on customer conversion, not internal identity language
- every recommendation must distinguish between launch-now activity and later optimisation

## Outputs Phase 6 should generate

### 1. Marketing strategy summary
A short plain-English read on how this business should win its first customers.

This should answer:
- what the best first offer is
- which channels matter first
- what message should lead the launch
- what not to waste effort on yet

### 2. Lead offer definition
Define the specific offer the business should take to market first.

Recommended structure:
- offer name
- offer type
- target audience
- customer problem solved
- included deliverables or outcome
- price or price posture
- why this is the right lead offer now
- capacity or fulfilment constraint to watch

Examples:
- launch package
- introductory service bundle
- diagnostic session
- paid trial
- limited founding-member offer
- first retail bundle

### 3. Channel strategy
List the channels the business should use first.

Each item should include:
- channel
- role: `primary`, `supporting`, or `later`
- why it fits this business
- audience behaviour signal
- setup requirement
- cost posture
- location notes where relevant

Examples:
- local SEO / maps presence
- Instagram or TikTok
- Google Search ads
- LinkedIn outreach
- partnerships/referrals
- founder network activation
- community groups
- marketplaces/directories
- email capture and follow-up

### 4. Launch messaging pack
Produce the core external messaging for first campaigns.

Recommended structure:
- primary positioning message
- audience-specific message angles
- launch hook
- proof/trust points
- offer CTA
- objection handling notes

This should be usable across ads, social posts, landing pages, and outreach.

### 5. Campaign asset checklist
Define what needs to exist before marketing goes live.

Recommended items:
- landing page or offer page
- booking or checkout link
- social profile updates
- launch post set
- ad creative starter
- lead capture form
- email or SMS follow-up starter
- testimonial/proof placeholder plan

Each item should include:
- asset
- purpose
- required before launch or not
- owner role
- supporting infrastructure dependency

### 6. Funnel and conversion path starter
Show how a prospect should move from attention to action.

Recommended structure:
- entry channel
- next touchpoint
- conversion action
- system used
- follow-up action
- likely drop-off risk

Examples:
- Instagram post to landing page to booking form to confirmation flow
- Google ad to offer page to checkout to onboarding email
- referral intro to call booking to proposal to payment

### 7. Launch plan sequence
Define the first practical rollout order.

Recommended structure:
- step number
- marketing action
- dependency
- why this comes now
- success signal

This should feel like an execution order, not a theory deck.

### 8. Budget and channel spend posture
Connect marketing choices back to finance.

Recommended structure:
- no-cost or low-cost channels to use first
- channels worth paid testing
- spend ceiling for MVP testing
- assets that matter more than ad spend
- where underfunding or overfunding creates risk

### 9. Measurement starter
Define what the user should track early.

Recommended metrics:
- reach or impressions where relevant
- clicks or inquiries
- lead volume
- booking or checkout conversion
- cost per lead
- first purchase / first booking count
- channel quality notes

Each item should include:
- metric
- why it matters
- expected signal type
- review cadence

### 10. Marketing risk snapshot
Short blunt summary of the biggest go-to-market weaknesses.

Each item should include:
- risk
- severity
- why it matters now
- next step

Examples:
- offer unclear
- wrong channel priority
- no trust signal on landing page
- weak follow-up after inquiry
- paid traffic before conversion path is ready

### 11. Marketing action checklist
Produce concrete next actions the user can actually do.

This should directly drive the phase task list.

## What Phase 6 should not do

- do not turn into a general branding exercise already covered by Phase 1
- do not output generic content-calendar filler
- do not recommend every social platform just to look comprehensive
- do not separate marketing from delivery capacity or cost reality
- do not drift into full sales pipeline design that belongs in Phase 8
- do not ignore legal, ad, privacy, or claims constraints from earlier phases
- do not recommend paid campaigns without a believable offer and conversion path
- do not give location-free channel guidance when local behaviour materially changes the advice

## Quality rules

Phase 6 passes only if:
- the lead offer is clear and commercially usable
- the first channels are prioritised realistically
- launch messaging is concrete enough to deploy in UI and assets
- the conversion path from attention to action is visible
- the marketing plan fits the business model, budget, and launch stage

Phase 6 fails if:
- it reads like generic marketing advice for any business
- the offer is vague or disconnected from monetisation
- channels are listed without a reason or role
- messaging is fluffy instead of conversion-focused
- there is no workable launch order or no measurable success logic

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "marketingStrategySummary": "Launch with one clear entry offer, a tight local-trust message, and a small number of channels the founder can actually run well before expanding.",
  "leadOffer": {
    "offerName": "Founding Client Setup Package",
    "offerType": "Introductory service package",
    "targetAudience": "Small local businesses needing fast setup support",
    "customerProblemSolved": "Gets the customer from confusion to a working starting solution quickly.",
    "includedDeliverables": [
      "Initial consult",
      "Core setup",
      "30-day follow-up"
    ],
    "pricePosture": "Mid-ticket launch offer with a clear fixed starting price",
    "whyNow": "Simple to explain, easy to deliver, and strong enough to generate proof quickly.",
    "capacityConstraint": "Do not oversell beyond weekly delivery slots."
  },
  "channelStrategy": [
    {
      "channel": "Google Business Profile and local search presence",
      "role": "primary",
      "whyItFits": "Captures high-intent local demand close to purchase.",
      "audienceSignal": "Customers search when they already want a provider.",
      "setupRequirement": "Profile, reviews plan, website link, service details",
      "costPosture": "low_cost",
      "locationNotes": "Optimise for the project service area and suburb/city language where relevant."
    }
  ],
  "launchMessagingPack": {
    "primaryPositioningMessage": "A faster, clearer way to get this result without the usual friction.",
    "messageAngles": [
      "Speed to outcome",
      "Trust and clarity",
      "Location-relevant convenience"
    ],
    "launchHook": "Opening with a limited early-client intake.",
    "proofPoints": [
      "Founder expertise",
      "Structured delivery process"
    ],
    "offerCta": "Book your first consult",
    "objectionHandling": [
      "Explain what is included",
      "Clarify turnaround and price starting point"
    ]
  },
  "campaignAssets": [
    {
      "asset": "Offer landing page",
      "purpose": "Explain the lead offer and convert interest into action",
      "requiredBeforeLaunch": true,
      "ownerRole": "Founder",
      "infrastructureDependency": "Website and booking/payment flow"
    }
  ],
  "funnelStarter": [
    {
      "entryChannel": "Instagram reel",
      "nextTouchpoint": "Offer landing page",
      "conversionAction": "Booking form submission",
      "systemUsed": "Website plus CRM or booking tool",
      "followUpAction": "Confirmation email and founder follow-up within one business day",
      "dropOffRisk": "Weak CTA or slow response after inquiry"
    }
  ],
  "launchPlanSequence": [
    {
      "stepNumber": 1,
      "marketingAction": "Finalise lead offer page and booking path",
      "dependency": "Infrastructure flow working",
      "whyNow": "Traffic should not be sent before the conversion path works.",
      "successSignal": "Offer page live and inquiry test completed"
    }
  ],
  "budgetPosture": {
    "lowCostFirst": [
      "Founder network activation",
      "Local listings",
      "Organic social proof collection"
    ],
    "paidTestChannels": [
      "Local search ads"
    ],
    "mvpSpendCeiling": "Use a small capped test budget until the first conversion data exists.",
    "assetPriority": "Landing page clarity and follow-up matter more than broad ad spend early.",
    "fundingRisk": "Paying for traffic before the offer and follow-up path are ready will waste budget."
  },
  "measurementStarter": [
    {
      "metric": "Qualified inquiries",
      "whyItMatters": "Shows whether channels are attracting people close to purchase.",
      "expectedSignalType": "weekly_count",
      "reviewCadence": "weekly"
    }
  ],
  "marketingRisks": [
    {
      "risk": "Offer message too broad to trigger action",
      "severity": "high",
      "why": "People may understand the business vaguely but still not convert.",
      "nextStep": "Tighten the promise, audience, and CTA on the main offer page."
    }
  ]
}
```

## Recommended task output for Phase 6

Phase 6 should create actionable tasks like:

1. lock the lead offer for launch
2. choose the first marketing channels
3. build the minimum campaign asset set
4. publish the launch messaging across the main touchpoints
5. set up one clean inquiry-to-conversion path
6. start measurement and review early results

### Task shape
Each task should include:
- `title`
- `whatToDo`
- `howToDoIt`
- `executionReference`
- `isRequired`

### Required tasks
For MVP, these should usually be marked required:
- confirm the launch lead offer
- activate the primary channels needed for first acquisition
- publish or complete the minimum launch assets
- make sure the funnel path from channel to action is live
- define how marketing results will be reviewed

## Suggested API expectations

### Generate Phase 6
`POST /api/projects/:projectId/phases/6/generate`

### Get Phase 6
`GET /api/projects/:projectId/phases/6`

### Expected response payload shape

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 6,
      "title": "Marketing",
      "state": "ready",
      "summary": "Launch the first real offer through the right channels with clear messaging and a working conversion path.",
      "content": {
        "marketingStrategySummary": "...",
        "leadOffer": {},
        "channelStrategy": [],
        "launchMessagingPack": {},
        "campaignAssets": [],
        "funnelStarter": [],
        "launchPlanSequence": [],
        "budgetPosture": {},
        "measurementStarter": [],
        "marketingRisks": []
      },
      "tasks": []
    }
  }
}
```

## Validation rules

Before Phase 6 can be saved as `ready`, backend should confirm:
- project country exists
- blueprint exists
- latest brand, legal, finance, protection, and infrastructure outputs exist
- marketing strategy summary exists
- lead offer exists
- at least two channel strategy items exist unless the business is unusually constrained and the reason is explicit
- launch messaging pack exists
- at least three campaign asset items exist unless the business model is unusually simple and that reason is explicit
- at least one end-to-end funnel path exists
- launch plan sequence exists
- at least one measurement item exists
- at least one required task exists

Additional validation:
- offer pricing posture should not contradict the finance model without explanation
- channel recommendations should align with known audience behaviour and delivery capacity
- location-sensitive channel or claim guidance should not appear without location data
- compliance-sensitive messaging should not conflict with legal or protection constraints
- marketing tasks should reference real assets or actions, not vague promotion language

## Agent routing recommendation

Default Phase 6 route should be:
- Bob
- Marketing Strategist
- Differentiation Strategist
- Finance Expert
- Operations Guru
- AI & Automation Engineer (light, where automation or tracking setup matters)

Why:
- marketing depends on offer clarity, messaging, budget realism, and executable delivery capacity
- the phase needs both acquisition strategy and practical implementation logic
- measurement and funnel setup often touch infrastructure and automation decisions

## MVP success test

Phase 6 is successful when the user can answer:
- what exact offer they are taking to market first
- which channels they should use first and why
- what message they should publish at launch
- what assets must exist before spending effort on promotion
- what signals will tell them whether the marketing is working

If the user leaves with only generic "post on social media" advice, it failed.

## Bottom line

Phase 6 should make marketing feel deployable.

It should turn the business into a clear offer, a focused channel plan, launch-ready messaging, and a trackable first acquisition system the user can actually run.