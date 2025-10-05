import { createFileRoute, redirect } from '@tanstack/solid-router'
import { createMemo, createSignal, Match, onMount, Show, Switch } from 'solid-js'
import { useNavigate } from '@tanstack/solid-router'
import { authClient } from '~/lib/auth-client'
import { LoginForm } from '~/components/LoginForm'
import { RegisterForm } from '~/components/RegisterForm'
import { getUserFn } from '~/utils/getUserFn'

export const Route = createFileRoute('/login')({
  component: LoginPage,
  loader: async ({ location }) => {
    // console.log('login loader', location)
    const search = location.search as { redirect?: string }
    const redirectLoaction = search.redirect || '/me'
    const user = await getUserFn()
    if (user) {
      throw redirect({
        to: redirectLoaction,
      })
    }
    return {
      redirectLoaction,
    }
  },
})

function LoginPage() {
  const context = Route.useLoaderData()
  const [tab, setTab] = createSignal<'login' | 'register'>('login')

  return (
    <div class='bg-white min-h-screen '>
      <main class='flex justify-center items-center h-full flex-col gap-4'>
        <div class='w-full max-w-xs mb-6'>
          <div class='flex border-b border-neutral-200'>
            <button
              type='button'
              class={`flex-1 py-2 text-center font-['Inter'] text-base transition-colors
                ${
                  tab() === 'login'
                    ? 'border-b-2 border-neutral-900 text-neutral-900 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              onClick={() => setTab('login')}
              aria-selected={tab() === 'login'}
              tabIndex={tab() === 'login' ? 0 : -1}
            >
              Login
            </button>
            <button
              type='button'
              class={`flex-1 py-2 text-center font-['Inter'] text-base transition-colors
                ${
                  tab() === 'register'
                    ? 'border-b-2 border-neutral-900 text-neutral-900 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              onClick={() => setTab('register')}
              aria-selected={tab() === 'register'}
              tabIndex={tab() === 'register' ? 0 : -1}
            >
              Register
            </button>
          </div>
        </div>
        <Switch>
          <Match when={tab() === 'login'}>
            <LoginForm redirect={context().redirectLoaction} />
          </Match>
          <Match when={tab() === 'register'}>
            <RegisterForm />
          </Match>
        </Switch>
      </main>
    </div>
  )
}
