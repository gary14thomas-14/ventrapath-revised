import {
  createLocalProject,
  generateLocalBlueprint,
  generateLocalPhase,
  getLocalBlueprint,
  getLocalPhase,
  updateLocalPhase,
} from './ventrapath-local-engine'

export const VENTRAPATH_STORAGE_KEYS = {
  userId: 'ventrapath_user_id',
  projectId: 'ventrapath_project_id',
  idea: 'ventrapath_idea',
  country: 'ventrapath_country',
  projectName: 'ventrapath_project_name',
  lastVisitedPath: 'ventrapath_last_visited_path',
} as const

const LEGACY_STORAGE_KEYS: Partial<Record<keyof typeof VENTRAPATH_STORAGE_KEYS, string>> = {
  projectId: 'projectId',
  idea: 'idea',
  country: 'country',
  projectName: 'projectName',
  lastVisitedPath: 'lastVisitedPath',
}

export type BlueprintSectionKey = 'business' | 'market' | 'monetisation' | 'execution' | 'legal' | 'website' | 'risks'

export interface BlueprintData {
  id: string
  projectId: string
  version: number
  status: string
  sections: Record<BlueprintSectionKey, string>
  meta?: {
    country?: string
    region?: string | null
    currencyCode?: string
    generatedAt?: string
  }
  createdAt?: string
}

export interface PhaseData {
  id: string
  projectId: string
  phaseNumber: number
  title: string
  state: string
  summary: string
  generatedContent: Record<string, unknown>
  userState?: Record<string, unknown>
  progress?: {
    totalSteps?: number
    completedSteps?: number
  }
  tasks?: Array<{
    title: string
    whatToDo?: string
    howToDoIt?: string
    executionReference?: string
    isRequired?: boolean
    stepNumber?: number
  }>
}

export interface LogoConcept {
  id: string
  name: string
  style: string
  rationale: string
  prompt: string
}

function getBrowserApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api'
}

export function getStoredValue(key: keyof typeof VENTRAPATH_STORAGE_KEYS) {
  if (typeof window === 'undefined') {
    return null
  }

  const primaryKey = VENTRAPATH_STORAGE_KEYS[key]
  const primaryValue = window.localStorage.getItem(primaryKey)
  if (primaryValue) {
    return primaryValue
  }

  const legacyKey = LEGACY_STORAGE_KEYS[key]
  if (!legacyKey) {
    return null
  }

  const legacyValue = window.localStorage.getItem(legacyKey)
  if (legacyValue) {
    window.localStorage.setItem(primaryKey, legacyValue)
  }

  return legacyValue
}

export function setStoredValue(key: keyof typeof VENTRAPATH_STORAGE_KEYS, value: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(VENTRAPATH_STORAGE_KEYS[key], value)

  const legacyKey = LEGACY_STORAGE_KEYS[key]
  if (legacyKey) {
    window.localStorage.setItem(legacyKey, value)
  }
}

export function clearProjectSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(VENTRAPATH_STORAGE_KEYS.projectId)
  window.localStorage.removeItem(VENTRAPATH_STORAGE_KEYS.projectName)
  window.localStorage.removeItem(VENTRAPATH_STORAGE_KEYS.idea)
  window.localStorage.removeItem(VENTRAPATH_STORAGE_KEYS.country)
  window.localStorage.removeItem(VENTRAPATH_STORAGE_KEYS.lastVisitedPath)
  window.localStorage.removeItem(LEGACY_STORAGE_KEYS.projectId ?? '')
  window.localStorage.removeItem(LEGACY_STORAGE_KEYS.projectName ?? '')
  window.localStorage.removeItem(LEGACY_STORAGE_KEYS.idea ?? '')
  window.localStorage.removeItem(LEGACY_STORAGE_KEYS.country ?? '')
  window.localStorage.removeItem(LEGACY_STORAGE_KEYS.lastVisitedPath ?? '')
}

export function getOrCreateUserId() {
  const existing = getStoredValue('userId')

  if (existing) {
    return existing
  }

  const created = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-ventrapath-user`
  setStoredValue('userId', created)
  return created
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const userId = getOrCreateUserId()
  const response = await fetch(`${getBrowserApiBase()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      ...(options.headers ?? {}),
    },
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Request failed')
  }

  return payload as T
}

function canUseLocalEngine() {
  return typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_LOCAL_FALLBACK === 'true'
}

async function withLocalFallback<T>(remote: () => Promise<T>, local: () => Promise<T>) {
  try {
    return await remote()
  } catch (error) {
    if (!canUseLocalEngine()) {
      console.error('[ventrapath] remote API unavailable and local fallback is disabled', error)
      throw error
    }

    console.warn('[ventrapath] remote API unavailable, falling back to local engine', error)
    return local()
  }
}

export async function createProject(project: {
  idea: string
  country: string
  name?: string
  region?: string | null
  currencyCode?: string
  hoursPerWeek?: number
}) {
  return withLocalFallback(
    () => apiRequest<{ ok: true; data: { project: { id: string; name: string } } }>('/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: project.name ?? 'Untitled project',
        idea: project.idea,
        country: project.country,
        region: project.region ?? null,
        currencyCode: project.currencyCode ?? 'AUD',
        hoursPerWeek: project.hoursPerWeek ?? 10,
      }),
    }),
    async () => {
      const created = await createLocalProject({
        userId: getOrCreateUserId(),
        name: project.name,
        idea: project.idea,
        country: project.country,
        region: project.region,
        currencyCode: project.currencyCode,
        hoursPerWeek: project.hoursPerWeek,
      })

      return {
        ok: true,
        data: {
          project: {
            id: created.id,
            name: created.name,
          },
        },
      }
    },
  )
}

export async function generateBlueprint(projectId: string) {
  return withLocalFallback(
    () => apiRequest<{ ok: true; data: { blueprint: BlueprintData } }>(`/projects/${projectId}/blueprint/generate`, {
      method: 'POST',
      body: JSON.stringify({ regenerate: true }),
    }),
    async () => ({
      ok: true,
      data: {
        blueprint: await generateLocalBlueprint(projectId),
      },
    }),
  )
}

export async function getBlueprint(projectId: string) {
  return withLocalFallback(
    () => apiRequest<{ ok: true; data: { blueprint: BlueprintData } }>(`/projects/${projectId}/blueprint`),
    async () => ({
      ok: true,
      data: {
        blueprint: await getLocalBlueprint(projectId),
      },
    }),
  )
}

export async function getPhase(projectId: string, phaseNumber: number) {
  return withLocalFallback(
    () => apiRequest<{ ok: true; data: { phase: PhaseData } }>(`/projects/${projectId}/phases/${phaseNumber}`),
    async () => ({
      ok: true,
      data: {
        phase: await getLocalPhase(projectId, phaseNumber),
      },
    }),
  )
}

export async function generatePhase(projectId: string, phaseNumber: number) {
  return withLocalFallback(
    () => apiRequest<{ ok: true; data: { phase: PhaseData } }>(`/projects/${projectId}/phases/${phaseNumber}/generate`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),
    async () => ({
      ok: true,
      data: {
        phase: await generateLocalPhase(projectId, phaseNumber),
      },
    }),
  )
}

export async function updatePhase(projectId: string, phaseNumber: number, updates: {
  userState?: Record<string, unknown>
  progress?: {
    totalSteps?: number
    completedSteps?: number
  }
}) {
  return withLocalFallback(
    () => apiRequest<{ ok: true; data: { phase: PhaseData } }>(`/projects/${projectId}/phases/${phaseNumber}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
    async () => ({
      ok: true,
      data: {
        phase: await updateLocalPhase(projectId, phaseNumber, updates),
      },
    }),
  )
}

export async function generateLogoConcepts(projectId: string, prompt: string) {
  return withLocalFallback(
    () => apiRequest<{ ok: true; data: { logoConcepts: LogoConcept[]; source: string; agent: string; generatedAt: string } }>(`/projects/${projectId}/phases/1/logo-concepts`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),
    async () => ({
      ok: true,
      data: {
        logoConcepts: [
          {
            id: 'wordmark',
            name: 'Wordmark',
            style: 'Typography-first',
            rationale: 'A clean wordmark gives the brand the fastest path to looking credible and premium across the product surface.',
            prompt,
          },
          {
            id: 'icon-wordmark',
            name: 'Icon + Wordmark',
            style: 'Symbol plus name',
            rationale: 'A compact symbol plus wordmark gives the brand a recognisable mark for app, web, and packaging use.',
            prompt: `${prompt} Create an icon + wordmark variant that feels ownable and commercially credible.`,
          },
          {
            id: 'minimal-premium',
            name: 'Minimal Premium',
            style: 'Editorial / luxury restraint',
            rationale: 'A more restrained premium direction helps the brand feel more mature and differentiated from generic startup visuals.',
            prompt: `${prompt} Create a more minimal premium variant with restrained luxury cues and sharper typography.`,
          },
        ],
        source: 'local-fallback',
        agent: 'logo-designer',
        generatedAt: new Date().toISOString(),
      },
    }),
  )
}
