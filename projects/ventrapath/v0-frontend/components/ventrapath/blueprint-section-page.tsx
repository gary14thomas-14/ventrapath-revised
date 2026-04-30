'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, Compass, Loader2, Sparkles } from 'lucide-react'
import { BlueprintData, BlueprintSectionKey, getBlueprint, getStoredValue } from '@/lib/ventrapath-client'
import { Button } from '@/components/ui/button'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function parseMarkdownBlocks(markdown: string) {
  return markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
}

function renderListItem(item: string) {
  return item.replace(/^[-*]\s*/, '').trim()
}

export function BlueprintSectionPage({
  sectionKey,
  eyebrow,
  title,
}: {
  sectionKey: BlueprintSectionKey
  eyebrow: string
  title: string
}) {
  const router = useRouter()
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const projectName = getStoredValue('projectName')
  const projectIdea = getStoredValue('idea')
  const storedCountry = getStoredValue('country')

  useEffect(() => {
    const projectId = getStoredValue('projectId')

    if (!projectId) {
      router.replace('/input')
      return
    }

    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const payload = await getBlueprint(projectId)
        if (!active) return
        setBlueprint(payload.data.blueprint)
      } catch (loadError) {
        if (!active) return
        setError(loadError instanceof Error ? loadError.message : 'Failed to load blueprint section')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [retryKey, router])

  const sectionContent = blueprint?.sections?.[sectionKey] ?? ''
  const blocks = useMemo(() => parseMarkdownBlocks(sectionContent), [sectionContent])

  if (loading) {
    return (
      <div className="px-6 py-10 lg:py-16">
        <div className="max-w-4xl mx-auto rounded-3xl border border-border/50 bg-surface/60 p-10 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <h2 className="text-2xl font-bold">Loading blueprint</h2>
          <p className="mt-2 text-muted-foreground">Pulling the real VentraPath data into the v0 screen.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-10 lg:py-16">
        <div className="max-w-4xl mx-auto rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-destructive" />
          <h2 className="text-2xl font-bold">Couldn’t load this section</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => setRetryKey((value) => value + 1)}>Try again</Button>
            <Button variant="outline" onClick={() => router.push('/input')}>Start again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-8">
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">{eyebrow}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
            {blueprint?.meta?.country ? (
              <p className="text-lg text-muted-foreground">Tailored for {blueprint.meta.country}{blueprint.meta.region ? ` · ${blueprint.meta.region}` : ''}</p>
            ) : storedCountry ? (
              <p className="text-lg text-muted-foreground">Tailored for {storedCountry}</p>
            ) : null}
          </motion.div>

          {(projectName || projectIdea || storedCountry) ? (
            <motion.div variants={fadeInUp} className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary">
                    <Compass className="h-4 w-4" />
                    Current project
                  </div>
                  {projectName ? <p className="text-xl font-semibold">{projectName}</p> : null}
                  {projectIdea ? <p className="max-w-2xl text-sm text-muted-foreground">{projectIdea}</p> : null}
                  {storedCountry ? <p className="text-sm text-muted-foreground">Operating in {storedCountry}</p> : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/input"><Button variant="outline">Start new project</Button></Link>
                </div>
              </div>
            </motion.div>
          ) : null}

          {blocks.length === 0 ? (
            <motion.div variants={fadeInUp} className="rounded-2xl border border-border/50 bg-surface/60 p-8">
              <p className="text-muted-foreground">No content landed for this section yet.</p>
            </motion.div>
          ) : (
            blocks.map((block, index) => {
              const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
              const heading = lines[0]?.startsWith('#') ? lines[0].replace(/^#+\s*/, '') : null
              const bulletLines = lines.filter((line) => /^[-*]\s+/.test(line))
              const paragraphLines = lines.filter((line) => !/^[-*]\s+/.test(line) && !line.startsWith('#'))

              return (
                <motion.section key={`${sectionKey}-${index}`} variants={fadeInUp} className="rounded-2xl border border-border/50 bg-surface/60 p-6 md:p-8">
                  {heading ? <h2 className="mb-4 text-2xl font-semibold">{heading}</h2> : null}
                  {paragraphLines.length > 0 ? (
                    <div className="space-y-4 text-foreground/90">
                      {paragraphLines.map((line, lineIndex) => (
                        <p key={lineIndex} className="leading-relaxed whitespace-pre-wrap">{line}</p>
                      ))}
                    </div>
                  ) : null}
                  {bulletLines.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {bulletLines.map((line, lineIndex) => (
                        <li key={lineIndex} className="flex gap-3 rounded-xl bg-background/60 p-4">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <span className="leading-relaxed text-foreground/90">{renderListItem(line)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </motion.section>
              )
            })
          )}
        </motion.div>
      </div>
    </div>
  )
}
