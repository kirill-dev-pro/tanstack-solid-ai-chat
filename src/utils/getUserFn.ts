import { createMiddleware, createServerFn } from '@tanstack/solid-start'
import { getRequest } from '@tanstack/solid-start/server'
import { auth } from '~/lib/auth'
import { authClient } from '~/lib/auth-client'

const sessionMiddleware = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    const session = await authClient.getSession()
    return next({
      context: { session },
    })
  })
  .server(async ({ next }) => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    return next({
      context: { session },
    })
  })

export const getUserFn = createServerFn({ method: 'GET' })
  .middleware([sessionMiddleware])
  .handler(async ({ context }) => context.session?.user)
