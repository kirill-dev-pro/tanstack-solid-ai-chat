import { createMiddleware } from '@tanstack/solid-start'
import { auth } from '~/lib/auth'
import { redirect } from '@tanstack/solid-router'

export const sessionMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    return next({
      context: {
        session,
      },
    })
  },
)

export const authMiddleware = createMiddleware({ type: 'request' })
  .middleware([sessionMiddleware])
  .server(async ({ next, context, request, pathname }) => {
    const session = context.session
    console.log('[authMiddleware] session', !!session)
    if (!session) {
      console.log('[authMiddleware] redirecting to /login from', pathname)
      throw redirect({
        to: '/login',
        search: { redirect: pathname },
      })
    }
    return next({
      context: {
        user: session.user,
      },
    })
  })
