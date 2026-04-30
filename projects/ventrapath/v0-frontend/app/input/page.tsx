'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Compass, Globe, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { clearProjectSession, getStoredValue, setStoredValue } from '@/lib/ventrapath-client'

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'SG', name: 'Singapore' },
]

const exampleIdeas = [
  'A subscription box for sustainable office supplies',
  'An AI tutor for learning musical instruments',
  'A marketplace connecting local farmers with restaurants',
]

export default function InputPage() {
  const router = useRouter()
  const [idea, setIdea] = useState('')
  const [country, setCountry] = useState('')
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resumeProjectName, setResumeProjectName] = useState<string | null>(null)

  useEffect(() => {
    setResumeProjectName(getStoredValue('projectName'))
  }, [])

  const handleSubmit = () => {
    if (!idea.trim() || !country) return
    setIsSubmitting(true)
    clearProjectSession()
    setStoredValue('idea', idea.trim())
    setStoredValue('country', country)
    setTimeout(() => {
      router.push('/generating')
    }, 300)
  }

  const canProceed = step === 1 ? idea.trim().length > 10 : country !== ''

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[150px] animate-glow-breathe" />
      </div>

      <header className="relative z-50 px-6 py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          <img src="/logo.svg" alt="VentraPath" className="h-44 w-auto" />
          <div className="w-16" />
        </div>
      </header>

      <div className="relative z-10 mb-8 px-6">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
          <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span className={step === 1 ? 'text-primary' : ''}>Your Idea</span>
          <span className={step === 2 ? 'text-primary' : ''}>Location</span>
        </div>
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-24">
        <div className="w-full max-w-2xl space-y-6">
          {resumeProjectName ? (
            <div className="rounded-2xl border border-success/20 bg-success/5 p-4 text-sm text-success">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Current project available</p>
                  <p className="text-success/80">Resume <strong>{resumeProjectName}</strong> or start a fresh one below.</p>
                </div>
                <Link href="/blueprint">
                  <Button variant="outline" className="border-success/30 text-success hover:bg-success/10">
                    <Compass className="mr-2 h-4 w-4" />
                    Resume project
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                <div className="space-y-4 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold md:text-4xl">What’s the business idea?</h1>
                  <p className="text-lg text-muted-foreground">Describe the business in a sentence or two. Clear beats clever here.</p>
                </div>

                <div className="space-y-4">
                  <Textarea placeholder="e.g. A service that helps tradies turn quotes, jobs, and follow-ups into a cleaner client workflow..." value={idea} onChange={(e) => setIdea(e.target.value)} className="min-h-[140px] resize-none border-border/50 bg-surface p-5 text-lg focus:border-primary/50 focus:ring-primary/20" />
                  <p className="text-right text-sm text-muted-foreground">{idea.length} characters</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Need a kickstart? Try one of these:</p>
                  <div className="flex flex-wrap gap-2">
                    {exampleIdeas.map((example) => (
                      <button key={example} onClick={() => setIdea(example)} className="rounded-full border border-border/50 bg-surface px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground">
                        {example.substring(0, 40)}...
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)} disabled={!canProceed} className="bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                <div className="space-y-4 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold md:text-4xl">Where will it operate?</h1>
                  <p className="text-lg text-muted-foreground">We use this to tailor legal context, market assumptions, and practical advice.</p>
                </div>

                <div className="mx-auto max-w-sm">
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-14 border-border/50 bg-surface text-lg">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-surface">
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.name} className="text-base">
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass space-y-4 rounded-2xl p-6">
                  <h3 className="text-sm font-medium text-muted-foreground">This test build will generate:</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {['Business & market blueprint', 'Revenue strategy', 'Legal guidance', 'Execution roadmap', 'Risk analysis', '9 guided phases'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting} className="glow-primary bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                    {isSubmitting ? 'Starting…' : 'Generate Blueprint'}
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
