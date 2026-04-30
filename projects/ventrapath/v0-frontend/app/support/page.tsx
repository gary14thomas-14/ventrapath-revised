'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ClipboardList, MessageSquareMore, Search, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const notes = [
  {
    title: 'What to test',
    icon: ClipboardList,
    items: [
      'Can you understand what VentraPath does from the first screen?',
      'Does the blueprint feel useful and specific?',
      'Do the phase pages feel actionable rather than fluffy?',
    ],
  },
  {
    title: 'What to watch for',
    icon: Search,
    items: [
      'Confusing wording or fake-looking claims',
      'Places where the flow feels too long or repetitive',
      'Anything that looks broken, unfinished, or untrustworthy',
    ],
  },
  {
    title: 'Best feedback format',
    icon: MessageSquareMore,
    items: [
      'What you expected',
      'What actually happened',
      'What would make this feel stronger or clearer',
    ],
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="relative z-50 border-b border-border/50 px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <img src="/logo.svg" alt="VentraPath" className="h-44 w-auto" />
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Testing Guide</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-6xl space-y-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">How to test this build well</h1>
            <p className="text-lg text-muted-foreground">
              Use this guide to get better feedback from testers: what felt clear, what felt rough, and what made the product feel trustworthy or shaky.
            </p>
          </motion.div>

          <div className="mx-auto max-w-2xl rounded-2xl border border-border/50 bg-surface p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" value="Try: confusing copy, missing detail, too long, trust issue" readOnly className="h-14 bg-background pl-12 text-base text-muted-foreground" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {notes.map((note, index) => {
              const Icon = note.icon
              return (
                <motion.div key={note.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.08 }} className="rounded-2xl border border-border/50 bg-surface p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="mb-4 text-xl font-semibold">{note.title}</h2>
                  <ul className="space-y-3">
                    {note.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-primary/5 p-8">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <Wrench className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Current reality</span>
            </div>
            <h2 className="mb-4 text-2xl font-bold">The core flow is real. The polish pass is still in motion.</h2>
            <p className="mb-6 text-muted-foreground">
              Blueprint generation and phases 1–9 are backed by the real VentraPath API. The best feedback now is about clarity, trust, usefulness, and where the product still feels rough.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/input">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Start Testing</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline">View rollout notes</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
