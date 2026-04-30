export const VENTRAPATH_STORAGE_KEYS = {
  userId: 'ventrapath_user_id',
  projectId: 'ventrapath_project_id',
  idea: 'ventrapath_idea',
  country: 'ventrapath_country',
  projectName: 'ventrapath_project_name',
} as const

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

function getBrowserApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api'
}

export function getStoredValue(key: keyof typeof VENTRAPATH_STORAGE_KEYS) {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(VENTRAPATH_STORAGE_KEYS[key])
}

export function setStoredValue(key: keyof typeof VENTRAPATH_STORAGE_KEYS, value: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(VENTRAPATH_STORAGE_KEYS[key], value)
}

export function clearProjectSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(VENTRAPATH_STORAGE_KEYS.projectId)
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

export async function createProject(project: {
  idea: string
  country: string
  name?: string
  region?: string | null
  currencyCode?: string
  hoursPerWeek?: number
}) {
  return apiRequest<{ ok: true; data: { project: { id: string; name: string } } }>('/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: project.name ?? 'Untitled project',
      idea: project.idea,
      country: project.country,
      region: project.region ?? null,
      currencyCode: project.currencyCode ?? 'AUD',
      hoursPerWeek: project.hoursPerWeek ?? 10,
    }),
  })
}

export async function generateBlueprint(projectId: string) {
  return apiRequest<{ ok: true; data: { blueprint: BlueprintData } }>(`/projects/${projectId}/blueprint/generate`, {
    method: 'POST',
    body: JSON.stringify({ regenerate: true }),
  })
}

export async function getBlueprint(projectId: string) {
  return apiRequest<{ ok: true; data: { blueprint: BlueprintData } }>(`/projects/${projectId}/blueprint`)
}

export async function getPhase(projectId: string, phaseNumber: number) {
  return apiRequest<{ ok: true; data: { phase: PhaseData } }>(`/projects/${projectId}/phases/${phaseNumber}`)
}

export async function generatePhase(projectId: string, phaseNumber: number) {
  return apiRequest<{ ok: true; data: { phase: PhaseData } }>(`/projects/${projectId}/phases/${phaseNumber}/generate`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}
