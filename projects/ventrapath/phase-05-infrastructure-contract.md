# VentraPath Phase 5 Contract — Infrastructure

## Purpose

Define what Phase 5 (Infrastructure) should actually generate and store.

Phase 5 should turn the blueprint, legal path, finance reality, and protection needs into the core operating setup the business runs on.

It is not a random software stack wishlist.
It is not enterprise architecture cosplay.
It should give the user a usable operating backbone.

## Phase goal

Turn the business into an executable system setup:
- what tools and accounts are needed first
- what operating systems the business depends on
- how data, payments, communication, and delivery should flow
- what setup order makes practical sense
- what minimum infrastructure is enough to launch cleanly

## Inputs required

Phase 5 should consume:
- approved Phase 0 blueprint
- latest Phase 2 Legal output
- latest Phase 3 Finance output
- latest Phase 4 Protection output
- project country
- project region/state where materially relevant
- project currency
- business model details
- delivery mode details
- channel mix and customer touchpoints

Minimum required source sections:
- Business
- Monetisation
- Execution
- Legal
- Finance
- Protection

## Hard rules

- location is mandatory because payment providers, identity/verification flows, tax setup, communications rules, and local tooling availability can vary by market
- approved blueprint is mandatory
- prior Phase 2, 3, and 4 content are mandatory
- infrastructure choices must stay proportionate to the actual stage of the business
- MVP infrastructure should prioritise launchability, reliability, and maintainability over feature sprawl
- recommendations must distinguish between launch-critical systems and upgrade-later systems

## Outputs Phase 5 should generate

### 1. Infrastructure summary
A short plain-English read on the minimum viable system stack for this business.

This should answer:
- what the business needs to operate day one
- what systems are mission-critical
- where simplicity is better than complexity

### 2. Core systems map
A structured view of the systems the business needs.

Recommended categories:
- website or storefront
- payments and invoicing
- booking or order management
- CRM or customer records
- communication and support
- file/document storage
- finance/accounting system
- analytics/reporting
- automation/integration layer

Each item should include:
- system area
- recommended setup type
- why it is needed
- launch priority
- location-sensitive notes where relevant

### 3. Accounts and platform checklist
List the accounts, registrations, and external platforms the user likely needs to create.

Examples:
- domain registrar
- business email
- payment gateway
- merchant or marketplace account
- accounting platform
- booking platform
- cloud storage
- team collaboration system

Each item should include:
- account or platform
- purpose
- owner role
- required before launch or not

### 4. Data and workflow architecture starter
Describe how information should move through the business.

Recommended structure:
- trigger
- system used
- next step
- output created
- failure point to watch

Examples:
- lead inquiry to CRM to quote to payment to onboarding
- website booking to calendar to confirmation email to customer record
- order placed to fulfilment to invoice to follow-up

### 5. Payment and transaction setup guidance
Because this is often location-sensitive and launch-critical, it should be explicit.

Recommended structure:
- payment model
- recommended provider type
- currency/tax considerations
- payout or reconciliation note
- fraud/refund handling note

### 6. Access, security, and admin controls starter
A simple first-pass control layer.

Examples:
- shared inbox ownership
- password manager requirement
- admin-access separation
- backup cadence
- MFA for critical systems
- document permission boundaries

### 7. Infrastructure cost posture
Connect the stack back to finance.

Recommended structure:
- must-pay launch systems
- low-cost alternatives
- tools to avoid buying too early
- where cheap tooling creates operational risk

### 8. Implementation sequence
Give the user a practical order of setup.

Recommended structure:
- step number
- setup action
- dependency
- why this comes now

### 9. Infrastructure risk snapshot
Short blunt summary of the main setup fragilities.

Examples:
- too many disconnected tools
- founder-only admin access
- no booking/payment fallback
- tax handling misconfigured
- customer data spread across channels

### 10. Infrastructure action checklist
Produce concrete next actions the user can actually do.

This should directly drive the phase task list.

## What Phase 5 should not do

- do not recommend an overbuilt stack for a simple business
- do not treat every business like a SaaS startup
- do not ignore local payment, tax, or platform availability realities
- do not drift into Phase 7 full operating procedures
- do not make tooling decisions without reference to budget and delivery model
- do not output vague advice like "use a CRM" without explaining the job it does

## Quality rules

Phase 5 passes only if:
- the user can see the minimum viable stack clearly
- system choices match the business model and scale
- launch-critical accounts and tools are obvious
- data/payment/workflow handoffs are understandable
- infrastructure costs stay commercially sane

Phase 5 fails if:
- it is just a list of popular tools
- the system map does not show how work flows
- location-sensitive platform constraints are ignored
- the stack is too complex for the stated business stage
- the setup order is missing or unusable

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "infrastructureSummary": "This business can launch on a lean stack centred on website capture, booking and payment flow, accounting visibility, and simple customer follow-up without needing custom software.",
  "coreSystemsMap": [
    {
      "systemArea": "Payments",
      "recommendedSetupType": "Online payment gateway with invoice support",
      "whyItIsNeeded": "Supports deposits, online checkout, and clean reconciliation.",
      "launchPriority": "critical_now",
      "locationNotes": "Choose a provider available in the project country that supports the business currency and tax handling."
    }
  ],
  "accountsChecklist": [
    {
      "account": "Business domain and email",
      "purpose": "Professional customer communication and account recovery",
      "ownerRole": "Founder",
      "requiredBeforeLaunch": true
    }
  ],
  "workflowArchitecture": [
    {
      "trigger": "Customer submits booking request",
      "system": "Website or booking platform",
      "nextStep": "Create customer record and send confirmation",
      "output": "Booking entry plus contact record",
      "failurePoint": "Requests lost if booking notifications rely on one personal inbox"
    }
  ],
  "paymentSetupGuidance": {
    "paymentModel": "Deposit upfront with balance before service delivery",
    "recommendedProviderType": "Gateway that supports online card payments and local payout to the business bank account",
    "currencyTaxNotes": "Use the project currency consistently and confirm local tax settings before going live.",
    "reconciliationNote": "Payments should map cleanly into bookkeeping without manual re-entry.",
    "fraudRefundNote": "Set clear refund and chargeback handling rules before first transactions."
  },
  "accessAndSecurityControls": [
    {
      "title": "Enable MFA on payment, email, and domain accounts",
      "priority": "high",
      "reason": "These are the highest-impact takeover points early on."
    }
  ],
  "infrastructureCostPosture": {
    "mustPayLaunchSystems": [
      "Domain and email",
      "Payments",
      "Bookkeeping or accounting tool"
    ],
    "lowCostAlternatives": [
      "Use integrated booking/payment tooling before custom automation"
    ],
    "avoidBuyingTooEarly": [
      "Enterprise CRM",
      "Custom app build"
    ],
    "cheapToolingRisk": "Using disconnected free tools for bookings and payments can create missed customers and reconciliation errors."
  },
  "implementationSequence": [
    {
      "stepNumber": 1,
      "setupAction": "Secure domain, business email, and password manager",
      "dependency": "Final business name chosen",
      "whyNow": "Other account creation and customer-facing systems depend on it."
    }
  ],
  "infrastructureRisks": [
    {
      "risk": "Bookings and customer data spread across multiple unmanaged channels",
      "severity": "high",
      "why": "Creates missed follow-up, data confusion, and weak reporting.",
      "nextStep": "Choose one primary intake path and capture all inquiries into the same customer record flow."
    }
  ]
}
```

## Recommended task output for Phase 5

Phase 5 should create actionable tasks like:

1. choose the minimum viable tool stack
2. create launch-critical business accounts
3. set up payment and transaction handling
4. map the customer flow across systems
5. secure admin access and backups
6. complete setup in the recommended implementation order

### Task shape
Each task should include:
- `title`
- `whatToDo`
- `howToDoIt`
- `executionReference`
- `isRequired`

### Required tasks
For MVP, these should usually be marked required:
- choose the launch-critical core systems
- create required accounts before launch
- configure payment handling for the business location and currency
- set up basic access/security controls
- define one clean customer data and workflow path

## Suggested API expectations

### Generate Phase 5
`POST /api/projects/:projectId/phases/5/generate`

### Get Phase 5
`GET /api/projects/:projectId/phases/5`

### Expected response payload shape

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 5,
      "title": "Infrastructure",
      "state": "ready",
      "summary": "Set up the minimum viable systems, accounts, and workflows the business runs on.",
      "content": {
        "infrastructureSummary": "...",
        "coreSystemsMap": [],
        "accountsChecklist": [],
        "workflowArchitecture": [],
        "paymentSetupGuidance": {},
        "accessAndSecurityControls": [],
        "infrastructureCostPosture": {},
        "implementationSequence": [],
        "infrastructureRisks": []
      },
      "tasks": []
    }
  }
}
```

## Validation rules

Before Phase 5 can be saved as `ready`, backend should confirm:
- project country exists
- blueprint exists
- latest legal, finance, and protection outputs exist
- infrastructure summary exists
- at least three core system items exist
- at least three account/platform checklist items exist unless the business is unusually simple and that reason is explicit
- workflow architecture exists for at least one end-to-end customer path
- payment setup guidance exists if the business takes payment directly
- at least one security/admin control exists
- implementation sequence exists
- at least one required task exists

Additional validation:
- launch-critical systems should align with the monetisation model
- location-sensitive payment/provider guidance should not appear without location data
- recommendations should not exceed the finance posture without explanation
- workflow steps should reference real customer or operating events, not abstract tooling slogans

## Agent routing recommendation

Default Phase 5 route should be:
- Bob
- AI & Automation Engineer
- Operations Guru
- Finance Expert
- Legal Advisor (light, for local payment/data/compliance constraints)

Why:
- infrastructure is where systems, money flow, and practical execution meet
- tooling choices need operational realism, not just technical preference
- payment and data handling often have location-sensitive consequences

## MVP success test

Phase 5 is successful when the user can answer:
- what tools and accounts must exist before launch
- how customer, payment, and record flows work
- what setup order to follow
- what infrastructure is enough now without overbuilding

If the user leaves with a vague stack list and no usable setup sequence, it failed.

## Bottom line

Phase 5 should give the business a working backbone.

It should feel like a clean launch-ready system map with sensible tools, clear workflows, and just enough control to operate reliably without overcomplicating the build.
