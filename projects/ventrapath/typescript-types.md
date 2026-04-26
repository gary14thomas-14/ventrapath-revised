# VentraPath TypeScript Types

## Purpose

Define the first shared TypeScript type layer for the VentraPath MVP.

This is the contract glue between:
- backend handlers
- database mapping layer
- orchestration layer
- frontend API client
- frontend UI rendering

The goal is simple:
**stop the same payload being reinvented five different ways.**

---

## Core enums / string unions

```ts
export type ProjectStatus =
  | 'draft'
  | 'blueprint_generating'
  | 'blueprint_ready'
  | 'in_progress'
  | 'archived';

export type PhaseState =
  | 'locked'
  | 'available'
  | 'generating'
  | 'ready'
  | 'complete';

export type TaskStatus =
  | 'open'
  | 'in_progress'
  | 'complete'
  | 'skipped';

export type RunType =
  | 'blueprint_generation'
  | 'blueprint_regeneration'
  | 'phase_generation'
  | 'weekly_plan_generation';

export type RunStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled';
```

---

## Core entities

```ts
export interface User {
  id: string;
  email: string;
  name?: string | null;
  authProvider: string;
  authProviderUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  rawIdea: string;
  country: string;
  region?: string | null;
  currencyCode: string;
  hoursPerWeek?: number | null;
  status: ProjectStatus;
  currentPhaseNumber: number;
  latestBlueprintVersionNumber?: number | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## Blueprint types

```ts
export interface BlueprintSections {
  business: string;
  market: string;
  monetisation: string;
  execution: string;
  legal: string;
  website: string;
  risks: string;
}

export interface BlueprintMeta {
  country: string;
  region?: string | null;
  currencyCode?: string;
  generatedAt: string;
}

export interface BlueprintVersion {
  id: string;
  projectId: string;
  version: number;
  status: 'ready';
  sections: BlueprintSections;
  meta: BlueprintMeta;
  createdByRunId?: string | null;
  createdAt: string;
}
```

---

## Phase / task shell types

```ts
export interface Task {
  id: string;
  projectId: string;
  phaseInstanceId: string;
  sortOrder: number;
  title: string;
  whatToDo: string;
  howToDoIt: string;
  executionReference?: string | null;
  status: TaskStatus;
  isRequired: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCounts {
  total: number;
  complete: number;
  required: number;
  requiredComplete: number;
}

export interface PhaseOverviewItem {
  number: number;
  title: string;
  state: PhaseState;
  isUnlocked: boolean;
  isGenerated: boolean;
  taskCounts: TaskCounts;
}

export interface PhaseInstanceBase<TContent = unknown> {
  id: string;
  projectId: string;
  number: number;
  title: string;
  state: PhaseState;
  summary?: string | null;
  content: TContent;
  tasks: Task[];
  generatedAt?: string | null;
  updatedAt: string;
}
```

---

## Weekly planning

```ts
export interface WeeklyPlanWeek {
  week: number;
  focus: string;
  tasks: string[];
}

export interface WeeklyPlan {
  id: string;
  projectId: string;
  hoursPerWeek: number;
  plan: WeeklyPlanWeek[];
  createdByRunId?: string | null;
  createdAt: string;
}
```

---

## Runs / billing

```ts
export interface AgentRun {
  id: string;
  projectId: string;
  runType: RunType;
  phaseNumber?: number | null;
  status: RunStatus;
  triggeredByUserId?: string | null;
  inputJson: unknown;
  routingJson?: unknown;
  rawOutputJson?: unknown;
  validatedOutputJson?: unknown;
  errorCode?: string | null;
  errorMessage?: string | null;
  startedAt: string;
  finishedAt?: string | null;
}

export interface Subscription {
  id: string;
  userId: string;
  provider: string;
  providerCustomerId: string;
  providerSubscriptionId?: string | null;
  planCode: string;
  status: SubscriptionStatus;
  currentPeriodEnd?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## API wrapper types

```ts
export interface ApiErrorShape {
  code: string;
  message: string;
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: ApiErrorShape;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
```

---

## Request payload types

```ts
export interface CreateProjectRequest {
  idea: string;
  country: string;
  region?: string;
  hoursPerWeek?: number;
}

export interface GenerateBlueprintRequest {
  regenerate?: boolean;
}

export interface GeneratePhaseRequest {
  regenerate?: boolean;
}

export interface UpdateTaskRequest {
  status: TaskStatus;
}

export interface GenerateWeeklyPlanRequest {
  hoursPerWeek: number;
}

export interface CreateCheckoutRequest {
  plan: string;
}
```

---

## Endpoint response payload types

```ts
export interface CreateProjectResponse {
  project: Project;
}

export interface ListProjectsResponse {
  projects: Array<Pick<
    Project,
    'id' | 'name' | 'country' | 'region' | 'status' | 'currentPhaseNumber' | 'updatedAt'
  >>;
}

export interface GetProjectResponse {
  project: Project;
}

export interface RunHandleResponse {
  run: {
    id: string;
    type: RunType;
    status: RunStatus;
    phase?: number;
  };
}

export interface GetBlueprintResponse {
  blueprint: BlueprintVersion;
}

export interface ListBlueprintVersionsResponse {
  versions: Array<{
    version: number;
    generatedAt: string;
  }>;
}

export interface GetPhasesResponse {
  phases: PhaseOverviewItem[];
}

export interface GetWeeklyPlanResponse {
  weeklyPlan: WeeklyPlan;
}

export interface GetRunsResponse {
  runs: Array<Pick<
    AgentRun,
    'id' | 'runType' | 'status' | 'startedAt' | 'finishedAt'
  >>;
}

export interface GetSubscriptionResponse {
  subscription: {
    plan: string;
    status: SubscriptionStatus;
    renewalDate?: string | null;
  };
}

export interface CheckoutResponse {
  checkoutUrl: string;
}
```

---

## Phase-specific content types

These should map to `phase_instances.generated_content_json`.

### Phase 1 — Brand

```ts
export interface BrandPhaseContent {
  brandDirection: string;
  nameOptions: Array<{
    name: string;
    rationale: string;
  }>;
  recommendedName: {
    name: string;
    rationale: string;
  };
  tagline: string;
  corePromise: string;
  brandVoice: string[];
  messagingPillars: string[];
  homepageHero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  visualDirection: {
    mood: string;
    avoid: string[];
  };
  brandRisks: string[];
}
```

### Phase 2 — Legal

```ts
export interface LegalPhaseContent {
  recommendedStructure: {
    type: string;
    rationale: string;
    upgradeLater?: string;
  };
  registrationPath: Array<{
    step: string;
    authority: string;
    timing: string;
    reason: string;
  }>;
  licensingChecks: Array<{
    area: string;
    status: 'likely_required' | 'may_apply' | 'not_likely';
    reason: string;
    followUp?: string;
  }>;
  complianceObligations: Array<{
    title: string;
    whyItMatters: string;
  }>;
  brandAndTrademarkChecks: {
    businessNameCheck: string;
    trademarkCheck: string;
    domainCheck: string;
  };
  marketingClaimWarnings: string[];
  legalRisks: Array<{
    risk: string;
    severity: 'low' | 'medium' | 'high';
    why: string;
    nextStep: string;
  }>;
  requiredDocuments: string[];
}
```

### Phase 3 — Finance

```ts
export interface FinancePhaseContent {
  financialModelSummary: string;
  startupCosts: {
    low: number;
    likely: number;
    high: number;
    currency: string;
    buckets: Array<{ label: string; amount: number }>;
  };
  monthlyOperatingCosts: {
    currency: string;
    buckets: Array<{ label: string; amount: number }>;
    estimatedTotal: number;
  };
  revenueModel: {
    primaryDriver: string;
    supportingDrivers: string[];
    keyAssumptions: string[];
  };
  breakevenView: {
    monthlyRevenueRequired: number;
    unitInterpretation: string;
    mainPressurePoint: string;
  };
  pricingSanityCheck: {
    verdict: string;
    reason: string;
  };
  cashflowPressurePoints: string[];
  fundingPosture: {
    type: string;
    reason: string;
  };
  financeRisks: Array<{
    risk: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}
```

### Phase 4-9 placeholder pattern

For the remaining phases, implement dedicated interfaces matching their contract docs.
At minimum, keep one exported type per phase:

```ts
export interface ProtectionPhaseContent { [key: string]: unknown }
export interface InfrastructurePhaseContent { [key: string]: unknown }
export interface MarketingPhaseContent { [key: string]: unknown }
export interface OperationsPhaseContent { [key: string]: unknown }
export interface SalesPhaseContent { [key: string]: unknown }
export interface LaunchScalePhaseContent { [key: string]: unknown }
```

These should be replaced with full interfaces once the codebase starts consuming each phase.

---

## Generic phase response helpers

```ts
export type BrandPhase = PhaseInstanceBase<BrandPhaseContent>;
export type LegalPhase = PhaseInstanceBase<LegalPhaseContent>;
export type FinancePhase = PhaseInstanceBase<FinancePhaseContent>;

export type AnyPhase =
  | BrandPhase
  | LegalPhase
  | FinancePhase
  | PhaseInstanceBase;
```

---

## Recommended code layout

```ts
// shared/types/domain.ts
// shared/types/api.ts
// shared/types/phases.ts
// shared/types/runs.ts
// shared/types/billing.ts
```

For frontend/backend monorepo setups, keep these in a shared package.

---

## Bottom line

These types should become the single source of truth for:
- API handlers
- validation mapping
- frontend fetch client
- UI components
- orchestration output adapters

If these drift, the build gets messy fast.
