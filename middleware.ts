import { next } from '@vercel/functions'
import { authorizeContent, privateHeaders } from './server/session.js'

// Runs before Vercel's static-file cache. index/assets remain public so that
// the login can load; all course manifests, shards and downloads require auth.
export const config = { matcher: ['/generated/:path*', '/course(.*)'] }
export default async function middleware(request: Request) {
  const denied = await authorizeContent(request)
  if (denied) return denied
  return next({ headers: privateHeaders })
}
