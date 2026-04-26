# VentraPath — Full System Description

## Source

Authoritative rundown provided by Gaz on 2026-04-26.

## What VentraPath is

VentraPath is a structured, AI-driven business-building system that takes a user from an initial idea to a fully defined, launch-ready business, and then guides them through building and operating that business.

It is not a chatbot.
It is not a generic planning tool.

It is a guided execution platform with defined phases, controlled outputs, and a structured user journey.

## Core function

VentraPath performs two primary functions:

1. Transforms an idea into a differentiated business (Blueprint)
2. Guides the user through building that business step-by-step (Phases)

## Required inputs

VentraPath requires the following inputs to operate correctly:

- Business idea (free text)
- User’s country/region (mandatory)
- User’s available time (captured after blueprint or during onboarding)

The country/region is critical and must be used across all outputs.
No part of the system should assume a fixed location.

## Output structure

VentraPath outputs are divided into two layers.

### Layer 1 — Blueprint (Phase 0)

This is the foundation of the business.

Per Gaz's correction, the Phase 0 structure should follow the real UI, not the later ChatGPT-derived rewrite.

It is a structured, controlled output with these sections:

1. **Business**
   - Defines the business clearly
   - Contains a built-in, non-generic, strategic differentiation (the “twist”)
   - The twist is embedded into the business itself, not separated
2. **Market**
   - Defines the target audience
   - Identifies demand
   - Identifies competitor weaknesses
3. **Monetisation**
   - Defines revenue strategy and how the business gets paid
   - Covers pricing / monetisation logic in the blueprint layer
4. **Execution**
   - Captures launch roadmap / execution planning within the blueprint experience
5. **Legal**
   - Captures location-aware legal requirements within the blueprint experience

#### Blueprint rules

- Must be specific, not generic
- Must reflect the user’s selected country/region
- Must include a clear, embedded strategic differentiation
- Must be commercially realistic
- Must not include step-by-step execution
- Must not include timelines or checklists
- Must not include generic filler language

If the blueprint does not contain a clear differentiation, it is invalid.

### Layer 2 — Guided execution system

After the blueprint, the user is guided through a structured phase system.

## Phase structure

VentraPath uses a fixed 10-phase system:

- Phase 0 — Blueprint
- Phase 1 — Brand
- Phase 2 — Legal
- Phase 3 — Finance
- Phase 4 — Protection
- Phase 5 — Infrastructure
- Phase 6 — Marketing
- Phase 7 — Operations
- Phase 8 — Sales
- Phase 9 — Launch & Scale

## Phase purpose

Each phase represents a category of business setup and development.

Each phase is designed to move the user forward in a controlled and logical order.

## Task structure within phases

Each phase contains multiple tasks.

Each task includes:

- What to do
- How to do it
- A concrete execution reference

Tasks are designed to be actionable and specific.

## User interaction model

- Users progress through phases in order
- Users can move forward or backward freely
- Users are not blocked by incomplete tasks
- Users can mark tasks as complete
- Users can return later and continue progress

## UI structure (current state)

VentraPath already has a multi-page interface.

Key characteristics:

- Phase-based navigation
- Clean, minimal, premium layout
- Expandable task sections
- Dashboard-style blueprint display
- Step-based progression system
- Persistent progress tracking

The UI is not chat-based.
It is structured and navigational.

## Location awareness (critical system rule)

All outputs must adapt to the user’s selected country/region.

This includes:

- Legal requirements
- Business registration processes
- Tax structure
- Currency
- Pricing context
- Domain recommendations
- Compliance requirements
- Licensing requirements
- Financial setup
- Payment systems
- Market behaviour

If the location is missing, the system must request it or mark outputs as location-dependent.

No hardcoded country assumptions are allowed.

## Time-based execution system

VentraPath incorporates user time availability.

The system:

- Captures how many hours per week the user can commit
- Generates a realistic execution pace
- Adjusts workload accordingly

This is used to produce a weekly execution structure.

This is not part of the blueprint.
It is part of the execution layer.

## Data and persistence

VentraPath must store:

- User profile
- Business idea
- Selected country/region
- Generated blueprint
- Phase progress
- Task completion
- Weekly plans
- Agent outputs

Users must be able to:

- Save progress
- Return later
- Continue from where they left off

## System architecture

VentraPath is powered by a multi-agent system.

### Agent structure

The system consists of:

- **Bob — Orchestrator**
  - Receives user input
  - Determines which agents to call
  - Aggregates outputs
  - Ensures structured responses
  - Maintains consistency across phases
- **Specialist agents**
  - Blueprint Builder
  - Legal Advisor
  - Finance Expert
  - Marketing Strategist
  - Operations Guru
  - Sales Coach
  - Growth & Scale Specialist
  - AI & Automation Engineer

Each agent contributes to specific phases.
Bob controls interaction between them.

### System behaviour

- Agents do not respond directly to the user
- Bob synthesizes all outputs
- Outputs must be structured, not conversational dumps
- Redundant or conflicting outputs must be resolved by Bob

## Monetisation model

VentraPath is a subscription-based product.

Pricing tiers are structured around access to features such as:

- Blueprint generation
- Phase access
- Progress tracking
- Weekly planning
- Advanced guidance
- Multi-user capability

## Product positioning

VentraPath is positioned as a system that:

- builds better businesses from the start
- removes uncertainty
- provides structure
- guides execution

It is not positioned as:

- an idea generator
- a content tool
- a passive advisor

## System requirements

For VentraPath to function correctly:

- Blueprint must be differentiated and location-aware
- Phases must be structured and actionable
- UI must remain clean and navigable
- Progress must persist
- Agents must remain controlled by the orchestrator
- Outputs must avoid generic content

## Final definition

VentraPath is a structured system that:

1. Converts an idea into a differentiated business using a controlled blueprint process
2. Then guides the user through a fixed, multi-phase execution path
3. Adapts all outputs to the user’s location and capacity
4. Maintains progress and structure through a persistent UI
5. Uses a multi-agent backend controlled by a central orchestrator

That is what the app does and how it does it.
