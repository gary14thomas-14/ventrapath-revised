import { loadEnv } from '../src/config/env.js'
import { fail } from '../src/lib/http.js'
import { handleRequest } from '../src/app.js'

const env = loadEnv()

export default async function handler(req, res) {
  try {
    await handleRequest(req, res, env)
  } catch (error) {
    console.error('[ventrapath-backend] unhandled request error', error)
    fail(res, 500, 'INTERNAL_ERROR', 'Unhandled server error')
  }
}
