'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { clearProjectSession, getStoredValue } from '@/lib/ventrapath-client'
import { launchConfig } from '@/lib/launch-config'

export default function LandingPage() {
  const [resumeProjectName, setResumeProjectName] = useState<string | null>(null)
  const [resumeHref, setResumeHref] = useState('/blueprint')
  const [prelaunchRedirected, setPrelaunchRedirected] = useState(false)
  const prelaunchMode = launchConfig.prelaunchMode

  useEffect(() => {
    const projectId = getStoredValue('projectId')
    const projectName = getStoredValue('projectName')
    const lastVisitedPath = getStoredValue('lastVisitedPath')
    const safeResumeHref = lastVisitedPath && lastVisitedPath.startsWith('/') ? lastVisitedPath : '/blueprint'

    setResumeProjectName(projectId && projectName ? projectName : null)
    setResumeHref(projectId ? safeResumeHref : '/blueprint')

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setPrelaunchRedirected(params.get('prelaunch') === '1')
    }
  }, [])

  const startFresh = () => {
    clearProjectSession()
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[100px] animate-glow-breathe" style={{ animationDelay: '2s' }} />
      </div>

      <nav className="relative z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="VentraPath" className="h-48 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            {resumeProjectName ? (
              <Link href={resumeHref}>
                <Button variant="outline" className="border-border/50 hover:bg-surface">Resume Project</Button>
              </Link>
            ) : null}
            <Link href={prelaunchMode ? '/pricing' : '/input'} onClick={prelaunchMode ? undefined : startFresh}>
              <Button className="bg-primary px-6 text-primary-foreground hover:bg-primary/90">
                {prelaunchMode ? 'Launch pricing' : 'Start New Project'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pb-28 pt-16">
          <div className="mx-auto max-w-4xl text-center">
            {prelaunchMode ? (
              <div className="mb-6 inline-flex max-w-2xl items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                {prelaunchRedirected
                  ? 'Launching soon. The free blueprint and 9 paid phases open here on launch day.'
                  : 'Launching soon. The free blueprint and 9 paid phases open here on launch day.'}
              </div>
            ) : null}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                {prelaunchMode ? 'Launching soon — see pricing' : 'Live blueprint and guided phase flow'}
              </span>
            </div>

            <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-7xl">
              <span className="text-foreground">Build the company</span>
              <br />
              <span className="gradient-text">you've been thinking about</span>
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
              You bring the idea. VentraPath turns it into a clear blueprint, then walks you through the actual setup work — legal, brand, marketing, sales, all the way through launch and what comes after.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={prelaunchMode ? '/pricing' : '/input'} onClick={prelaunchMode ? undefined : startFresh}>
                <Button size="lg" className="glow-primary bg-primary px-8 py-6 text-lg text-primary-foreground hover:bg-primary/90">
                  {prelaunchMode ? 'Launching soon' : 'Start New Project'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {resumeProjectName ? (
                <Link href={resumeHref}>
                  <Button size="lg" variant="outline" className="border-border/50 px-8 py-6 text-lg hover:bg-surface">
                    Resume Current Project
                  </Button>
                </Link>
              ) : null}
              <Link href="/support">
                <Button size="lg" variant="outline" className="border-border/50 px-8 py-6 text-lg hover:bg-surface">
                  Support
                </Button>
              </Link>
            </div>

            {resumeProjectName ? (
              <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-success/20 bg-success/5 px-5 py-4 text-sm text-success">
                Current project ready to resume: <strong>{resumeProjectName}</strong>
              </div>
            ) : null}
          </div>
        </section>

        <section className="border-t border-border/50 bg-surface/30">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">What VentraPath helps you do</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                The full path between the idea in your head and a business that's actually open — without losing track of what comes next.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'A blueprint with a real angle',
                  description: 'You get a clear picture of the business, market, money side, and legal side — built around what actually makes your idea different, not a fill-in-the-blank template.',
                },
                {
                  title: 'Every step, in the right order',
                  description: 'Brand, legal, finance, marketing, sales, launch — the whole setup, broken into work you can actually finish without burning a weekend.',
                },
                {
                  title: 'Built for the time you actually have',
                  description: 'Tell it how much you can commit each week, and the workload shapes around it. No "just spend a weekend on this" nonsense.',
                },
              ].map((feature, index) => (
                <div key={feature.title} className="group rounded-2xl glass p-8 transition-all duration-300 hover:border-primary/30">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row">
          <img src="/logo.svg" alt="VentraPath" className="h-44 w-auto opacity-60" />
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="/support" className="transition-colors hover:text-foreground">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
