'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FlaskConical, Rocket, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const cards = [
  {
    title: 'Tester preview',
    detail: 'What this build is for',
    icon: FlaskConical,
    bullets: [
      'Walk through the real blueprint flow',
      'Review the nine guided business phases',
      'Give feedback on clarity, trust, and usefulness',
    ],
  },
  {
    title: 'Current product state',
    detail: 'What is genuinely working now',
    icon: CheckCircle2,
    bullets: [
      'Real project creation',
      'Real blueprint generation',
      'Real phase generation through Growth & Milestones',
    ],
  },
  {
    title: 'What comes next',
    detail: 'What this test round should sharpen',
    icon: Rocket,
    bullets: [
      'Page-by-page polish',
      'Sharper copy and guidance',
      'Deployment hardening and production data setup',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] animate-glow-breathe" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px] animate-glow-breathe" style={{ animationDelay: '2s' }} />
      </div>

      <nav className="relative z-50 px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/">
            <img src="/logo.svg" alt="VentraPath" className="h-44 w-auto" />
          </Link>
          <Link href="/input">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Open Product</Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-6xl space-y-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <ShieldCheck className="h-4 w-4" />
              Honest product state, not fake SaaS pricing theatre
            </div>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Tester access and rollout status</h1>
            <p className="text-xl text-muted-foreground">
              This build is for feedback and confidence-building, not fake checkout flows. The important bit is the product path itself — and that’s now live.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {cards.map((card, index) => {
              const Icon = card.icon
              return (
                <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.08 }} className="rounded-2xl border border-border/50 bg-surface p-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">{card.detail}</p>
                  <h3 className="mb-6 text-xl font-bold">{card.title}</h3>
                  <ul className="space-y-3">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-muted-foreground">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Tomorrow’s goal</h2>
            <p className="mb-8 text-muted-foreground">
              Put testers through the real VentraPath experience, collect the rough edges, and use that feedback to shape the first proper production rollout.
            </p>
            <Link href="/input">
              <Button size="lg" className="bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                Start a Test Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
