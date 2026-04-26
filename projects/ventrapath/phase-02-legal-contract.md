# VentraPath Phase 2 Contract — Legal

## Purpose

Define what Phase 2 (Legal) should actually generate and store.

Phase 2 should turn the blueprint and brand direction into a location-aware legal setup path the user can act on.

The real UI shape is now clearer from screenshots:
Phase 2 is a **6-step guided accordion workflow** with a visible country badge, a country-tailoring banner, helper/example panels, structured recommendation cards, outbound links, and completion checkboxes.

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

UI-observed step structure:
1. Choose Business Structure
2. Register Your Business
3. Get Your ABN (Australian Business Number)
4. Set Up Taxes
5. Business Bank Account
6. Basic Legal Protection

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

## Hard rule: the phase must show visible disclaimer language

The phase itself should visibly say that:
- this is information only
- it is not legal advice
- the user must verify local requirements themselves

Do not hide the disclaimer only in a system prompt or only in the blueprint phase.

## Hard rule: official and jurisdiction-relevant links matter

Where a filing path, registration step, or tax action is shown, the phase should link the user to the **correct official site or primary authority** when reasonably available.

Preferred link order:
1. official government / regulator / tax authority
2. official registration portal
3. clearly labeled trusted commercial provider only when the step is not a government filing requirement

Rules:
- never fabricate links
- never use another country's authority for convenience
- if an exact regional authority is unknown, label the follow-up honestly instead of bluffing
- commercial templates/providers must not be presented as if they are government requirements

## Outputs Phase 2 should generate

Phase 2 should generate **step-shaped outputs**, not just a legal summary blob.

### Step 1. Choose Business Structure
Backend should provide:
- recommended structure for the user's country
- 2 to 4 structure options
- why one is recommended
- pros and cons per option
- helper copy
- example copy

Observed UI interaction:
- option cards
- pros/cons split
- visible `Recommended` badge on the preferred option

### Step 2. Register Your Business
Backend should provide:
- required registration authority
- official registration portal link
- short reason the step matters
- helper copy
- example copy
- input for business name if the screen uses it

Observed UI interaction:
- business name input
- official registration portal card with outbound link

### Step 3. Get Your Tax/Business Number
Backend should provide:
- country-specific identifier type
- official application link
- why it is needed
- input config if the user already has the number
- helper copy
- example copy

Observed UI interaction in Australia:
- ABN input field
- country-specific label expansion inside the step title

### Step 4. Set Up Taxes
Backend should provide:
- tax type
- rate
- registration threshold
- official tax-registration link
- acknowledgement checklist items
- helper copy
- example copy

Observed UI interaction:
- tax summary row
- official registration link card
- checkbox confirmations

### Step 5. Business Bank Account
Backend should provide:
- jurisdiction-relevant bank/provider suggestions
- short rationale per option
- outbound links
- helper copy
- example copy

Observed UI interaction:
- recommendation cards with provider summaries and outbound links

### Step 6. Basic Legal Protection
Backend should provide:
- document starter list
- template generation/retrieval CTAs
- short purpose line per document
- checklist items for document completion
- helper copy
- example copy
- visible disclaimer copy

Observed UI interaction:
- Terms & Conditions / Privacy Policy / Service Agreement cards
- `Get Template` CTAs
- completion checkboxes

### Supporting legal layer behind the steps
The phase should still be grounded in deeper legal outputs such as:
- licensing / permit checks
- compliance obligations
- business name / trademark checks
- website and marketing claim warnings
- legal risk snapshot

But those should feed the step UI, not arrive as a detached legal memo.

## What Phase 2 should not do

- do not pretend to replace a lawyer
- do not produce generic "seek legal advice" as the main output
- do not give fake certainty on licences that depend on local facts
- do not ignore country/state differences
- do not produce an essay on business law history
- do not drift into finance, insurance, or operational SOPs unless directly tied to legal setup
- do not send users to the wrong country portal
- do not present commercial template sellers as official filing authorities
- do not bury the disclaimer outside the visible phase UI

## Quality rules

Phase 2 passes only if:
- the legal path is clearly tied to the business model
- the output is location-aware
- the phase visibly shows its jurisdiction basis and disclaimer language
- official or primary-authority links are included where the user needs to take action
- risky claims and regulated activity are surfaced early
- registrations/licences are concrete enough to act on
- the advice feels like structured setup guidance, not blog content
- the content fills the actual step UI rather than leaving the workflow hollow

Phase 2 fails if:
- it could have been written for any country
- it hides uncertainty instead of labeling it
- it gives only broad disclaimers and no actions
- it misses obvious permits/compliance issues for the business type
- it ignores brand/website claim risk
- it links to the wrong regulator or to a vague homepage instead of the actual filing path when that path is known
- it gives a legal-doc template CTA without clear disclaimer framing

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "jurisdiction": {
    "country": "Australia",
    "region": null,
    "tailoredBanner": "All guidance on this page is specific to Australia regulations and requirements.",
    "disclaimer": "Information only, not legal advice. Verify local requirements yourself before acting."
  },
  "progress": {
    "totalSteps": 6,
    "completedSteps": 0
  },
  "steps": [
    {
      "number": 1,
      "slug": "choose-business-structure",
      "title": "Choose Business Structure",
      "description": "Select the legal structure that best fits your business goals and risk tolerance.",
      "helper": {
        "howToDoThis": "Pick the simplest structure that still matches liability, credibility, and growth needs.",
        "example": "A solo local service may start as sole trader; a higher-risk or investor-facing business may suit a company."
      },
      "options": [
        {
          "name": "Sole Trader",
          "recommended": true,
          "summary": "Simplest structure. You and your business are one legal entity.",
          "pros": ["Easy to set up", "Minimal paperwork", "Full control"],
          "cons": ["Personal liability", "Harder to raise capital"]
        },
        {
          "name": "Company (Pty Ltd)",
          "recommended": false,
          "summary": "Separate legal entity from you. More protection but more obligations.",
          "pros": ["Limited liability", "Professional image", "Easier investment"],
          "cons": ["More compliance", "Higher setup cost", "Public reporting"]
        }
      ]
    },
    {
      "number": 2,
      "slug": "register-your-business",
      "title": "Register Your Business",
      "description": "Register your business name with the correct authority.",
      "helper": {
        "howToDoThis": "Use the official filing path for your country. Check name availability before spending on branding.",
        "example": "In Australia, business-name registration runs through ASIC."
      },
      "input": {
        "type": "text",
        "label": "Enter your business name"
      },
      "linkCard": {
        "label": "Register with Australian Securities and Investments Commission (ASIC)",
        "subtext": "Official registration portal",
        "url": "https://asic.gov.au/"
      }
    },
    {
      "number": 3,
      "slug": "tax-business-number",
      "title": "Get Your ABN (Australian Business Number)",
      "description": "Apply for your ABN — your unique business identifier.",
      "helper": {
        "howToDoThis": "Use the official ABN application path and keep the number on record once issued.",
        "example": "Australian sole traders and companies commonly need an ABN before invoicing and registrations."
      },
      "input": {
        "type": "text",
        "label": "Enter your ABN (Australian Business Number)"
      },
      "linkCard": {
        "label": "Apply for an ABN",
        "subtext": "Official registration portal",
        "url": "https://www.abr.gov.au/"
      }
    },
    {
      "number": 4,
      "slug": "set-up-taxes",
      "title": "Set Up Taxes",
      "description": "Register for GST if required based on your turnover.",
      "helper": {
        "howToDoThis": "Show the threshold, rate, and official filing path clearly. Do not assume the user knows the trigger.",
        "example": "In Australia, GST registration is generally required once annual turnover crosses the threshold."
      },
      "taxSummary": {
        "taxType": "GST (Goods and Services Tax)",
        "rate": "10%",
        "threshold": "$75,000 annual turnover"
      },
      "linkCard": {
        "label": "Register for GST (Goods and Services Tax)",
        "subtext": "Official tax registration",
        "url": "https://www.ato.gov.au/"
      },
      "checklist": [
        "I understand GST thresholds and requirements",
        "I've registered for GST (or confirmed I'm under threshold)"
      ]
    },
    {
      "number": 5,
      "slug": "business-bank-account",
      "title": "Business Bank Account",
      "description": "Open a dedicated business bank account to separate personal and business finances.",
      "helper": {
        "howToDoThis": "Recommend options that fit the user's market and business type, not random global brands.",
        "example": "Use a simple local business account first unless cross-border payments are core."
      },
      "providers": [
        {
          "name": "Up Bank",
          "reason": "Modern, no fees, great app",
          "url": "https://up.com.au/"
        },
        {
          "name": "Westpac",
          "reason": "Traditional, good business features",
          "url": "https://www.westpac.com.au/business-banking/"
        },
        {
          "name": "Airwallex",
          "reason": "Best for international payments",
          "url": "https://www.airwallex.com/au"
        }
      ]
    },
    {
      "number": 6,
      "slug": "basic-legal-protection",
      "title": "Basic Legal Protection",
      "description": "Set up essential legal documents to protect your business and customers.",
      "helper": {
        "howToDoThis": "Generate only the documents that match the business model and data flows.",
        "example": "A service business usually needs terms, privacy coverage, and a service agreement before scaling."
      },
      "disclaimer": "Templates are informational starting points only and must be reviewed for local legal suitability.",
      "documents": [
        {
          "name": "Terms & Conditions",
          "purpose": "Rules for using your service",
          "cta": "Get Template"
        },
        {
          "name": "Privacy Policy",
          "purpose": "How you handle customer data",
          "cta": "Get Template"
        },
        {
          "name": "Service Agreement",
          "purpose": "Contract for your services",
          "cta": "Get Template"
        }
      ],
      "checklist": [
        "Terms & Conditions created",
        "Privacy Policy created"
      ]
    }
  ],
  "legalLayer": {
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
    ]
  }
}
```

## Recommended task output for Phase 2

Phase 2 should create actionable tasks that map tightly to the 6 visible legal steps.

Recommended tasks:
1. confirm legal structure
2. complete business registration
3. apply for required business/tax identifier
4. confirm tax threshold and registration status
5. choose business banking path
6. create the first legal documents
7. review licences, permits, and risky claims in the supporting legal layer

### Task shape
Each task should include:
- what to do
- how to do it
- execution reference
- linked step number
- completion state

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
      "jurisdiction": {},
      "progress": {
        "totalSteps": 6,
        "completedSteps": 0
      },
      "content": {
        "steps": [],
        "legalLayer": {}
      },
      "tasks": []
    }
  }
}
```

## Validation rules

Before Phase 2 can be saved as `ready`, backend should confirm:
- project country exists
- visible disclaimer exists
- jurisdiction banner text exists
- step 1 structure options exist
- step 2 registration authority/link exists
- step 3 identifier logic exists when the country requires it
- step 4 tax summary/link exists where tax registration is relevant
- step 6 document starter list exists
- licensing/permit review exists in the supporting legal layer, even if the outcome is low-risk
- at least one compliance obligation exists
- at least one legal risk or explicit low-risk statement exists

Additional validation:
- no generic placeholders like "consult a lawyer" as a standalone output
- authority names should be as specific as the available location data allows
- outbound links should be validated as non-empty and jurisdiction-appropriate before render
- claim warnings must reflect the actual business model where relevant
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
- the correct registration and tax pathways for their country
- trustworthy links to the right websites
- a shortlist of likely permits or approvals to verify
- a list of legal documents to prepare
- warning flags for risky website/marketing claims
- clear disclaimer language that sets the boundary without making the phase useless
- a concrete next action list

If it only says "get legal advice", it failed.

## Bottom line

Phase 2 should give the user a practical legal setup map for their specific location and business type.

It should reduce avoidable legal mistakes early, feed directly into the 6-step UI, connect the user to the correct official pathways where possible, and stay commercially grounded instead of hiding behind generic disclaimers.
