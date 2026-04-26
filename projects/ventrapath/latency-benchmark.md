# VentraPath Blueprint Latency Benchmark

## Non-negotiable product rule

Blueprint generation must complete in **120 seconds or less**.

This is a hard ceiling, not an aspiration.

## Practical target

- **Average target:** 90 seconds or less
- **P95 target:** 120 seconds or less
- **Worst-case target:** 135 seconds or less only in pre-production testing, never as an accepted production norm

## Production pass/fail rule

The blueprint pipeline is only acceptable for production if:

- average <= 90s
- p95 <= 120s
- unique twist quality stays acceptable
- no critical section is routinely dropped to hit the target

If p95 exceeds 120s, the design fails and must be simplified.

## Default Phase 0 hot path

Run by default:
- Bob
- Blueprint Architect
- Differentiation Strategist
- Market Intelligence
- Monetisation Architect

Run as constrained / light modules only when needed:
- Legal & Compliance
- Execution Planner

## Latency budget by role

### Budget target
- Blueprint Architect: 15s
- Differentiation Strategist: 12s
- Market Intelligence: 18s
- Monetisation Architect: 15s
- Legal & Compliance (light): 10s
- Execution Planner (light): 10s
- Bob synthesis/finalization: 20s
- Slack / orchestration overhead: 10s

This gives a workable budget when core agents run in parallel and light modules stay constrained.

## Test matrix

Run at least 30 blueprint tests:

- 10 simple ideas
- 10 medium ideas
- 10 vague / messy ideas

Vary:
- country/region
- industry
- complexity
- input length
- business model type

## Metrics to capture

For every run, record:
- total runtime
- per-agent runtime
- Bob synthesis runtime
- timeout / retry count
- section completeness
- twist quality score
- overall blueprint quality score

## Quality gates

A fast blueprint still fails if:
- the twist is weak or generic
- monetisation is incoherent
- market logic is vague
- legal section pretends certainty it does not have
- Bob ships contradictory sections

## Degradation rules under latency pressure

If runtime risk is detected:
1. keep Differentiation Strategist in the path
2. keep Business / Market / Monetisation intact
3. compress Legal into a bounded high-signal summary
4. compress Execution into milestone-only mode
5. never remove the unique twist requirement

## Benchmark decision tree

### If tests pass comfortably
- keep the 5-agent default hot path
- allow light legal/execution inserts where needed

### If tests are close to the ceiling
- merge Market + Monetisation for Phase 0 only
- make Legal and Execution post-blueprint enrichments
- tighten Bob synthesis contract

### If tests fail badly
- redesign the Phase 0 pipeline before productizing
- do not just accept slower blueprints

## Conclusion

The team can be built now, but it is not considered production-safe until this benchmark is run and passed.
