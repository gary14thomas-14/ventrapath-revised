import { loadEnv } from '../src/config/env.js'
import { fail } from '../src/lib/http.js'
import { handleRequest } from '../src/app.js'

const env = loadEnv()

function rewriteRequestUrl(req) {
  const base = req.headers.host ? `http://${req.headers.host}` : env.appBaseUrl
  const url = new URL(req.url, base)
  const pathname = url.searchParams.get('__pathname')

  if (!pathname) {
    return
  }

  url.searchParams.delete('__pathname')
  const search = url.searchParams.toString()
  req.url = `${pathname}${search ? `?${search}` : ''}`
}

export default async function handler(req, res) {
  try {
    rewriteRequestUrl(req)
    await handleRequest(req, res, env)
  } catch (error) {
    console.error('[ventrapath-backend] unhandled request error', error)
    fail(res, 500, 'INTERNAL_ERROR', 'Unhandled server error')
  }
}
