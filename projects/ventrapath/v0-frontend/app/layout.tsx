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
  title: 'VentraPath - Transform Your Idea Into a Business',
  description: 'AI-powered business launch platform. Enter your idea, get a complete business blueprint with market analysis, monetization strategy, execution plan, and more.',
  keywords: ['business', 'startup', 'AI', 'business plan', 'entrepreneur', 'launch'],
  authors: [{ name: 'VentraPath' }],
  openGraph: {
    title: 'VentraPath - Transform Your Idea Into a Business',
    description: 'AI-powered business launch platform. One idea in, complete business blueprint out.',
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
