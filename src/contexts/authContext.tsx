import { createContext, useContext, createSignal, onMount } from 'solid-js'
import { auth } from '~/lib/auth'
import { authClient } from '~/lib/auth-client'
import type { JSX } from 'solid-js'

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user

export interface AuthContextType {
  session: () => Session | null
  user: () => User | null
}

const AuthContext = createContext<AuthContextType>()

export function AuthProvider(props: { children: JSX.Element }) {
  const [session, setSession] = createSignal<Session | null>(null)
  const [user, setUser] = createSignal<User | null>(null)

  // Check session on mount
  onMount(async () => {
    const { error, data } = await authClient.getSession()
    if (error) {
      console.error('Session check error:', error)
      return
    }
    if (!data) {
      return
    }
    setSession(data.session)
    setUser(data.user)
  })

  const value: AuthContextType = {
    session,
    user,
  }

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
