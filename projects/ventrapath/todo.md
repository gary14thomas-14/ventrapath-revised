# VentraPath Todo

## Now

- [x] Reconstruct what VentraPath does
- [x] Wait for Gaz's go-ahead before starting design/build work
- [x] Define the first-pass agent roster
- [x] Write prompts / boundaries / handoff rules
- [x] Design the latency benchmark for sub-2-minute blueprint generation
- [x] Decide which agents stay in the default Phase 0 hot path
- [x] Convert the agent contracts into executable prompts/config
- [ ] Finish MVP quality on the guided phases flow from Phase 3 onward.
- [ ] Clean remaining phase-route drift and stale links so the phase ladder feels coherent.
- [ ] Verify the real frontend phase experience end-to-end against the backend phase generator, not just backend smoke.
- [x] Smoke-test phase step persistence against a fresh backend-backed project across reload/navigation for phases 3-9.
- [ ] Run the latency benchmark before calling the team production-ready.
- [ ] Commit a checkpoint after the first stable design.
- [ ] Split benchmarking into blueprint-generation lane vs messy rescue/rejection lane.
- [ ] Define lane-specific pass criteria and scorecards.
- [ ] Run a clean reround for both lanes and compare separately.
- [ ] Reflect the unique twist explicitly in the first company-description section of the Phase 0 frontend-derived schema and backend output.
- [x] Clean up duplicate legacy phase routes (`/phase4/operations`, `/phase9/launch`) and any remaining phase-to-route drift now that phase 3-9 content is rendering properly.

## Later

- [ ] Design and implement the hard paywall transition immediately after blueprint view: user sees blueprint, clicks Next, loads into next-steps momentum, then hits the paywall before entering guided phases.
- [ ] Decide where each agent should run
- [ ] Define automation and escalation paths
- [ ] Add tests/checklists for risky operations
