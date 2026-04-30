'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, Mail, FileText, ChevronDown, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const helpTopics = [
  {
    category: "Getting Started",
    articles: [
      { title: "How to create your first blueprint", views: "2.4k" },
      { title: "Understanding your market analysis", views: "1.8k" },
      { title: "Interpreting financial projections", views: "1.2k" },
    ]
  },
  {
    category: "Account & Billing",
    articles: [
      { title: "Managing your subscription", views: "890" },
      { title: "Updating payment methods", views: "650" },
      { title: "Requesting a refund", views: "420" },
    ]
  },
  {
    category: "Features",
    articles: [
      { title: "Exporting blueprints to PDF", views: "1.5k" },
      { title: "Sharing blueprints with team members", views: "980" },
      { title: "Customizing your execution plan", views: "750" },
    ]
  }
]

const faqs = [
  {
    question: "How accurate are the market projections?",
    answer: "Our AI analyzes real-time market data, industry reports, and competitive intelligence to provide projections. While highly researched, they should be used as directional guidance alongside your own market research."
  },
  {
    question: "Can I edit my blueprint after generation?",
    answer: "Yes, Pro users can regenerate sections with modified inputs. All blueprints are saved to your account and can be accessed anytime."
  },
  {
    question: "How long does blueprint generation take?",
    answer: "Most blueprints complete in under 60 seconds. Complex industries or detailed analyses may take slightly longer."
  },
  {
    question: "Is my business idea kept confidential?",
    answer: "Absolutely. Your data is encrypted, never shared, and you can delete your blueprints anytime. We do not train our models on user submissions."
  },
]

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <img src="/logo.svg" alt="VentraPath" className="h-44 w-auto" />
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Support</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
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
            {/* Header & Search */}
            <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help?</h1>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-surface border-border/50 text-lg"
                />
              </div>
            </motion.div>

            {/* Contact Options */}
            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6">
              {[
                { icon: MessageCircle, title: "Live Chat", description: "Chat with our team in real-time", action: "Start Chat", available: "Available 9am-6pm EST" },
                { icon: Mail, title: "Email Support", description: "Get a response within 24 hours", action: "Send Email", available: "support@ventrapath.com" },
                { icon: FileText, title: "Documentation", description: "Browse our detailed guides", action: "View Docs", available: "100+ articles" },
              ].map((option, index) => {
                const Icon = option.icon
                return (
                  <motion.div
                    key={option.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="p-6 rounded-2xl bg-surface border border-border/50 hover:border-primary/30 transition-all text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                    <Button variant="outline" className="mb-2">{option.action}</Button>
                    <p className="text-xs text-muted-foreground">{option.available}</p>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Help Topics */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <h2 className="text-2xl font-bold">Popular Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {helpTopics.map((topic) => (
                  <div key={topic.category} className="space-y-4">
                    <h3 className="font-semibold text-muted-foreground">{topic.category}</h3>
                    <div className="space-y-2">
                      {topic.articles.map((article) => (
                        <button
                          key={article.title}
                          className="w-full p-4 rounded-xl bg-surface border border-border/50 hover:border-primary/30 transition-all text-left group"
                        >
                          <p className="font-medium group-hover:text-primary transition-colors">{article.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{article.views} views</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={faq.question}
                    className="rounded-xl bg-surface border border-border/50 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <span className="font-medium">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="px-5 pb-5"
                      >
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeInUp} className="max-w-2xl mx-auto">
              <div className="p-8 rounded-2xl glass-strong">
                <h2 className="text-2xl font-bold mb-2 text-center">Still need help?</h2>
                <p className="text-muted-foreground text-center mb-8">Send us a message and we'll get back to you within 24 hours.</p>
                
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input placeholder="Your name" className="bg-surface border-border/50" />
                    <Input type="email" placeholder="Your email" className="bg-surface border-border/50" />
                  </div>
                  <Input placeholder="Subject" className="bg-surface border-border/50" />
                  <Textarea placeholder="How can we help?" className="bg-surface border-border/50 min-h-[120px]" />
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
