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
  title: 'VentraPath — Build the company you\'ve been thinking about',
  description: 'Take your idea, get a clear blueprint, then move step by step through brand, legal, finance, marketing, sales, launch — and what comes after.',
  keywords: ['business', 'startup', 'business plan', 'entrepreneur', 'blueprint', 'launch'],
  authors: [{ name: 'VentraPath' }],
  openGraph: {
    title: 'VentraPath — Build the company you\'ve been thinking about',
    description: 'From idea to a real, running company — in clear, manageable steps.',
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
