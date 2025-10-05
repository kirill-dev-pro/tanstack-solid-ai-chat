import { createFileRoute, useNavigate, useRouter } from '@tanstack/solid-router'
import { Show } from 'solid-js'
import { useAuth } from '~/contexts/authContext'
import { useAuthed } from '~/contexts/authedContext'
import { authClient } from '~/lib/auth-client'

export const Route = createFileRoute('/_authed/me')({
  component: RouteComponent,
})

function RouteComponent() {
  const context = Route.useRouteContext()
  const navigate = useNavigate()
  const router = useRouter()

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.invalidate()
        },
      },
    })
  }

  return (
    <div class='p-4'>
      User data
      <Show when={context().user} fallback={<div>Loading user...</div>}>
        {(user) => (
          <div>
            <p>Name: {user().name}</p>
            <p>Email: {user().email}</p>
          </div>
        )}
      </Show>
      <button onClick={handleLogout} class='bg-red-500 text-white p-2 rounded-md'>
        Logout
      </button>
    </div>
  )
}
