# VentraPath Model Strategy

## Goal

Use premium models only where VentraPath genuinely benefits from stronger judgment, synthesis, or contradiction handling.
Use cheaper models for structured drafting, extraction, and mechanical transformation so blueprint generation stays commercially sane.

## Recommended OpenAI tiering

### Tier A — premium reasoning/editorial
**Use:** `openai/gpt-5.4`

Use for:
- Bob final synthesis
- contradiction resolution
- routing decisions when task ambiguity is high
- final user-facing blueprint assembly
- difficult cross-section reconciliation
- edge-case business judgment

Why:
- best fit for taste, strategic judgment, and final-output quality
- should be used sparingly because it is the expensive brain

### Tier B — capable specialist default
**Use:** `openai/gpt-4.1`

Use for:
- first-pass specialist drafting
- market, monetisation, legal, and execution section generation
- structured reasoning with decent nuance
- phase module drafting where correctness matters more than literary polish

Why:
- strong enough for most specialist work
- cheaper than premium orchestration
- good default middle lane for production use

### Tier C — cheap utility / compression / transforms
**Use:** `openai/gpt-4.1-mini`

Use for:
- formatting
- summarisation
- extraction
- checklist compression
- schema filling
- helper text rewrites
- converting verbose specialist output into bounded UI-ready structures

Why:
- good value for predictable, bounded tasks
- should handle the bulk of mechanical work

## Recommended assignment by agent

| Agent | Recommended model | Why |
|---|---|---|
| Bob | `openai/gpt-5.4` | Final authority, synthesis, ambiguity handling, twist preservation, contradiction resolution |
| Blueprint Architect | `openai/gpt-4.1` | Strong structured business drafting without needing top-tier model every run |
| Differentiation Strategist | `openai/gpt-5.4` for hard cases, otherwise `openai/gpt-4.1` | Twist quality matters a lot, but not every pass needs the most expensive model |
| Market Intelligence | `openai/gpt-4.1` | Good balance for audience/market/competitor analysis |
| Monetisation Architect | `openai/gpt-4.1` | Pricing and revenue design need competence, not always premium synthesis |
| Legal & Compliance | `openai/gpt-4.1` | Better caution and nuance than mini for jurisdiction-aware issue spotting |
| Execution Planner | `openai/gpt-4.1-mini` | Usually structured sequencing/checklist work, low need for premium reasoning |

## Recommended operating policy

### Blueprint hot path
Default:
- Bob → `openai/gpt-5.4`
- Blueprint Architect → `openai/gpt-4.1`
- Differentiation Strategist → `openai/gpt-4.1`
- Market Intelligence → `openai/gpt-4.1`
- Monetisation Architect → `openai/gpt-4.1`

Escalate only when needed:
- bump Differentiation Strategist to `openai/gpt-5.4` when the twist is weak, generic, or strategically central
- let Bob do the premium final merge instead of making every specialist premium

### Secondary path
- Legal & Compliance → `openai/gpt-4.1`
- Execution Planner → `openai/gpt-4.1-mini`

### Mechanical sub-tasks
Use `openai/gpt-4.1-mini` for:
- converting specialist output into step cards
- helper/example panel drafting
- checklist normalization
- compact summaries for UI
- extracting fields from screenshots/spec notes

## Practical rule

If the task needs **taste, originality, judgment, or conflict resolution**, use the stronger model.
If the task needs **structure, extraction, formatting, or bounded drafting**, use the cheaper one.

## Current recommendation for VentraPath

- Keep exactly one premium model in the loop by default: **Bob**
- Make `gpt-4.1` the standard specialist model
- Use `gpt-4.1-mini` for utility/transform work and low-risk planners
- Escalate only the Differentiation Strategist when the twist quality clearly needs it

This should cut waste materially without making the product feel dumber.