'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Compass, ExternalLink, Home, Loader2, Sparkles, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateLogoConcepts, PhaseData, type LogoConcept, getBlueprint, generatePhase, getPhase, getStoredValue, setStoredValue, updatePhase } from '@/lib/ventrapath-client'

function findLayer(generatedContent: Record<string, unknown> | undefined) {
  if (!generatedContent) return null

  const entry = Object.entries(generatedContent).find(([key, value]) => key.endsWith('Layer') && value && typeof value === 'object')
  return entry ? entry[1] as Record<string, unknown> : null
}

function findLayerPosture(layer: Record<string, unknown> | null) {
  if (!layer) return ''

  const postureEntry = Object.entries(layer).find(([key, value]) => {
    if (typeof value !== 'string' || !value.trim()) return false
    return key === 'positioning' || key.endsWith('Posture')
  })

  return postureEntry ? postureEntry[1] as string : ''
}

function prettyLabel(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/^./, (char) => char.toUpperCase())
}

function isExternalLinkKey(key: string) {
  return ['url', 'link', 'href'].includes(key)
}

function renderExternalLink(value: string, label = 'Open local reference') {
  return (
    <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
      {label} <ExternalLink className="h-4 w-4" />
    </a>
  )
}

function asRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : []
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function firstNonEmpty(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function getProjectHandleSeed(projectName: string, idea: string) {
  const raw = firstNonEmpty(projectName, idea, 'ventrapathbiz').toLowerCase().replace(/[^a-z0-9]+/g, '')
  return raw || 'ventrapathbiz'
}

function getBusinessNameAuthority(country: string, businessName: string) {
  const normalized = country.trim().toLowerCase()
  const query = encodeURIComponent(businessName.trim())

  if (normalized === 'australia') {
    return {
      label: 'Check business name with ASIC',
      url: `https://connectonline.asic.gov.au/RegistrySearch/faces/landing/SearchRegisters.jspx?searchTab=bnSearch&searchText=${query}`,
      note: 'Business names in Australia are checked through ASIC registers before you spend on signage, branding, or print.',
    }
  }

  if (normalized === 'united kingdom' || normalized === 'uk') {
    return {
      label: 'Check company name with Companies House',
      url: `https://find-and-update.company-information.service.gov.uk/search?q=${query}`,
      note: 'Check whether the intended name is already taken or too close to an existing registration.',
    }
  }

  if (normalized === 'canada') {
    return {
      label: 'Check federal business name in Canada',
      url: `https://ised-isde.canada.ca/cc/lgcy/fdrlCrpSrch.html?text=${query}`,
      note: 'Canada can require federal and provincial checks, so use this as a first-pass name screen before locking the brand.',
    }
  }

  if (normalized === 'united states' || normalized === 'us' || normalized === 'usa') {
    return {
      label: 'Check your state business registry',
      url: 'https://www.sba.gov/business-guide/launch-your-business/register-your-business',
      note: 'US business names are usually registered at state level, so start with the SBA guide and then check the right state registry.',
    }
  }

  return {
    label: 'Check business name with local registry',
    url: '',
    note: 'Check the local business-name registry before locking the brand name.',
  }
}

function getHandleAvailabilityUrl(handleSeed: string) {
  return `https://namechk.com/${encodeURIComponent(handleSeed)}`
}

function getDomainSearchUrl(domain: string) {
  return `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`
}

function slugifyBrandName(name: string) {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim()

  return normalized || 'ventrapathbiz'
}

function getPhaseDraftStorageKey(projectId: string, phaseNumber: number) {
  return `ventrapath:phase-draft:${projectId}:${phaseNumber}`
}

function readPhaseDraft(projectId: string, phaseNumber: number) {
  if (typeof window === 'undefined' || !projectId) return null

  try {
    const raw = window.localStorage.getItem(getPhaseDraftStorageKey(projectId, phaseNumber))
    if (!raw) return null

    const parsed = JSON.parse(raw) as {
      completedStepIds?: unknown
      richStepState?: unknown
      updatedAt?: unknown
    }

    return {
      completedStepIds: Array.isArray(parsed.completedStepIds)
        ? parsed.completedStepIds.filter((value): value is string => typeof value === 'string')
        : [],
      richStepState: asRecord(parsed.richStepState) as Record<string, Record<string, unknown>> ?? {},
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0,
    }
  } catch {
    return null
  }
}

function writePhaseDraft(projectId: string, phaseNumber: number, completedStepIds: string[], richStepState: Record<string, Record<string, unknown>>) {
  if (typeof window === 'undefined' || !projectId) return

  window.localStorage.setItem(getPhaseDraftStorageKey(projectId, phaseNumber), JSON.stringify({
    completedStepIds,
    richStepState,
    updatedAt: Date.now(),
  }))
}

function clearPhaseDraft(projectId: string, phaseNumber: number) {
  if (typeof window === 'undefined' || !projectId) return
  window.localStorage.removeItem(getPhaseDraftStorageKey(projectId, phaseNumber))
}

function getTimestampValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return 0
}

function shouldUseLocalPhaseDraft(localDraft: { updatedAt: number } | null, phaseUpdatedAt: unknown) {
  if (!localDraft?.updatedAt) return false
  return localDraft.updatedAt > getTimestampValue(phaseUpdatedAt)
}

function sanitizeCompletedStepIds(stepIds: string[], steps: Array<Record<string, unknown>>) {
  const validStepKeys = new Set(steps.map((step, index) => String(step.slug ?? step.number ?? index)))
  const seen = new Set<string>()

  return stepIds.filter((stepId) => {
    if (!validStepKeys.has(stepId) || seen.has(stepId)) return false
    seen.add(stepId)
    return true
  })
}

function sanitizeRichStepState(richStepState: Record<string, Record<string, unknown>>, steps: Array<Record<string, unknown>>) {
  const validStepKeys = new Set(steps.map((step, index) => String(step.slug ?? step.number ?? index)))

  return Object.fromEntries(
    Object.entries(richStepState).filter(([stepKey, value]) => validStepKeys.has(stepKey) && value && typeof value === 'object' && !Array.isArray(value)),
  ) as Record<string, Record<string, unknown>>
}

function buildCascadeDomains(brandName: string) {
  const root = slugifyBrandName(brandName)
  return [`${root}.com`, `${root}.co`, `${root}.app`]
}

function buildCascadeSocialHandles(platforms: unknown[], brandName: string) {
  const root = slugifyBrandName(brandName)
  const values: Record<string, string> = {}

  for (const platform of platforms) {
    const record = asRecord(platform)
    const key = stringValue(record?.platform).toLowerCase().replace(/[^a-z0-9]+/g, '_') || `platform_${Object.keys(values).length + 1}`
    const platformName = stringValue(record?.platform).toLowerCase()

    values[key] = platformName.includes('linkedin') ? `company/${root}` : `@${root}`
  }

  return values
}

function getEmptyProjectContext() {
  return {
    projectName: '',
    projectIdea: '',
    storedCountry: '',
  }
}

function getStoredProjectContext() {
  return {
    projectName: getStoredValue('projectName') ?? '',
    projectIdea: getStoredValue('idea') ?? '',
    storedCountry: getStoredValue('country') ?? '',
  }
}

const phaseNavigation = [
  { number: 1, title: 'Brand', href: '/phase1/brand' },
  { number: 2, title: 'Legal', href: '/phase2/legal' },
  { number: 3, title: 'Finance', href: '/phase3/finance' },
  { number: 4, title: 'Protection', href: '/phase4/protection' },
  { number: 5, title: 'Infrastructure', href: '/phase5/infrastructure' },
  { number: 6, title: 'Marketing', href: '/phase6/marketing' },
  { number: 7, title: 'Operations', href: '/phase7/operations' },
  { number: 8, title: 'Sales', href: '/phase8/sales' },
  { number: 9, title: 'Growth & Milestones', href: '/phase9/growth' },
]

function PhaseLadder({
  phaseNumber,
  onNavigate,
}: {
  phaseNumber: number
  onNavigate?: (href: string) => void | Promise<void>
}) {
  function handleNavigate(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!onNavigate) return
    event.preventDefault()
    void onNavigate(href)
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-background/50 p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Phase ladder</p>
          <p className="text-sm text-muted-foreground">Move through phases without losing the canonical route flow.</p>
        </div>
        <Button asChild variant="outline" size="sm"><Link href="/blueprint" onClick={(event) => handleNavigate(event, '/blueprint')}>Blueprint</Link></Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {phaseNavigation.map((phaseLink) => {
          const isActive = phaseLink.number === phaseNumber
          const isPast = phaseLink.number < phaseNumber

          return (
            <Link
              key={phaseLink.number}
              href={phaseLink.href}
              onClick={(event) => handleNavigate(event, phaseLink.href)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${isActive ? 'border-primary bg-primary/10 text-primary' : isPast ? 'border-primary/20 bg-primary/5 text-foreground hover:border-primary/40' : 'border-border/60 bg-background/80 text-muted-foreground hover:border-primary/30 hover:text-foreground'}`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${isActive ? 'bg-primary text-primary-foreground' : isPast ? 'bg-primary/15 text-primary' : 'bg-surface text-muted-foreground'}`}>
                {phaseLink.number}
              </span>
              <span>{phaseLink.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function PhaseInteractiveStep({
  phaseNumber,
  step,
  stepIndex,
  projectId,
  projectContext,
  businessContext,
  activeBusinessName,
  onBusinessNameChange,
}: {
  phaseNumber: number
  step: Record<string, unknown>
  stepIndex: number
  projectId: string
  projectContext: { projectName: string; projectIdea: string; storedCountry: string }
  businessContext: string
  activeBusinessName: string
  onBusinessNameChange: (name: string) => void
}) {
  const stepNumber = String(step.number ?? stepIndex + 1)
  const title = String(step.title ?? `Step ${stepIndex + 1}`)
  const description = stringValue(step.description)
  const helper = asRecord(step.helper)
  const input = asRecord(step.input)
  const suggestions = asRecord(step.suggestions)
  const recommendedName = asRecord(suggestions?.recommendedName)
  const nameOptions = asArray(suggestions?.nameOptions)
  const fields = asArray(step.fields)
  const logoOptions = asArray(step.logoOptions)
  const providers = asArray(step.providers)
  const platforms = asArray(step.platforms)
  const suggestedDomains = asArray(step.suggestedDomains)
  const fontOptions = asArray(step.fontOptions)
  const colourPalette = asRecord(step.colourPalette)
  const paletteEntries = colourPalette ? Object.entries(colourPalette) : []
  const aiPromptSeed = stringValue(step.aiPromptSeed)
  const cta = stringValue(step.cta)

  const [textValue, setTextValue] = useState(firstNonEmpty(activeBusinessName, projectContext.projectName, stringValue(recommendedName?.name)))
  const [positioningState, setPositioningState] = useState<Record<string, string>>(() => Object.fromEntries(
    fields.map((field) => {
      const record = asRecord(field)
      return [String(record?.key ?? ''), stringValue(record?.placeholder)]
    }),
  ))
  const [selectedLogoMode, setSelectedLogoMode] = useState<string>('')
  const [selectedPalette, setSelectedPalette] = useState<string>(paletteEntries[0]?.[0] ?? '')
  const [selectedFont, setSelectedFont] = useState<string>(stringValue(asRecord(fontOptions[0])?.name))
  const [socialHandles, setSocialHandles] = useState<Record<string, string>>(() => buildCascadeSocialHandles(platforms, firstNonEmpty(activeBusinessName, projectContext.projectName, stringValue(recommendedName?.name))))
  const [logoConcepts, setLogoConcepts] = useState<LogoConcept[]>([])
  const [logoLoading, setLogoLoading] = useState(false)
  const [logoError, setLogoError] = useState('')
  const [uploadedLogoName, setUploadedLogoName] = useState('')
  const [uploadedLogoDataUrl, setUploadedLogoDataUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const resolvedBusinessName = firstNonEmpty(activeBusinessName, textValue, stringValue(recommendedName?.name), projectContext.projectName, projectContext.projectIdea)
  const businessNameAuthority = getBusinessNameAuthority(projectContext.storedCountry, resolvedBusinessName)
  const handleSeed = slugifyBrandName(resolvedBusinessName)
  const cascadedDomains = suggestedDomains.length > 0 ? buildCascadeDomains(resolvedBusinessName) : []

  useEffect(() => {
    setTextValue(firstNonEmpty(activeBusinessName, projectContext.projectName, stringValue(recommendedName?.name)))
  }, [activeBusinessName, projectContext.projectName, recommendedName])

  useEffect(() => {
    if (step.slug !== 'social-handles') return
    setSocialHandles(buildCascadeSocialHandles(platforms, resolvedBusinessName))
  }, [resolvedBusinessName, platforms, step.slug])

  function confirmBusinessName(name: string) {
    const cleanName = name.trim()
    if (!cleanName) return
    setTextValue(cleanName)
    onBusinessNameChange(cleanName)
  }

  async function handleGenerateLogoConcepts() {
    if (!projectId) return

    setSelectedLogoMode('ai-generate')
    setLogoLoading(true)
    setLogoError('')

    try {
      const payload = await generateLogoConcepts(projectId, aiPromptSeed)
      setLogoConcepts(payload.data.logoConcepts)
    } catch (error) {
      setLogoError(error instanceof Error ? error.message : 'Failed to generate logo concepts')
    } finally {
      setLogoLoading(false)
    }
  }

  function handleUploadLogoClick() {
    setSelectedLogoMode('upload')
    fileInputRef.current?.click()
  }

  function handleLogoFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedLogoName(file.name)
    setLogoError('')

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedLogoDataUrl(reader.result)
      }
    }
    reader.onerror = () => {
      setLogoError('Could not read that logo file')
    }
    reader.readAsDataURL(file)
  }

  if (phaseNumber !== 1) {
    return null
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stepIndex * 0.05 }}
      className="rounded-3xl border border-border/50 bg-surface/60 p-6 md:p-8"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">{stepNumber}</div>
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
        </div>
      </div>

      {helper ? (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {helper.howToDoThis ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <strong className="mb-2 block text-primary">How to do this</strong>
              <p className="leading-relaxed text-foreground/90">{String(helper.howToDoThis)}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {step.slug === 'business-name' ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
            <label className="mb-2 block text-sm font-medium text-primary">{stringValue(input?.label) || 'Business name'}</label>
            <input
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
              className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
              placeholder={stringValue(recommendedName?.name) || projectContext.projectName || 'Your business name'}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              {businessNameAuthority.url ? (
                <Button asChild type="button">
                  <a href={businessNameAuthority.url} target="_blank" rel="noreferrer">{stringValue(input?.cta) || businessNameAuthority.label}</a>
                </Button>
              ) : (
                <Button type="button" disabled>{stringValue(input?.cta) || businessNameAuthority.label}</Button>
              )}
              <Button type="button" variant="outline" onClick={() => confirmBusinessName(stringValue(recommendedName?.name))}>Use recommended name</Button>
              <Button type="button" variant="secondary" onClick={() => confirmBusinessName(textValue)} disabled={!textValue.trim()}>
                Confirm this name
              </Button>
            </div>
            {activeBusinessName ? <p className="mt-3 text-xs text-primary">Locked name: {activeBusinessName}</p> : null}
            {businessNameAuthority.note ? <p className="mt-3 text-xs text-muted-foreground">{businessNameAuthority.note}</p> : null}
          </div>

          {nameOptions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {nameOptions.map((option, index) => {
                const record = asRecord(option)
                const optionName = stringValue(record?.name)
                return (
                  <button
                    key={`${optionName}-${index}`}
                    type="button"
                    onClick={() => confirmBusinessName(optionName)}
                    className={`rounded-2xl border p-5 text-left transition ${resolvedBusinessName === optionName ? 'border-primary bg-primary/10' : 'border-border/50 bg-background/60 hover:border-primary/50'}`}
                  >
                    <div className="text-base font-semibold">{optionName}</div>
                    {record?.rationale ? <p className="mt-2 text-sm text-muted-foreground">{String(record.rationale)}</p> : null}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {step.slug === 'brand-positioning' ? (
        <div className="space-y-4">
          {businessContext ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <strong className="mb-2 block text-primary">Blueprint anchor</strong>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{businessContext}</p>
            </div>
          ) : null}
          {fields.map((field, index) => {
            const record = asRecord(field)
            const key = String(record?.key ?? `field_${index}`)
            return (
              <div key={key} className="rounded-2xl border border-border/50 bg-background/60 p-5">
                <label className="mb-2 block text-sm font-medium text-primary">{stringValue(record?.label)}</label>
                <textarea
                  value={positioningState[key] ?? ''}
                  onChange={(event) => setPositioningState((current) => ({ ...current, [key]: event.target.value }))}
                  rows={4}
                  className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
                  placeholder={stringValue(record?.placeholder)}
                />
              </div>
            )
          })}
        </div>
      ) : null}

      {step.slug === 'logo-visual-identity' ? (
        <div className="space-y-5">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFileChange} />

          <div className="flex flex-wrap gap-3">
            {logoOptions.map((option, index) => {
              const record = asRecord(option)
              const type = stringValue(record?.type)
              const selected = selectedLogoMode === type
              const label = stringValue(record?.label)
              const onClick = type === 'upload'
                ? handleUploadLogoClick
                : type === 'ai-generate'
                  ? handleGenerateLogoConcepts
                  : () => setSelectedLogoMode(type)
              return (
                <button
                  key={`${type}-${index}`}
                  type="button"
                  onClick={onClick}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${selected ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 bg-background/60 hover:border-primary/50'}`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {uploadedLogoName ? (
            <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
              <strong className="mb-2 block text-primary">Uploaded logo</strong>
              <p className="text-sm text-foreground/90">{uploadedLogoName}</p>
              {uploadedLogoDataUrl ? <img src={uploadedLogoDataUrl} alt={uploadedLogoName} className="mt-4 max-h-40 rounded-xl border border-border/50 object-contain" /> : null}
            </div>
          ) : null}

          {aiPromptSeed ? (
            <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
              <strong className="mb-2 block text-primary">AI logo prompt seed</strong>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{aiPromptSeed}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" onClick={handleGenerateLogoConcepts} disabled={logoLoading}>
                  {logoLoading ? 'Generating concepts…' : 'Generate with AI'}
                </Button>
                <Button type="button" variant="outline" onClick={handleUploadLogoClick}>
                  <Upload className="mr-2 h-4 w-4" />Upload Logo
                </Button>
              </div>
            </div>
          ) : null}

          {logoError ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {logoError}
            </div>
          ) : null}

          {logoConcepts.length > 0 ? (
            <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
              <strong className="mb-4 block text-primary">Logo Designer concepts</strong>
              <div className="grid gap-4 md:grid-cols-3">
                {logoConcepts.map((concept) => (
                  <div key={concept.id} className="rounded-2xl border border-border/50 bg-surface/70 p-4">
                    <div className="text-sm font-medium uppercase tracking-wider text-primary">{concept.style}</div>
                    <div className="mt-2 text-lg font-semibold">{concept.name}</div>
                    <p className="mt-3 text-sm text-muted-foreground">{concept.rationale}</p>
                    <div className="mt-4 rounded-xl border border-border/50 bg-background/80 p-3 text-xs text-foreground/90 whitespace-pre-wrap">
                      {concept.prompt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {paletteEntries.length > 0 ? (
            <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
              <strong className="mb-4 block text-primary">Colour palette</strong>
              <div className="grid gap-4 md:grid-cols-2">
                {paletteEntries.map(([name, colors]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedPalette(name)}
                    className={`rounded-2xl border p-4 text-left transition ${selectedPalette === name ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/50'}`}
                  >
                    <div className="mb-3 flex gap-2">
                      {asArray(colors).map((color, index) => (
                        <span key={`${name}-${index}`} className="h-8 w-8 rounded-full border border-white/20" style={{ backgroundColor: String(color) }} />
                      ))}
                    </div>
                    <div className="text-sm font-medium">{prettyLabel(name)}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {fontOptions.length > 0 ? (
            <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
              <strong className="mb-4 block text-primary">Font direction</strong>
              <div className="flex flex-wrap gap-3">
                {fontOptions.map((font, index) => {
                  const record = asRecord(font)
                  const fontName = stringValue(record?.name)
                  return (
                    <button
                      key={`${fontName}-${index}`}
                      type="button"
                      onClick={() => setSelectedFont(fontName)}
                      className={`rounded-xl border px-4 py-3 text-left transition ${selectedFont === fontName ? 'border-primary bg-primary/10' : 'border-border/50 bg-background/60 hover:border-primary/50'}`}
                    >
                      <div className="font-semibold">{fontName}</div>
                      {record?.style ? <div className="text-xs text-muted-foreground">{String(record.style)}</div> : null}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {step.slug === 'domain-email-setup' ? (
        <div className="space-y-5">
          {suggestedDomains.length > 0 ? (
            <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
              <strong className="mb-4 block text-primary">Suggested domains</strong>
              <div className="flex flex-wrap gap-3">
                {cascadedDomains.map((domain, index) => (
                  <a
                    key={`${domain}-${index}`}
                    href={getDomainSearchUrl(String(domain))}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-border/50 bg-surface px-4 py-3 text-sm hover:border-primary/50"
                  >
                    {String(domain)}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {providers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {providers.map((provider, index) => {
                const record = asRecord(provider)
                const url = stringValue(record?.url)
                return url ? (
                  <a
                    key={`${record?.name}-${index}`}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-border/50 bg-background/60 p-5 transition hover:border-primary/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{stringValue(record?.name)}</div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {record?.reason ? <p className="mt-3 text-sm text-muted-foreground">{String(record.reason)}</p> : null}
                  </a>
                ) : (
                  <div
                    key={`${record?.name}-${index}`}
                    className="rounded-2xl border border-border/50 bg-background/60 p-5 opacity-70"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{stringValue(record?.name)}</div>
                    </div>
                    {record?.reason ? <p className="mt-3 text-sm text-muted-foreground">{String(record.reason)}</p> : null}
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {step.slug === 'social-handles' ? (
        <div className="space-y-4">
          {platforms.map((platform, index) => {
            const record = asRecord(platform)
            const key = stringValue(record?.platform).toLowerCase().replace(/[^a-z0-9]+/g, '_') || `platform_${index + 1}`
            return (
              <div key={key} className="rounded-2xl border border-border/50 bg-background/60 p-5">
                <label className="mb-2 block text-sm font-medium text-primary">{stringValue(record?.platform)}</label>
                <input
                  value={socialHandles[key] ?? (key.includes('linkedin') ? `company/${handleSeed}` : `@${handleSeed}`)}
                  onChange={(event) => setSocialHandles((current) => ({ ...current, [key]: event.target.value }))}
                  className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
                  placeholder={key.includes('linkedin') ? `company/${handleSeed}` : `@${handleSeed}`}
                />
              </div>
            )
          })}
          {cta ? (
            <Button asChild type="button">
              <a href={getHandleAvailabilityUrl(handleSeed)} target="_blank" rel="noreferrer">{cta}</a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </motion.section>
  )
}

function LegalInteractiveStep({
  step,
  stepIndex,
  projectContext,
}: {
  step: Record<string, unknown>
  stepIndex: number
  projectContext: { projectName: string; projectIdea: string; storedCountry: string }
}) {
  const stepNumber = String(step.number ?? stepIndex + 1)
  const title = String(step.title ?? `Step ${stepIndex + 1}`)
  const description = stringValue(step.description)
  const helper = asRecord(step.helper)
  const input = asRecord(step.input)
  const linkCard = asRecord(step.linkCard)
  const taxSummary = asRecord(step.taxSummary)
  const options = asArray(step.options)
  const providers = asArray(step.providers)
  const documents = asArray(step.documents)
  const checklist = asArray(step.checklist)
  const defaultValue = firstNonEmpty(stringValue(input?.value), projectContext.projectName, projectContext.projectIdea)

  const [textValue, setTextValue] = useState(defaultValue)
  const [selectedOption, setSelectedOption] = useState(stringValue(asRecord(options.find((option) => Boolean(asRecord(option)?.recommended)))?.name))
  const [selectedProvider, setSelectedProvider] = useState('')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setTextValue(defaultValue)
  }, [defaultValue])

  function toggleChecklistItem(item: string) {
    setCheckedItems((current) => ({ ...current, [item]: !current[item] }))
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stepIndex * 0.05 }}
      className="rounded-3xl border border-border/50 bg-surface/60 p-6 md:p-8"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">{stepNumber}</div>
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
        </div>
      </div>

      {helper?.howToDoThis ? (
        <div className="mb-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <strong className="mb-2 block text-primary">How to do this</strong>
            <p className="leading-relaxed text-foreground/90">{String(helper.howToDoThis)}</p>
          </div>
        </div>
      ) : null}

      {step.slug === 'choose-business-structure' ? (
        <div className="grid gap-4 md:grid-cols-3">
          {options.map((option, index) => {
            const record = asRecord(option)
            const name = stringValue(record?.name)
            const selected = selectedOption === name
            return (
              <button
                key={`${name}-${index}`}
                type="button"
                onClick={() => setSelectedOption(name)}
                className={`rounded-2xl border p-5 text-left transition ${selected ? 'border-primary bg-primary/10' : 'border-border/50 bg-background/60 hover:border-primary/50'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-base font-semibold">{name}</div>
                  {record?.recommended ? <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Recommended</span> : null}
                </div>
                {record?.summary ? <p className="mt-3 text-sm text-muted-foreground">{String(record.summary)}</p> : null}
                {asArray(record?.pros).length > 0 ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Pros</p>
                    <ul className="space-y-1 text-sm text-foreground/90">
                      {asArray(record?.pros).map((item, itemIndex) => <li key={`${name}-pro-${itemIndex}`}>• {String(item)}</li>)}
                    </ul>
                  </div>
                ) : null}
                {asArray(record?.cons).length > 0 ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Cons</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {asArray(record?.cons).map((item, itemIndex) => <li key={`${name}-con-${itemIndex}`}>• {String(item)}</li>)}
                    </ul>
                  </div>
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}

      {(step.slug === 'register-your-business' || step.slug === 'tax-business-number') && input ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
            <label className="mb-2 block text-sm font-medium text-primary">{stringValue(input.label) || 'Value'}</label>
            <input
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
              className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
              placeholder={stringValue(input.label) || 'Enter value'}
            />
          </div>

          {linkCard ? (
            stringValue(linkCard.url) ? (
              <a
                href={stringValue(linkCard.url)}
                target="_blank"
                rel="noreferrer"
                className="flex rounded-2xl border border-border/50 bg-background/60 p-5 transition hover:border-primary/50"
              >
                <div>
                  <div className="flex items-center gap-2 font-semibold">
                    {stringValue(linkCard.label)}
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {linkCard.subtext ? <p className="mt-2 text-sm text-muted-foreground">{String(linkCard.subtext)}</p> : null}
                </div>
              </a>
            ) : (
              <div className="rounded-2xl border border-border/50 bg-background/60 p-5 opacity-70">
                <div className="font-semibold">{stringValue(linkCard.label)}</div>
                {linkCard.subtext ? <p className="mt-2 text-sm text-muted-foreground">{String(linkCard.subtext)}</p> : null}
              </div>
            )
          ) : null}
        </div>
      ) : null}

      {step.slug === 'set-up-taxes' ? (
        <div className="space-y-5">
          {taxSummary ? (
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(taxSummary).map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-border/50 bg-background/60 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{prettyLabel(key)}</p>
                  <p className="mt-2 text-lg font-semibold">{String(value)}</p>
                </div>
              ))}
            </div>
          ) : null}

          {linkCard && stringValue(linkCard.url) ? (
            <a href={stringValue(linkCard.url)} target="_blank" rel="noreferrer" className="flex rounded-2xl border border-border/50 bg-background/60 p-5 transition hover:border-primary/50">
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  {stringValue(linkCard.label)}
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                {linkCard.subtext ? <p className="mt-2 text-sm text-muted-foreground">{String(linkCard.subtext)}</p> : null}
              </div>
            </a>
          ) : null}

          {checklist.length > 0 ? (
            <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Tax setup checklist</p>
              <div className="space-y-3">
                {checklist.map((item, index) => {
                  const label = String(item)
                  const checked = Boolean(checkedItems[label])
                  return (
                    <label key={`${label}-${index}`} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/50 bg-surface/60 p-4">
                      <input type="checkbox" checked={checked} onChange={() => toggleChecklistItem(label)} className="mt-1 h-4 w-4 rounded border-border" />
                      <span className="text-sm text-foreground/90">{label}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {step.slug === 'business-bank-account' ? (
        <div className="grid gap-4 md:grid-cols-3">
          {providers.map((provider, index) => {
            const record = asRecord(provider)
            const name = stringValue(record?.name)
            const selected = selectedProvider === name
            const url = stringValue(record?.url)
            return (
              <div key={`${name}-${index}`} className={`rounded-2xl border p-5 transition ${selected ? 'border-primary bg-primary/10' : 'border-border/50 bg-background/60'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{name}</div>
                    {record?.reason ? <p className="mt-3 text-sm text-muted-foreground">{String(record.reason)}</p> : null}
                  </div>
                  <button type="button" onClick={() => setSelectedProvider(name)} className="rounded-full border border-border/60 px-3 py-1 text-xs hover:border-primary/50">Pick</button>
                </div>
                {url ? (
                  <a href={url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
                    Visit provider <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}

      {step.slug === 'basic-legal-protection' ? (
        <div className="space-y-5">
          {step.disclaimer ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-foreground/90">
              <strong className="mb-2 block text-amber-200">Important</strong>
              {String(step.disclaimer)}
            </div>
          ) : null}

          {documents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {documents.map((document, index) => {
                const record = asRecord(document)
                return (
                  <div key={`${record?.name}-${index}`} className="rounded-2xl border border-border/50 bg-background/60 p-5">
                    <div className="font-semibold">{stringValue(record?.name)}</div>
                    {record?.purpose ? <p className="mt-3 text-sm text-muted-foreground">{String(record.purpose)}</p> : null}
                    {record?.cta ? <div className="mt-4 inline-flex rounded-full border border-border/60 px-3 py-1 text-xs text-primary">{String(record.cta)}</div> : null}
                  </div>
                )
              })}
            </div>
          ) : null}

          {checklist.length > 0 ? (
            <div className="rounded-2xl border border-border/50 bg-background/60 p-5">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Document checklist</p>
              <div className="space-y-3">
                {checklist.map((item, index) => {
                  const label = String(item)
                  const checked = Boolean(checkedItems[label])
                  return (
                    <label key={`${label}-${index}`} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/50 bg-surface/60 p-4">
                      <input type="checkbox" checked={checked} onChange={() => toggleChecklistItem(label)} className="mt-1 h-4 w-4 rounded border-border" />
                      <span className="text-sm text-foreground/90">{label}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </motion.section>
  )
}

function PhaseRichStep({
  step,
  stepIndex,
  isCompleted,
  persistedState,
  onToggleComplete,
  onStateChange,
}: {
  step: Record<string, unknown>
  stepIndex: number
  isCompleted: boolean
  persistedState?: Record<string, unknown>
  onToggleComplete: () => void
  onStateChange: (nextState: Record<string, unknown>) => void
}) {
  const stepNumber = String(step.number ?? stepIndex + 1)
  const title = String(step.title ?? `Step ${stepIndex + 1}`)
  const description = stringValue(step.description)
  const helper = asRecord(step.helper)
  const options = asArray(step.providers).length ? asArray(step.providers)
    : asArray(step.accountingOptions).length ? asArray(step.accountingOptions)
    : asArray(step.insuranceTypes).length ? asArray(step.insuranceTypes)
    : []
  const tiers = asArray(step.tiers)
  const checklist = asArray(step.checklist).length ? asArray(step.checklist)
    : asArray(step.weeklyTrackingTasks).length ? asArray(step.weeklyTrackingTasks)
    : asArray(step.privacyItems).length ? asArray(step.privacyItems)
    : asArray(step.contractItems).length ? asArray(step.contractItems)
    : asArray(step.disclaimerTypes).length ? asArray(step.disclaimerTypes)
    : asArray(step.scalingChecklist).length ? asArray(step.scalingChecklist)
    : []
  const tools = asArray(step.tools)
  const taxSummary = asRecord(step.taxSummary)
  const dashboard = asRecord(step.dashboard)
  const exampleBlock = asRecord(step.example)
  const stringCollections = [
    'whatToDo',
    'howToDoIt',
    'incomeCategories',
    'expenseCategories',
    'messagePrompts',
    'contentPillars',
    'proofAssets',
  ]
  const objectCollections = [
    'riskCategories',
    'taxRegistrations',
    'softwareCategories',
    'folderStructure',
    'crmFields',
    'securityChecklist',
    'personaFields',
    'marketingChannels',
    'adPlatforms',
    'leadMagnetIdeas',
    'workflowStages',
    'sopCategories',
    'touchpoints',
    'metrics',
    'salesProcessStages',
    'qualificationCriteria',
    'commonObjections',
    'followUpSequence',
    'salesMetrics',
    'offerChecklist',
    'preLaunchChecklist',
    'launchDayActivities',
    'launchMetrics',
    'growthMilestones',
    'issuePriorities',
    'retentionTactics',
    'feedbackQuestions',
    'testIdeas',
    'complianceItems',
  ]
  const extraStringCollections = stringCollections
    .map((key) => ({ key, items: asArray(step[key]).map((item) => String(item)).filter(Boolean) }))
    .filter(({ items }) => items.length > 0)
  const extraCollections = objectCollections
    .map((key) => ({ key, items: asArray(step[key]) }))
    .filter(({ items }) => items.length > 0)
  const consumedKeys = new Set([
    'number',
    'slug',
    'title',
    'description',
    'helper',
    'contentType',
    'providers',
    'accountingOptions',
    'insuranceTypes',
    'tiers',
    'checklist',
    'weeklyTrackingTasks',
    'privacyItems',
    'contractItems',
    'disclaimerTypes',
    'scalingChecklist',
    'tools',
    'taxSummary',
    'dashboard',
    'example',
    'disclaimer',
    'privacyNotice',
    ...stringCollections,
    ...objectCollections,
  ])
  const remainingEntries = Object.entries(step).filter(([key, value]) => !consumedKeys.has(key) && value != null && value !== '')

  const defaultSelectedOption = stringValue(asRecord(options.find((option) => Boolean(asRecord(option)?.recommended)))?.name)
  const defaultSelectedTier = stringValue(asRecord(tiers.find((tier) => Boolean(asRecord(tier)?.highlighted)))?.name)

  const [selectedOption, setSelectedOption] = useState(() => stringValue(persistedState?.selectedOption) || defaultSelectedOption)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => Object.fromEntries(
    Object.entries(asRecord(persistedState?.checkedItems) ?? {}).map(([key, value]) => [key, Boolean(value)]),
  ))
  const [selectedTier, setSelectedTier] = useState(() => stringValue(persistedState?.selectedTier) || defaultSelectedTier)
  const [notes, setNotes] = useState(() => stringValue(persistedState?.notes))

  useEffect(() => {
    setSelectedOption(stringValue(persistedState?.selectedOption) || defaultSelectedOption)
  }, [defaultSelectedOption, persistedState])

  useEffect(() => {
    setSelectedTier(stringValue(persistedState?.selectedTier) || defaultSelectedTier)
  }, [defaultSelectedTier, persistedState])

  useEffect(() => {
    setCheckedItems(Object.fromEntries(
      Object.entries(asRecord(persistedState?.checkedItems) ?? {}).map(([key, value]) => [key, Boolean(value)]),
    ))
  }, [persistedState])

  useEffect(() => {
    setNotes(stringValue(persistedState?.notes))
  }, [persistedState])

  function buildNextStepState(overrides: Record<string, unknown> = {}) {
    return {
      ...(persistedState ?? {}),
      selectedOption,
      checkedItems,
      selectedTier,
      notes,
      ...overrides,
    }
  }

  function handleSelectedOption(name: string) {
    setSelectedOption(name)
    onStateChange(buildNextStepState({ selectedOption: name }))
  }

  function handleSelectedTier(name: string) {
    setSelectedTier(name)
    onStateChange(buildNextStepState({ selectedTier: name }))
  }

  function handleNotesChange(nextNotes: string) {
    setNotes(nextNotes)
    onStateChange(buildNextStepState({ notes: nextNotes }))
  }

  function toggleChecklistItem(item: string) {
    const nextCheckedItems = { ...checkedItems, [item]: !checkedItems[item] }
    setCheckedItems(nextCheckedItems)
    onStateChange(buildNextStepState({ checkedItems: nextCheckedItems }))
  }

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stepIndex * 0.05 }} className="rounded-3xl border border-border/50 bg-surface/60 p-6 md:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">{stepNumber}</div>
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">{title}</h2>
              {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
            </div>
            <Button type="button" variant={isCompleted ? 'default' : 'outline'} onClick={onToggleComplete}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isCompleted ? 'Completed' : 'Mark complete'}
            </Button>
          </div>
        </div>
      </div>

      {helper?.howToDoThis ? (
        <div className="mb-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <strong className="mb-2 block text-primary">How to do this</strong>
            <p className="leading-relaxed text-foreground/90">{String(helper.howToDoThis)}</p>
          </div>
        </div>
      ) : null}

      <div className="mb-6 rounded-2xl border border-border/50 bg-background/60 p-5">
        <label className="mb-2 block text-sm font-medium text-primary">Your notes</label>
        <textarea
          value={notes}
          onChange={(event) => handleNotesChange(event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
          placeholder="Capture decisions, links, numbers, or next actions for this step."
        />
      </div>

      {typeof step.disclaimer === 'string' && step.disclaimer ? (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-foreground/90">
          <strong className="mb-2 block text-amber-200">Important</strong>
          {String(step.disclaimer)}
        </div>
      ) : null}

      {typeof step.privacyNotice === 'string' && step.privacyNotice ? (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-foreground/90">
          <strong className="mb-2 block text-primary">Privacy note</strong>
          {String(step.privacyNotice)}
        </div>
      ) : null}

      {options.length > 0 ? (
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {options.map((option, index) => {
            const record = asRecord(option)
            const name = stringValue(record?.name)
            const selected = selectedOption === name
            const features = asArray(record?.features)
            const url = stringValue(record?.url)

            return (
              <button
                key={`${name}-${index}`}
                type="button"
                onClick={() => handleSelectedOption(name)}
                className={`rounded-2xl border p-5 text-left transition ${selected ? 'border-primary bg-primary/10' : 'border-border/50 bg-background/60 hover:border-primary/50'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{stringValue(record?.logo)} {name}</div>
                  {record?.recommended ? <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Recommended</span> : null}
                </div>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {record?.bestFor ? <p><span className="font-medium text-foreground/90">Best for:</span> {String(record.bestFor)}</p> : null}
                  {record?.fees ? <p><span className="font-medium text-foreground/90">Fees:</span> {String(record.fees)}</p> : null}
                  {record?.price ? <p><span className="font-medium text-foreground/90">Price:</span> {String(record.price)}</p> : null}
                  {record?.typicalCost ? <p><span className="font-medium text-foreground/90">Typical cost:</span> {String(record.typicalCost)}</p> : null}
                  {record?.whoNeeds ? <p><span className="font-medium text-foreground/90">Who needs it:</span> {String(record.whoNeeds)}</p> : null}
                  {record?.description ? <p>{String(record.description)}</p> : null}
                  {features.length > 0 ? (
                    <ul className="space-y-1 text-foreground/90">
                      {features.map((feature, featureIndex) => <li key={`${name}-feature-${featureIndex}`}>• {String(feature)}</li>)}
                    </ul>
                  ) : null}
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex items-center gap-2 pt-2 text-primary hover:underline"
                    >
                      Open local setup link <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      ) : null}

      {tiers.length > 0 ? (
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {tiers.map((tier, index) => {
            const record = asRecord(tier)
            const name = stringValue(record?.name)
            const selected = selectedTier === name
            return (
              <button key={`${name}-${index}`} type="button" onClick={() => handleSelectedTier(name)} className={`rounded-2xl border p-5 text-left transition ${selected ? 'border-primary bg-primary/10' : 'border-border/50 bg-background/60 hover:border-primary/50'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{name}</div>
                  {record?.highlighted ? <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Most popular</span> : null}
                </div>
                <p className="mt-3 text-3xl font-bold">{stringValue(record?.currencyDisplay) || '$'}{String(record?.price ?? '')}<span className="text-sm font-medium text-muted-foreground">{stringValue(record?.billingUnit)}</span></p>
                {Array.isArray(record?.features) ? (
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {asArray(record.features).map((feature, featureIndex) => <li key={`${name}-tier-${featureIndex}`}>• {String(feature)}</li>)}
                  </ul>
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}

      {exampleBlock ? (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{stringValue(exampleBlock.title) || 'Example'}</p>
          {exampleBlock.content ? <p className="mt-2 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{String(exampleBlock.content)}</p> : null}
        </div>
      ) : null}

      {(taxSummary || dashboard) ? (
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {taxSummary ? Object.entries(taxSummary).map(([key, value]) => value ? (
            <div key={`tax-${key}`} className="rounded-2xl border border-border/50 bg-background/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{prettyLabel(key)}</p>
              <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{String(value)}</p>
            </div>
          ) : null) : null}
          {dashboard ? Object.entries(dashboard).map(([key, value]) => (
            <div key={`dash-${key}`} className="rounded-2xl border border-border/50 bg-background/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{prettyLabel(key)}</p>
              <p className="mt-2 text-2xl font-semibold">{String(value)}</p>
            </div>
          )) : null}
        </div>
      ) : null}

      {checklist.length > 0 ? (
        <div className="mb-6 rounded-2xl border border-border/50 bg-background/60 p-5">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Checklist</p>
          <div className="space-y-3">
            {checklist.map((item, index) => {
              const label = typeof item === 'string' ? item : stringValue(asRecord(item)?.item || asRecord(item)?.task || asRecord(item)?.name || asRecord(item)?.criteria || asRecord(item)?.metric || asRecord(item)?.tactic || asRecord(item)?.question)
              const checked = Boolean(checkedItems[label])
              const detailRecord = asRecord(item)
              return (
                <label key={`${label}-${index}`} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/50 bg-surface/60 p-4">
                  <input type="checkbox" checked={checked} onChange={() => toggleChecklistItem(label)} className="mt-1 h-4 w-4 rounded border-border" />
                  <div>
                    <div className="text-sm text-foreground/90">{label}</div>
                    {detailRecord ? (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {Object.entries(detailRecord)
                          .filter(([key]) => !['item', 'task', 'name', 'criteria', 'metric', 'tactic', 'question'].includes(key))
                          .map(([key, value]) => `${prettyLabel(key)}: ${String(value)}`)
                          .join(' • ')}
                      </div>
                    ) : null}
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      ) : null}

      {extraStringCollections.map(({ key, items }) => (
        <div key={key} className="mb-6 rounded-2xl border border-border/50 bg-background/60 p-5">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">{prettyLabel(key)}</p>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={`${key}-${index}`} className="rounded-xl border border-border/50 bg-surface/60 p-4 text-sm text-foreground/90">
                • {item}
              </div>
            ))}
          </div>
        </div>
      ))}

      {extraCollections.map(({ key, items }) => (
        <div key={key} className="mb-6 rounded-2xl border border-border/50 bg-background/60 p-5">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">{prettyLabel(key)}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item, index) => {
              const record = asRecord(item)
              return (
                <div key={`${key}-${index}`} className="rounded-xl border border-border/50 bg-surface/60 p-4 space-y-2">
                  {record ? Object.entries(record).map(([nestedKey, nestedValue]) => {
                    if (nestedValue == null || nestedValue === '') return null
                    if (Array.isArray(nestedValue)) {
                      return (
                        <div key={nestedKey}>
                          <p className="text-sm font-medium text-primary">{prettyLabel(nestedKey)}</p>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {nestedValue.map((entry, nestedIndex) => <li key={`${key}-${nestedKey}-${nestedIndex}`}>• {String(entry)}</li>)}
                          </ul>
                        </div>
                      )
                    }
                    if (isExternalLinkKey(nestedKey) && typeof nestedValue === 'string') {
                      return (
                        <div key={nestedKey}>
                          {renderExternalLink(nestedValue)}
                        </div>
                      )
                    }
                    return (
                      <div key={nestedKey}>
                        <span className="font-medium">{prettyLabel(nestedKey)}:</span>{' '}
                        <span className="text-muted-foreground">{String(nestedValue)}</span>
                      </div>
                    )
                  }) : <p className="text-sm text-muted-foreground">{String(item)}</p>}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {remainingEntries.length > 0 ? (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {remainingEntries.map(([key, value]) => {
            if (Array.isArray(value) || (value && typeof value === 'object')) return null
            return (
              <div key={key} className="rounded-2xl border border-border/50 bg-background/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{prettyLabel(key)}</p>
                <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{String(value)}</p>
              </div>
            )
          })}
        </div>
      ) : null}

      {tools.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool, index) => {
            const record = asRecord(tool)
            const name = stringValue(record?.name)
            const url = stringValue(record?.url)
            return url ? (
              <a key={`${name}-${index}`} href={url} target="_blank" rel="noreferrer" className="rounded-2xl border border-border/50 bg-background/60 p-5 transition hover:border-primary/50">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{name}</div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                {record?.description ? <p className="mt-3 text-sm text-muted-foreground">{String(record.description)}</p> : null}
              </a>
            ) : null
          })}
        </div>
      ) : null}
    </motion.section>
  )
}

function GenericStepCard({ step, stepIndex }: { step: Record<string, unknown>; stepIndex: number }) {
  const contentEntries = Object.entries(step).filter(([key]) => !['number', 'slug', 'title', 'description', 'helper', 'contentType'].includes(key))

  function PrimitiveCard({ label, value }: { label: string; value: string | number | boolean }) {
    return (
      <div className="rounded-xl bg-background/60 p-4">
        <strong className="mb-2 block text-sm text-primary">{prettyLabel(label)}</strong>
        <p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">{String(value)}</p>
      </div>
    )
  }

  function ObjectSummaryCard({ label, value }: { label: string; value: Record<string, unknown> }) {
    return (
      <div className="rounded-xl bg-background/60 p-4 md:col-span-2">
        <strong className="mb-3 block text-sm text-primary">{prettyLabel(label)}</strong>
        <div className="space-y-2">
          {Object.entries(value).map(([nestedKey, nestedValue]) => {
            if (nestedValue == null || nestedValue === '') return null
            return (
              <div key={nestedKey} className="rounded-lg border border-border/50 bg-surface/60 p-4">
                <span className="font-medium">{prettyLabel(nestedKey)}:</span>{' '}
                <span className="text-muted-foreground">{Array.isArray(nestedValue) ? nestedValue.join(', ') : String(nestedValue)}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  function StringListCard({ label, items }: { label: string; items: string[] }) {
    return (
      <div className="rounded-xl bg-background/60 p-4">
        <strong className="mb-3 block text-sm text-primary">{prettyLabel(label)}</strong>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${label}-${index}`} className="rounded-lg border border-border/50 bg-surface/60 p-4 text-foreground/90">• {item}</div>
          ))}
        </div>
      </div>
    )
  }

  function ObjectListCard({ label, items }: { label: string; items: Record<string, unknown>[] }) {
    return (
      <div className="rounded-xl bg-background/60 p-4 md:col-span-2">
        <strong className="mb-3 block text-sm text-primary">{prettyLabel(label)}</strong>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item, index) => (
            <div key={`${label}-${index}`} className="rounded-lg border border-border/50 bg-surface/60 p-4 space-y-2">
              {Object.entries(item).map(([nestedKey, nestedValue]) => {
                if (nestedValue == null || nestedValue === '') return null
                if (Array.isArray(nestedValue)) {
                  const nestedItems = nestedValue.map((entry) => String(entry))
                  return (
                    <div key={nestedKey}>
                      <p className="text-sm font-medium text-primary">{prettyLabel(nestedKey)}</p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {nestedItems.map((entry, nestedIndex) => <li key={`${nestedKey}-${nestedIndex}`}>• {entry}</li>)}
                      </ul>
                    </div>
                  )
                }

                if (isExternalLinkKey(nestedKey) && typeof nestedValue === 'string') {
                  return (
                    <div key={nestedKey}>
                      {renderExternalLink(nestedValue)}
                    </div>
                  )
                }

                return (
                  <div key={nestedKey}>
                    <span className="font-medium">{prettyLabel(nestedKey)}:</span>{' '}
                    <span className="text-muted-foreground">{String(nestedValue)}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  function ToolGrid({ items }: { items: Record<string, unknown>[] }) {
    return (
      <div className="rounded-xl bg-background/60 p-4 md:col-span-2">
        <strong className="mb-3 block text-sm text-primary">Tools</strong>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const name = stringValue(item.name)
            const url = stringValue(item.url)
            const description = stringValue(item.description)
            return url ? (
              <a key={`${name}-${index}`} href={url} target="_blank" rel="noreferrer" className="rounded-lg border border-border/50 bg-surface/60 p-4 transition hover:border-primary/50">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{name}</div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
              </a>
            ) : (
              <div key={`${name}-${index}`} className="rounded-lg border border-border/50 bg-surface/60 p-4">
                <div className="font-semibold">{name}</div>
                {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  function renderEntry(label: string, value: unknown) {
    if (value == null || value === '') return null

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return <PrimitiveCard key={label} label={label} value={value} />
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return null
      if (value.every((item) => typeof item === 'string')) {
        return <StringListCard key={label} label={label} items={value.map((item) => String(item))} />
      }
      if (value.every((item) => item && typeof item === 'object' && !Array.isArray(item))) {
        const records = value.map((item) => item as Record<string, unknown>)
        if (label === 'tools') {
          return <ToolGrid key={label} items={records} />
        }
        return <ObjectListCard key={label} label={label} items={records} />
      }

      return <StringListCard key={label} label={label} items={value.map((item) => String(item))} />
    }

    if (typeof value === 'object') {
      return <ObjectSummaryCard key={label} label={label} value={value as Record<string, unknown>} />
    }

    return null
  }

  return (
    <motion.section key={String(step.slug ?? step.number ?? stepIndex)} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stepIndex * 0.05 }} className="rounded-3xl border border-border/50 bg-surface/60 p-6 md:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">{String(step.number ?? stepIndex + 1)}</div>
        <div>
          <h2 className="text-2xl font-semibold">{String(step.title ?? `Step ${stepIndex + 1}`)}</h2>
          {step.description ? <p className="mt-2 text-muted-foreground">{String(step.description)}</p> : null}
        </div>
      </div>

      {step.helper && typeof step.helper === 'object' && 'howToDoThis' in step.helper ? (
        <div className="mb-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <strong className="mb-2 block text-primary">How to do this</strong>
            <p className="leading-relaxed text-foreground/90">{String((step.helper as Record<string, unknown>).howToDoThis ?? '')}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {contentEntries.map(([label, value]) => renderEntry(label, value))}
      </div>
    </motion.section>
  )
}

export function PhasePage({
  phaseNumber,
  title,
  prevHref,
  nextHref,
  prevLabel,
  nextLabel,
}: {
  phaseNumber: number
  title: string
  prevHref: string
  nextHref?: string
  prevLabel: string
  nextLabel?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<PhaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [missing, setMissing] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [projectId, setProjectId] = useState('')
  const [hasHydrated, setHasHydrated] = useState(false)
  const [projectContext, setProjectContext] = useState(getEmptyProjectContext)
  const [businessContext, setBusinessContext] = useState('')
  const [activeBusinessName, setActiveBusinessName] = useState('')
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([])
  const [richStepState, setRichStepState] = useState<Record<string, Record<string, unknown>>>({})
  const [savingProgress, setSavingProgress] = useState(false)
  const attemptedAutoGenerateRef = useRef(false)
  const latestPhaseRef = useRef<PhaseData | null>(null)
  const latestSaveRequestIdRef = useRef(0)
  const latestDraftVersionRef = useRef(0)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingDraftRef = useRef<{ version: number; completedStepIds: string[]; richStepState: Record<string, Record<string, unknown>> } | null>(null)
  const latestProjectIdRef = useRef('')

  useEffect(() => {
    setProjectId(getStoredValue('projectId') ?? '')
    const storedProjectContext = getStoredProjectContext()
    setProjectContext(storedProjectContext)
    setActiveBusinessName(firstNonEmpty(storedProjectContext.projectName, storedProjectContext.projectIdea))
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    latestPhaseRef.current = phase
  }, [phase])

  useEffect(() => {
    if (hasHydrated && projectId && pathname) {
      setStoredValue('lastVisitedPath', pathname)
    }
  }, [hasHydrated, projectId, pathname])

  useEffect(() => {
    latestProjectIdRef.current = projectId
  }, [projectId])

  useEffect(() => {
    if (!hasHydrated) return

    if (!projectId) {
      router.replace('/input')
      return
    }

    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [phasePayload, blueprintPayload] = await Promise.all([
          getPhase(projectId, phaseNumber),
          getBlueprint(projectId).catch(() => null),
        ])
        if (!active) return
        attemptedAutoGenerateRef.current = false
        const loadedPhase = phasePayload.data.phase
        const phaseSteps = (loadedPhase.generatedContent?.steps as Array<Record<string, unknown>> | undefined) ?? []
        const storedCompleted = Array.isArray(loadedPhase.userState?.completedStepIds)
          ? loadedPhase.userState.completedStepIds.filter((value): value is string => typeof value === 'string')
          : []
        const storedRichStepState = asRecord(loadedPhase.userState?.richStepState) as Record<string, Record<string, unknown>> ?? {}
        const localDraft = phaseNumber >= 3 ? readPhaseDraft(projectId, phaseNumber) : null
        const useLocalDraft = shouldUseLocalPhaseDraft(localDraft, loadedPhase.updatedAt)
        const rawCompletedStepIds = useLocalDraft && localDraft ? localDraft.completedStepIds : storedCompleted
        const rawRichStepState = useLocalDraft && localDraft ? localDraft.richStepState : storedRichStepState
        const nextCompletedStepIds = sanitizeCompletedStepIds(rawCompletedStepIds, phaseSteps)
        const nextRichStepState = sanitizeRichStepState(rawRichStepState, phaseSteps)
        setPhase(loadedPhase)
        setCompletedStepIds(nextCompletedStepIds)
        setRichStepState(nextRichStepState)
        pendingDraftRef.current = null
        setBusinessContext(String(blueprintPayload?.data?.blueprint?.sections?.business ?? ''))
        setMissing(false)
      } catch (loadError) {
        if (!active) return
        const message = loadError instanceof Error ? loadError.message : 'Failed to load phase'
        if (message.toLowerCase().includes('not found')) {
          const shouldAutoGenerate = phaseNumber >= 3 && !attemptedAutoGenerateRef.current

          if (shouldAutoGenerate) {
            attemptedAutoGenerateRef.current = true

            try {
              const [generatedPayload, blueprintPayload] = await Promise.all([
                generatePhase(projectId, phaseNumber),
                getBlueprint(projectId).catch(() => null),
              ])

              if (!active) return

              const generatedPhase = generatedPayload.data.phase
              const phaseSteps = (generatedPhase.generatedContent?.steps as Array<Record<string, unknown>> | undefined) ?? []
              const storedCompleted = Array.isArray(generatedPhase.userState?.completedStepIds)
                ? generatedPhase.userState.completedStepIds.filter((value): value is string => typeof value === 'string')
                : []
              const storedRichStepState = asRecord(generatedPhase.userState?.richStepState) as Record<string, Record<string, unknown>> ?? {}
              const localDraft = readPhaseDraft(projectId, phaseNumber)
              const useLocalDraft = shouldUseLocalPhaseDraft(localDraft, generatedPhase.updatedAt)
              const rawCompletedStepIds = useLocalDraft && localDraft ? localDraft.completedStepIds : storedCompleted
              const rawRichStepState = useLocalDraft && localDraft ? localDraft.richStepState : storedRichStepState
              const nextCompletedStepIds = sanitizeCompletedStepIds(rawCompletedStepIds, phaseSteps)
              const nextRichStepState = sanitizeRichStepState(rawRichStepState, phaseSteps)

              setPhase(generatedPhase)
              setCompletedStepIds(nextCompletedStepIds)
              setRichStepState(nextRichStepState)
              pendingDraftRef.current = null
              setBusinessContext(String(blueprintPayload?.data?.blueprint?.sections?.business ?? ''))
              setMissing(false)
              return
            } catch (generationError) {
              if (!active) return
              setError(generationError instanceof Error ? generationError.message : 'Failed to generate phase')
            }
          }

          setMissing(true)
          if (!shouldAutoGenerate) setError('')
        } else {
          setError(message)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [hasHydrated, phaseNumber, projectId, retryKey, router])

  const layer = useMemo(() => findLayer(phase?.generatedContent), [phase?.generatedContent])
  const layerPosture = useMemo(() => findLayerPosture(layer), [layer])
  const legalJurisdiction = asRecord(phase?.generatedContent?.jurisdiction)
  const legalPageDisclaimer = firstNonEmpty(
    stringValue(legalJurisdiction?.warningTitle),
    stringValue(legalJurisdiction?.disclaimer),
    stringValue(asRecord(layer)?.pageDisclaimer),
  )
  const legalPageWarningBody = firstNonEmpty(
    stringValue(legalJurisdiction?.warningBody),
    stringValue(legalJurisdiction?.tailoredBanner),
    stringValue(asRecord(layer)?.authorityReminder),
  )
  const completionCallout = layer?.completionCallout as Record<string, unknown> | undefined
  const steps = (phase?.generatedContent?.steps as Array<Record<string, unknown>> | undefined) ?? []
  const sanitizedCompletedStepIds = useMemo(() => sanitizeCompletedStepIds(completedStepIds, steps), [completedStepIds, steps])
  const totalSteps = steps.length || phase?.progress?.totalSteps || 0
  const completedSteps = sanitizedCompletedStepIds.length

  function cancelScheduledPersist() {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = null
    }
  }

  async function flushPendingPhaseState() {
    const pendingDraft = pendingDraftRef.current

    if (!pendingDraft) return

    cancelScheduledPersist()
    await persistPhaseState(pendingDraft.completedStepIds, pendingDraft.richStepState, pendingDraft.version)
  }

  async function persistPhaseState(nextCompletedStepIds: string[], nextRichStepState: Record<string, Record<string, unknown>>, draftVersion = latestDraftVersionRef.current) {
    const currentPhase = latestPhaseRef.current
    if (!projectId || !currentPhase) return

    const currentSteps = (currentPhase.generatedContent?.steps as Array<Record<string, unknown>> | undefined) ?? []
    const sanitizedNextCompletedStepIds = sanitizeCompletedStepIds(nextCompletedStepIds, currentSteps)
    const sanitizedNextRichStepState = sanitizeRichStepState(nextRichStepState, currentSteps)

    writePhaseDraft(projectId, phaseNumber, sanitizedNextCompletedStepIds, sanitizedNextRichStepState)
    pendingDraftRef.current = {
      version: draftVersion,
      completedStepIds: sanitizedNextCompletedStepIds,
      richStepState: sanitizedNextRichStepState,
    }

    const requestId = latestSaveRequestIdRef.current + 1
    latestSaveRequestIdRef.current = requestId
    setSavingProgress(true)

    try {
      const payload = await updatePhase(projectId, currentPhase.phaseNumber, {
        userState: {
          ...(currentPhase.userState ?? {}),
          completedStepIds: sanitizedNextCompletedStepIds,
          richStepState: sanitizedNextRichStepState,
        },
        progress: {
          totalSteps: currentSteps.length || totalSteps,
          completedSteps: sanitizedNextCompletedStepIds.length,
        },
      })

      if (requestId !== latestSaveRequestIdRef.current || draftVersion !== latestDraftVersionRef.current) return

      const savedSteps = (payload.data.phase.generatedContent?.steps as Array<Record<string, unknown>> | undefined) ?? currentSteps
      const savedCompletedStepIds = sanitizeCompletedStepIds(
        Array.isArray(payload.data.phase.userState?.completedStepIds)
          ? payload.data.phase.userState.completedStepIds.filter((value): value is string => typeof value === 'string')
          : sanitizedNextCompletedStepIds,
        savedSteps,
      )
      const savedRichStepState = sanitizeRichStepState(
        asRecord(payload.data.phase.userState?.richStepState) as Record<string, Record<string, unknown>> ?? sanitizedNextRichStepState,
        savedSteps,
      )

      setPhase(payload.data.phase)
      setCompletedStepIds(savedCompletedStepIds)
      setRichStepState(savedRichStepState)
      clearPhaseDraft(projectId, phaseNumber)
      pendingDraftRef.current = null
      setError('')
    } catch (saveError) {
      if (requestId !== latestSaveRequestIdRef.current || draftVersion !== latestDraftVersionRef.current) return
      setError(saveError instanceof Error ? saveError.message : 'Failed to save phase progress')
    } finally {
      if (requestId === latestSaveRequestIdRef.current && draftVersion === latestDraftVersionRef.current) {
        setSavingProgress(false)
      }
    }
  }

  function schedulePersistPhaseState(nextCompletedStepIds: string[], nextRichStepState: Record<string, Record<string, unknown>>, delayMs = 500) {
    const sanitizedNextCompletedStepIds = sanitizeCompletedStepIds(nextCompletedStepIds, steps)
    const sanitizedNextRichStepState = sanitizeRichStepState(nextRichStepState, steps)
    const draftVersion = latestDraftVersionRef.current + 1
    latestDraftVersionRef.current = draftVersion

    writePhaseDraft(projectId, phaseNumber, sanitizedNextCompletedStepIds, sanitizedNextRichStepState)
    pendingDraftRef.current = {
      version: draftVersion,
      completedStepIds: sanitizedNextCompletedStepIds,
      richStepState: sanitizedNextRichStepState,
    }

    cancelScheduledPersist()

    setSavingProgress(true)
    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null
      void persistPhaseState(sanitizedNextCompletedStepIds, sanitizedNextRichStepState, draftVersion)
    }, delayMs)
  }

  useEffect(() => {
    return () => {
      cancelScheduledPersist()

      const pendingDraft = pendingDraftRef.current
      const pendingProjectId = latestProjectIdRef.current

      if (pendingDraft && pendingProjectId) {
        writePhaseDraft(pendingProjectId, phaseNumber, pendingDraft.completedStepIds, pendingDraft.richStepState)
        void persistPhaseState(pendingDraft.completedStepIds, pendingDraft.richStepState, pendingDraft.version)
      }
    }
  }, [phaseNumber, projectId])

  function handleToggleStepCompletion(stepKey: string) {
    cancelScheduledPersist()

    const latestDraft = pendingDraftRef.current
    const sourceCompletedStepIds = latestDraft?.completedStepIds ?? completedStepIds
    const sourceRichStepState = latestDraft?.richStepState ?? richStepState
    const nextCompletedStepIds = sourceCompletedStepIds.includes(stepKey)
      ? sourceCompletedStepIds.filter((value) => value !== stepKey)
      : [...sourceCompletedStepIds, stepKey]
    const sanitizedNextCompletedStepIds = sanitizeCompletedStepIds(nextCompletedStepIds, steps)
    const draftVersion = latestDraftVersionRef.current + 1
    latestDraftVersionRef.current = draftVersion

    setCompletedStepIds(sanitizedNextCompletedStepIds)
    void persistPhaseState(sanitizedNextCompletedStepIds, sourceRichStepState, draftVersion)
  }

  function handleRichStepStateChange(stepKey: string, nextStepState: Record<string, unknown>) {
    const latestDraft = pendingDraftRef.current
    const sourceCompletedStepIds = latestDraft?.completedStepIds ?? completedStepIds
    const sourceRichStepState = latestDraft?.richStepState ?? richStepState
    const nextRichStepState = sanitizeRichStepState({
      ...sourceRichStepState,
      [stepKey]: nextStepState,
    }, steps)

    setRichStepState(nextRichStepState)
    schedulePersistPhaseState(sourceCompletedStepIds, nextRichStepState)
  }

  async function handleBusinessNameChange(name: string) {
    const trimmedName = name.trim()
    if (!trimmedName) return

    setActiveBusinessName(trimmedName)
    setProjectContext((current) => ({ ...current, projectName: trimmedName }))
    setStoredValue('projectName', trimmedName)

    if (!projectId || !phase || phaseNumber !== 1) return

    try {
      const payload = await updatePhase(projectId, phase.phaseNumber, {
        userState: {
          ...(phase.userState ?? {}),
          businessName: trimmedName,
        },
      })

      setPhase(payload.data.phase)
      setError('')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save business name')
    }
  }

  async function handleNavigate(href: string) {
    if (phaseNumber >= 3) {
      await flushPendingPhaseState()
    }

    router.push(href)
  }

  async function handleGenerate() {
    if (!projectId) {
      router.replace('/input')
      return
    }

    setGenerating(true)
    setError('')

    try {
      const [payload, blueprintPayload] = await Promise.all([
        generatePhase(projectId, phaseNumber),
        getBlueprint(projectId).catch(() => null),
      ])
      const generatedPhase = payload.data.phase
      const phaseSteps = (generatedPhase.generatedContent?.steps as Array<Record<string, unknown>> | undefined) ?? []
      const storedCompleted = Array.isArray(generatedPhase.userState?.completedStepIds)
        ? generatedPhase.userState.completedStepIds.filter((value): value is string => typeof value === 'string')
        : []
      const storedRichStepState = asRecord(generatedPhase.userState?.richStepState) as Record<string, Record<string, unknown>> ?? {}
      const localDraft = phaseNumber >= 3 ? readPhaseDraft(projectId, phaseNumber) : null
      const useLocalDraft = shouldUseLocalPhaseDraft(localDraft, generatedPhase.updatedAt)
      const rawCompletedStepIds = useLocalDraft && localDraft ? localDraft.completedStepIds : storedCompleted
      const rawRichStepState = useLocalDraft && localDraft ? localDraft.richStepState : storedRichStepState
      const nextCompletedStepIds = sanitizeCompletedStepIds(rawCompletedStepIds, phaseSteps)
      const nextRichStepState = sanitizeRichStepState(rawRichStepState, phaseSteps)
      setPhase(generatedPhase)
      setCompletedStepIds(nextCompletedStepIds)
      setRichStepState(nextRichStepState)
      pendingDraftRef.current = null
      setBusinessContext(String(blueprintPayload?.data?.blueprint?.sections?.business ?? businessContext))
      setMissing(false)
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Failed to generate phase')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-6 py-24">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-3xl border border-border/50 bg-surface/60 p-10 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
            <h1 className="text-3xl font-bold">Loading {title}</h1>
            <p className="mt-2 text-muted-foreground">Pulling the real phase data into the v0 flow.</p>
          </div>
          <PhaseLadder phaseNumber={phaseNumber} onNavigate={handleNavigate} />
          {(projectContext.projectName || projectContext.projectIdea || projectContext.storedCountry) ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary">
                  <Compass className="h-4 w-4" />
                  Current project
                </div>
                {projectContext.projectName ? <p className="text-xl font-semibold">{projectContext.projectName}</p> : null}
                {projectContext.projectIdea ? <p className="max-w-2xl text-sm text-muted-foreground">{projectContext.projectIdea}</p> : null}
                {projectContext.storedCountry ? <p className="text-sm text-muted-foreground">Operating in {projectContext.storedCountry}</p> : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  if (missing) {
    return (
      <div className="min-h-screen bg-background px-6 py-24">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-3xl border border-border/50 bg-surface/60 p-10 text-center">
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-primary" />
            <p className="text-sm font-medium uppercase tracking-wider text-primary">Phase {phaseNumber} of 9</p>
            <h1 className="mt-3 text-4xl font-bold">{title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">This phase hasn’t been generated for the current project yet.</p>
            {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="ghost"><Link href={prevHref} onClick={(event) => { event.preventDefault(); void handleNavigate(prevHref) }}><ArrowLeft className="mr-2 h-4 w-4" />Back to {prevLabel}</Link></Button>
              <Button onClick={handleGenerate} disabled={generating} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {generating ? 'Generating…' : `Generate Phase ${phaseNumber}`}
              </Button>
            </div>
          </div>
          <PhaseLadder phaseNumber={phaseNumber} onNavigate={handleNavigate} />
          {(projectContext.projectName || projectContext.projectIdea || projectContext.storedCountry) ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary">
                  <Compass className="h-4 w-4" />
                  Current project
                </div>
                {projectContext.projectName ? <p className="text-xl font-semibold">{projectContext.projectName}</p> : null}
                {projectContext.projectIdea ? <p className="max-w-2xl text-sm text-muted-foreground">{projectContext.projectIdea}</p> : null}
                {projectContext.storedCountry ? <p className="text-sm text-muted-foreground">Operating in {projectContext.storedCountry}</p> : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  if (error && !phase) {
    return (
      <div className="min-h-screen bg-background px-6 py-24">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center">
            <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-destructive" />
            <h1 className="text-3xl font-bold">Couldn’t load {title}</h1>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button onClick={() => setRetryKey((value) => value + 1)}>Try again</Button>
              <Button asChild variant="outline"><Link href="/blueprint" onClick={(event) => { event.preventDefault(); void handleNavigate('/blueprint') }}>Back to blueprint</Link></Button>
            </div>
          </div>
          <PhaseLadder phaseNumber={phaseNumber} onNavigate={handleNavigate} />
          {(projectContext.projectName || projectContext.projectIdea || projectContext.storedCountry) ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary">
                  <Compass className="h-4 w-4" />
                  Current project
                </div>
                {projectContext.projectName ? <p className="text-xl font-semibold">{projectContext.projectName}</p> : null}
                {projectContext.projectIdea ? <p className="max-w-2xl text-sm text-muted-foreground">{projectContext.projectIdea}</p> : null}
                {projectContext.storedCountry ? <p className="text-sm text-muted-foreground">Operating in {projectContext.storedCountry}</p> : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 rounded-3xl border border-border/50 bg-surface/60 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary">Phase {phaseNumber} of 9</p>
              <h1 className="mt-2 text-4xl font-bold">{phase?.title ?? title}</h1>
              <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{phase?.summary}</p>
            </div>
            <div className="rounded-2xl bg-background/70 px-5 py-4 text-right">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold text-primary">{completedSteps}/{totalSteps}</p>
              {savingProgress ? <p className="mt-1 text-xs text-muted-foreground">Saving…</p> : null}
            </div>
          </div>

          <PhaseLadder phaseNumber={phaseNumber} onNavigate={handleNavigate} />

          {(projectContext.projectName || projectContext.projectIdea || projectContext.storedCountry) ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary">
                    <Compass className="h-4 w-4" />
                    Current project
                  </div>
                  {projectContext.projectName ? <p className="text-xl font-semibold">{projectContext.projectName}</p> : null}
                  {projectContext.projectIdea ? <p className="max-w-2xl text-sm text-muted-foreground">{projectContext.projectIdea}</p> : null}
                  {projectContext.storedCountry ? <p className="text-sm text-muted-foreground">Operating in {projectContext.storedCountry}</p> : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="ghost"><Link href="/" onClick={(event) => { event.preventDefault(); void handleNavigate('/') }}><Home className="mr-2 h-4 w-4" />Home</Link></Button>
                </div>
              </div>
            </div>
          ) : null}

          {phaseNumber === 2 && (legalPageDisclaimer || legalPageWarningBody) ? (
            <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-5 text-foreground/95">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-200">{legalPageDisclaimer || 'Important legal disclaimer'}</p>
                  {legalPageWarningBody ? <p className="mt-2 text-sm leading-relaxed text-foreground/90">{legalPageWarningBody}</p> : null}
                </div>
              </div>
            </div>
          ) : null}

          {layerPosture ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-foreground/90">
              {layerPosture}
            </div>
          ) : null}
        </motion.div>

        {steps.map((step, index) => {
          const key = String(step.slug ?? step.number ?? index)

          if (phaseNumber === 1) {
            return (
              <PhaseInteractiveStep
                key={key}
                phaseNumber={phaseNumber}
                step={step}
                stepIndex={index}
                projectId={projectId}
                projectContext={projectContext}
                businessContext={businessContext}
                activeBusinessName={activeBusinessName}
                onBusinessNameChange={handleBusinessNameChange}
              />
            )
          }

          if (phaseNumber === 2) {
            return <LegalInteractiveStep key={key} step={step} stepIndex={index} projectContext={projectContext} />
          }

          if (phaseNumber >= 3) {
            return (
              <PhaseRichStep
                key={key}
                step={step}
                stepIndex={index}
                isCompleted={sanitizedCompletedStepIds.includes(key)}
                persistedState={asRecord(richStepState[key]) ?? undefined}
                onToggleComplete={() => handleToggleStepCompletion(key)}
                onStateChange={(nextState) => handleRichStepStateChange(key, nextState)}
              />
            )
          }

          return <GenericStepCard key={key} step={step} stepIndex={index} />
        })}

        {phase?.tasks && phase.tasks.length > 0 ? (
          <section className="rounded-3xl border border-border/50 bg-surface/60 p-6 md:p-8">
            <h2 className="mb-5 text-2xl font-semibold">Execution tasks</h2>
            <div className="space-y-4">
              {phase.tasks.map((task, index) => (
                <div key={`${task.title}-${index}`} className="rounded-2xl border border-border/50 bg-background/60 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          {typeof task.stepNumber === 'number' ? <span className="rounded-full border border-border/60 px-3 py-1 text-muted-foreground">Step {task.stepNumber}</span> : null}
                          <span className={`rounded-full px-3 py-1 ${task.isRequired ? 'bg-primary/15 text-primary' : 'border border-border/60 text-muted-foreground'}`}>
                            {task.isRequired ? 'Required' : 'Optional'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {task.whatToDo ? <p className="mt-4 text-muted-foreground">{task.whatToDo}</p> : null}
                  {task.howToDoIt ? <p className="mt-2 text-sm text-foreground/90">{task.howToDoIt}</p> : null}
                  {task.executionReference ? (
                    <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-foreground/90">
                      <span className="font-medium text-primary">Execution reference:</span> {task.executionReference}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {completionCallout ? (
          <section className="rounded-3xl border border-success/20 bg-success/5 p-8">
            <p className="text-sm font-medium text-success">{String(completionCallout.badge ?? `Phase ${phaseNumber} Complete`)}</p>
            <h2 className="mt-2 text-2xl font-bold">{String(completionCallout.title ?? 'Ready for the next phase')}</h2>
            {completionCallout.description ? <p className="mt-3 text-muted-foreground">{String(completionCallout.description)}</p> : null}
          </section>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-6">
          <Button asChild variant="ghost"><Link href={prevHref} onClick={(event) => { event.preventDefault(); void handleNavigate(prevHref) }}><ArrowLeft className="mr-2 h-4 w-4" />{prevLabel}</Link></Button>
          {nextHref && nextLabel ? (
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90"><Link href={nextHref} onClick={(event) => { event.preventDefault(); void handleNavigate(nextHref) }}>Next: {nextLabel}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
