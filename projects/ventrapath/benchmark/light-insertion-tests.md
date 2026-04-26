# Light Insertion Tests

These tests validate whether Legal & Compliance and Execution Planner can join the Phase 0 path in light mode without blowing the latency budget or producing bloated filler.

## Test strategy

- Use one commercially strong case: `VP-P0-002`
- Use one ambiguity/safety-heavy case: `VP-P0-003`
- Run Legal light and Execution light separately first
- Judge both runtime and usefulness

## Success conditions

- response is concise and bounded
- no fake certainty
- no restating the whole business
- adds useful signal in under ~20-30s per light insert

## Test set

### LI-LEGAL-002
- Base case: `VP-P0-002`
- Goal: check whether Legal can flag UK data/privacy/platform issues without bloating

### LI-EXEC-002
- Base case: `VP-P0-002`
- Goal: check whether Execution can produce a milestone-only launch path for the UK trades job-desk concept

### LI-LEGAL-003
- Base case: `VP-P0-003`
- Goal: check whether Legal can keep boundaries clear around burnout support vs therapy and privacy/moderation risk

### LI-EXEC-003
- Base case: `VP-P0-003`
- Goal: check whether Execution can propose a narrow pilot-first launch path instead of app-first sprawl

