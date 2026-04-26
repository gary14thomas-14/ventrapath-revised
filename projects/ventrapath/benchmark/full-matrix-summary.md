# VentraPath 30-Case Matrix Summary

## Coverage

- Total cases run: 30
- Batches: 5
- Method: default Phase 0 hot path only

## Outcome totals

- Clean passes: 11
- Conditional passes: 9
- Fails: 10

## Rates

- Clean pass rate: 36.7%
- Pass + conditional pass rate: 66.7%
- Fail rate: 33.3%

## What passed most reliably

The system was strongest on:

- SMB workflow tools
- operational service businesses
- admin/revenue-recovery products
- products with a clear recurring job and a ledger/control-layer twist

Examples:

- UK trades WhatsApp job desk
- creator back-office operations desk
- Shopify exception/action queue
- clinic no-show recovery flow
- tutoring-centre WhatsApp admissions/renewal flow
- small-agency WhatsApp hiring workflow
- apprenticeship certification-readiness tracker

## What failed most reliably

The system was weakest on:

- vague wellness / support / community ideas
- soft concierge concepts
- family or caregiver ideas with unclear buyer and product form
- ideas that stayed undecided between software, service, membership, and marketplace

Examples:

- overwhelmed mothers AI/community support
- manager burnout support
- creator burnout/business-side support
- elder-support AI/community concept
- jobs/community for youth employment
- family travel planning concierge/software hybrid

## Recurring failure modes

1. No hard commercial wedge
   - the idea sounds emotionally resonant but commercially mushy

2. Unclear payer / user split
   - especially in education, family support, and youth-focused concepts

3. Software vs service ambiguity
   - the business never commits to a delivery model

4. Generic category language
   - “AI + community + support” or “not another CRM” is not a business

5. Trust-heavy boundary risk
   - health, eldercare, family, and wellness ideas fail when non-clinical / non-legal boundaries are not brutally clear

## Recurring success pattern

The engine performs best when it can force the concept into:

- one obvious buyer
- one recurring operational pain
- one clear workflow/ledger/control-layer twist
- one believable monetisation path

## Production-readiness verdict

Current verdict: **not production-safe yet**

Why:

- A 36.7% clean pass rate is not strong enough for open-ended user input.
- The system is good at sharpening already-legible workflow ideas, but still inconsistent on fuzzy consumer/support concepts.
- Conditional passes are often only rescued by heavy Bob narrowing, which means the system still depends too much on strong orchestration pressure for weaker inputs.

## More encouraging truth

The architecture is still promising because:

- the hot path works well for the right problem shapes
- Bob preserves twists and rejects fluff properly
- Legal/Execution light inserts are usable when triggered selectively
- failure is often correct rather than random; the system is saying “no” for real commercial reasons

## Recommendation

Before calling this production-ready, VentraPath should add stronger anti-generic narrowing at the start of Phase 0.

Best next improvements:

1. Add a stronger early-stage business-form forcing step
   - force software vs service vs membership vs marketplace selection earlier

2. Add a payer-clarity gate
   - if buyer and user are unclear, fail faster or force a narrowed hypothesis

3. Add a “generic support/community” kill check
   - reject vague wellness/community/helping-people language earlier

4. Keep Legal selective, not default-on
   - especially for routine workflow cases where it adds little signal

5. Consider a separate messy-idea recovery mode
   - distinct from the default Phase 0 hot path

## Bottom line

VentraPath is becoming a strong system for workflow-heavy business ideas.

It is **not yet strong enough across messy consumer/support inputs** to be called safely production-ready without further narrowing logic.

