import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PREFIXES = [
  '/input',
  '/generating',
  '/blueprint',
  '/market',
  '/monetisation',
  '/execution',
  '/legal',
  '/website',
  '/risks',
  '/unlock',
  '/phase1',
  '/phase2',
  '/phase3',
  '/phase4',
  '/phase5',
  '/phase6',
  '/phase7',
  '/phase8',
  '/phase9',
]

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export function middleware(request: NextRequest) {
  const prelaunchMode = process.env.NEXT_PUBLIC_PRELAUNCH_MODE === 'true'

  if (!prelaunchMode) {
    return NextResponse.next()
  }

  const { pathname, search } = request.nextUrl

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.searchParams.set('prelaunch', '1')
  redirectUrl.searchParams.set('from', `${pathname}${search}`)

  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.svg|robots.txt|sitemap.xml).*)'],
}
