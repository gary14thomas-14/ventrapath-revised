'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AlertTriangle, ArrowLeft, CheckCircle2, DollarSign, Lightbulb, Rocket, Scale, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createProject, generateBlueprint, getStoredValue, setStoredValue } from '@/lib/ventrapath-client'

const stages = [
  { id: 'idea', name: 'Understanding Your Idea', icon: Lightbulb },
  { id: 'market', name: 'Analyzing Market', icon: Target },
  { id: 'monetisation', name: 'Building Revenue Strategy', icon: DollarSign },
  { id: 'legal', name: 'Mapping Legal Requirements', icon: Scale },
  { id: 'execution', name: 'Creating Launch Plan', icon: Rocket },
  { id: 'complete', name: 'Blueprint Ready', icon: CheckCircle2 },
]

export default function GeneratingPage() {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function runGeneration() {
      setError('')
      setProgress(0)
      setCurrentStage(0)
      setCompletedStages([])

      const idea = getStoredValue('idea')
      const country = getStoredValue('country')

      if (!idea || !country) {
        router.replace('/input')
        return
      }

      let stageIndex = 0
      const advance = () => {
        if (cancelled || stageIndex >= stages.length) return
        setCurrentStage(stageIndex)
        setProgress(((stageIndex + 1) / stages.length) * 100)
        setCompletedStages((prev) => Array.from(new Set([...prev, stages[stageIndex].id])))
        stageIndex += 1
      }

      advance()

      try {
        const projectResponse = await createProject({ idea, country })
        if (cancelled) return
        const project = projectResponse.data.project
        setStoredValue('projectId', project.id)
        setStoredValue('projectName', project.name)

        advance()
        await generateBlueprint(project.id)
        if (cancelled) return

        while (stageIndex < stages.length) {
          advance()
        }

        setTimeout(() => {
          if (!cancelled) router.push('/blueprint')
        }, 500)
      } catch (generationError) {
        if (cancelled) return
        setError(generationError instanceof Error ? generationError.message : 'Something went wrong while generating the blueprint.')
      }
    }

    runGeneration()

    return () => {
      cancelled = true
    }
  }, [retryKey, router])

  const isComplete = currentStage >= stages.length - 1 && completedStages.includes('complete')

  return (
    <div className="min-h-screen overflow-hidden bg-background px-6">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute left-1/2 top-8 z-10 -translate-x-1/2">
        <img src="/logo.svg" alt="VentraPath" className="h-48 w-auto" />
      </motion.div>

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-16">
            <div className="relative flex items-center justify-between">
              <svg className="absolute inset-0 h-full w-full" style={{ zIndex: -1 }}>
                {stages.slice(0, -1).map((_, index) => {
                  const isActive = completedStages.includes(stages[index].id)
                  const startX = (index / (stages.length - 1)) * 100
                  const endX = ((index + 1) / (stages.length - 1)) * 100
                  return <motion.line key={index} x1={`${startX}%`} y1="50%" x2={`${endX}%`} y2="50%" stroke={isActive ? '#6366F1' : 'rgba(255,255,255,0.1)'} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: isActive ? 1 : 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} />
                })}
              </svg>

              {stages.map((stage, index) => {
                const isActive = currentStage === index
                const isCompleted = completedStages.includes(stage.id)
                const Icon = stage.icon
                return (
                  <motion.div key={stage.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }} className="relative flex flex-col items-center">
                    <motion.div animate={isActive && !error ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 1.5, repeat: isActive && !error ? Infinity : 0 }} className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 ${isCompleted ? 'border-2 border-success/50 bg-success/20' : ''} ${isActive && !error ? 'glow-primary border-2 border-primary bg-primary/20' : ''} ${!isActive && !isCompleted ? 'border border-border/50 bg-surface' : ''}`}>
                      <Icon className={`h-6 w-6 ${isCompleted ? 'text-success' : isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </motion.div>
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: isActive || isCompleted ? 1 : 0.5 }} className={`mt-3 max-w-[90px] text-center text-xs font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                      {stage.name.split(' ').slice(0, 2).join(' ')}
                    </motion.span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="space-y-6 text-center">
            <AnimatePresence mode="wait">
              <motion.div key={`${currentStage}-${error ? 'error' : 'ok'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-3">
                <h2 className="text-2xl font-bold md:text-3xl">
                  {error ? 'Blueprint generation hit a snag' : stages[Math.min(currentStage, stages.length - 1)].name}
                </h2>
                <p className="text-muted-foreground">
                  {error ? 'The product should fail honestly, not dump you somewhere random.' : isComplete ? 'Your business blueprint is ready to view.' : 'Building your personalized business blueprint...'}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mx-auto max-w-md">
              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3, ease: 'easeOut' }} className={`h-full rounded-full ${error ? 'bg-destructive' : 'bg-gradient-to-r from-primary to-accent'}`} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>

            {error ? (
              <div className="mx-auto max-w-xl rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-left">
                <div className="mb-3 flex items-center gap-3 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <strong>Generation failed</strong>
                </div>
                <p className="text-sm text-muted-foreground">{error}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button onClick={() => setRetryKey((value) => value + 1)} className="bg-primary text-primary-foreground hover:bg-primary/90">Try again</Button>
                  <Link href="/input">
                    <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Back to input</Button>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
