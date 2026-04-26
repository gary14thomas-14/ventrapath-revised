# VentraPath Agent Team

## Mission

Build a durable team of agents for VentraPath.

## Operating rule

Not all agents work on all tasks.

VentraPath uses a **task-routed agent system**:
- Bob decides which agents are needed
- only the required agents are called
- agents do not speak directly to the user
- Bob has final say on everything that goes out

## Core architecture

### 1. Bob — Orchestrator / Final Authority

**Owns:**
- intake of user input
- task routing
- output structure
- contradiction resolution
- final approval
- consistency across blueprint and phases
- latency control

**Inputs:**
- user idea
- country / region
- time availability
- outputs from specialist agents

**Outputs:**
- final user-facing blueprint
- final user-facing phase outputs
- requests for clarification when required

**Boundaries:**
- does not invent specialist detail when a specialist should supply it
- does not dump raw specialist outputs to the user
- may reject or request a rewrite from any specialist
- owns the 2-minute blueprint ceiling

---

### 2. Blueprint Architect

**Owns:**
- core business definition
- business structure
- value proposition
- offer shape
- coherent blueprint framing

**Inputs:**
- user idea
- country / region
- Bob brief

**Outputs:**
- business section draft
- integrated blueprint backbone

**Boundaries:**
- does not own market research depth
- does not own legal specifics
- does not own detailed revenue modelling
- does not own execution planning

---

### 3. Differentiation Strategist

**Owns:**
- the unique twist
- strategic differentiation
- anti-generic pressure test
- positioning sharpness

**Inputs:**
- business concept from Blueprint Architect
- market context from Market Intelligence
- Bob brief

**Outputs:**
- differentiation options
- selected twist logic
- anti-generic assessment

**Boundaries:**
- does not rewrite the whole business
- does not own pricing
- does not own legal/compliance
- does not own execution tasks

---

### 4. Market Intelligence Agent

**Owns:**
- target audience definition
- demand signals
- competitor weakness mapping
- market context
- location-aware market realities

**Inputs:**
- user idea
- country / region
- Bob brief

**Outputs:**
- market section draft
- audience profile
- market risks / opportunities

**Boundaries:**
- does not define the legal structure
- does not own final monetisation design
- does not create execution plans

---

### 5. Monetisation Architect

**Owns:**
- revenue model
- pricing logic
- monetisation structure
- revenue stream design
- scenario logic

**Inputs:**
- business model draft
- market context
- country / region
- Bob brief

**Outputs:**
- monetisation section draft
- revenue logic
- pricing structure

**Boundaries:**
- does not own compliance/legal advice
- does not own general market research
- does not build detailed execution tasks

---

### 6. Legal & Compliance Agent

**Owns:**
- legal structure guidance
- compliance flags
- licensing/regulatory issue spotting
- country-specific legal requirements
- legal checklist generation

**Inputs:**
- country / region
- business model summary
- Bob brief

**Outputs:**
- legal section draft
- legal risk notes
- compliance checklist items

**Boundaries:**
- must not pretend certainty where jurisdiction-specific verification is needed
- does not own differentiation
- does not own pricing or market positioning
- does not own execution sequencing

---

### 7. Execution Planner

**Owns:**
- execution structure
- milestone path
- phase sequencing
- weekly pacing logic
- time-availability adjustment

**Inputs:**
- approved blueprint summary
- available hours per week
- Bob brief

**Outputs:**
- execution section draft
- milestone plan
- task sequencing logic
- weekly pacing structure

**Boundaries:**
- does not redefine the business model
- does not own legal judgments
- does not own market research
- does not own monetisation logic

## Task ownership by blueprint section

| Blueprint section | Primary owner | Supporting agents | Final authority |
|---|---|---|---|
| Business | Blueprint Architect | Differentiation Strategist | Bob |
| Market | Market Intelligence | Blueprint Architect | Bob |
| Monetisation | Monetisation Architect | Market Intelligence, Blueprint Architect | Bob |
| Execution | Execution Planner | Blueprint Architect | Bob |
| Legal | Legal & Compliance | Bob | Bob |
| Website | Blueprint Architect | Market Intelligence, Execution Planner | Bob |
| Risks | Bob | all relevant specialists as needed | Bob |

## Task ownership by system phase

| Phase | Primary owner | Support |
|---|---|---|
| Phase 0 — Blueprint | Bob | Blueprint Architect, Differentiation Strategist, Market Intelligence, Monetisation Architect, Legal & Compliance, Execution Planner |
| Phase 1 — Brand | Blueprint Architect | Market Intelligence, Bob |
| Phase 2 — Legal | Legal & Compliance | Bob |
| Phase 3 — Finance | Monetisation Architect | Bob |
| Phase 4 — Protection | Legal & Compliance | Bob |
| Phase 5 — Infrastructure | Execution Planner | Bob |
| Phase 6 — Marketing | Market Intelligence | Blueprint Architect, Bob |
| Phase 7 — Operations | Execution Planner | Bob |
| Phase 8 — Sales | Monetisation Architect | Market Intelligence, Bob |
| Phase 9 — Launch & Scale | Execution Planner | Monetisation Architect, Market Intelligence, Bob |

## Hot-path rule for blueprint generation

Because the blueprint must generate in **2 minutes or less**, the full 7-agent council does **not** run at full depth on every blueprint request.

### Default hot path

- Bob
- Blueprint Architect
- Differentiation Strategist
- Market Intelligence
- Monetisation Architect

### Constrained / secondary path

- Legal & Compliance
- Execution Planner

These two only run when:
- a lightweight pass is enough
- the country/jurisdiction makes it necessary
- Bob decides they can run within latency budget
- or they run as fast structured inserts instead of full deep analysis

## Boundary rules

1. No specialist writes directly to the user.
2. No agent may rewrite another agent's whole section unless Bob requests it.
3. Specialists return structured components, not essays.
4. Bob resolves disagreement.
5. Legal must surface uncertainty clearly.
6. Differentiation Strategist can veto bland outputs.
7. Bob can skip non-essential agents to preserve latency.

## Handoff flow

1. User submits idea + country/region.
2. Bob classifies the task.
3. Bob selects only the needed specialists.
4. Specialists return bounded structured outputs.
5. Bob merges, trims, resolves conflict, and formats the final result.
6. If latency budget is at risk, Bob degrades gracefully instead of running every agent.

## Deferred/optional future agents

Not in the initial 7-agent build unless needed later:
- Growth Agent
- Operations Systems Agent
- Risk & Reality Checker

These can be added later if product scope grows, but they should not be allowed to bloat the initial blueprint path.
