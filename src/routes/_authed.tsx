import { createFileRoute, Outlet, redirect } from '@tanstack/solid-router'
import { createServerFn } from '@tanstack/solid-start'
import { authClient } from '~/lib/auth-client'
import { type } from 'arktype'
import { db } from '~/lib/db'
import { authMiddleware } from '~/utils/authMiddleware'
import { AuthedProvider } from '~/contexts/authedContext'
import { getUserFn } from '~/utils/getUserFn'
import { AuthedDebugHeader } from '~/components/AuthedDebugHeader'

const getUserSchema = type({
  userId: 'string',
})

// const loadUserProfile = createServerFn({ method: 'GET' })
//   .inputValidator(getUserSchema)
//   .handler(async ({ data }) => {
//     const { userId } = data
//     const profile = await db.profile.findUnique({ where: { userId } })

//     if (!profile) {
//       return null
//     }

//     return profile
//   })

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    // console.log('_authed beforeLoad')
    const user = await getUserFn()
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    return {
      user,
    }
  },
  // loader: async ({ context }) => {
  //   console.log('_authed loader')
  //   if (!context.user) {
  //     throw redirect({
  //       to: '/login',
  //       search: { redirect: location.href },
  //     })
  //   }
  //   return context
  // },
  server: {
    middleware: [authMiddleware],
  },
  component: () => (
    <>
      <AuthedDebugHeader />
      <hr />
      <Outlet />
    </>
  ),
})
