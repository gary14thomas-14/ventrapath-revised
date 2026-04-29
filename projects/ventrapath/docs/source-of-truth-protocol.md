# VentraPath Source-of-Truth Protocol

Status: active working rule
Last updated: 2026-04-29

## Purpose

Stop expensive rebuild loops caused by building from partial or presentation-only inputs.

## Core rule

For VentraPath product and backend shaping:

- **exported frontend code beats screenshots**
- **real repo files beat remembered intent**
- **explicit schemas beat inferred structure**
- **locked contracts beat repeated reinterpretation**

## Practical rule set

### 1. Screenshots are not enough for backend shaping

Screenshots are useful for:
- layout
- hierarchy
- tone
- page ordering
- obvious fields/buttons

Screenshots are **not sufficient** for:
- exact payload structure
- component data dependencies
- optional vs required field logic
- hidden state assumptions
- edit/save behaviour
- navigation-driven API requirements

Therefore:
- screenshots may guide discovery
- screenshots must **not** be treated as the final backend contract source

### 2. Frontend-derived schema comes before backend adaptation

Before changing or expanding backend payloads for a VentraPath page/phase:
1. obtain the real frontend code for that page/phase
2. derive the required data shape from the component(s)
3. write the schema to disk
4. compare it against the current backend
5. only then implement or refactor backend output

### 3. One section at a time

Do not broad-brush the whole product from one page.

For each section/page:
- collect the actual component code
- derive its schema
- mark what is confirmed vs inferred
- only then move to the next section

### 4. Mark confidence honestly

Every schema or contract doc should distinguish:
- **confirmed from code**
- **confirmed from live backend**
- **inferred / provisional**

If something is inferred, label it plainly instead of building over the uncertainty silently.

### 5. Avoid duplicate interpretation layers

Do not repeatedly translate the same product idea through:
- screenshots
- then chat summary
- then spec rewrite
- then backend guess

That is how cost blows out.

Preferred order:
- frontend code
- schema
- backend contract
- implementation

## Required source materials before major backend work

For Phase 0 / blueprint shaping, preferred minimum input is:
- actual page/component code for all blueprint sections
- shared layout/navigation component code if relevant
- any transition/paywall components linked to the flow

For guided phases, preferred minimum input is:
- actual phase page/component code
- any step-state/edit/save interaction code
- any completion/progress/sidebar code

## Working decision rule

If frontend code is missing, do one of these only:
- pause and request the missing code
- make a narrowly labeled provisional schema
- avoid broad backend shaping from guesswork

## Goal

Build VentraPath once per truth source, not three or four times per partial clue.
