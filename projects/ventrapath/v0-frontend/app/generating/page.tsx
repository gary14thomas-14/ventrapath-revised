'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Lightbulb, Target, DollarSign, Scale, Rocket, CheckCircle2 } from 'lucide-react'
import { createProject, generateBlueprint, getStoredValue, setStoredValue } from '@/lib/ventrapath-client'

const stages = [
  { id: 'idea', name: 'Understanding Your Idea', icon: Lightbulb, duration: 1200 },
  { id: 'market', name: 'Analyzing Market', icon: Target, duration: 1400 },
  { id: 'monetisation', name: 'Building Revenue Strategy', icon: DollarSign, duration: 1200 },
  { id: 'legal', name: 'Mapping Legal Requirements', icon: Scale, duration: 1200 },
  { id: 'execution', name: 'Creating Launch Plan', icon: Rocket, duration: 1200 },
  { id: 'complete', name: 'Blueprint Ready', icon: CheckCircle2, duration: 800 },
]

export default function GeneratingPage() {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function runGeneration() {
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
        const targetProgress = ((stageIndex + 1) / stages.length) * 100
        setProgress(targetProgress)
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
      } catch {
        router.push('/input')
      }
    }

    runGeneration()

    return () => {
      cancelled = true
    }
  }, [router])

  const isComplete = currentStage >= stages.length - 1 && completedStages.includes('complete')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
        <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-8">
        <img src="/logo.svg" alt="VentraPath" className="h-48 w-auto" />
      </motion.div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-16">
          <div className="relative flex items-center justify-between">
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
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
                  <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-success/20 border-2 border-success/50' : ''} ${isActive ? 'bg-primary/20 border-2 border-primary glow-primary' : ''} ${!isActive && !isCompleted ? 'bg-surface border border-border/50' : ''}`}>
                    <Icon className={`w-6 h-6 ${isCompleted ? 'text-success' : isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: isActive || isCompleted ? 1 : 0.5 }} className={`mt-3 text-xs font-medium text-center max-w-[80px] ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                    {stage.name.split(' ').slice(0, 2).join(' ')}
                  </motion.span>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="text-center space-y-6">
          <AnimatePresence mode="wait">
            <motion.div key={currentStage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold">{stages[Math.min(currentStage, stages.length - 1)].name}</h2>
              <p className="text-muted-foreground">{isComplete ? 'Your business blueprint is ready to view' : 'Building your personalized business blueprint...'}</p>
            </motion.div>
          </AnimatePresence>

          <div className="max-w-md mx-auto">
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-primary to-accent rounded-full" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}% complete</p>
          </div>
        </div>
      </div>
    </div>
  )
}
