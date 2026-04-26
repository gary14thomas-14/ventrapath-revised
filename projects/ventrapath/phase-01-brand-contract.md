# VentraPath Phase 1 Contract — Brand

## Purpose

Define what Phase 1 (Brand) should actually generate and store.

Phase 1 should move the user from a finished blueprint into a usable business identity.

The real UI shape is now clearer from screenshots:
Phase 1 is not just one content blob.
It is a **5-step guided accordion workflow** with inline inputs, helper panels, examples, and completion tracking.

It should not be fluffy brand theory.
It should produce practical brand decisions the user can act on inside the actual screen.

## Phase goal

Turn the approved blueprint into a clear external identity:
- what the business is called
- how it presents itself
- what promise it makes
- how it sounds
- what core messaging the rest of the build should inherit

UI-observed step structure:
1. Business Name
2. Brand Positioning
3. Logo & Visual Identity
4. Domain & Email Setup
5. Social Handles

## Inputs required

Phase 1 should consume:
- approved Phase 0 blueprint
- project location
- selected currency/context where relevant
- user preferences if collected later

Minimum required source sections:
- Business
- Market
- Monetisation
- Website

## Outputs Phase 1 should generate

Phase 1 should generate **step-shaped outputs**, not just abstract brand fields.

### Step 1. Business Name
Backend should provide:
- 3 strong name options
- 1 recommended name
- short rationale for each
- `how to do this` helper copy
- `example` helper copy
- availability-check target data shape

Observed UI interaction:
- single business name input
- `Check Availability` CTA

### Step 2. Brand Positioning
Backend should provide:
- what the business does
- who it is for
- what makes it different
- helper copy
- example copy

Observed UI interaction:
- three text areas:
  - What does your business do?
  - Who is it for?
  - What makes it different?

### Step 3. Logo & Visual Identity
Backend should provide:
- visual direction starter
- logo direction prompt
- AI-logo prompt seed
- colour palette recommendation
- font recommendations
- helper copy
- example copy

Observed UI interaction:
- upload-logo card
- generate-with-AI card
- colour palette selections
- font style selections

### Step 4. Domain & Email Setup
Backend should provide:
- recommended domain options
- domain provider suggestions
- short reason for each provider
- email setup guidance
- helper copy
- example copy

Observed UI interaction:
- recommended provider cards with outbound links
- examples shown: Namecheap, Google Domains, Cloudflare

### Step 5. Social Handles
Backend should provide:
- recommended handle patterns
- platform-specific handle suggestions
- naming consistency guidance
- helper copy
- example copy

Observed UI interaction:
- platform inputs for Instagram, TikTok, Twitter/X, LinkedIn
- `Check All Handle Availability` CTA

### Supporting brand layer behind the steps
The step flow should still be grounded in deeper brand outputs such as:
- brand direction
- tagline / one-liner
- core promise
- brand voice
- messaging pillars
- homepage hero starter
- brand risks

But those should feed the step UI, not float separately as an essay.

## What Phase 1 should not do

- do not build a full logo system
- do not generate a full design file
- do not drift into marketing execution plans
- do not rewrite the whole business model
- do not lose the twist
- do not collapse the 5-step UI into one generic response blob
- do not return helper/example copy as an afterthought; the UI clearly expects it per step

## Quality rules

Phase 1 passes only if:
- the twist still shows up clearly
- the name and messaging fit the business model
- the tone matches the pricing level
- the output feels usable in the actual step UI
- every step has enough content to make the screen useful, not empty
- the result is specific, not agency fluff

Phase 1 fails if:
- names are generic and forgettable
- messaging sounds like startup wallpaper
- the brand voice contradicts the business
- the premium edge disappears
- output becomes aesthetic nonsense with no commercial link
- the backend returns abstract brand theory but leaves the UI controls empty or dumb

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "progress": {
    "totalSteps": 5,
    "completedSteps": 0
  },
  "steps": [
    {
      "number": 1,
      "slug": "business-name",
      "title": "Business Name",
      "description": "Choose a memorable, unique name that reflects your brand identity.",
      "helper": {
        "howToDoThis": "Use a name that makes the business legible fast and leaves room for the twist to show.",
        "example": "Neon Circuit works because it feels premium, kinetic, and replayable."
      },
      "input": {
        "type": "text",
        "label": "Enter your business name",
        "cta": "Check Availability"
      },
      "suggestions": {
        "nameOptions": [
          {
            "name": "Neon Circuit",
            "rationale": "Feels competitive, modern, and replayable."
          }
        ],
        "recommendedName": {
          "name": "Neon Circuit",
          "rationale": "Best fit for premium immersive racing."
        }
      }
    },
    {
      "number": 2,
      "slug": "brand-positioning",
      "title": "Brand Positioning",
      "description": "Define what your business does, who it serves, and what makes it different.",
      "helper": {
        "howToDoThis": "Keep each field sharp and commercially legible.",
        "example": "An AI-driven indoor racing venue for group events that adapts every race in real time."
      },
      "fields": [
        {
          "label": "What does your business do?",
          "key": "whatItDoes",
          "placeholder": "Describe your product or service..."
        },
        {
          "label": "Who is it for?",
          "key": "whoItsFor",
          "placeholder": "Describe your target audience..."
        },
        {
          "label": "What makes it different?",
          "key": "whatMakesItDifferent",
          "placeholder": "Your unique value proposition..."
        }
      ]
    },
    {
      "number": 3,
      "slug": "logo-visual-identity",
      "title": "Logo & Visual Identity",
      "description": "Create visual elements that represent your brand across all touchpoints.",
      "helper": {
        "howToDoThis": "Push the look toward the actual business mood, not default startup aesthetics.",
        "example": "Use deep electric blues, clean geometric forms, and premium modern typography."
      },
      "logoOptions": [
        { "type": "upload", "label": "Upload Logo" },
        { "type": "ai-generate", "label": "Generate with AI" }
      ],
      "colourPalette": {
        "primary": ["#6D6BFF", "#5A54F9", "#4638D8"],
        "accent": ["#34D3FF", "#1FBCE6", "#1798BF"],
        "success": ["#22C58B", "#0EA56E", "#0B8157"],
        "neutral": ["#F4F7FB", "#A8B2C7", "#1F2847"]
      },
      "fontOptions": [
        { "name": "Inter", "style": "Modern & Clean" },
        { "name": "Poppins", "style": "Modern & Clean" },
        { "name": "Space Grotesk", "style": "Modern & Clean" }
      ]
    },
    {
      "number": 4,
      "slug": "domain-email-setup",
      "title": "Domain & Email Setup",
      "description": "Secure your online presence with a professional domain and email.",
      "helper": {
        "howToDoThis": "Pick a domain provider that fits speed, simplicity, and future DNS control needs.",
        "example": "Use Cloudflare for cheap domain pricing and simple DNS management."
      },
      "providers": [
        {
          "name": "Namecheap",
          "reason": "Great value, includes free email forwarding"
        },
        {
          "name": "Google Domains",
          "reason": "Simple setup, integrates with Google Workspace"
        },
        {
          "name": "Cloudflare",
          "reason": "Best pricing, excellent security"
        }
      ]
    },
    {
      "number": 5,
      "slug": "social-handles",
      "title": "Social Handles",
      "description": "Claim consistent usernames across all major social platforms.",
      "helper": {
        "howToDoThis": "Keep handle structure consistent unless a platform forces variation.",
        "example": "Use the same short root handle across Instagram, TikTok, X, and LinkedIn when possible."
      },
      "platforms": [
        { "platform": "Instagram", "placeholder": "@yourhandle" },
        { "platform": "TikTok", "placeholder": "@yourhandle" },
        { "platform": "Twitter / X", "placeholder": "@yourhandle" },
        { "platform": "LinkedIn", "placeholder": "company/yourcompany" }
      ],
      "cta": "Check All Handle Availability"
    }
  ],
  "brandLayer": {
    "brandDirection": "Premium adaptive adventure brand",
    "tagline": "Sydney's adaptive AI escape adventure.",
    "corePromise": "A replayable immersive experience that changes with every team.",
    "brandVoice": ["premium", "sharp", "playful", "confident"],
    "messagingPillars": [
      "adaptive gameplay",
      "group spectacle",
      "replayable missions"
    ],
    "homepageHero": {
      "headline": "Escape rooms that fight back.",
      "subheadline": "AI-driven adventures that change in real time.",
      "cta": "Book a Mission"
    },
    "brandRisks": [
      "AI edge may sound gimmicky if the experience proof is weak"
    ]
  }
}
```

## Recommended task output for Phase 1

The UI already behaves like step completion, so tasks should map tightly to the 5 visible steps.

Recommended tasks:
1. choose final business name
2. lock brand positioning copy
3. choose logo/visual direction
4. secure domain + email path
5. lock social handle set

### Task shape
Each task should include:
- what to do
- how to do it
- execution reference
- linked step number
- completion state

## Suggested API expectations

### Generate Phase 1
`POST /api/projects/:projectId/phases/1/generate`

### Get Phase 1
`GET /api/projects/:projectId/phases/1`

### Expected response payload shape

```json
{
  "ok": true,
  "data": {
    "phase": {
      "number": 1,
      "title": "Brand",
      "state": "ready",
      "summary": "Turn the blueprint into a usable brand identity.",
      "progress": {
        "totalSteps": 5,
        "completedSteps": 0
      },
      "content": {
        "steps": [],
        "brandLayer": {}
      },
      "tasks": []
    }
  }
}
```

## Agent routing recommendation

Default Phase 1 route should be:
- Bob
- Blueprint Architect
- Differentiation Strategist
- Market Intelligence (light)

Optional later:
- Marketing Strategist

Why:
- Brand must stay anchored to the business and twist
- Market helps stop brand drift
- Full marketing depth is not necessary for first-pass brand generation

## MVP success test

Phase 1 is successful when the user can leave with:
- a name direction
- clear positioning copy
- a usable visual direction
- a domain/email path
- consistent social handles
- helper/example content that actually makes the UI usable

If it only produces pretty brand mush, or if the accordion steps look empty, it failed.

## Bottom line

Phase 1 should turn the blueprint into an identity the rest of VentraPath can build on.

It should feel commercially sharp, twist-consistent, and immediately usable inside the 5-step Brand screen — not like a branding workshop trapped in a thesaurus.
