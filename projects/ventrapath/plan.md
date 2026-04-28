# VentraPath Plan

## Current objective

Build VentraPath through a repo-first loop where real frontend files inform a maintained backend contract, and backend work is verified locally before push.

## Immediate milestones

1. Stabilise repo structure and docs
2. Create and maintain `specs/backend-spec.md`
3. Align frontend expectations with backend contract
4. Implement backend slices against the spec
5. Test locally and close mismatches
6. Prepare clean checkpoints and pushes

## Working rules

- Prefer explicit specs over inferred behaviour.
- Keep build steps recoverable.
- Keep docs close to the code they explain.
- Feed discoveries from local testing back into the spec.
- Do not confuse scaffold completion with product completion.

## Done when

- repo layout is stable
- backend contract exists and is maintained
- core backend flows are implemented against the contract
- local validation is part of the normal loop
