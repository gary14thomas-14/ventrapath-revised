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

function sentence(value: unknown) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

function titleCase(value: unknown) {
  return sentence(value)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function deriveAudience(idea: string) {
  const text = idea.toLowerCase()

  if (/(kids|children|families|parents)/.test(text)) return 'families who want a simpler, more trustworthy option'
  if (/(tradie|trade|contractor|electrician|plumb|builder|handyman)/.test(text)) return 'busy households and property owners who need fast, credible help'
  if (/(beauty|salon|hair|skin|lashes|spa)/.test(text)) return 'appearance-conscious customers willing to pay for visible quality'
  if (/(fitness|gym|coach|wellness|nutrition)/.test(text)) return 'time-poor people who want outcomes, not vague motivation'
  if (/(food|cafe|coffee|restaurant|meal|bakery)/.test(text)) return 'locals who will buy repeatedly if the offer feels distinct and reliable'
  if (/(software|app|saas|ai|automation|tech)/.test(text)) return 'operators who will pay to save time or unlock growth'

  return 'buyers already looking for a credible solution in this category'
}

function deriveMechanism(project: LocalProject) {
  const idea = sentence(project.rawIdea)
  const lowerIdea = idea.toLowerCase()
  const location = project.region ? `${project.region}, ${project.country}` : project.country

  if (/(ice cream|gelato|dessert|bakery|cafe|food)/.test(lowerIdea)) {
    return {
      concept: 'Signature Flavour Lab',
      input: 'customer flavour votes, purchase patterns, weather, and weekly trending combinations',
      behaviour: 'the menu changes live or in short weekly cycles so customers can influence what appears next',
      experience: 'people feel like they are discovering or shaping something current rather than buying the same shelf-stable menu every visit',
      advantage: 'the business becomes a destination people talk about, revisit, and bring friends to because there is always a visible reason to come back',
      retention: 'weekly drops, featured customer-created winners, and limited runs that reward repeat visits',
      pricing: `${project.currencyCode} 7-9 entry item, ${project.currencyCode} 12-16 signature product, ${project.currencyCode} 18-24 tasting or premium combo`,
      websiteHook: 'Show the live flavour mechanic first, then the best current drop, then the proof that customers come back for what changes.',
    }
  }

  if (/(clean|cleaning|cleaner)/.test(lowerIdea)) {
    return {
      concept: 'Proof-Backed Clean Standard',
      input: 'room-by-room scope, before-and-after evidence, and fixed deliverable checklists',
      behaviour: 'every clean is sold and delivered against a visible standard instead of vague time-based promises',
      experience: 'buyers feel they are purchasing a result they can verify, not just hoping a cleaner does a decent job',
      advantage: 'trust rises faster, premium pricing is easier to justify, and referrals are easier because the promise is concrete',
      retention: 'documented standards make repeat cleans easier to rebook',
      pricing: `${project.currencyCode} fixed packages with a clear premium tier tied to larger reset scope or higher-frequency service`,
      websiteHook: 'Lead with the proof system and the standard, not generic “we clean homes” copy.',
    }
  }

  if (/(tradie|trade|electrician|plumb|builder|handyman|maintenance|repair)/.test(lowerIdea)) {
    return {
      concept: 'Diagnose-First Service Desk',
      input: 'incoming problem details, urgency, photo evidence, and property context',
      behaviour: 'the business starts by diagnosing and turning messy requests into a clear decision path before the bigger job is sold',
      experience: 'buyers get clarity, speed, and confidence before committing to the larger spend',
      advantage: 'the business feels easier to trust than vague quote-first competitors and wins more work at the decision stage',
      retention: 'diagnosis history and repeat property knowledge make future jobs easier to win',
      pricing: `${project.currencyCode} paid diagnostic or callout layer plus clear fixed-price or scoped follow-on work`,
      websiteHook: 'Show how the business reduces uncertainty before it sells labour.',
    }
  }

  if (/(beauty|salon|hair|skin|lashes|spa)/.test(lowerIdea)) {
    return {
      concept: 'Signature Result System',
      input: 'client starting point, result goal, maintenance timing, and documented treatment history',
      behaviour: 'the service is sold as a named outcome system with a repeatable path rather than a menu of disconnected appointments',
      experience: 'clients know what result they are buying and how to maintain it',
      advantage: 'the business is easier to remember, easier to ask for by name, and easier to price above generic appointment shops',
      retention: 'maintenance cadence is built into the promise',
      pricing: `${project.currencyCode} hero service plus signature package and maintenance plan`,
      websiteHook: 'Lead with the named result and the proof it is repeatable.',
    }
  }

  if (/(fitness|gym|coach|wellness|nutrition)/.test(lowerIdea)) {
    return {
      concept: 'Follow-Through Engine',
      input: 'client plan, compliance checkpoints, missed-action signals, and progress evidence',
      behaviour: 'the business intervenes when follow-through drops instead of waiting for motivation to magically hold',
      experience: 'customers feel guided through real momentum dips rather than left alone with a plan',
      advantage: 'it sells adherence, not inspiration, which is commercially stronger and easier to talk about',
      retention: 'progress tracking and intervention loops make continuation rational',
      pricing: `${project.currencyCode} flagship program plus continuity membership or premium support tier`,
      websiteHook: 'Show how the business handles the moment most people fall off.',
    }
  }

  if (/(software|app|saas|ai|automation|tech)/.test(lowerIdea)) {
    return {
      concept: 'Outcome Control Layer',
      input: 'live workflow signals, bottleneck data, and user actions',
      behaviour: 'the product surfaces the next important action and keeps a key workflow moving without the user hunting for it',
      experience: 'operators feel less blind and less delayed in a painful day-to-day process',
      advantage: 'the software is bought for a visible operating gain, not just for feature novelty',
      retention: 'once embedded in the workflow, it becomes part of the standing operating rhythm',
      pricing: `${project.currencyCode} team subscription with implementation or premium support`,
      websiteHook: 'Lead with the workflow bottleneck and how the product changes it in practice.',
    }
  }

  return {
    concept: 'Concrete Category Wedge',
    input: `the real demand signals and friction points inside ${idea}`,
    behaviour: 'the business changes how the service is delivered in a way customers can notice immediately',
    experience: 'buyers understand what is different without needing a long explanation',
    advantage: 'the business is easier to picture, trust, and recommend than a generic competitor',
    retention: 'the repeat reason is built into delivery, not tacked on with marketing language',
    pricing: `${project.currencyCode} one flagship offer and one premium step-up tied to the visible difference`,
    websiteHook: 'Lead with what visibly happens that makes this different.',
  }
}

function buildBlueprintSections(project: LocalProject) {
  const location = project.region ? `${project.region}, ${project.country}` : project.country
  const currency = project.currencyCode
  const idea = sentence(project.rawIdea)
  const businessName = titleCase(project.name || idea)
  const audience = deriveAudience(idea)
  const mechanism = deriveMechanism(project)

  return {
    business: `${businessName} in ${location} should be built around ${mechanism.concept}. Mechanism: ${mechanism.input} drive how the offer behaves; ${mechanism.behaviour}. Customer experience: ${mechanism.experience}. Business advantage: ${mechanism.advantage}. Business form: make this immediately legible as a real commercial offer, not a generic version of ${idea}.`,
    market: `Start with ${audience} in ${location}. They are the first wedge because they can recognise the pain quickly and judge whether ${mechanism.concept} is genuinely different on first read. Why this wins: ${mechanism.advantage}.`,
    monetisation: `Use ${currency} pricing from day one and anchor it to the visible mechanism, not generic category averages. Starting structure: ${mechanism.pricing}. The premium step-up should exist because the customer can see why the offer is better within seconds.`,
    execution: `First prove the loop in the real world: ${mechanism.input} -> ${mechanism.behaviour} -> ${mechanism.experience}. Build the first offer, message, and proof around that loop and reject any version that collapses back into generic ${idea} wording.`,
    legal: `This is information only, not legal advice. Legal setup must reflect ${location} requirements and the real delivery model. Verify registration, tax, privacy, claims, licensing, and industry-specific obligations before launch, and keep the promise aligned with what the business can actually prove.`,
    website: `The website should make the business instantly pictureable. Lead with ${mechanism.concept}, show what visibly happens that is different, explain the payoff in plain language, and drive to one clear next step. ${mechanism.websiteHook}`,
    risks: `The biggest risk is sanding this back down into generic AI sludge: vague positioning, weak mechanics, fake differentiation, and pricing that does not match the visible edge. If a human cannot picture what actually happens in the business, the blueprint is wrong and should be regenerated.`,
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

export async function updateLocalPhase(projectId: string, phaseNumber: number, updates: {
  userState?: Record<string, unknown>
  progress?: {
    totalSteps?: number
    completedSteps?: number
  }
}) {
  const store = readStore()
  const phase = getPhaseOrThrow(store, projectId, phaseNumber)

  const nextPhase: PhaseData = {
    ...phase,
    userState: updates.userState ? { ...(phase.userState ?? {}), ...updates.userState } : phase.userState,
    progress: updates.progress ? { ...(phase.progress ?? {}), ...updates.progress } : phase.progress,
  }

  store.phases[projectId][phaseNumber] = nextPhase
  writeStore(store)

  return nextPhase
}
