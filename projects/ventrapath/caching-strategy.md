# VentraPath Caching Strategy

## Goal

Cut repeated model spend without serving stale nonsense.
VentraPath should cache structured intermediate work aggressively, and cache final user-facing artifacts more carefully.

## What exists already

Current backend already has a primitive cache shape for Phase 0:
- `blueprint_versions` stores completed blueprint outputs
- `GET/POST /blueprint` already reuses the latest blueprint unless `regenerate=true`
- `agent_runs` exists and is the right place to track orchestration metadata, routing, inputs, and outputs

That means the system already has the bones for proper caching; it just is not doing granular agent/step caching yet.

## Recommended cache layers

### 1. Final artifact cache
Cache:
- final blueprint version per project
- final phase-step outputs per project/phase/step

Use when:
- the user reopens the same result
- nothing meaningful has changed upstream

Current status:
- blueprint-level reuse already exists

### 2. Specialist output cache
Cache per agent:
- structured output payload
- prompt/version hash
- model id
- input fingerprint
- dependency fingerprints

Examples:
- market section draft
- monetisation options
- legal checklist draft
- execution milestones
- differentiation options/twist candidates

This is the highest-value cache layer because it avoids rerunning expensive specialists when only assembly changes.

### 3. Transform/utility cache
Cache cheap but noisy repeat work:
- markdown to UI-card transforms
- helper/example panel rewrites
- section compression
- checklist normalization
- extraction from screenshots/spec notes

This is lower-risk and keeps the hot path snappy.

### 4. Research/reference cache
Cache external or slow-derived context with freshness rules:
- competitor snapshots
- pricing comparables
- country/jurisdiction notes
- provider/link lookup results

Important:
- these need TTLs or explicit source-version tags
- legal/reference cache must never look permanent when the source may drift

## What not to cache blindly

Do **not** blindly reuse:
- Bob final synthesis when upstream specialist inputs changed
- legal outputs without jurisdiction + source/version tagging
- outputs produced under a different model or prompt version
- anything derived from a user-edited project unless the edit fingerprint matches
- twist generation if the business framing changed materially

## Cache key design

Every cacheable result should have a deterministic key built from:
- `project_id`
- `phase_number`
- `step_id` or `section_id`
- `agent_id`
- `task_kind`
- `model`
- `prompt_version_hash`
- `normalized_input_hash`
- `jurisdiction_key`
- `dependency_hash`

### Normalized input hash should include
- raw idea or current section input
- country
- region
- currency
- hours per week
- relevant user constraints
- any locked business-form/buyer/payer decisions

### Dependency hash should include
- upstream section versions
- latest blueprint version
- referenced research snapshot versions
- routing mode when it changes task scope

## Invalidation rules

Invalidate cache when any of these change:
- prompt changed
- model changed
- user changed project inputs
- country/region changed
- upstream section changed
- pricing/reference snapshot expired
- legal source pack changed
- explicit regenerate requested

## Recommended storage model

## A. Keep final artifacts in existing tables
- continue using `blueprint_versions`
- later add `phase_step_outputs` or equivalent for guided phases

## B. Add granular cache table for agent outputs
Recommended table: `agent_output_cache`

Suggested fields:
- `id`
- `project_id`
- `phase_number`
- `step_key`
- `agent_id`
- `task_kind`
- `cache_key`
- `model`
- `prompt_version_hash`
- `normalized_input_hash`
- `dependency_hash`
- `status`
- `output_json`
- `source_meta_json`
- `expires_at`
- `created_at`
- `last_used_at`

Recommended indexes:
- unique on `cache_key`
- index on `project_id, phase_number`
- index on `agent_id, created_at`
- index on `expires_at`

## C. Use `agent_runs` as the audit trail, not the cache itself
`agent_runs` should record:
- what was attempted
- what routing happened
- whether a cache hit occurred
- what final outputs were accepted

It should not be the only cache store because lookup and invalidation get messy fast.

## Read/write flow

### Blueprint generation flow
1. Build normalized project fingerprint.
2. Check final blueprint reuse first.
3. If no final hit, route required specialists.
4. For each specialist:
   - compute cache key
   - check `agent_output_cache`
   - reuse hit if valid
   - otherwise run model and store result
5. Let Bob assemble final blueprint from specialist outputs.
6. Save final blueprint version.
7. Record an `agent_runs` row with cache-hit metadata.

### Guided phase step flow
1. Compute step fingerprint.
2. Check cached step output.
3. Reuse valid specialist outputs under that step.
4. Re-run only invalidated dependencies.
5. Save fresh step output and update phase progress.

## Model-aware caching rule

Cache keys must include the actual model.
A result from `gpt-4.1-mini` should not silently masquerade as a `gpt-5.4` result.

Practical exception:
- weaker-model outputs can be reused as inputs to stronger final synthesis
- but they should still be tagged honestly so the system knows what quality lane produced them

## Recommended rollout order

### Phase 1 — low-risk win
- keep existing final blueprint reuse
- add cache metadata to `agent_runs`
- design deterministic cache keys in orchestration code

### Phase 2 — biggest savings
- add `agent_output_cache`
- cache specialist structured outputs for Phase 0
- start with: market, monetisation, legal, execution

### Phase 3 — twist-aware support
- cache differentiation drafts too, but invalidate aggressively when business framing changes
- let Bob decide whether cached twist options are still strong enough

### Phase 4 — guided-phase caching
- add step-level caching for Phase 1+ flows
- rerun only changed steps or dependent summaries

### Phase 5 — reference freshness
- add TTL/source-versioned cache for pricing, legal links, competitor snapshots

## Practical recommendations for VentraPath now

1. **Do not stop at full-blueprint reuse**. That is nice, but the real savings come from specialist-level caching.
2. **Use Postgres for cache storage**, not JSON files. This is exactly the kind of state Postgres is for.
3. **Treat legal and reference caches as perishable**. They need TTLs or source-version tags.
4. **Cache cheap transforms too**, but only after specialist cache is in place.
5. **Let Bob remain the freshness gate** for final assembly when cached specialist outputs disagree or feel stale.

## Honest bottom line

VentraPath already has the start of caching, but only at the coarse final-blueprint level.
The next meaningful step is a proper Postgres-backed specialist output cache keyed by normalized inputs, prompt version, dependency hash, and model.
That is where the serious token savings will come from without making the product quietly dumb.