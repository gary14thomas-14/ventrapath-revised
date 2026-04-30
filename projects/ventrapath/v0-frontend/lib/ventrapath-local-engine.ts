import {
  buildBrandPhase,
  buildFinancePhase,
  buildInfrastructurePhase,
  buildLaunchScalePhase,
  buildLegalPhase,
  buildMarketingPhase,
  buildOperationsPhase,
  buildProtectionPhase,
  buildSalesPhase,
} from './phase-data-engine.js'
import type { BlueprintData, PhaseData } from './ventrapath-client'

const STORAGE_KEY = 'ventrapath_local_engine_store_v1'

const currencyByCountry = new Map([
  ['australia', 'AUD'],
  ['canada', 'CAD'],
  ['new zealand', 'NZD'],
  ['united kingdom', 'GBP'],
  ['uk', 'GBP'],
  ['england', 'GBP'],
  ['scotland', 'GBP'],
  ['wales', 'GBP'],
  ['northern ireland', 'GBP'],
  ['united states', 'USD'],
  ['usa', 'USD'],
  ['us', 'USD'],
  ['ireland', 'EUR'],
  ['germany', 'EUR'],
  ['france', 'EUR'],
  ['spain', 'EUR'],
  ['italy', 'EUR'],
  ['netherlands', 'EUR'],
  ['portugal', 'EUR'],
  ['austria', 'EUR'],
  ['india', 'INR'],
  ['singapore', 'SGD'],
])

type LocalProject = {
  id: string
  userId: string
  name: string
  rawIdea: string
  country: string
  region: string | null
  currencyCode: string
  hoursPerWeek: number | null
  status: string
  currentPhaseNumber: number
  latestBlueprintVersionNumber: number | null
  createdAt: string
  updatedAt: string
}

type LocalStore = {
  projects: Record<string, LocalProject>
  blueprints: Record<string, BlueprintData>
  phases: Record<string, Record<number, PhaseData>>
}

function ensureBrowser() {
  if (typeof window === 'undefined') {
    throw new Error('Local engine is only available in the browser')
  }
}

function defaultStore(): LocalStore {
  return {
    projects: {},
    blueprints: {},
    phases: {},
  }
}

function readStore(): LocalStore {
  ensureBrowser()
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultStore()

  try {
    const parsed = JSON.parse(raw) as LocalStore
    return {
      projects: parsed.projects ?? {},
      blueprints: parsed.blueprints ?? {},
      phases: parsed.phases ?? {},
    }
  } catch {
    return defaultStore()
  }
}

function writeStore(store: LocalStore) {
  ensureBrowser()
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function deriveCurrencyCode(country: string) {
  return currencyByCountry.get(country.toLowerCase()) ?? 'USD'
}

function buildBlueprintSections(project: LocalProject) {
  const location = project.region ? `${project.region}, ${project.country}` : project.country
  const currency = project.currencyCode
  const idea = project.rawIdea

  return {
    business: `${idea} becomes a structured VentraPath blueprint for ${location}, positioned as a differentiated business rather than a vague concept. The operating angle is framed to feel commercially legible fast, with the location and customer context baked in from the start.`,
    market: `Primary market focus is shaped around buyers in ${location} who already spend in this category and can recognise the offer quickly. The MVP market thesis should stay narrow first, then widen only after proof of demand and repeatable pull.`,
    monetisation: `Use ${currency} pricing from day one and anchor the first offer to a clear commercial path rather than fuzzy interest. Initial pricing should be tested as a directional market entry point, then lifted only when the differentiation is obvious within seconds.`,
    execution: `First prove this can sell in ${location} with a tight launch path, clear buyer targeting, and a simple operating workflow. Do not overbuild the stack before real customer response exists.`,
    legal: `Legal setup will depend on ${location} rules and should be treated as information only, not legal advice. The user must verify local registration, licensing, claims, privacy, tax, and compliance requirements themselves.`,
    website: `The website should immediately explain what this business is, why it is different, who it is for, and what the next step is. Keep the landing flow tight: clear promise, proof angle, offer, and CTA.`,
    risks: `Biggest early risks are fake differentiation, unclear buyer urgency, sloppy pricing confidence, and building too much before proof. If the commercial edge is not legible quickly, the concept should be narrowed before scaling effort.`,
  }
}

function normalizePhase(phase: any): PhaseData {
  if (phase.number === 9) {
    phase.title = 'Growth & Milestones'
    phase.summary = 'Guide the business through launch, growth, milestone tracking, optimisation, acquisition, and retention as it matures.'
    if (phase.content?.launchScaleLayer?.completionCallout) {
      phase.content.launchScaleLayer.completionCallout.badge = 'Phase 9 Complete'
      phase.content.launchScaleLayer.completionCallout.title = 'Built to Grow With the Company'
      phase.content.launchScaleLayer.completionCallout.description = 'The business now has a launch, growth, and milestone rhythm that can keep evolving as traction builds.'
    }
  }

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${phase.number}`,
    projectId: '',
    phaseNumber: phase.number,
    title: phase.title,
    state: 'ready',
    summary: phase.summary,
    generatedContent: phase.content,
    progress: phase.progress ?? {},
    tasks: phase.tasks ?? [],
  }
}

function getProjectOrThrow(store: LocalStore, projectId: string) {
  const project = store.projects[projectId]
  if (!project) {
    throw new Error(`Project ${projectId} was not found`)
  }
  return project
}

function getBlueprintOrThrow(store: LocalStore, projectId: string) {
  const blueprint = store.blueprints[projectId]
  if (!blueprint) {
    throw new Error(`No blueprint exists for project ${projectId}`)
  }
  return blueprint
}

function getPhaseOrThrow(store: LocalStore, projectId: string, phaseNumber: number) {
  const phase = store.phases[projectId]?.[phaseNumber]
  if (!phase) {
    throw new Error(`Phase ${phaseNumber} not found for project ${projectId}`)
  }
  return phase
}

function storePhase(store: LocalStore, project: LocalProject, phase: PhaseData) {
  if (!store.phases[project.id]) {
    store.phases[project.id] = {}
  }

  phase.projectId = project.id
  store.phases[project.id][phase.phaseNumber] = phase
  project.currentPhaseNumber = Math.max(project.currentPhaseNumber, phase.phaseNumber)
  project.status = 'in_progress'
  project.updatedAt = new Date().toISOString()
}

export async function createLocalProject(project: {
  userId: string
  idea: string
  country: string
  name?: string
  region?: string | null
  currencyCode?: string
  hoursPerWeek?: number
}) {
  const store = readStore()
  const now = new Date().toISOString()
  const created: LocalProject = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-project`,
    userId: project.userId,
    name: project.name?.trim() || project.idea.trim(),
    rawIdea: project.idea.trim(),
    country: project.country.trim(),
    region: project.region ?? null,
    currencyCode: (project.currencyCode?.trim().toUpperCase() || deriveCurrencyCode(project.country.trim())),
    hoursPerWeek: project.hoursPerWeek ?? 10,
    status: 'draft',
    currentPhaseNumber: 0,
    latestBlueprintVersionNumber: null,
    createdAt: now,
    updatedAt: now,
  }

  store.projects[created.id] = created
  writeStore(store)

  return created
}

export async function generateLocalBlueprint(projectId: string) {
  const store = readStore()
  const project = getProjectOrThrow(store, projectId)
  const blueprint: BlueprintData = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-blueprint`,
    projectId: project.id,
    version: (project.latestBlueprintVersionNumber ?? 0) + 1,
    status: 'ready',
    sections: buildBlueprintSections(project),
    meta: {
      country: project.country,
      region: project.region,
      currencyCode: project.currencyCode,
      generatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  }

  store.blueprints[project.id] = blueprint
  project.latestBlueprintVersionNumber = blueprint.version
  project.updatedAt = blueprint.createdAt ?? new Date().toISOString()
  project.status = 'in_progress'
  writeStore(store)

  return blueprint
}

export async function getLocalBlueprint(projectId: string) {
  const store = readStore()
  return getBlueprintOrThrow(store, projectId)
}

export async function generateLocalPhase(projectId: string, phaseNumber: number) {
  const store = readStore()
  const project = getProjectOrThrow(store, projectId)
  const blueprint = getBlueprintOrThrow(store, projectId)

  const phases = store.phases[projectId] ?? {}
  const brandPhase = phases[1] ?? null
  const legalPhase = phases[2] ?? null
  const financePhase = phases[3] ?? null
  const protectionPhase = phases[4] ?? null
  const infrastructurePhase = phases[5] ?? null
  const marketingPhase = phases[6] ?? null
  const operationsPhase = phases[7] ?? null
  const salesPhase = phases[8] ?? null

  if (phaseNumber >= 2 && !brandPhase) throw new Error('Generate Phase 1 Brand before creating this phase')
  if (phaseNumber >= 3 && !legalPhase) throw new Error('Generate Phase 2 Legal before creating this phase')
  if (phaseNumber === 4 && !financePhase) throw new Error('Generate Phase 3 Finance before creating Phase 4 Protection')
  if (phaseNumber === 5 && !protectionPhase) throw new Error('Generate Phase 4 Protection before creating Phase 5 Infrastructure')
  if (phaseNumber === 6 && !infrastructurePhase) throw new Error('Generate Phase 5 Infrastructure before creating Phase 6 Marketing')
  if (phaseNumber === 7 && !marketingPhase) throw new Error('Generate Phase 6 Marketing before creating Phase 7 Operations')
  if (phaseNumber === 8 && !operationsPhase) throw new Error('Generate Phase 7 Operations before creating Phase 8 Sales')
  if (phaseNumber === 9 && !salesPhase) throw new Error('Generate Phase 8 Sales before creating Phase 9 Growth & Milestones')

  const built = phaseNumber === 1
    ? buildBrandPhase(project, blueprint)
    : phaseNumber === 2
      ? buildLegalPhase(project, blueprint, brandPhase)
      : phaseNumber === 3
        ? buildFinancePhase(project, blueprint, legalPhase)
        : phaseNumber === 4
          ? buildProtectionPhase(project, blueprint, legalPhase, financePhase)
          : phaseNumber === 5
            ? buildInfrastructurePhase(project, blueprint, protectionPhase)
            : phaseNumber === 6
              ? buildMarketingPhase(project, blueprint, infrastructurePhase)
              : phaseNumber === 7
                ? buildOperationsPhase(project, blueprint, marketingPhase)
                : phaseNumber === 8
                  ? buildSalesPhase(project, blueprint, operationsPhase)
                  : buildLaunchScalePhase(project, blueprint, salesPhase)

  const phase = normalizePhase(built)
  storePhase(store, project, phase)
  writeStore(store)
  return phase
}

export async function getLocalPhase(projectId: string, phaseNumber: number) {
  const store = readStore()
  return getPhaseOrThrow(store, projectId, phaseNumber)
}
