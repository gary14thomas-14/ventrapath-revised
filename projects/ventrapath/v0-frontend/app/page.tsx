'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap, Target, TrendingUp, Shield, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const phases = [
  { name: 'Idea', icon: Zap },
  { name: 'Market', icon: Target },
  { name: 'Strategy', icon: TrendingUp },
  { name: 'Launch', icon: Shield },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-glow-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px] animate-glow-breathe" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="VentraPath" className="h-48 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Pricing
              </Button>
            </Link>
            <Link href="/input">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeIn} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                AI-Powered Business Launch System
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={fadeIn}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
            >
              <span className="text-foreground">From idea to</span>
              <br />
              <span className="gradient-text">launch-ready business</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={fadeIn}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Enter your business idea. Get a complete blueprint with market analysis, 
              monetization strategy, legal requirements, and step-by-step execution plan.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/input">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg glow-primary">
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-border/50 hover:bg-surface">
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated Phase Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-24 max-w-3xl mx-auto"
          >
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />
              
              {/* Phase Nodes */}
              <div className="relative flex items-center justify-between">
                {phases.map((phase, index) => (
                  <motion.div
                    key={phase.name}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.15, duration: 0.4 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-border/50 hover:border-primary/50 transition-all duration-300 hover:glow-primary cursor-default"
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      <phase.icon className="w-7 h-7 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{phase.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border/50 bg-surface/30">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to launch</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our AI analyzes your idea and generates a comprehensive business blueprint tailored to your market.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Market Analysis',
                  description: 'Deep dive into your target audience, competitors, and market opportunity.',
                  icon: Target
                },
                {
                  title: 'Revenue Strategy',
                  description: 'Pricing models, revenue streams, and financial projections customized for you.',
                  icon: TrendingUp
                },
                {
                  title: 'Launch Roadmap',
                  description: 'Step-by-step execution plan with milestones, tasks, and timelines.',
                  icon: Zap
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-2xl glass hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
            <div className="absolute inset-0 glass" />
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to build your business?
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                Join thousands of entrepreneurs who have transformed their ideas into actionable business plans.
              </p>
              <Link href="/input">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg">
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <img src="/logo.svg" alt="VentraPath" className="h-44 w-auto opacity-60" />
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
