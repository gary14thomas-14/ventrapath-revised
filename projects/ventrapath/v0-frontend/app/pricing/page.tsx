'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Sparkles, Zap, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const plans = [
  {
    name: "Starter",
    description: "Perfect for validating your idea",
    price: "Free",
    period: "",
    icon: Sparkles,
    features: [
      "1 Blueprint generation",
      "Basic market analysis",
      "Core monetisation strategy",
      "Standard execution plan",
      "Email support"
    ],
    cta: "Get Started Free",
    href: "/input",
    highlighted: false
  },
  {
    name: "Pro",
    description: "For serious entrepreneurs",
    price: "$29",
    period: "/blueprint",
    icon: Zap,
    features: [
      "Unlimited blueprints",
      "Deep market & competitor analysis",
      "Full financial projections",
      "Legal requirements checklist",
      "Website & branding guide",
      "Risk assessment & mitigation",
      "Export to PDF & Notion",
      "Priority support"
    ],
    cta: "Upgrade to Pro",
    href: "/input",
    highlighted: true
  },
  {
    name: "Enterprise",
    description: "For teams and agencies",
    price: "Custom",
    period: "",
    icon: Building2,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "White-label reports",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee"
    ],
    cta: "Contact Sales",
    href: "/support",
    highlighted: false
  }
]

const faqs = [
  {
    question: "How does the free plan work?",
    answer: "You can generate one complete business blueprint for free. This includes market analysis, monetisation strategy, and execution plan. It's perfect for validating your idea before committing."
  },
  {
    question: "Can I upgrade later?",
    answer: "Absolutely. Start with the free plan and upgrade to Pro when you're ready for unlimited blueprints and advanced features. Your existing blueprints will be preserved."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are processed securely through Stripe."
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, we offer a 14-day money-back guarantee on Pro plans. If you're not satisfied, contact support for a full refund."
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-glow-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-glow-breathe" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <img src="/logo.svg" alt="VentraPath" className="h-44 w-auto" />
          </Link>
          <Link href="/input">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-16"
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h1>
              <p className="text-xl text-muted-foreground">
                Start free and upgrade when you need more. No hidden fees, no surprises.
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, index) => {
                const Icon = plan.icon
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={`relative p-8 rounded-2xl ${
                      plan.highlighted 
                        ? 'bg-primary/5 border-2 border-primary/30 glow-primary' 
                        : 'bg-surface border border-border/50'
                    }`}
                  >
                    {plan.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        Most Popular
                      </span>
                    )}

                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={plan.href}>
                      <Button 
                        className={`w-full ${
                          plan.highlighted 
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                            : 'bg-surface-alt hover:bg-surface-alt/80'
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* FAQ */}
            <motion.div variants={fadeInUp} className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-6 rounded-xl bg-surface border border-border/50"
                  >
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
