import { User } from 'better-auth'
import { createContext, JSX, Show, useContext } from 'solid-js'
import { useAuth } from './authContext'
import { redirect } from '@tanstack/solid-router'

export const AuthedContext = createContext<{
  user: () => User
}>({
  user: () => ({}) as User,
})

export function AuthedProvider(props: { children: JSX.Element }) {
  const { user } = useAuth()

  console.log('AuthedProvider user', user())

  if (!user()) {
    console.log('Redirecting to /login from authed context')
    throw redirect({ to: '/login' })
  }

  return (
    <Show when={user()} fallback={<div>Loading user...</div>}>
      {(user) => <AuthedContext.Provider value={{ user }}>{props.children}</AuthedContext.Provider>}
    </Show>
  )
}

export function useAuthed() {
  const context = useContext(AuthedContext)
  if (!context) {
    throw new Error('useAuthed must be used within an AuthedProvider')
  }
  return context
}
