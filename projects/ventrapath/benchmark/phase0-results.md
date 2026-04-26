# Phase 0 Benchmark Results

## Pilot batch

### VP-P0-001 — Australia — local dog-care membership marketplace

#### First run

- Case ID: VP-P0-001
- Country: Australia
- Total runtime: Failed before final synthesis; one specialist path degraded badly
- Specialist runtimes:
  - Blueprint Architect: 37s
  - Differentiation Strategist: 37s
  - Monetisation Architect: 14s
  - Market Intelligence: 84s and failed
- Bob synthesis runtime: Not scored as a final benchmark result because the Market pass failed
- Twist quality: Strong
- Overall quality: Partial pass on idea quality, fail on pipeline reliability
- Pass/fail: Fail
- Notes:
  - Business shape was coherent.
  - Differentiation improved the idea materially by shifting it from generic marketplace logic to continuity-first pet-care membership.
  - Monetisation aligned with the twist but exposed subscription-friction risk.
  - Market Intelligence failed the Phase 0 latency/quality standard by drifting into live external fetch behavior and returning no usable market output.
  - Prompt was tightened after the run to force fast hypothesis-based market reasoning in default Phase 0 mode.

#### Rerun after prompt fix

- Case ID: VP-P0-001-RERUN
- Country: Australia
- Total runtime: 57s specialist ceiling before Bob synthesis
- Specialist runtimes:
  - Blueprint Architect: 22s
  - Differentiation Strategist: 37s
  - Market Intelligence: 28s
  - Monetisation Architect: 57s
- Bob synthesis runtime: Not yet separately timed; qualitative synthesis indicates a clean usable Phase 0 result
- Twist quality: Strong
- Overall quality: Good
- Pass/fail: Pass
- Notes:
  - Business, differentiation, market, and monetisation all aligned around a continuity-first dog-care membership.
  - Best twist candidate was the Dog Routine Guarantee: consistent care delivery through stored dog-specific routines and structured updates.
  - Strongest audience signal was busy metro and inner-suburban Australian dog owners with repeat care needs.
  - Biggest commercial risk remains subscription friction if the membership promise is not clearly better than a normal marketplace.
  - Prompt fix successfully stopped the Market agent from wasting time on weak live-fetch behavior.

### VP-P0-002 — United Kingdom — WhatsApp-first job desk for trades

- Case ID: VP-P0-002
- Country: United Kingdom
- Total runtime: 50s specialist ceiling before Bob synthesis
- Specialist runtimes:
  - Blueprint Architect: 25s
  - Differentiation Strategist: 50s
  - Market Intelligence: 50s
  - Monetisation Architect: 37s
- Bob synthesis runtime: Not yet separately timed; qualitative synthesis indicates a clean usable Phase 0 result
- Twist quality: Strong
- Overall quality: Strong
- Pass/fail: Pass
- Notes:
  - The strongest positioning was a UK trades WhatsApp job desk, not generic SMB automation.
  - Business, market, and monetisation aligned around booked-job ROI for small trade firms that already live in chat.
  - Main strategic risk is channel fit: some trades are strongly WhatsApp-native and some are not.
  - Main product risk is boundary creep between lightweight workflow software and support-heavy managed service.
  - This case currently looks commercially stronger than the dog-care marketplace case.

### VP-P0-003 — Canada — burnout recovery membership with AI + community

- Case ID: VP-P0-003
- Country: Canada
- Total runtime: 38s specialist ceiling before Bob synthesis
- Specialist runtimes:
  - Blueprint Architect: 26s
  - Differentiation Strategist: 36s
  - Market Intelligence: 31s
  - Monetisation Architect: 38s
- Bob synthesis runtime: Not yet separately timed; qualitative synthesis indicates a usable but Bob-dependent Phase 0 result
- Twist quality: Medium-strong after narrowing
- Overall quality: Conditional pass
- Pass/fail: Pass with intervention required
- Notes:
  - The raw idea was vague, but the system correctly forced it into a membership-first service shape instead of defaulting to a vague app.
  - The strongest twist was matching members by burnout type, work context, and recovery stage.
  - Biggest risks are bland wellness positioning, weak differentiation, and sloppy therapy/compliance boundaries.
  - This case showed the system can recover weak input, but only when Bob is willing to narrow the audience and reject generic wellness language.

## Pilot verdict so far

- The default Phase 0 hot path looks viable after the Market prompt fix.
- Best commercial result so far: VP-P0-002.
- Hardest reasoning test so far: VP-P0-003.
- Biggest discovered failure mode: specialists drifting into unnecessary external lookup during fast Phase 0 runs.
- Current status: promising, but still not production-safe.
- Why not production-safe yet:
  - Bob synthesis timing is not yet separately benchmarked.
  - The pilot set is only 3 cases, not the full 30-case matrix.
  - Legal and Execution inserts still need timing behavior validated.

### Result template

- Case ID:
- Country:
- Total runtime:
- Specialist runtimes:
- Bob synthesis runtime:
- Twist quality:
- Overall quality:
- Pass/fail:
- Notes:
