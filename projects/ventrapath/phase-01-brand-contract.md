# VentraPath Phase 1 Contract — Brand

## Purpose

Define what Phase 1 (Brand) should actually generate and store.

Phase 1 should move the user from a finished blueprint into a usable business identity.

It should not be fluffy brand theory.
It should produce practical brand decisions the user can act on.

## Phase goal

Turn the approved blueprint into a clear external identity:
- what the business is called
- how it presents itself
- what promise it makes
- how it sounds
- what core messaging the rest of the build should inherit

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

### 1. Brand direction
Short statement describing the brand posture.

Example shape:
- premium operational tool
- trusted family coordination brand
- premium immersive entertainment brand
- practical B2B control-layer brand

### 2. Name options
Generate a short list of usable names.

Recommended output:
- 3 strong brand name options
- 1 recommended option
- short rationale for each

### 3. Tagline / one-liner
A short, sharp line that makes the business legible fast.

### 4. Core promise
What the customer gets from the business in plain language.

### 5. Brand voice
Short practical voice settings.

Example output:
- sharp
- premium
- calm
- playful
- direct
- expert

### 6. Messaging pillars
3 to 5 core angles the website and marketing should reuse.

### 7. Homepage hero starter
A usable first-pass homepage hero block.

Recommended structure:
- headline
- subheadline
- primary CTA

### 8. Visual direction starter
Not full design system.
Just enough direction for UI/design work.

Recommended structure:
- visual mood
- design cues
- what to avoid

### 9. Brand risks
Call out brand traps.

Examples:
- sounds generic
- sounds too playful for the category
- twist is not visible enough
- feels too cheap for premium pricing

## What Phase 1 should not do

- do not build a full logo system
- do not generate a full design file
- do not drift into marketing execution plans
- do not rewrite the whole business model
- do not lose the twist

## Quality rules

Phase 1 passes only if:
- the twist still shows up clearly
- the name and messaging fit the business model
- the tone matches the pricing level
- the output feels usable in the UI
- the result is specific, not agency fluff

Phase 1 fails if:
- names are generic and forgettable
- messaging sounds like startup wallpaper
- the brand voice contradicts the business
- the premium edge disappears
- output becomes aesthetic nonsense with no commercial link

## Recommended data shape for `phase_instances.generated_content_json`

```json
{
  "brandDirection": "Premium adaptive adventure brand",
  "nameOptions": [
    {
      "name": "Neon Circuit",
      "rationale": "Feels competitive, modern, and replayable."
    }
  ],
  "recommendedName": {
    "name": "Neon Circuit",
    "rationale": "Best fit for premium immersive racing."
  },
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
  "visualDirection": {
    "mood": "cinematic, premium, high-energy",
    "avoid": ["cheap cyberpunk clichés", "generic arcade look"]
  },
  "brandRisks": [
    "AI edge may sound gimmicky if the experience proof is weak"
  ]
}
```

## Recommended task output for Phase 1

Phase 1 should create actionable tasks like:

1. choose final brand direction
2. choose final name
3. lock homepage hero message
4. approve brand voice
5. choose initial visual direction

### Task shape
Each task should include:
- what to do
- how to do it
- execution reference

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
      "content": {
        "brandDirection": "...",
        "nameOptions": [],
        "recommendedName": {},
        "tagline": "...",
        "corePromise": "...",
        "brandVoice": [],
        "messagingPillars": [],
        "homepageHero": {},
        "visualDirection": {},
        "brandRisks": []
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
- a homepage-ready one-liner
- a clear voice
- a clear promise
- a clear next action

If it only produces pretty brand mush, it failed.

## Bottom line

Phase 1 should turn the blueprint into an identity the rest of VentraPath can build on.

It should feel commercially sharp, twist-consistent, and immediately usable — not like a branding workshop trapped in a thesaurus.
