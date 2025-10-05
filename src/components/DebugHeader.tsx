import { Link } from '@tanstack/solid-router'
import { ThemeSwitch } from './ThemeSwitch'

export function DebugHeader() {
  return (
    <div class='p-2 flex gap-2 text-lg items-center'>
      <Link
        to='/'
        activeProps={{
          class: 'font-bold',
        }}
        activeOptions={{ exact: true }}
      >
        Chat
      </Link>{' '}
      <Link
        to='/login'
        activeProps={{
          class: 'font-bold',
        }}
      >
        Login
      </Link>
      <div class='flex-1' />
      <ThemeSwitch />
    </div>
  )
}
