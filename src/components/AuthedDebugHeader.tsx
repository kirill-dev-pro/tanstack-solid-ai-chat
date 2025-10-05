import { Link, useRouter } from '@tanstack/solid-router'
import { authClient } from '~/lib/auth-client'
import { ThemeSwitch } from './ThemeSwitch'
import { Button } from './ui/button'

export function AuthedDebugHeader() {
  const router = useRouter()
  return (
    <div class='p-2 flex gap-2 text-lg items-center'>
      <Link
        to='/me'
        activeProps={{
          class: 'font-bold',
        }}
      >
        Me
      </Link>
      <div class='flex-1' />

      <Button
        size='sm'
        variant='destructive'
        onClick={() => {
          authClient.signOut()
          router.invalidate()
        }}
      >
        Sign Out
      </Button>
    </div>
  )
}
