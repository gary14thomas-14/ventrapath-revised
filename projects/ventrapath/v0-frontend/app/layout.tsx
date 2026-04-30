import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: 'VentraPath - Idea to Blueprint',
  description: 'Turn a business idea into a country-aware blueprint and work through nine guided phases toward Growth & Milestones.',
  keywords: ['business', 'startup', 'AI', 'business plan', 'entrepreneur', 'blueprint'],
  authors: [{ name: 'VentraPath' }],
  openGraph: {
    title: 'VentraPath - Idea to Blueprint',
    description: 'Business blueprint generation with a guided nine-phase planning flow.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B1020',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
