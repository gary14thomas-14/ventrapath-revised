# VentraPath MVP Phase Progression Rules

## Purpose

Define how projects, phases, and tasks move through state in the MVP.

This is the operational rulebook behind the phase sidebar, task completion logic, and generation endpoints.

It should keep the product structured without turning it into a rigid blocker machine.

## Core product rules

- phases exist in a fixed order from 0 to 9
- users can open earlier phases at any time
- users should not enter a later phase until the previous phase has been generated
- incomplete tasks should not hard-block navigation
- generation state and completion state are different things
- regeneration should refresh guidance without wiping the user's progress history
- location remains mandatory across every phase

## Fixed phase order

0. Blueprint
1. Brand
2. Legal
3. Finance
4. Protection
5. Infrastructure
6. Marketing
7. Operations
8. Sales
9. Launch & Scale

## Two different state layers

VentraPath needs two separate state models.

### 1. Project-level state

Used for the overall project shell.

Recommended MVP values:
- `draft`
- `blueprint_generating`
- `blueprint_ready`
- `in_progress`
- `archived`

### 2. Phase-level state

Used per phase in `phase_instances`.

Recommended MVP values:
- `locked`
- `available`
- `generating`
- `ready`
- `complete`

Important:
- `ready` means the phase content exists and can be worked through
- `complete` means the user has finished the phase enough to move on cleanly
- a phase can be `ready` with many incomplete tasks

## Project creation rules

When a project is first created:
- project `status = draft`
- `current_phase_number = 0`
- no Phase 1-9 content is generated yet
- phase sidebar can be materialised like this:
  - Phase 0 Blueprint = `available`
  - Phase 1-9 = `locked`

If the implementation does not create all phase rows up front, the API should still return the same logical states.

## Blueprint rules (Phase 0)

### Before generation
- Phase 0 state: `available`
- Project status: `draft`

### While blueprint generation is running
- Phase 0 state remains logically active
- Project status becomes `blueprint_generating`
- new phase generations must be rejected

### When blueprint generation succeeds
- Project status becomes `blueprint_ready`
- `latest_blueprint_version_number` is updated
- Phase 0 is treated as `complete`
- Phase 1 becomes `available`
- Phase 2-9 remain `locked`
- `current_phase_number` stays `0` until the user actually opens or generates Phase 1

### When blueprint generation fails
- Project status returns to `draft`
- no later phase unlocks
- failed run is stored in `agent_runs`

## Phase unlock rules

For MVP, later phases unlock one step at a time.

### Unlock condition
Phase `N + 1` becomes `available` only when Phase `N` has reached `ready` or `complete`.

That means:
- Brand must be generated before Legal unlocks
- Legal must be generated before Finance unlocks
- and so on

This keeps the journey structured while avoiding task-level hard locks.

## Phase generation rules

A phase can be generated only when:
- the project has a ready blueprint
- the requested phase is currently `available` or `ready`
- the previous phase is `ready` or `complete` unless the requested phase is 1
- required location fields are present

### `POST /api/projects/:projectId/phases/:phaseNumber/generate`

#### Allowed
- generate a phase for the first time when state is `available`
- regenerate a phase when state is `ready` or `complete`

#### Rejected
- generating a `locked` phase
- generating Phase 2+ when the previous phase has never been generated
- generating any phase while another run for the same project/phase is already `queued` or `running`

Recommended error codes:
- `PHASE_LOCKED`
- `PHASE_PREREQUISITE_MISSING`
- `PHASE_ALREADY_GENERATING`
- `PROJECT_LOCATION_REQUIRED`

## Phase state transitions

### Normal path
`locked -> available -> generating -> ready -> complete`

### Alternate path with regeneration
`ready -> generating -> ready`
`complete -> generating -> complete`

Important regeneration rule:
- if a completed phase is regenerated successfully, keep it `complete` unless the new output invalidates required tasks on purpose
- MVP default should be to preserve `complete`

## Current phase number rules

`projects.current_phase_number` should represent the furthest phase the user has actively entered, not the highest unlocked phase.

Update it when:
- the user opens a newly unlocked phase for the first time, or
- a phase generation succeeds for a later phase

Examples:
- blueprint finished, Brand unlocked, user has not entered Brand yet -> `current_phase_number = 0`
- Brand generated -> `current_phase_number = 1`
- Legal generated later -> `current_phase_number = 2`

This keeps the dashboard honest about where the user actually is.

## Task rules

Tasks are guidance and execution tracking, not hard gates.

### Task status values
- `open`
- `in_progress`
- `complete`
- `skipped`

### Task completion rules
- users can mark tasks complete in any order within a phase
- users can reopen completed tasks
- skipped tasks remain visible
- task completion updates phase progress metrics but does not by itself unlock the next phase

## Phase completion rules

A phase should move from `ready` to `complete` when either:
- all required tasks are `complete` or `skipped`, or
- the user explicitly marks the phase complete later if that control is added

For MVP, use the first rule.

### Required-task rule
If a phase has required tasks:
- every required task must be `complete` or `skipped`
- optional tasks can stay open

### If a phase has no required tasks
- leave it at `ready` until the user completes at least one meaningful action or a manual phase-complete action exists
- in practice, phase contracts should include required tasks so completion is deterministic

## Unlock-on-ready vs unlock-on-complete

MVP recommendation:
- unlock the next phase when the current phase becomes `ready`
- mark the current phase `complete` later based on tasks

Why:
- the user can keep momentum
- structured progression remains intact
- the product does not feel artificially blocked

This matches the system rule that users are not blocked by incomplete tasks.

## Regeneration rules

Regeneration is allowed for:
- Blueprint
- any generated phase
- weekly plan

Regeneration must:
- create a new `agent_runs` record
- update `phase_instances.generated_content_json`
- update or replace system-generated tasks for that phase
- preserve user task status where task intent still matches

If task matching is too complex for MVP, use this fallback:
- archive old tasks later if needed
- create new task rows
- preserve phase completion state only if the regenerated task set is materially equivalent

## Recommended task persistence rule for MVP

Keep task persistence simple:
- give each generated task a stable `task_key` in memory before insert/update logic is added later
- on regeneration, match by `task_key` where possible
- preserve `status`, `completed_at`, and user notes later if the task meaning is unchanged

If schema changes are deferred, document this as application logic to add next.

## API response expectations for phase overview

`GET /api/projects/:projectId/phases` should always return the full phase ladder.

Recommended shape per item:

```json
{
  "number": 2,
  "title": "Legal",
  "state": "locked",
  "isUnlocked": false,
  "isGenerated": false,
  "taskCounts": {
    "total": 0,
    "complete": 0,
    "required": 0,
    "requiredComplete": 0
  }
}
```

Why:
- the UI can render progress without guessing
- sidebar logic stays deterministic
- frontend does not need to derive unlock state from partial data

## Completion percentage rule

Recommended MVP formula per phase:

- if no tasks: `0` when `available`, `100` when `complete`
- if tasks exist: `complete_or_skipped_tasks / total_tasks`

Do not use this percentage as the unlock gate.
It is a display metric only.

## Audit events worth recording

- `project.created`
- `blueprint.generation_started`
- `blueprint.generated`
- `phase.generation_started`
- `phase.generated`
- `phase.completed`
- `task.completed`
- `task.reopened`

## Backend enforcement summary

The backend should enforce:
- blueprint exists before Phase 1 generation
- previous phase exists before later phase generation
- location is present before any location-dependent phase generation
- duplicate concurrent runs are rejected
- next phase unlock happens on successful generation of the previous phase
- task completion never directly rewrites blueprint or phase content

## MVP edge cases

### User regenerates Blueprint after Brand exists
Recommended MVP behaviour:
- allow blueprint regeneration
- keep later phases visible but mark them `ready` with stale-source metadata later if needed
- do not silently delete later phase data

If stricter behaviour is preferred later, add a revalidation workflow instead of destructive resets.

### User never completes Brand tasks but generates Legal
Allowed.
That is consistent with VentraPath's guided but non-blocking model.

### Location changes after blueprint generation
Treat as a high-impact change.
Recommended MVP behaviour:
- allow project update
- flag blueprint and generated phases as needing regeneration
- do not claim existing legal or finance content is still valid

## Bottom line

VentraPath should enforce ordered phase generation, not task-level bureaucracy.

The MVP progression model is:
- Blueprint first
- unlock one phase at a time
- let users move forward once a phase is generated
- keep task completion for progress and discipline, not hard gating
- preserve structured state in the backend so the UI stays simple and reliable
