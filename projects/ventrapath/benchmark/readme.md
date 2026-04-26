# VentraPath Benchmark Harness

This folder contains the test cases and result logs for Phase 0 blueprint latency/quality benchmarking.

## Goal

Prove that the default Phase 0 hot path can produce acceptable blueprint outputs within the product ceiling.

## Current mode

- Phase 0 hot path benchmarked end-to-end
- Now moving to a split-lane evaluation model:
  - **Blueprint lane** — can VentraPath turn already-legible business ideas into strong UI-fit blueprints?
  - **Messy lane** — can VentraPath honestly rescue fuzzy ideas or reject them cleanly for the right reason?
- Agents under test:
  - Blueprint Architect
  - Differentiation Strategist
  - Market Intelligence
  - Monetisation Architect
  - Bob synthesis

## Files

- `phase0-pilot-cases.yaml` — first benchmark case set
- `phase0-results.md` — result log
- `benchmark-lanes.md` — split-lane benchmark model and success criteria
- `blueprint-lane-cases.md` — company blueprint generation lane case set
- `messy-lane-cases.md` — messy idea rescue/rejection lane case set
