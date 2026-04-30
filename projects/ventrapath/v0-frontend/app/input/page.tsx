'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Sparkles, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { clearProjectSession, setStoredValue } from '@/lib/ventrapath-client'

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
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-glow-breathe" />
      </div>

      <header className="relative z-50 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <img src="/logo.svg" alt="VentraPath" className="h-44 w-auto" />
          <div className="w-16" />
        </div>
      </header>

      <div className="relative z-10 px-6 mb-8">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
          <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span className={step === 1 ? 'text-primary' : ''}>Your Idea</span>
          <span className={step === 2 ? 'text-primary' : ''}>Location</span>
        </div>
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-24">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">What's your business idea?</h1>
                  <p className="text-muted-foreground text-lg">Describe your idea in a sentence or two. Be specific about what problem you're solving.</p>
                </div>

                <div className="space-y-4">
                  <Textarea placeholder="e.g., An app that connects pet owners with trusted local pet sitters for last-minute bookings..." value={idea} onChange={(e) => setIdea(e.target.value)} className="min-h-[140px] bg-surface border-border/50 text-lg p-5 resize-none focus:border-primary/50 focus:ring-primary/20" />
                  <p className="text-sm text-muted-foreground text-right">{idea.length} characters</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Need inspiration? Try one of these:</p>
                  <div className="flex flex-wrap gap-2">
                    {exampleIdeas.map((example) => (
                      <button key={example} onClick={() => setIdea(example)} className="text-sm px-4 py-2 rounded-full bg-surface border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                        {example.substring(0, 40)}...
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)} disabled={!canProceed} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">Where will you operate?</h1>
                  <p className="text-muted-foreground text-lg">This helps us tailor legal requirements and market insights to your region.</p>
                </div>

                <div className="max-w-sm mx-auto">
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-14 bg-surface border-border/50 text-lg">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-border">
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.name} className="text-base">
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Your Blueprint will include:</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {['Market Analysis', 'Revenue Strategy', 'Legal Requirements', 'Execution Plan', 'Competitor Research', 'Risk Assessment'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
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
                  <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 glow-primary">
                    {isSubmitting ? 'Starting...' : 'Generate Blueprint'}
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
