# VentraPath Phase 2 Contract — Legal

## Purpose

Define what Phase 2 (Legal) should actually generate and store.

Phase 2 should turn the blueprint and brand direction into a location-aware legal setup path the user can act on.

It is not a legal lecture.
It is not a jurisdiction-agnostic disclaimer dump.
It should give the user a practical legal setup map for their country/region.

## Phase goal

Turn the business concept into a concrete legal setup starting point:
- what legal/business structure is most sensible first
- what registrations are likely required
- what licences, permits, or approvals may matter
- what compliance risks need attention before launch
- what documents, decisions, and government touchpoints the user should prepare for

## Inputs required

Phase 2 should consume:
- approved Phase 0 blueprint
- approved or latest Phase 1 Brand output
- project country
- project region/state where relevant
- business model details that affect regulation

Minimum required source sections:
- Business
- Monetisation
- Legal
- Website
- Brand direction and positioning where claims/compliance matter

## Hard rule: location is mandatory

Phase 2 is invalid without location.

If country is missing:
- generation must fail
- the phase must not return placeholder legal guidance

If region/state matters and is missing:
- return country-level guidance only if that is still commercially honest
- explicitly mark regional follow-up as required

## Outputs Phase 2 should generate

### 1. Recommended legal structure

Give a practical recommended starting structure for the location.

Examples:
- sole trader / sole proprietorship
- limited company / private company
- LLC
- partnership

Recommended output:
- recommended structure
- why it fits this business model
- when a more advanced structure may make sense later

### 2. Registration path

Spell out the likely registration actions.

Recommended structure:
- registration step
- authority or system involved
- why it is needed
- whether it is required before trading

Examples:
- register company name
- register business/entity
- obtain tax number
- register for sales tax / VAT / GST if thresholds apply

### 3. Licensing and permit check

List likely licences, permits, or regulated activity checks based on location and business type.

Important:
- do not pretend certainty where licensing depends on finer details
- clearly label items as `likely required`, `may apply`, or `not likely`

Examples:
- food handling permit
- childcare licensing
- local council occupancy approval
- transport operator permit
- home business approval
- event/public liability permit conditions

### 4. Compliance obligations starter

Give a tight list of legal/compliance obligations the user should know early.

Examples:
- privacy policy requirement
- consumer law obligations
- refund policy rules
- employment classification risk
- industry-specific disclosures
- record-keeping obligations
- online terms and conditions need

### 5. Business name / trademark checks

Give the user a practical first-pass brand protection/legal check.

Recommended structure:
- whether business name availability should be checked before locking brand
- trademark search recommendation
- domain conflict awareness
- obvious naming risk notes

This should stay practical, not full IP strategy.

### 6. Website and marketing claim warnings

Because VentraPath is non-chat and structured, this needs to feed directly into later UI tasks.

Flag risky claims the business should not casually make on site/ads.

Examples:
- regulated health claims
- earnings claims
- "best" or "guaranteed" claims without support
- AI/data claims that create privacy exposure
- misleading pricing presentation

### 7. Legal risk snapshot

Summarise the biggest legal risks in plain language.

Recommended shape:
- risk
- why it matters
- severity
- what the user should do next

### 8. Required document starter list

List the practical documents or policies the business will likely need first.

Examples:
- privacy policy
- website terms
- service agreement
- contractor agreement
- refund/cancellation policy
- waiver
- employment agreement template

### 9. Legal action checklist

Produce concrete next actions the user can actually do.

This should drive the phase task list.

## What Phase 2 should not do

- do not pretend to replace a lawyer
- do not produce generic "seek legal advice" as the main output
- do not give fake certainty on licences that depend on local facts
- do not ignore country/state differences
- do not produce an essay on business law history
- do not drift into finance, insurance, or operational SOPs unless directly tied to legal setup

## Quality rules

Phase 2 passes only if:
- the legal path is clearly tied to the business model
- the output is location-aware
- risky claims and regulated activity are surfaced early
- registrations/licences are concrete enough to act on
- the advice feels like structured setup guidance, not blog content

Phase 2 fails if:
- it could have been written for any country
- it hides uncertainty instead of labeling it
- it gives only broad disclaimers and no actions
- it misses obvious permits/compliance issues for the business type
- it ignores brand/website claim risk

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "recommendedStructure": {
    "type": "LLC",
    "rationale": "Balances credibility, liability separation, and simple early operations for this location and business model.",
    "upgradeLater": "Move to a more complex structure only if multiple founders, investors, or tax planning needs appear."
  },
  "registrationPath": [
    {
      "step": "Register the business entity",
      "authority": "State filing office",
      "timing": "before trading",
      "reason": "Creates the legal operating entity"
    }
  ],
  "licensingChecks": [
    {
      "area": "Local occupancy approval",
      "status": "likely_required",
      "reason": "Physical venue and customer foot traffic usually trigger local approval checks",
      "followUp": "Confirm with city/council planning office"
    }
  ],
  "complianceObligations": [
    {
      "title": "Privacy policy",
      "whyItMatters": "Customer booking and contact capture create data handling obligations"
    }
  ],
  "brandAndTrademarkChecks": {
    "businessNameCheck": "Confirm name availability before locking signage or domain spend.",
    "trademarkCheck": "Run a first-pass trademark search in the target market.",
    "domainCheck": "Check primary domain and close variants."
  },
  "marketingClaimWarnings": [
    "Do not advertise unprovable performance guarantees",
    "Avoid claims that imply regulated certification unless held"
  ],
  "legalRisks": [
    {
      "risk": "Operating without local venue approval",
      "severity": "high",
      "why": "Can delay launch or trigger enforcement",
      "nextStep": "Check local planning and occupancy requirements before lease commitment"
    }
  ],
  "requiredDocuments": [
    "Privacy policy",
    "Website terms",
    "Customer waiver"
  ]
}
```

## Recommended task output for Phase 2

Phase 2 should create actionable tasks like:

1. confirm recommended legal structure
2. complete entity/business registration
3. check local licences and permits
4. verify tax registration requirements
5. review business name and trademark conflicts
6. prepare website legal documents
7. remove or rewrite risky website claims

### Task shape
Each task should include:
- what to do
- how to do it
- execution reference

### Required tasks
For MVP, these should usually be marked required:
- confirm legal structure
- identify registration authority and filing path
- review licence/permit applicability
- list required website/customer documents

## Suggested API expectations

### Generate Phase 2
`POST /api/projects/:projectId/phases/2/generate`

### Get Phase 2
`GET /api/projects/:projectId/phases/2`

### Expected response payload shape

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 2,
      "title": "Legal",
      "state": "ready",
      "summary": "Translate the business into a practical legal setup path for the user's location.",
      "content": {
        "recommendedStructure": {},
        "registrationPath": [],
        "licensingChecks": [],
        "complianceObligations": [],
        "brandAndTrademarkChecks": {},
        "marketingClaimWarnings": [],
        "legalRisks": [],
        "requiredDocuments": []
      },
      "tasks": []
    }
  }
}
```

## Validation rules

Before Phase 2 can be saved as `ready`, backend should confirm:
- project country exists
- recommended legal structure exists
- at least one registration step exists
- licensing/permit review exists, even if the outcome is low-risk
- at least one compliance obligation exists
- at least one legal risk or explicit low-risk statement exists
- required documents list exists

Additional validation:
- no generic placeholders like "consult a lawyer" as a standalone output
- authority names should be as specific as the available location data allows
- claim warnings must reflect the actual business model where relevant

## Agent routing recommendation

Default Phase 2 route should be:
- Bob
- Legal Advisor
- Blueprint Builder or Blueprint Architect for business-model grounding
- Brand/Marketing awareness pass for claim-review logic

Optional later:
- Finance Expert where tax registration complexity materially affects structure

Why:
- legal setup must stay tied to what the business actually sells
- brand claims can create legal exposure fast
- location sensitivity matters more here than generic legal language

## MVP success test

Phase 2 is successful when the user can leave with:
- a sensible starting legal structure
- a clear registration path
- a shortlist of likely permits or approvals to verify
- a list of legal documents to prepare
- a warning list for risky website/marketing claims
- a concrete next action list

If it only says "get legal advice", it failed.

## Bottom line

Phase 2 should give the user a practical legal setup map for their specific location and business type.

It should reduce avoidable legal mistakes early, feed directly into structured tasks, and stay commercially grounded instead of hiding behind generic disclaimers.
