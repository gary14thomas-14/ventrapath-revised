'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Compass, Home, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhaseData, generatePhase, getPhase, getStoredValue } from '@/lib/ventrapath-client'

function findLayer(generatedContent: Record<string, unknown> | undefined) {
  if (!generatedContent) return null

  const entry = Object.entries(generatedContent).find(([key, value]) => key.endsWith('Layer') && value && typeof value === 'object')
  return entry ? entry[1] as Record<string, unknown> : null
}

function omitStepMeta(step: Record<string, unknown>) {
  return Object.entries(step).filter(([key]) => !['number', 'slug', 'title', 'description', 'helper'].includes(key))
}

function prettyLabel(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/^./, (char) => char.toUpperCase())
}

function ValueRenderer({ label, value }: { label: string; value: unknown }) {
  if (value == null || value === '') {
    return null
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return (
      <div className="rounded-xl bg-background/60 p-4">
        <strong className="mb-2 block text-sm text-primary">{prettyLabel(label)}</strong>
        <p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">{String(value)}</p>
      </div>
    )
  }

  if (Array.isArray(value)) {
    return (
      <div className="rounded-xl bg-background/60 p-4">
        <strong className="mb-3 block text-sm text-primary">{prettyLabel(label)}</strong>
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={index} className="rounded-lg border border-border/50 bg-surface/60 p-4">
              {typeof item === 'object' && item !== null ? (
                <div className="space-y-2">
                  {Object.entries(item).map(([nestedKey, nestedValue]) => (
                    <div key={nestedKey}>
                      <span className="font-medium">{prettyLabel(nestedKey)}:</span>{' '}
                      <span className="text-muted-foreground">{Array.isArray(nestedValue) ? nestedValue.join(', ') : String(nestedValue)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/90">{String(item)}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (typeof value === 'object') {
    return (
      <div className="rounded-xl bg-background/60 p-4">
        <strong className="mb-3 block text-sm text-primary">{prettyLabel(label)}</strong>
        <div className="space-y-2">
          {Object.entries(value).map(([nestedKey, nestedValue]) => (
            <div key={nestedKey} className="rounded-lg border border-border/50 bg-surface/60 p-4">
              <span className="font-medium">{prettyLabel(nestedKey)}:</span>{' '}
              <span className="text-muted-foreground">{Array.isArray(nestedValue) ? nestedValue.join(', ') : String(nestedValue)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
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
  const [phase, setPhase] = useState<PhaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [missing, setMissing] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [projectContext, setProjectContext] = useState({
    projectName: '',
    projectIdea: '',
    storedCountry: '',
  })

  useEffect(() => {
    const projectId = getStoredValue('projectId')

    setProjectContext({
      projectName: getStoredValue('projectName') ?? '',
      projectIdea: getStoredValue('idea') ?? '',
      storedCountry: getStoredValue('country') ?? '',
    })

    if (!projectId) {
      router.replace('/input')
      return
    }

    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const payload = await getPhase(projectId, phaseNumber)
        if (!active) return
        setPhase(payload.data.phase)
        setMissing(false)
      } catch (loadError) {
        if (!active) return
        const message = loadError instanceof Error ? loadError.message : 'Failed to load phase'
        if (message.toLowerCase().includes('not found')) {
          setMissing(true)
          setError('')
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
  }, [phaseNumber, retryKey, router])

  const layer = useMemo(() => findLayer(phase?.generatedContent), [phase?.generatedContent])
  const completionCallout = layer?.completionCallout as Record<string, unknown> | undefined
  const steps = (phase?.generatedContent?.steps as Array<Record<string, unknown>> | undefined) ?? []
  const totalSteps = phase?.progress?.totalSteps ?? steps.length
  const completedSteps = phase?.progress?.completedSteps ?? 0
  const projectId = getStoredValue('projectId')

  async function handleGenerate() {
    if (!projectId) {
      router.replace('/input')
      return
    }

    setGenerating(true)
    setError('')

    try {
      const payload = await generatePhase(projectId, phaseNumber)
      setPhase(payload.data.phase)
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
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/50 bg-surface/60 p-10 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <h1 className="text-3xl font-bold">Loading {title}</h1>
          <p className="mt-2 text-muted-foreground">Pulling the real phase data into the v0 flow.</p>
        </div>
      </div>
    )
  }

  if (missing) {
    return (
      <div className="min-h-screen bg-background px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/50 bg-surface/60 p-10 text-center">
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-primary" />
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Phase {phaseNumber} of 9</p>
          <h1 className="mt-3 text-4xl font-bold">{title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">This phase hasn’t been generated for the current project yet.</p>
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href={prevHref}><Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" />Back to {prevLabel}</Button></Link>
            <Button onClick={handleGenerate} disabled={generating} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {generating ? 'Generating…' : `Generate Phase ${phaseNumber}`}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (error && !phase) {
    return (
      <div className="min-h-screen bg-background px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-destructive" />
          <h1 className="text-3xl font-bold">Couldn’t load {title}</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => setRetryKey((value) => value + 1)}>Try again</Button>
            <Link href="/blueprint"><Button variant="outline">Back to blueprint</Button></Link>
          </div>
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
            </div>
          </div>

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
                  <Link href="/blueprint"><Button variant="outline">Blueprint</Button></Link>
                  <Link href="/"><Button variant="ghost"><Home className="mr-2 h-4 w-4" />Home</Button></Link>
                </div>
              </div>
            </div>
          ) : null}

          {layer?.growthPosture || layer?.financialPosture || layer?.protectionPosture || layer?.operationsPosture || layer?.salesPosture || layer?.marketingPosture || layer?.infrastructurePosture ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-foreground/90">
              {String(layer?.growthPosture ?? layer?.financialPosture ?? layer?.protectionPosture ?? layer?.operationsPosture ?? layer?.salesPosture ?? layer?.marketingPosture ?? layer?.infrastructurePosture)}
            </div>
          ) : null}
        </motion.div>

        {steps.map((step, index) => (
          <motion.section key={String(step.slug ?? step.number ?? index)} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-3xl border border-border/50 bg-surface/60 p-6 md:p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">{String(step.number ?? index + 1)}</div>
              <div>
                <h2 className="text-2xl font-semibold">{String(step.title ?? `Step ${index + 1}`)}</h2>
                {step.description ? <p className="mt-2 text-muted-foreground">{String(step.description)}</p> : null}
              </div>
            </div>

            {step.helper && typeof step.helper === 'object' ? (
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                {'howToDoThis' in step.helper ? (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                    <strong className="mb-2 block text-primary">How to do this</strong>
                    <p className="leading-relaxed text-foreground/90">{String((step.helper as Record<string, unknown>).howToDoThis ?? '')}</p>
                  </div>
                ) : null}
                {'example' in step.helper ? (
                  <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                    <strong className="mb-2 block text-accent">Example</strong>
                    <p className="leading-relaxed text-foreground/90">{String((step.helper as Record<string, unknown>).example ?? '')}</p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              {omitStepMeta(step).map(([key, value]) => (
                <ValueRenderer key={key} label={key} value={value} />
              ))}
            </div>
          </motion.section>
        ))}

        {phase?.tasks && phase.tasks.length > 0 ? (
          <section className="rounded-3xl border border-border/50 bg-surface/60 p-6 md:p-8">
            <h2 className="mb-5 text-2xl font-semibold">Execution tasks</h2>
            <div className="space-y-4">
              {phase.tasks.map((task, index) => (
                <div key={`${task.title}-${index}`} className="rounded-2xl border border-border/50 bg-background/60 p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{task.title}</h3>
                  </div>
                  {task.whatToDo ? <p className="mt-3 text-muted-foreground">{task.whatToDo}</p> : null}
                  {task.howToDoIt ? <p className="mt-2 text-sm text-foreground/90">{task.howToDoIt}</p> : null}
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
          <Link href={prevHref}><Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" />{prevLabel}</Button></Link>
          {nextHref && nextLabel ? (
            <Link href={nextHref}><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Next: {nextLabel}<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}
