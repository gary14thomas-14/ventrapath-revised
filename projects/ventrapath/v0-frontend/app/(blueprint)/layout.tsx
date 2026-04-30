'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Lightbulb, 
  Target, 
  DollarSign, 
  Scale, 
  Rocket, 
  Globe,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const navigationSections = [
  { href: '/blueprint', label: 'The Business', icon: Lightbulb, description: 'Your core concept' },
  { href: '/market', label: 'Market', icon: Target, description: 'Audience & competition' },
  { href: '/monetisation', label: 'Monetisation', icon: DollarSign, description: 'Revenue strategy' },
  { href: '/execution', label: 'Execution', icon: Rocket, description: 'Launch roadmap' },
  { href: '/legal', label: 'Legal', icon: Scale, description: 'Requirements & compliance' },
  { href: '/website', label: 'Website', icon: Globe, description: 'Digital presence' },
  { href: '/risks', label: 'Risks', icon: AlertTriangle, description: 'Challenges & mitigation' },
]

export default function BlueprintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentIndex = navigationSections.findIndex(s => s.href === pathname)
  const nextSection = navigationSections[currentIndex + 1]
  const prevSection = navigationSections[currentIndex - 1]
  const completedBlueprint = pathname === '/risks'

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-72 lg:flex-col border-r border-border/50 bg-surface/50 backdrop-blur-xl">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <Link href="/">
              <img src="/logo.svg" alt="VentraPath" className="h-44 w-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Blueprint Sections
            </p>
            {navigationSections.map((section, index) => {
              const isActive = pathname === section.href
              const isPast = currentIndex > index
              const Icon = section.icon

              return (
                <Link key={section.href} href={section.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                      ${isActive 
                        ? 'bg-primary/10 text-foreground border border-primary/30' 
                        : isPast
                          ? 'text-muted-foreground hover:bg-surface-alt hover:text-foreground'
                          : 'text-muted-foreground/60 hover:bg-surface-alt hover:text-muted-foreground'
                      }
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                      ${isActive ? 'bg-primary/20' : isPast ? 'bg-success/10' : 'bg-surface-alt'}
                    `}>
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-foreground' : ''}`}>
                        {section.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{section.description}</p>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-primary" />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Progress */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(((currentIndex + 1) / navigationSections.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / navigationSections.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
            {completedBlueprint ? (
              <Link href="/phase1/brand" className="mt-4 block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Phase 1: Brand
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4">
        <Link href="/">
          <img src="/logo.svg" alt="VentraPath" className="h-36 w-auto" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <img src="/logo.svg" alt="VentraPath" className="h-36 w-auto" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigationSections.map((section, index) => {
              const isActive = pathname === section.href
              const isPast = currentIndex > index
              const Icon = section.icon

              return (
                <Link 
                  key={section.href} 
                  href={section.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`
                    flex items-center gap-4 px-4 py-4 rounded-xl transition-all
                    ${isActive ? 'bg-primary/10 border border-primary/30' : 'hover:bg-surface'}
                  `}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-primary/20' : isPast ? 'bg-success/10' : 'bg-surface-alt'
                    }`}>
                      {isPast ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{section.label}</p>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
            {completedBlueprint ? (
              <Link href="/phase1/brand" onClick={() => setMobileMenuOpen(false)}>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-4 text-primary">
                  <div>
                    <p className="font-medium">Start Phase 1</p>
                    <p className="text-sm text-primary/80">Move from blueprint into Brand</p>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            ) : null}
          </nav>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="min-h-screen pt-16 lg:pt-0">
          {children}

          {/* Navigation Footer */}
          <div className="border-t border-border/50 px-6 py-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              {prevSection ? (
                <Link href={prevSection.href}>
                  <Button variant="ghost" className="text-muted-foreground">
                    <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                    {prevSection.label}
                  </Button>
                </Link>
              ) : <div />}
              
              {nextSection ? (
                <Link href={nextSection.href}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Next: {nextSection.label}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : completedBlueprint ? (
                <Link href="/phase1/brand">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start Phase 1: Brand
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
