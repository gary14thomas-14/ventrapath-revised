'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Compass, Layers3, PlayCircle, Sparkles, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStoredValue } from '@/lib/ventrapath-client'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const proofPoints = [
  { name: 'Blueprint', icon: Compass },
  { name: '9 Guided Phases', icon: Layers3 },
  { name: 'Actionable Steps', icon: Target },
  { name: 'Ready to Start', icon: PlayCircle },
]

export default function LandingPage() {
  const [projectName, setProjectName] = useState<string | null>(null)

  useEffect(() => {
    setProjectName(getStoredValue('projectName'))
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] animate-glow-breathe" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[100px] animate-glow-breathe" style={{ animationDelay: '2s' }} />
      </div>

      <nav className="relative z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="VentraPath" className="h-48 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Tester Access</Button>
            </Link>
            <Link href={projectName ? '/blueprint' : '/input'}>
              <Button className="bg-primary px-6 text-primary-foreground hover:bg-primary/90">
                {projectName ? 'Resume Project' : 'Get Started'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pb-28 pt-16">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mx-auto max-w-4xl text-center">
            <motion.div variants={fadeIn} className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Early tester preview · live blueprint and guided phase flow
              </span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="mb-8 text-5xl font-bold tracking-tight md:text-7xl">
              <span className="text-foreground">Turn an idea into a</span>
              <br />
              <span className="gradient-text">business plan you can actually act on</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
              VentraPath takes a business idea, adapts it to your country, and walks you from blueprint through nine guided phases ending in <strong className="text-foreground">Growth & Milestones</strong>.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={projectName ? '/blueprint' : '/input'}>
                <Button size="lg" className="glow-primary bg-primary px-8 py-6 text-lg text-primary-foreground hover:bg-primary/90">
                  {projectName ? 'Continue Current Project' : 'Start Building'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/support">
                <Button size="lg" variant="outline" className="border-border/50 px-8 py-6 text-lg hover:bg-surface">
                  Testing Guide
                </Button>
              </Link>
            </motion.div>

            {projectName ? (
              <motion.div variants={fadeIn} className="mx-auto mt-6 max-w-xl rounded-2xl border border-success/20 bg-success/5 px-5 py-4 text-sm text-success">
                Current local project ready to resume: <strong>{projectName}</strong>
              </motion.div>
            ) : null}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8 }} className="mx-auto mt-24 max-w-3xl">
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="relative flex items-center justify-between gap-4">
                {proofPoints.map((item, index) => (
                  <motion.div key={item.name} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.65 + index * 0.12, duration: 0.4 }} className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 cursor-default items-center justify-center rounded-2xl glass border border-border/50 transition-all duration-300 hover:border-primary/50 hover:glow-primary">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <span className="text-center text-sm font-medium text-muted-foreground">{item.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="border-t border-border/50 bg-surface/30">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">What testers can use right now</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                This is no longer just a nice-looking shell. The core generation flow is wired to the live backend and ready for real walkthroughs.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Country-aware blueprint',
                  description: 'Generate business, market, legal, website, and risk sections from a real project record.',
                },
                {
                  title: 'Nine guided phases',
                  description: 'Move from Brand and Legal all the way through Sales and Growth & Milestones.',
                },
                {
                  title: 'Useful tester flow',
                  description: 'Start, resume, and review a project without awkward dead ends or unclear handoffs.',
                },
              ].map((feature, index) => (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group rounded-2xl glass p-8 transition-all duration-300 hover:border-primary/30">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
            <div className="absolute inset-0 glass" />
            <div className="relative px-8 py-16 text-center md:px-16 md:py-20">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready for tomorrow’s tester walkthrough</h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                Use the real flow, gather feedback on clarity and usefulness, then tighten the rough edges page by page.
              </p>
              <Link href={projectName ? '/blueprint' : '/input'}>
                <Button size="lg" className="bg-primary px-10 py-6 text-lg text-primary-foreground hover:bg-primary/90">
                  {projectName ? 'Open Current Project' : 'Start the Product'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row">
          <img src="/logo.svg" alt="VentraPath" className="h-44 w-auto opacity-60" />
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="/pricing" className="transition-colors hover:text-foreground">Tester Access</Link>
            <Link href="/support" className="transition-colors hover:text-foreground">Testing Guide</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
